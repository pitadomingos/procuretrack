
import type { NextApiRequest, NextApiResponse } from 'next';
import ReactDOMServer from 'react-dom/server';
import { chromium, type Browser } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import React from 'react'; 
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import { pool } from '../../../backend/db.js'; 
import type { PurchaseOrderPayload, POItemPayload, Supplier, Site, Category as CategoryType, Approver, POItemForPrint } from '@/types';

async function getPODataForPdf(poId: string): Promise<PurchaseOrderPayload | null> {
  const numericPoId = Number(poId);
  if (isNaN(numericPoId)) {
    console.error(`[PDF API][getPODataForPdf] Invalid PO ID format: ${poId}`);
    return null;
  }
  console.log(`[PDF API][getPODataForPdf] START - Attempting to fetch data for numeric PO ID: ${numericPoId}`);

  let connection;
  try {
    connection = await pool.getConnection();
    console.log(`[PDF API][getPODataForPdf] Database connection obtained for PO ID: ${numericPoId}`);

    console.log(`[PDF API][getPODataForPdf] Executing PO Header query for ID: ${numericPoId}`);
    const [poHeaderRows]: any[] = await connection.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [numericPoId]);
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
    // Fetch items including new fields
    const [poItemRows]: any[] = await connection.execute('SELECT * FROM POItem WHERE poId = ?', [numericPoId]);
    console.log(`[PDF API][getPODataForPdf] PO Items query done. Rows found: ${poItemRows.length}`);

    console.log(`[PDF API][getPODataForPdf] Fetching auxiliary data (suppliers, sites, categories, approvers)`);
    const [suppliersRes, sitesRes, categoriesRes, approversRes] = await Promise.all([
      connection.query('SELECT * FROM Supplier'),
      connection.query('SELECT * FROM Site'),
      connection.query('SELECT * FROM Category'),
      connection.query('SELECT * FROM Approver'),
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
        ...item, // Includes quantityReceived and itemStatus from DB
        id: item.id ? Number(item.id) : undefined,
        poId: item.poId ? Number(item.poId) : undefined,
        quantity: Number(item.quantity || 0),
        unitPrice: Number(item.unitPrice || 0),
        quantityReceived: Number(item.quantityReceived || 0), // Ensure this is present
        itemStatus: item.itemStatus || 'Pending', // Ensure this is present
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
  } catch (dbError: any) {
    console.error(`[PDF API][getPODataForPdf][DB_ERROR] PO ID ${poId}: ${dbError.message}`);
    console.error(`[PDF API][getPODataForPdf][DB_ERROR_STACK]: ${dbError.stack || 'No stack available'}`);
    throw dbError; 
  } finally {
    if (connection) {
      try {
        await connection.release();
        console.log(`[PDF API][getPODataForPdf][FINALLY] Database connection released for PO ID: ${numericPoId}`);
      } catch (releaseError: any) {
        console.error(`[PDF API][getPODataForPdf][FINALLY] Error releasing database connection for PO ID ${numericPoId}: ${releaseError.message}`);
      }
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { poId } = req.query;
  console.log(`[PDF API][Handler] START - Received request for PO ID: ${poId} (Using Playwright)`);

  if (typeof poId !== 'string' || !poId) {
    console.error('[PDF API][Handler] Invalid PO ID in query parameters.');
    return res.status(400).json({
      source: 'api-handler-validation',
      error: 'Valid Purchase Order ID is required in query parameters.',
      poIdReceived: poId,
    });
  }

  let browser: Browser | null = null;

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
    const logoFileName = 'jachris-logo.png';
    const logoPath = path.join(process.cwd(), 'public', logoFileName);
    console.log(`[PDF API][Handler] Intending to access logo from: ${logoPath}`);
    
    try {
      await fs.access(logoPath); 
      console.log(`[PDF API][Handler] Logo file found at: ${logoPath}. Reading file.`);
      const logoBuffer = await fs.readFile(logoPath);
      logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      console.log(`[PDF API][Handler] Logo read successfully. Data URI length: ${logoDataUri.length}`);
    } catch (logoError: any) {
      console.warn(`[PDF API][Handler] Logo file error for path "${logoPath}": ${logoError.code} - ${logoError.message}. Proceeding without custom logo data URI (PrintablePO will use default path).`);
    }

    console.log(`[PDF API][Handler] Rendering PrintablePO component to HTML string for PO ID: ${poId}`);
    const reactElement = React.createElement(PrintablePO, { poData, logoDataUri });
    const htmlContent = ReactDOMServer.renderToString(reactElement);
    console.log(`[PDF API][Handler] HTML content rendered. Length: ${htmlContent.length}`);

    const playwrightArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', 
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', 
      '--disable-gpu',
      '--disable-features=IsolateOrigins,site-per-process', 
      '--disable-web-security', 
    ];
    console.log(`[PDF API][Handler] Launching Playwright Chromium with args: ${playwrightArgs.join(' ')} for PO ID: ${poId}`);
    
    browser = await chromium.launch({
      args: playwrightArgs,
      headless: true, 
      timeout: 60000, 
    });
    console.log(`[PDF API][Handler] Playwright browser launched successfully. Version: ${browser.version()}`);

    const context = await browser.newContext({
        acceptDownloads: false, 
    });
    console.log(`[PDF API][Handler] Playwright context created.`);
    const page = await context.newPage();
    console.log(`[PDF API][Handler] Playwright page created.`);

    if (process.env.NODE_ENV === 'development') {
        page.on('console', msg => console.log('[PDF API][Playwright Page Console]', msg.type().toUpperCase(), msg.text()));
        page.on('pageerror', pageError => console.error('[PDF API][Playwright Page Error]', pageError.message, pageError.stack));
        page.on('requestfailed', request => console.warn('[PDF API][Playwright Request Failed]', request.url(), request.failure()?.errorText));
    }

    console.log(`[PDF API][Handler] Setting page content for PO ID: ${poId}`);
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charSet="UTF-8" />
          <title>Purchase Order ${poData.poNumber}</title>
          <style>
            body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; font-size: 10pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>`;
    await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 30000 }); 
    console.log(`[PDF API][Handler] Page content set. Generating PDF for PO ID: ${poId}`);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '10mm', bottom: '20mm', left: '10mm' },
      timeout: 60000, 
    });
    console.log(`[PDF API][Handler] PDF buffer generated. Size: ${pdfBuffer.length} bytes.`);

    console.log(`[PDF API][Handler] Attempting to close Playwright page for PO ID: ${poId}`);
    await page.close();
    console.log(`[PDF API][Handler] Playwright page closed.`);
    console.log(`[PDF API][Handler] Attempting to close Playwright context for PO ID: ${poId}`);
    await context.close();
    console.log(`[PDF API][Handler] Playwright context closed.`);
    console.log(`[PDF API][Handler] Attempting to close Playwright browser for PO ID: ${poId}`);
    await browser.close(); 
    browser = null; 
    console.log(`[PDF API][Handler] Playwright browser closed successfully.`);

    const poNumberForFile = poData.poNumber || `PO-${poId}`;
    console.log(`[PDF API][Handler] Setting response headers for PDF download: ${poNumberForFile}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${poNumberForFile}.pdf"`);

    console.log(`[PDF API][Handler] SUCCESS - Sending PDF response for PO ID: ${poId}`);
    res.send(pdfBuffer);

  } catch (error: any) {
    const errorMessage = error.message || 'An unknown error occurred during PDF generation.';
    const errorName = error.name || 'Error';
    const errorStack = error.stack || 'No stack trace available';

    console.error(`[PDF API][Handler][MAIN CATCH BLOCK] CRITICAL ERROR for PO ID ${poId}: [${errorName}] ${errorMessage}`);
    console.error(`[PDF API][Handler][MAIN CATCH BLOCK] STACK TRACE: ${errorStack}`);

    if (!res.headersSent) {
      res.status(500).json({
        source: 'api-handler-main-catch',
        error: `Server error during PDF generation for PO ID ${poId}.`,
        details: errorMessage,
        errorName: errorName,
        stack: process.env.NODE_ENV === 'development' ? errorStack : 'Stack trace hidden in production',
      });
    } else {
      console.error("[PDF API][Handler][MAIN CATCH BLOCK] Headers already sent, cannot send JSON error response.");
    }
  } finally {
    if (browser) { 
      try {
        console.warn(`[PDF API][Handler][FINALLY BLOCK] Ensuring Playwright browser is closed (if not already) for PO ID: ${poId}`);
        await browser.close();
        console.warn(`[PDF API][Handler][FINALLY BLOCK] Playwright browser closed in finally block for PO ID: ${poId}`);
      } catch (closeError: any) {
        console.error(`[PDF API][Handler][FINALLY BLOCK] Error closing Playwright browser in finally for PO ID ${poId}: ${closeError.message}`);
      }
    }
    console.log(`[PDF API][Handler] END - Request processed for PO ID: ${poId}`);
  }
}
