
import { NextResponse } from 'next/server';
import { pool } from '../../../../../../backend/db.js';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: requisitionId } = params;
  // const { reason } = await request.json(); // Optional: capture rejection reason

  if (!requisitionId) {
    return NextResponse.json({ error: 'Requisition ID is required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [reqRows]: any[] = await connection.execute('SELECT status FROM Requisition WHERE id = ? FOR UPDATE', [requisitionId]);
    if (reqRows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: `Requisition with ID ${requisitionId} not found` }, { status: 404 });
    }

    if (reqRows[0].status !== 'Pending Approval') {
      await connection.rollback();
      return NextResponse.json({ error: `Requisition cannot be rejected. Current status: ${reqRows[0].status}` }, { status: 400 });
    }
    
    await connection.execute(
      'UPDATE Requisition SET status = ?, approvalDate = NULL, updatedAt = NOW() WHERE id = ?',
      // If storing reason: SET status = ?, approvalDate = NULL, rejectionReason = ?, updatedAt = NOW()
      ['Rejected', requisitionId]
    );

    await connection.commit();

    return NextResponse.json({
      message: 'Requisition rejected successfully.',
      requisitionId: requisitionId,
      newStatus: 'Rejected',
    });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error(`[API_ERROR] /api/requisitions/${requisitionId}/reject:`, error);
    return NextResponse.json({ error: `Failed to reject requisition ${requisitionId}.`, details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
