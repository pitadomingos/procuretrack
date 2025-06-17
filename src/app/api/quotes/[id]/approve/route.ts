
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: quoteId } = params;

  if (!quoteId) {
    return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [quoteRows]: any[] = await connection.execute('SELECT status FROM Quote WHERE id = ? FOR UPDATE', [quoteId]);
    if (quoteRows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: `Quote with ID ${quoteId} not found` }, { status: 404 });
    }

    if (quoteRows[0].status !== 'Pending Approval') {
      await connection.rollback();
      return NextResponse.json({ error: `Quote is not pending approval. Current status: ${quoteRows[0].status}` }, { status: 400 });
    }

    const approvalDate = new Date();
    await connection.execute(
      'UPDATE Quote SET status = ?, approvalDate = ?, updatedAt = NOW() WHERE id = ?',
      ['Approved', approvalDate, quoteId]
    );

    await connection.commit();

    return NextResponse.json({
      message: 'Quote approved successfully.',
      quoteId: quoteId,
      newStatus: 'Approved',
      approvalDate: approvalDate.toISOString(),
    });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error(`[API_ERROR] /api/quotes/${quoteId}/approve:`, error);
    return NextResponse.json({ error: `Failed to approve quote ${quoteId}.`, details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
    