
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../../backend/db.js';
import type { RequisitionApprovalQueueItem } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const approverEmail = searchParams.get('approverEmail');

  if (!approverEmail) {
    return NextResponse.json({ error: 'Approver email is required' }, { status: 400 });
  }

  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();

    const [approverRows]: any[] = await connection.execute(
      'SELECT id FROM Approver WHERE email = ? AND isActive = TRUE',
      [approverEmail]
    );

    if (approverRows.length === 0) {
      return NextResponse.json({ error: `No active approver found with email ${approverEmail}` }, { status: 404 });
    }
    const approverId = approverRows[0].id;

    const query = `
      SELECT
        r.id,
        r.requisitionNumber,
        r.requisitionDate,
        r.requestedByName,
        COALESCE(u.name, r.requestedByName) as submittedBy,
        COALESCE(s.siteCode, s.name, 'N/A') as siteName,
        r.totalEstimatedValue, -- This field exists in DB but might be 0 or not used by UI
        r.status
      FROM Requisition r
      LEFT JOIN User u ON r.requestedByUserId = u.id 
      LEFT JOIN Site s ON r.siteId = s.id
      WHERE r.approverId = ? AND r.status = 'Pending Approval'
      ORDER BY r.requisitionDate DESC;
    `;
    const [reqRows]: any[] = await connection.execute(query, [approverId]);

    const results: RequisitionApprovalQueueItem[] = reqRows.map((row: any) => ({
      id: row.id,
      documentNumber: row.requisitionNumber,
      creationDate: row.requisitionDate,
      submittedBy: row.submittedBy,
      entityName: row.siteName,
      totalAmount: row.totalEstimatedValue ? parseFloat(row.totalEstimatedValue) : null,
      currency: 'MZN', // Requisitions might not have explicit currency, assuming MZN for display
      status: row.status,
    }));

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('[API_ERROR] /api/requisitions/pending-approval:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending requisition approvals.', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
