
import { pool } from '../../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';
import type { ApprovalQueueItem } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const approverEmail = searchParams.get('approverEmail');

  if (!approverEmail) {
    return NextResponse.json({ error: 'Approver email is required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Find the Approver ID from their email
    const [approverRows]: any[] = await connection.execute(
      'SELECT id FROM Approver WHERE email = ? AND isActive = TRUE',
      [approverEmail]
    );

    if (approverRows.length === 0) {
      return NextResponse.json({ error: `No active approver found with email ${approverEmail}` }, { status: 404 });
    }
    const approverId = approverRows[0].id;

    // 2. Fetch Purchase Orders assigned to this approver that are 'Pending Approval'
    //    and join with Supplier table to get supplierName
    const query = `
      SELECT
        po.id,
        po.poNumber,
        po.creationDate,
        po.requestedByName,
        po.grandTotal,
        po.currency,
        po.status,
        s.supplierName
      FROM PurchaseOrder po
      LEFT JOIN Supplier s ON po.supplierId = s.supplierCode
      WHERE po.approverId = ? AND po.status = 'Pending Approval'
      ORDER BY po.creationDate DESC;
    `;
    const [poRows]: any[] = await connection.execute(query, [approverId]);

    const results: ApprovalQueueItem[] = poRows.map((row: any) => ({
      id: row.id,
      poNumber: row.poNumber,
      creationDate: row.creationDate, // Assuming it's already a string or Date object
      supplierName: row.supplierName || 'N/A',
      requestedByName: row.requestedByName || 'N/A',
      grandTotal: parseFloat(row.grandTotal || 0),
      currency: row.currency,
      status: row.status,
    }));

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Error fetching pending approvals:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch pending approvals.',
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
