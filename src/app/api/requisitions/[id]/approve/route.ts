
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../../../backend/db.js';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: requisitionId } = params;

  if (!requisitionId) {
    return NextResponse.json({ error: 'Requisition ID is required' }, { status: 400 });
  }

  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [reqRows]: any[] = await connection.execute('SELECT status, approverId FROM Requisition WHERE id = ? FOR UPDATE', [requisitionId]);
    if (reqRows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: `Requisition with ID ${requisitionId} not found` }, { status: 404 });
    }

    const requisition = reqRows[0];
    if (requisition.status !== 'Pending Approval') {
      await connection.rollback();
      return NextResponse.json({ error: `Requisition is not pending approval. Current status: ${requisition.status}` }, { status: 400 });
    }
    
    // Optionally, verify if the logged-in user is the assigned approver (requires auth context)
    // For now, we assume the request is legitimate if it reaches here for the correct approver.

    const approvalDate = new Date();
    await connection.execute(
      'UPDATE Requisition SET status = ?, approvalDate = ?, updatedAt = NOW() WHERE id = ?',
      ['Approved', approvalDate, requisitionId]
    );

    await connection.commit();

    return NextResponse.json({
      message: 'Requisition approved successfully.',
      requisitionId: requisitionId,
      newStatus: 'Approved',
      approvalDate: approvalDate.toISOString(),
    });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error(`[API_ERROR] /api/requisitions/${requisitionId}/approve:`, error);
    return NextResponse.json({ error: `Failed to approve requisition ${requisitionId}.`, details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
