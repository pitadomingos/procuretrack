
import React from 'react';
import { pool } from '../../../../backend/db.js';
import type { PurchaseOrderPayload, POItemPayload, Supplier, Site, Category as CategoryType, POItemForPrint, Approver } from '@/types';
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import fs from 'fs/promises';
import path from 'path';

async function getPOData(poId: string): Promise<PurchaseOrderPayload | null> {
  const numericPoId = Number(poId);
  if (isNaN(numericPoId)) return null;

  try {
    const [poHeaderRows]: any[] = await pool.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [numericPoId]);
    if (poHeaderRows.length === 0) {
      console.error(`Purchase Order with ID ${numericPoId} not found in internal page.`);
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

    // Fetch items including new fields
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
    console.error(`Error fetching PO data for internal print page (PO ID: ${poId}):`, error);
    return null;
  }
}

export default async function InternalPrintPOPage({ params }: { params: { poId: string } }) {
  const poId = params.poId;
  const poData = await getPOData(poId);

  if (!poData) {
    return (
      <html>
        <head><title>Error Generating PO</title></head>
        <body>Error: Purchase Order data could not be loaded for PO ID {poId}.</body>
      </html>
    );
  }

  let logoDataUri = '';
  try {
    const logoPath = path.resolve(process.cwd(), 'public', 'jachris-logo.png');
    const logoBuffer = await fs.readFile(logoPath);
    logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch (logoError) {
    console.warn('Logo file not found or could not be read for internal print page, PDF will use default path or show broken image:', logoError);
  }
  
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>Purchase Order {poData.poNumber}</title>
        <style>{`
          @media print {
            body, html { margin: 0; padding: 0; background-color: #fff; color: #000; font-family: 'Arial', sans-serif; }
          }
        `}</style>
      </head>
      <body>
        <PrintablePO poData={poData} logoDataUri={logoDataUri} />
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic';
