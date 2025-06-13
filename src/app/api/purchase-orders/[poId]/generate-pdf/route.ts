
import { NextResponse } from 'next/server';
import { pool } from '../../../../../../backend/db.js';
import type { PurchaseOrderPayload, POItemPayload, Supplier, Site, Category as CategoryType, POItemForPrint, Approver } from '@/types';
import ReactDOMServer from 'react-dom/server';
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { poId: string } }
) {
  const { poId } = params;
  const numericPoId = Number(poId);

  if (!poId || isNaN(numericPoId)) {
    return NextResponse.json({ error: 'Valid Purchase Order ID is required' }, { status: 400 });
  }

  try {
    // 1. Fetch PO Header
    const [poHeaderRows]: any[] = await pool.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [numericPoId]);
    if (poHeaderRows.length === 0) {
      return NextResponse.json({ error: `Purchase Order with ID ${numericPoId} not found` }, { status: 404 });
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

    // 2. Fetch PO Items
    const [poItemRows]: any[] = await pool.execute('SELECT * FROM POItem WHERE poId = ?', [numericPoId]);
    
    // 3. Fetch related data for items and header
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

    const fullPoData: PurchaseOrderPayload = {
      ...headerData,
      items: itemsForPrint,
      supplierDetails: supplierDetails,
      approverName: approverDetails?.name,
      approverSignatureUrl: approverSignatureUrl, // This is part of PurchaseOrderPayload type
      quoteNo: headerData.quoteNo || '', // Ensure quoteNo is present
    };

    // Read logo and convert to base64
    let logoDataUri = '';
    try {
      const logoPath = path.resolve(process.cwd(), 'public', 'jachris-logo.png');
      const logoBuffer = await fs.readFile(logoPath);
      logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (logoError) {
      console.warn('Logo file not found or could not be read, PDF will use default path:', logoError);
      // If logo can't be read, PrintablePO will use its default relative path, which might not work in PDF
    }
    
    // Render React component to HTML string
    const poHtml = ReactDOMServer.renderToString(
      React.createElement(PrintablePO, { poData: fullPoData, logoDataUri: logoDataUri })
    );

    // Read global print CSS (simplified for example, could be more complex)
    // For a more robust solution, ensure Puppeteer can access linked stylesheets or inline critical CSS.
    // Here, we rely on the @media print styles in globals.css being picked up by emulateMediaType.
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Order ${fullPoData.poNumber}</title>
        <link rel="stylesheet" href="/globals.css"> {/* Adjust if your globals.css is served differently or inline styles */}
         <style>
          /* Minimal reset for Puppeteer if globals.css is not fully effective via link */
          body, html { margin: 0; padding: 0; background-color: #fff; font-family: 'Arial', sans-serif; color: #000; }
          /* Ensure @media print from globals.css is respected by Puppeteer */
        </style>
      </head>
      <body>
        ${poHtml}
      </body>
      </html>
    `;
    
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Common args for server environments
    });
    const page = await browser.newPage();
    
    // It's often better to use page.goto(`data:text/html,${fullHtml}`, { waitUntil: 'networkidle0' }) 
    // or serve the HTML from a temporary local file/endpoint if assets need to be loaded relative to it.
    // For simplicity, setContent is used here. Relative paths in poHtml (like for CSS) might need adjustment.
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' }); 
    await page.emulateMediaType('print'); // Crucial for applying @media print styles

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '10mm',
        bottom: '20mm',
        left: '10mm',
      },
    });

    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="PO-${fullPoData.poNumber}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error(`Error generating PDF for PO ${poId}:`, error);
    return NextResponse.json({ error: 'Failed to generate PDF.', details: error.message, stack: error.stack }, { status: 500 });
  }
}
