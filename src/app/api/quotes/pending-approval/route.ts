
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { QuoteApprovalQueueItem } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const approverEmail = searchParams.get('approverEmail');

  if (!approverEmail) {
    return NextResponse.json({ error: 'Approver email is required' }, { status: 400 });
  }

  let connection;
  try {
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
        q.id,
        q.quoteNumber,
        q.quoteDate,
        c.name as clientName,
        q.creatorEmail,
        q.grandTotal,
        q.currency,
        q.status
      FROM Quote q
      LEFT JOIN Client c ON q.clientId = c.id
      WHERE q.approverId = ? AND q.status = 'Pending Approval'
      ORDER BY q.quoteDate DESC;
    `;
    const [quoteRows]: any[] = await connection.execute(query, [approverId]);

    const results: QuoteApprovalQueueItem[] = quoteRows.map((row: any) => ({
      id: row.id,
      quoteNumber: row.quoteNumber,
      quoteDate: row.quoteDate,
      clientName: row.clientName || 'N/A',
      creatorEmail: row.creatorEmail || 'N/A',
      grandTotal: parseFloat(row.grandTotal || 0),
      currency: row.currency,
      status: row.status,
    }));

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('[API_ERROR] /api/quotes/pending-approval:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending quote approvals.', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
    