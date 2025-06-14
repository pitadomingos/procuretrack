
import { NextResponse } from 'next/server';
import { pool } from '../../../../../../backend/db.js';
import type { PurchaseOrderPayload, POItemPayload, Supplier, Site, Category as CategoryType, POItemForPrint, Approver } from '@/types';
import { renderPoToHtml } from '@/lib/render-po-to-html';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import React from 'react'; // Keep React import if createElement is used inside renderPoToHtml or indirectly

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
      approverSignatureUrl: approverSignatureUrl, 
      quoteNo: headerData.quoteNo || '', 
    };

    let logoDataUri = '';
    try {
      const logoPath = path.resolve(process.cwd(), 'public', 'jachris-logo.png');
      const logoBuffer = await fs.readFile(logoPath);
      logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (logoError) {
      console.warn('Logo file not found or could not be read, PDF will use default path:', logoError);
    }
    
    const poHtml = renderPoToHtml(fullPoData, logoDataUri);

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Order ${fullPoData.poNumber}</title>
        <style>
          /* Minimal reset for Puppeteer if globals.css is not fully effective via link */
          body, html { margin: 0; padding: 0; background-color: #fff; font-family: 'Arial', sans-serif; color: #000; }
          /* You might need to inline critical CSS from globals.css here if link tag doesn't work */
        </style>
      </head>
      <body>
        ${poHtml}
      </body>
      </html>
    `;
    
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // It's often better to use page.goto(`data:text/html,${encodeURIComponent(fullHtml)}`, { waitUntil: 'networkidle0' })
    // or serve the HTML from a temporary local file/endpoint if assets (like linked CSS) need to be loaded relative to it.
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' }); 
    await page.emulateMediaType('print');

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
