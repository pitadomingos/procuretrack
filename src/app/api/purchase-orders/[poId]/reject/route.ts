
import { NextResponse } from 'next/server';
import { pool } from '../../../../../../backend/db.js'; // Adjusted path

export async function POST(
  request: Request,
  { params }: { params: { poId: string } }
) {
  const poIdParam = params.poId;
  const numericPoId = Number(poIdParam);

  if (!poIdParam || isNaN(numericPoId)) {
    return NextResponse.json({ error: 'Valid Purchase Order ID is required' }, { status: 400 });
  }

  let connection;
  try {
    // const { reason } = await request.json(); // Optional: Get reason from body if provided
    // For now, we are not storing the reason to avoid schema changes.

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Fetch the Purchase Order to ensure it exists and is in a rejectable state
    const [poRows]: any[] = await connection.execute('SELECT status FROM PurchaseOrder WHERE id = ? FOR UPDATE', [numericPoId]);
    if (poRows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: `Purchase Order with ID ${numericPoId} not found` }, { status: 404 });
    }
    const currentStatus = poRows[0].status;

    // 2. Check if PO can be rejected (e.g., only if 'Pending Approval')
    if (currentStatus !== 'Pending Approval') {
      await connection.rollback();
      return NextResponse.json({ error: `Purchase Order cannot be rejected. Current status: ${currentStatus}` }, { status: 400 });
    }

    // 3. Update the Purchase Order status to 'Rejected'
    //    and set approvalDate to NULL in case it was previously approved then re-opened.
    //    Ideally, we would also store rejectionDate and rejectionReason if the schema supported it.
    const rejectionDate = new Date(); // Current date for rejection
    await connection.execute(
      'UPDATE PurchaseOrder SET status = ?, approvalDate = NULL WHERE id = ?',
      // If you add rejectionReason and rejectionDate columns to your DB:
      // 'UPDATE PurchaseOrder SET status = ?, approvalDate = NULL, rejectionDate = ?, rejectionReason = ? WHERE id = ?',
      // ['Rejected', rejectionDate, reason || null, numericPoId]
      ['Rejected', numericPoId]
    );

    await connection.commit();

    return NextResponse.json({ 
      message: 'Purchase Order rejected successfully.', 
      poId: numericPoId, 
      newStatus: 'Rejected',
    });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error(`Error rejecting PO ${poIdParam}: Server-side full error:`, error); 
    
    let errorDetails = 'An unknown error occurred on the server.';
    if (error instanceof Error) errorDetails = error.message;
    else if (typeof error === 'string') errorDetails = error;
    else if (error && typeof error.message === 'string') errorDetails = error.message;

    return NextResponse.json({ 
      error: `Failed to reject Purchase Order ${poIdParam}.`, 
      details: errorDetails,
    }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
