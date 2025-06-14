
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
  if (isNaN(numericPoId)) return null;

  try {
    const [poHeaderRows]: any[] = await pool.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [numericPoId]);
    if (poHeaderRows.length === 0) {
      console.error(`Purchase Order with ID ${numericPoId} not found for PDF generation.`);
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
      items: [], // Will be populated next
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
  } catch (error) {
    console.error(`Error fetching PO data for PDF (PO ID: ${poId}):`, error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { poId } = req.query;

  if (typeof poId !== 'string' || !poId) {
    return res.status(400).json({ error: 'Valid Purchase Order ID is required in query parameters.' });
  }

  try {
    const poData = await getPODataForPdf(poId);

    if (!poData) {
      return res.status(404).json({ error: `Purchase Order ${poId} not found or data incomplete.` });
    }

    let logoDataUri = '';
    try {
      // Path relative to the project root where 'public' folder is.
      const logoPath = path.resolve(process.cwd(), 'public', 'jachris-logo.png');
      const logoBuffer = await fs.readFile(logoPath);
      logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (logoError) {
      console.warn('Logo file not found or could not be read for PDF generation:', logoError);
      // PDF can still be generated without the logo, or with a placeholder.
    }

    const htmlContent = ReactDOMServer.renderToString(
      React.createElement(PrintablePO, { poData, logoDataUri })
    );
    
    const browser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] // Common args for server environments
    });
    const page = await browser.newPage();
    
    // Set content for Puppeteer
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Emulate print media type and apply print-specific styles
    // (These styles are a subset of what's in globals.css for print, focusing on essentials)
    await page.emulateMediaType('print');
    await page.addStyleTag({ content: `
        body, html {
          background-color: #ffffff !important;
          color: #000000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100%;
          font-size: 10pt; /* Consistent font size for PDF */
          font-family: 'Arial', sans-serif; /* Generic font for PDF */
        }
        .printable-po-content-wrapper { /* Assuming this class wraps PrintablePO component content */
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important; 
          width: 100% !important;
          max-width: 100% !important;
          background-color: #ffffff !important;
        }
        table, th, td {
            border: 1px solid #000000 !important; /* Basic black borders */
            padding: 4pt !important; /* Reduced padding */
        }
        *, *::before, *::after {
            transition: none !important;
            transform: none !important;
            box-shadow: none !important; /* Remove all shadows */
        }
        img { max-width: 100%; height: auto; } /* Ensure images are responsive */
    ` });


    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Important for backgrounds and colors
      margin: { // Control margins for the PDF page
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    await browser.close();

    const poNumberForFile = poData.poNumber || `PO-${poId}`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${poNumberForFile}.pdf"`);
    res.send(pdfBuffer);

  } catch (error: any) {
    console.error(`Error generating PDF for PO ${poId}:`, error);
    res.status(500).json({ 
        error: 'Failed to generate PDF.', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Include stack in dev
    });
  }
}
