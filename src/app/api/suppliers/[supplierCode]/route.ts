
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../../backend/db.js';
import type { Supplier } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { supplierCode: string } }
) {
  const { supplierCode } = params;
  if (!supplierCode) {
    return NextResponse.json({ error: 'Supplier code is required' }, { status: 400 });
  }
  try {
    const pool = await getDbPool();
    const [rows]: any[] = await pool.execute('SELECT * FROM Supplier WHERE supplierCode = ?', [supplierCode]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error(`Error fetching supplier with code ${supplierCode}:`, error);
    return NextResponse.json({ error: 'Failed to fetch supplier', details: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { supplierCode: string } }
) {
  const { supplierCode } = params;
  if (!supplierCode) {
    return NextResponse.json({ error: 'Supplier code is required for update' }, { status: 400 });
  }
  try {
    const pool = await getDbPool();
    const supplierData = await request.json() as Omit<Supplier, 'supplierCode'>;

    if (!supplierData.supplierName) {
      return NextResponse.json({ error: 'Supplier name is required.' }, { status: 400 });
    }

    const query = `
      UPDATE Supplier 
      SET supplierName = ?, salesPerson = ?, cellNumber = ?, physicalAddress = ?, nuitNumber = ?, emailAddress = ?
      WHERE supplierCode = ?
    `;
    const [result]: any[] = await pool.execute(query, [
      supplierData.supplierName,
      supplierData.salesPerson || null,
      supplierData.cellNumber || null,
      supplierData.physicalAddress || null,
      supplierData.nuitNumber || null,
      supplierData.emailAddress || null,
      supplierCode
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Supplier not found or no changes made' }, { status: 404 });
    }
    
    const [updatedSupplierRows]: any[] = await pool.execute('SELECT * FROM Supplier WHERE supplierCode = ?', [supplierCode]);
    if (updatedSupplierRows.length === 0) {
        return NextResponse.json({ error: 'Supplier updated but failed to retrieve.' }, { status: 500 });
    }
    return NextResponse.json(updatedSupplierRows[0]);

  } catch (error: any) {
    console.error(`Error updating supplier with code ${supplierCode}:`, error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED_2'){
        // This might happen if supplierCode is changed and it's a FK in another table,
        // but supplierCode is PK, so it shouldn't be changed typically.
        // More likely, it's referenced.
         return NextResponse.json({ error: 'Failed to update supplier due to referential integrity constraints.', details: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update supplier', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { supplierCode: string } }
) {
  const { supplierCode } = params;
  if (!supplierCode) {
    return NextResponse.json({ error: 'Supplier code is required for deletion' }, { status: 400 });
  }
  try {
    const pool = await getDbPool();
    const [result]: any[] = await pool.execute('DELETE FROM Supplier WHERE supplierCode = ?', [supplierCode]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Supplier deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting supplier with code ${supplierCode}:`, error);
     if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({ error: 'Cannot delete supplier. It is currently referenced by other records (e.g., Purchase Orders). Please remove those references first.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete supplier', details: error.message }, { status: 500 });
  }
}
