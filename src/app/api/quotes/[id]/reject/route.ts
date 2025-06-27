
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../../../backend/db.js';

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
    const pool = await getDbPool();
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [quoteRows]: any[] = await connection.execute('SELECT status FROM Quote WHERE id = ? FOR UPDATE', [quoteId]);
    if (quoteRows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: `Quote with ID ${quoteId} not found` }, { status: 404 });
    }

    if (quoteRows[0].status !== 'Pending Approval') {
      await connection.rollback();
      return NextResponse.json({ error: `Quote cannot be rejected. Current status: ${quoteRows[0].status}` }, { status: 400 });
    }
    
    await connection.execute(
      'UPDATE Quote SET status = ?, approvalDate = NULL, updatedAt = NOW() WHERE id = ?',
      ['Rejected', quoteId]
    );

    await connection.commit();

    return NextResponse.json({
      message: 'Quote rejected successfully.',
      quoteId: quoteId,
      newStatus: 'Rejected',
    });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error(`[API_ERROR] /api/quotes/${quoteId}/reject:`, error);
    return NextResponse.json({ error: `Failed to reject quote ${quoteId}.`, details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
