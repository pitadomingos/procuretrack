
import type { NextApiRequest, NextApiResponse } from 'next';
import ReactDOMServer from 'react-dom/server';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import React from 'react'; // Required for JSX
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import { pool } from '../../backend/db'; // Adjusted path for pages/api
import type { PurchaseOrderPayload, POItemPayload, Supplier, Site, Category as CategoryType, Approver, POItemForPrint } from '@/types';

async function getPODataForPdf(poId: string): Promise<PurchaseOrderPayload | null> {
  const numericPoId = Number(poId);
  if (isNaN(numericPoId)) {
    console.error(`[PDF API] Invalid PO ID format for PDF: ${poId}`);
    return null;
  }

  try {
    const [poHeaderRows]: any[] = await pool.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [numericPoId]);
    if (poHeaderRows.length === 0) {
      console.error(`[PDF API] Purchase Order with ID ${numericPoId} not found for PDF generation.`);
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
    
    const [suppliersRes, sitesRes, categoriesRes, approversRes] = await Promise.all([
      pool.query('SELECT * FROM Supplier'),
      pool.query('SELECT * FROM Site'),
      pool.query('SELECT * FROM Category'),
      pool.query('SELECT * FROM Approver'),
    ]);

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

    return {
      ...headerData,
      items: itemsForPrint,
      supplierDetails: supplierDetails,
      approverName: approverDetails?.name,
      approverSignatureUrl: approverSignatureUrl,
      quoteNo: headerData.quoteNo || '',
    };
  } catch (error: any) {
    console.error(`[PDF API] Error in getPODataForPdf for PO ID ${poId}:`, error.message);
    if (error.stack) {
        console.error("[PDF API] Stack trace for getPODataForPdf:", error.stack);
    }
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { poId } = req.query;
  console.log(`[PDF API] Received request for PO ID: ${poId}`);

  if (typeof poId !== 'string' || !poId) {
    console.error('[PDF API] Invalid PO ID in query parameters.');
    return res.status(400).json({ 
      source: 'api-generate-po-pdf-validation',
      error: 'Valid Purchase Order ID is required in query parameters.' 
    });
  }

  let browser; 

  try {
    console.log(`[PDF API] Fetching PO data for PO ID: ${poId}`);
    const poData = await getPODataForPdf(poId);

    if (!poData) {
      console.error(`[PDF API] PO Data not found or incomplete for PO ID: ${poId}`);
      return res.status(404).json({ 
        source: 'api-generate-po-pdf-data-fetch',
        error: `Purchase Order ${poId} not found or data incomplete.` 
      });
    }
    console.log(`[PDF API] PO data fetched successfully for PO ID: ${poId}`);

    let logoDataUri = '';
    try {
      const logoPath = path.resolve(process.cwd(), 'public', 'jachris-logo.png');
      console.log(`[PDF API] Attempting to read logo from: ${logoPath}`);
      const logoBuffer = await fs.readFile(logoPath);
      logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      console.log(`[PDF API] Logo read successfully.`);
    } catch (logoError: any) {
      console.warn(`[PDF API] Logo file not found or could not be read: ${logoError.message}. Proceeding without custom logo.`);
    }

    console.log(`[PDF API] Rendering PrintablePO component to HTML string for PO ID: ${poId}`);
    const htmlContent = ReactDOMServer.renderToString(
      React.createElement(PrintablePO, { poData, logoDataUri })
    );
    console.log(`[PDF API] HTML content rendered successfully for PO ID: ${poId}`);
    
    console.log(`[PDF API] Launching Puppeteer for PO ID: ${poId}`);
    browser = await puppeteer.launch({ 
        headless: true, 
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox', 
          '--disable-dev-shm-usage', 
          '--disable-gpu', // Often necessary in server environments
          '--single-process', // Can help in resource-constrained environments
          '--no-zygote', // Another common flag for compatibility
          // '--font-render-hinting=none' // May help with font rendering issues if they occur
        ],
        dumpio: process.env.NODE_ENV === 'development' // Log puppeteer browser console output in dev
    });
    console.log(`[PDF API] Puppeteer launched. Creating new page for PO ID: ${poId}`);
    const page = await browser.newPage();
    
    console.log(`[PDF API] Setting page content for PO ID: ${poId}`);
    await page.setContent(`
      <html>
        <head>
          <meta charSet="UTF-8" />
          <title>Purchase Order ${poData.poNumber}</title>
          <style>
            body, html { margin: 0; padding: 0; background-color: #fff; color: #000; font-family: 'Arial', sans-serif; font-size: 10pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .printable-po-content-wrapper { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; background-color: #ffffff !important; }
            table, th, td { border: 1px solid #000000 !important; padding: 4pt !important; }
            *, *::before, *::after { transition: none !important; transform: none !important; box-shadow: none !important; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <div class="printable-po-content-wrapper">
            ${htmlContent}
          </div>
        </body>
      </html>
    `, { waitUntil: 'networkidle0' });
    console.log(`[PDF API] Page content set. Emulating print media for PO ID: ${poId}`);

    await page.emulateMediaType('print');

    console.log(`[PDF API] Generating PDF buffer for PO ID: ${poId}`);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });
    console.log(`[PDF API] PDF buffer generated successfully for PO ID: ${poId}. Size: ${pdfBuffer.length} bytes.`);

    const poNumberForFile = poData.poNumber || `PO-${poId}`;

    console.log(`[PDF API] Setting response headers for PDF download: ${poNumberForFile}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${poNumberForFile}.pdf"`);
    console.log(`[PDF API] Sending PDF response for PO ID: ${poId}`);
    res.send(pdfBuffer);

  } catch (error: any) {
    console.error(`[PDF API] Critical error in handler for PO ID ${poId}:`, error.message);
    if (error.stack) {
        console.error("[PDF API] Stack trace for handler error:", error.stack);
    }
    if (!res.headersSent) {
      res.status(500).json({ 
          source: 'api-generate-po-pdf-catch-block',
          error: 'Failed to generate PDF due to a critical server-side issue.', 
          details: error.message,
          errorStack: process.env.NODE_ENV === 'development' ? error.stack : 'Stack trace hidden in production',
      });
    } else {
      console.error("[PDF API] Headers already sent, cannot send JSON error response.");
    }
  } finally {
      if (browser) {
          try {
            console.log(`[PDF API] Closing Puppeteer browser for PO ID: ${poId}`);
            await browser.close();
            console.log(`[PDF API] Puppeteer browser closed successfully for PO ID: ${poId}`);
          } catch (closeError: any) {
            console.error(`[PDF API] Error closing Puppeteer browser for PO ID ${poId}:`, closeError.message);
          }
      }
  }
}
    