
import { pool } from '../../../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';
import type { PurchaseOrderPayload, POItemPayload, Supplier } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { poNumber: string } }
) {
  const { poNumber } = params;

  if (!poNumber) {
    return NextResponse.json({ message: 'PO Number is required' }, { status: 400 });
  }

  const decodedPoNumber = decodeURIComponent(poNumber);
  let connection;

  try {
    connection = await pool.getConnection();

    const [poHeaderRows]: any[] = await connection.execute(
      'SELECT * FROM PurchaseOrder WHERE poNumber = ?',
      [decodedPoNumber]
    );

    if (poHeaderRows.length === 0) {
      return NextResponse.json({ message: `Purchase Order with PO Number ${decodedPoNumber} not found.` }, { status: 404 });
    }

    const poHeader: PurchaseOrderPayload = poHeaderRows[0] as PurchaseOrderPayload;

    if (poHeader.status !== 'Approved') {
      return NextResponse.json({ message: `Purchase Order ${decodedPoNumber} is not approved. Current status: ${poHeader.status}. Cannot receive items.` }, { status: 400 });
    }
    
    if (poHeader.supplierId) {
        const [supplierRows]: any[] = await connection.execute('SELECT * FROM Supplier WHERE supplierCode = ?', [poHeader.supplierId]);
        if (supplierRows.length > 0) {
            poHeader.supplierDetails = supplierRows[0] as Supplier;
        }
    }

    const [poItemRows]: any[] = await connection.execute(
      'SELECT * FROM POItem WHERE poId = ?',
      [poHeader.id]
    );

    const poItems: POItemPayload[] = poItemRows.map((item: any) => ({
        id: item.id,
        poId: item.poId,
        partNumber: item.partNumber,
        description: item.description,
        categoryId: item.categoryId,
        siteId: item.siteId,
        uom: item.uom,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        quantityReceived: Number(item.quantityReceived || 0), // Fetch new field
        itemStatus: item.itemStatus || 'Pending', // Fetch new field
    }));
    
    if (poItems.length === 0) {
        return NextResponse.json({ message: `No items found for approved Purchase Order ${decodedPoNumber}.` }, { status: 404 });
    }

    return NextResponse.json({ poHeader, poItems });

  } catch (error: any) {
    console.error(`Error fetching PO for GRN (PO Number ${decodedPoNumber}):`, error);
    return NextResponse.json({ message: 'Failed to fetch purchase order data for GRN.', details: error.message }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
