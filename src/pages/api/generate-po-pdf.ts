
import type { NextApiRequest, NextApiResponse } from 'next';
import ReactDOMServer from 'react-dom/server';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import React from 'react'; // Required for JSX
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import { pool } from '../../../backend/db.js'; // Corrected path
import type { PurchaseOrderPayload, POItemPayload, Supplier, Site, Category as CategoryType, Approver, POItemForPrint } from '@/types';

async function getPODataForPdf(poId: string): Promise<PurchaseOrderPayload | null> {
  const numericPoId = Number(poId);
  if (isNaN(numericPoId)) {
    console.error(`[PDF API][getPODataForPdf] Invalid PO ID format: ${poId}`);
    return null;
  }
  console.log(`[PDF API][getPODataForPdf] Attempting to fetch data for numeric PO ID: ${numericPoId}`);

  try {
    const [poHeaderRows]: any[] = await pool.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [numericPoId]);
    console.log(`[PDF API][getPODataForPdf] Fetched PO Header for ${numericPoId}:`, poHeaderRows.length > 0 ? poHeaderRows[0] : 'Not found');
    if (poHeaderRows.length === 0) {
      console.error(`[PDF API][getPODataForPdf] Purchase Order with ID ${numericPoId} not found.`);
      return null;
    }
    const rawHeaderData = poHeaderRows[0];
    const headerData: PurchaseOrderPayload = {
      ...rawHeaderData,
      id: rawHeaderData.id ? Number(rawHeaderData.id) : undefined,
      subTotal: Number(rawHeaderData.subTotal || 0),
      vatAmount: Number(rawHeaderData.vatAmount || 0),
      grandTotal: Number(rawHeaderData.grandTotal || 0),
      pricesIncludeVat: Boolean(rawHeaderData.pricesIncludeVat),
      siteId: rawHeaderData.siteId ? Number(rawHeaderData.siteId) : null,
      items: [],
    };

    const [poItemRows]: any[] = await pool.execute('SELECT * FROM POItem WHERE poId = ?', [numericPoId]);
    console.log(`[PDF API][getPODataForPdf] Fetched PO Items for ${numericPoId}:`, poItemRows.length);

    const [suppliersRes, sitesRes, categoriesRes, approversRes] = await Promise.all([
      pool.query('SELECT * FROM Supplier'),
      pool.query('SELECT * FROM Site'),
      pool.query('SELECT * FROM Category'),
      pool.query('SELECT * FROM Approver'),
    ]);
    console.log(`[PDF API][getPODataForPdf] Fetched auxiliary data (suppliers, sites, etc.) for ${numericPoId}`);

    const allSuppliers = suppliersRes[0] as Supplier[];
    const allSites = sitesRes[0] as Site[];
    const allCategories = categoriesRes[0] as CategoryType[];
    const allApprovers = approversRes[0] as Approver[];

    const supplierDetails = allSuppliers.find(s => s.supplierCode === headerData.supplierId);
    const approverDetails = allApprovers.find(a => a.id === headerData.approverId);

    const itemsForPrint: POItemForPrint[] = poItemRows.map((item: any) => {
      const site = allSites.find(s => s.id === (item.siteId ? Number(item.siteId) : null));
      const category = allCategories.find(c => c.id === (item.categoryId ? Number(item.categoryId) : null));
      return {
        ...item,
        id: item.id ? Number(item.id) : undefined,
        poId: item.poId ? Number(item.poId) : undefined,
        quantity: Number(item.quantity || 0),
        unitPrice: Number(item.unitPrice || 0),
        categoryId: item.categoryId ? Number(item.categoryId) : null,
        siteId: item.siteId ? Number(item.siteId) : null,
        siteDisplay: site?.siteCode || site?.name || (item.siteId ? `Site ID ${item.siteId}` : 'N/A'),
        categoryDisplay: category?.category || (item.categoryId ? `Category ID ${item.categoryId}` : 'N/A'),
      };
    });

    const approverSignatureUrl = approverDetails ? `/signatures/${approverDetails.id}.png` : undefined;
    console.log(`[PDF API][getPODataForPdf] Successfully processed data for PO ID: ${numericPoId}`);
    return {
      ...headerData,
      items: itemsForPrint,
      supplierDetails: supplierDetails,
      approverName: approverDetails?.name,
      approverSignatureUrl: approverSignatureUrl,
      quoteNo: headerData.quoteNo || '',
    };
  } catch (error: any) {
    console.error(`[PDF API][getPODataForPdf] Database or processing error for PO ID ${poId} (numeric ${numericPoId}):`, error.message);
    if (error.stack) {
        console.error("[PDF API][getPODataForPdf] Stack trace:", error.stack);
    }
    // It's better to throw the error so the main handler catches it and sends a 500
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { poId } = req.query;
  console.log(`[PDF API][Handler] Received request for PO ID: ${poId}`);

  if (typeof poId !== 'string' || !poId) {
    console.error('[PDF API][Handler] Invalid PO ID in query parameters.');
    return res.status(400).json({
      source: 'api-generate-po-pdf-validation',
      error: 'Valid Purchase Order ID is required in query parameters.'
    });
  }

  let browser: puppeteer.Browser | null = null;

  try {
    console.log(`[PDF API][Handler] Fetching PO data for PO ID: ${poId}`);
    const poData = await getPODataForPdf(poId);

    if (!poData) {
      console.error(`[PDF API][Handler] PO Data not found or incomplete for PO ID: ${poId}`);
      return res.status(404).json({
        source: 'api-generate-po-pdf-data-fetch',
        error: `Purchase Order ${poId} not found or data incomplete.`
      });
    }
    console.log(`[PDF API][Handler] PO data fetched successfully for PO ID: ${poId}`);

    let logoDataUri = '';
    try {
      const logoPath = path.resolve(process.cwd(), 'public', 'jachris-logo.png');
      console.log(`[PDF API][Handler] Attempting to read logo from: ${logoPath}`);
      const logoBuffer = await fs.readFile(logoPath);
      logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      console.log(`[PDF API][Handler] Logo read successfully.`);
    } catch (logoError: any) {
      console.warn(`[PDF API][Handler] Logo file not found or could not be read: ${logoError.message}. Proceeding without custom logo.`);
    }

    console.log(`[PDF API][Handler] Rendering PrintablePO component to HTML string for PO ID: ${poId}`);
    const htmlContent = ReactDOMServer.renderToString(
      React.createElement(PrintablePO, { poData, logoDataUri })
    );
    console.log(`[PDF API][Handler] HTML content rendered successfully for PO ID: ${poId}`);

    console.log(`[PDF API][Handler] Launching Puppeteer for PO ID: ${poId}`);
    browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', // Important for constrained environments
          '--disable-gpu', // Often not needed for headless PDF generation
          '--single-process', // Can sometimes help with resource issues
          '--no-zygote', // Can help in some environments
        ],
        dumpio: process.env.NODE_ENV === 'development' // Logs browser console output
    });
    console.log(`[PDF API][Handler] Puppeteer launched. Creating new page for PO ID: ${poId}`);
    const page = await browser.newPage();

    console.log(`[PDF API][Handler] Setting page content for PO ID: ${poId}`);
    await page.setContent(`
      <html>
        <head>
          <meta charSet="UTF-8" />
          <title>Purchase Order ${poData.poNumber}</title>
          <style>
            body, html { margin: 0; padding: 0; background-color: #fff; color: #000; font-family: 'Arial', sans-serif; font-size: 10pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .printable-po-content-wrapper { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; background-color: #ffffff !important; }
            table { width: 100%; border-collapse: collapse; }
            table, th, td { border: 1px solid #000000 !important; padding: 4pt !important; page-break-inside: avoid; }
            tr, td, th { page-break-inside: avoid; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            *, *::before, *::after { transition: none !important; transform: none !important; box-shadow: none !important; }
            img { max-width: 100%; height: auto; }
            .grid { display: grid; } .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .grid-cols-\\[max-content_1fr\\] { grid-template-columns: max-content 1fr; }
            .gap-x-2 { column-gap: 0.5rem; } .gap-x-4 { column-gap: 1rem; }
            .justify-between { justify-content: space-between; } .items-start { align-items: flex-start; } .items-center { align-items: center; }
            .mb-4 { margin-bottom: 1rem; } .mb-2 { margin-bottom: 0.5rem; } .mb-1 { margin-bottom: 0.25rem; }
            .pb-1 { padding-bottom: 0.25rem; } .border-b-2 { border-bottom-width: 2px; } .border-black { border-color: #000; }
            .text-lg { font-size: 1.125rem; } .text-xl { font-size: 1.25rem; } .text-xs { font-size: 0.75rem; } .text-sm { font-size: 0.875rem; }
            .font-bold { font-weight: 700; } .font-sans { font-family: 'Arial', sans-serif; }
            .text-red-700 { color: #b91c1c; } .text-right { text-align: right; } .text-left { text-align: left; } .text-center { text-align: center; }
            .w-full { width: 100%; } .bg-gray-100 { background-color: #f3f4f6; }
            .p-1 { padding: 0.25rem; } .p-4 { padding: 1rem; } .align-top { vertical-align: top; } .min-h-\\[300px\\] { min-height: 300px; }
            .flex { display: flex; } .justify-end { justify-content: flex-end; } .w-\\[250px\\] { width: 250px; }
            .py-0.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; } .pt-0.5 { padding-top: 0.125rem; } .pt-2 { padding-top: 0.5rem; }
            .border-t-2 { border-top-width: 2px; } .w-28 { width: 7rem; } .items-end { align-items: flex-end; } .flex-col { flex-direction: column; }
            .mt-4 { margin-top: 1rem; } .mt-8 { margin-top: 2rem; } .max-w-\\[12rem\\] { max-width: 12rem; }
            .ml-auto { margin-left: auto; } .h-12 { height: 3rem; }
          </style>
        </head>
        <body>
          <div class="printable-po-content-wrapper">
            ${htmlContent}
          </div>
        </body>
      </html>
    `, { waitUntil: 'networkidle0' }); // networkidle0 can be important
    console.log(`[PDF API][Handler] Page content set. Emulating print media for PO ID: ${poId}`);
    await page.emulateMediaType('print');

    console.log(`[PDF API][Handler] Generating PDF buffer for PO ID: ${poId}`);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
    });
    console.log(`[PDF API][Handler] PDF buffer generated successfully for PO ID: ${poId}. Size: ${pdfBuffer.length} bytes.`);

    await browser.close(); // Close browser BEFORE sending response
    browser = null; // Set to null after closing to prevent double close in finally
    console.log(`[PDF API][Handler] Puppeteer browser closed successfully for PO ID: ${poId}`);

    const poNumberForFile = poData.poNumber || `PO-${poId}`;
    console.log(`[PDF API][Handler] Setting response headers for PDF download: ${poNumberForFile}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${poNumberForFile}.pdf"`);
    console.log(`[PDF API][Handler] Sending PDF response for PO ID: ${poId}`);
    res.send(pdfBuffer);

  } catch (error: any) {
    console.error(`[PDF API][Handler] Critical error in handler for PO ID ${poId}. Error message: ${error.message}. Stack: ${error.stack}`);
    if (!res.headersSent) {
      res.status(500).json({
          source: 'api-generate-po-pdf-main-catch-block',
          error: 'Failed to generate PDF due to a critical server-side issue.',
          details: error.message,
          errorStack: process.env.NODE_ENV === 'development' ? error.stack : 'Stack trace hidden in production.',
      });
    } else {
      console.error("[PDF API][Handler] Headers already sent, cannot send JSON error response.");
    }
  } finally {
      if (browser) { // Check if browser is not null (i.e., was launched but not closed successfully in try)
          try {
            console.log(`[PDF API][Handler][Finally] Attempting to close Puppeteer browser for PO ID: ${poId}`);
            await browser.close();
            console.log(`[PDF API][Handler][Finally] Puppeteer browser closed successfully for PO ID: ${poId}`);
          } catch (closeError: any) {
            console.error(`[PDF API][Handler][Finally] Error closing Puppeteer browser for PO ID ${poId}:`, closeError.message);
          }
      }
  }
}
