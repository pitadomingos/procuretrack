
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
  console.log(`[PDF API][getPODataForPdf] START - Attempting to fetch data for numeric PO ID: ${numericPoId}`);

  try {
    console.log(`[PDF API][getPODataForPdf] Executing PO Header query for ID: ${numericPoId}`);
    const [poHeaderRows]: any[] = await pool.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [numericPoId]);
    console.log(`[PDF API][getPODataForPdf] PO Header query done. Rows found: ${poHeaderRows.length}`);
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
    console.log(`[PDF API][getPODataForPdf] PO Header data processed for ID: ${numericPoId}`);

    console.log(`[PDF API][getPODataForPdf] Executing PO Items query for PO ID: ${numericPoId}`);
    const [poItemRows]: any[] = await pool.execute('SELECT * FROM POItem WHERE poId = ?', [numericPoId]);
    console.log(`[PDF API][getPODataForPdf] PO Items query done. Rows found: ${poItemRows.length}`);
    
    console.log(`[PDF API][getPODataForPdf] Fetching auxiliary data (suppliers, sites, categories, approvers)`);
    const [suppliersRes, sitesRes, categoriesRes, approversRes] = await Promise.all([
      pool.query('SELECT * FROM Supplier'),
      pool.query('SELECT * FROM Site'),
      pool.query('SELECT * FROM Category'),
      pool.query('SELECT * FROM Approver'),
    ]);
    console.log(`[PDF API][getPODataForPdf] Auxiliary data fetched.`);

    const allSuppliers = suppliersRes[0] as Supplier[];
    const allSites = sitesRes[0] as Site[];
    const allCategories = categoriesRes[0] as CategoryType[];
    const allApprovers = approversRes[0] as Approver[];

    const supplierDetails = allSuppliers.find(s => s.supplierCode === headerData.supplierId);
    const approverDetails = allApprovers.find(a => a.id === headerData.approverId);
    console.log(`[PDF API][getPODataForPdf] Supplier found: ${!!supplierDetails}, Approver found: ${!!approverDetails}`);

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
    console.log(`[PDF API][getPODataForPdf] PO Items processed for printing: ${itemsForPrint.length} items.`);
    
    const approverSignatureUrl = approverDetails ? `/signatures/${approverDetails.id}.png` : undefined;

    console.log(`[PDF API][getPODataForPdf] END - Successfully processed data for PO ID: ${numericPoId}`);
    return {
      ...headerData,
      items: itemsForPrint,
      supplierDetails: supplierDetails,
      approverName: approverDetails?.name,
      approverSignatureUrl: approverSignatureUrl,
      quoteNo: headerData.quoteNo || '',
    };
  } catch (error: any) {
    console.error(`[PDF API][getPODataForPdf] CRITICAL ERROR during data fetching/processing for PO ID ${poId} (numeric ${numericPoId}). Message: ${error.message}`);
    if (error.stack) {
        console.error("[PDF API][getPODataForPdf] Stack trace:", error.stack);
    }
    throw error; // Re-throw to be caught by the main handler
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { poId } = req.query;
  console.log(`[PDF API][Handler] START - Received request for PO ID: ${poId}`);

  if (typeof poId !== 'string' || !poId) {
    console.error('[PDF API][Handler] Invalid PO ID in query parameters.');
    return res.status(400).json({
      source: 'api-handler-validation',
      error: 'Valid Purchase Order ID is required in query parameters.',
      poIdReceived: poId,
    });
  }

  let browser: puppeteer.Browser | null = null;

  try {
    console.log(`[PDF API][Handler] Fetching PO data for PO ID: ${poId}`);
    const poData = await getPODataForPdf(poId);

    if (!poData) {
      console.error(`[PDF API][Handler] PO Data not found or incomplete after getPODataForPdf for PO ID: ${poId}`);
      return res.status(404).json({
        source: 'api-handler-data-fetch',
        error: `Purchase Order data not found or incomplete for PO ID ${poId}.`,
      });
    }
    console.log(`[PDF API][Handler] PO data fetched successfully for PO ID: ${poId}`);

    let logoDataUri = '';
    try {
      const logoPath = path.resolve(process.cwd(), 'public', 'jachris-logo.png');
      console.log(`[PDF API][Handler] Attempting to read logo from: ${logoPath}`);
      const logoBuffer = await fs.readFile(logoPath);
      logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      console.log(`[PDF API][Handler] Logo read successfully. Length: ${logoDataUri.length}`);
    } catch (logoError: any) {
      console.warn(`[PDF API][Handler] Logo file error: ${logoError.message}. Proceeding without custom logo data URI.`);
      // Not returning error, proceed without logo. PrintablePO should handle undefined logoDataUri.
    }

    console.log(`[PDF API][Handler] Rendering PrintablePO component to HTML string for PO ID: ${poId}`);
    const reactElement = React.createElement(PrintablePO, { poData, logoDataUri });
    const htmlContent = ReactDOMServer.renderToString(reactElement);
    console.log(`[PDF API][Handler] HTML content rendered. Length: ${htmlContent.length}`);

    const puppeteerArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Important for constrained environments
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', 
      '--disable-gpu', // Often not needed for headless PDF generation
    ];
    console.log(`[PDF API][Handler] Launching Puppeteer with args: ${puppeteerArgs.join(' ')}`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: puppeteerArgs,
      dumpio: process.env.NODE_ENV === 'development', // Logs browser console output
    });
    console.log(`[PDF API][Handler] Puppeteer launched. Creating new page for PO ID: ${poId}`);
    const page = await browser.newPage();
    
    if (process.env.NODE_ENV === 'development') {
        page.on('console', msg => console.log('[PDF API][Puppeteer Page Console]', msg.type().toUpperCase(), msg.text()));
        page.on('pageerror', error => console.error('[PDF API][Puppeteer Page Error]', error.message));
        page.on('requestfailed', request => console.warn('[PDF API][Puppeteer Request Failed]', request.url(), request.failure()?.errorText));
    }

    console.log(`[PDF API][Handler] Setting page content for PO ID: ${poId}`);
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charSet="UTF-8" />
          <title>Purchase Order ${poData.poNumber}</title>
          <style>
            body { margin: 20px; font-family: 'Arial', sans-serif; font-size: 10pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            /* Minimal styling, assuming PrintablePO uses inline styles or basic CSS that renderToString includes */
            /* For Tailwind, you'd typically need to inline styles or link to a stylesheet that Puppeteer can access */
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 5px; text-align: left; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>`;
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    console.log(`[PDF API][Handler] Page content set. Emulating print media for PO ID: ${poId}`);
    await page.emulateMediaType('print');

    console.log(`[PDF API][Handler] Generating PDF buffer for PO ID: ${poId}`);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '10mm', bottom: '20mm', left: '10mm' }, // Standard margins
    });
    console.log(`[PDF API][Handler] PDF buffer generated. Size: ${pdfBuffer.length} bytes.`);

    await browser.close(); 
    browser = null;
    console.log(`[PDF API][Handler] Puppeteer browser closed successfully.`);

    const poNumberForFile = poData.poNumber || `PO-${poId}`;
    console.log(`[PDF API][Handler] Setting response headers for PDF download: ${poNumberForFile}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${poNumberForFile}.pdf"`);
    
    console.log(`[PDF API][Handler] SUCCESS - Sending PDF response for PO ID: ${poId}`);
    res.send(pdfBuffer);

  } catch (error: any) {
    console.error(`[PDF API][Handler] CRITICAL ERROR for PO ID ${poId}. Message: ${error.message}`);
    if (error.stack) {
        console.error("[PDF API][Handler] Stack trace:", error.stack);
    }
    
    // Attempt to close browser if it was opened and an error occurred
    if (browser) {
      try {
        console.log(`[PDF API][Handler][Error Catch] Attempting to close Puppeteer browser.`);
        await browser.close();
        browser = null; // Ensure it's marked as closed
        console.log(`[PDF API][Handler][Error Catch] Puppeteer browser closed.`);
      } catch (closeError: any) {
        console.error(`[PDF API][Handler][Error Catch] Error closing Puppeteer browser:`, closeError.message);
      }
    }

    // Send a structured JSON error response if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({
          source: 'api-handler-main-catch',
          error: 'Failed to generate PDF due to a server-side critical issue.',
          details: error.message || 'An unknown error occurred during PDF generation.',
          poIdProcessed: poId,
          // Only include stack in development for security
          stack: process.env.NODE_ENV === 'development' ? error.stack : 'Stack trace hidden for security.',
      });
    } else {
      // This case should ideally not happen if browser.close() is before res.send()
      console.error("[PDF API][Handler][Error Catch] Headers already sent, cannot send JSON error response. This indicates a problem with response flow.");
    }
  }
}
    