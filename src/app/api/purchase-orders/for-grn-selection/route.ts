
import { pool } from '../../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';
import type { ApprovedPOForSelect } from '@/types';

export async function GET(request: Request) {
  let connection;
  try {
    connection = await pool.getConnection();
    // Select POs that are 'Approved' and potentially have items not fully received.
    // This query can be further refined if more complex logic for "pending GRN" is needed.
    const query = `
      SELECT 
        po.id, 
        po.poNumber, 
        s.supplierName,
        po.creationDate
      FROM PurchaseOrder po
      LEFT JOIN Supplier s ON po.supplierId = s.supplierCode
      WHERE po.status = 'Approved' 
      ORDER BY po.creationDate DESC;
    `;
    const [rows]: any[] = await connection.execute(query);

    const results: ApprovedPOForSelect[] = rows.map((row: any) => ({
      id: row.id,
      poNumber: row.poNumber,
      supplierName: row.supplierName || 'N/A',
      creationDate: row.creationDate,
    }));

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Error fetching approved POs for GRN selection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch POs for GRN selection.', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
