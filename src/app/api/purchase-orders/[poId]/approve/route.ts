
import { NextResponse } from 'next/server';
import { pool } from '../../../../../../backend/db.js'; // Adjusted path
import type { PurchaseOrderPayload } from '@/types';

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
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Fetch the Purchase Order
    const [poRows]: any[] = await connection.execute('SELECT * FROM PurchaseOrder WHERE id = ? FOR UPDATE', [numericPoId]);
    if (poRows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: `Purchase Order with ID ${numericPoId} not found` }, { status: 404 });
    }
    const purchaseOrder: PurchaseOrderPayload = poRows[0] as PurchaseOrderPayload;

    // 2. Check if PO is already approved or not pending
    if (purchaseOrder.status !== 'Pending Approval') {
      await connection.rollback();
      return NextResponse.json({ error: `Purchase Order is not pending approval. Current status: ${purchaseOrder.status}` }, { status: 400 });
    }

    // 3. Get the assigned approverId from the PO (still useful for context if needed later, but not directly used in this simplified update)
    const assignedApproverId = purchaseOrder.approverId;
    if (!assignedApproverId) {
      await connection.rollback();
      // This check remains as a PO should have an assigned approver to be approved.
      return NextResponse.json({ error: 'No approver assigned to this Purchase Order. Cannot approve.' }, { status: 400 });
    }

    // 4. Update the Purchase Order status and approval date
    const approvalDate = new Date();
    await connection.execute(
      'UPDATE PurchaseOrder SET status = ?, approvalDate = ? WHERE id = ?',
      ['Approved', approvalDate, numericPoId]
    );

    await connection.commit();

    return NextResponse.json({ 
      message: 'Purchase Order approved successfully.', 
      poId: numericPoId, 
      newStatus: 'Approved', 
      approvalDate: approvalDate.toISOString(),
    });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error(`Error approving PO ${poIdParam}: Server-side full error:`, error); 
    
    let errorDetails = 'An unknown error occurred on the server.';
    let errorStack = '';

    if (error instanceof Error) {
      errorDetails = error.message;
      errorStack = error.stack || '';
    } else if (typeof error === 'string') {
      errorDetails = error;
    } else if (error && typeof error.message === 'string') {
      errorDetails = error.message;
      if (typeof error.stack === 'string') {
        errorStack = error.stack;
      }
    }

    return NextResponse.json({ 
      error: `Failed to approve Purchase Order ${poIdParam}.`, 
      details: errorDetails,
      stack: errorStack 
    }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
