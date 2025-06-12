
import { NextResponse } from 'next/server';
import { pool } from '../../../../../../backend/db.js'; // Adjusted path
import type { PurchaseOrderPayload, Approver, User as UserType } from '@/types';

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

    // 3. Get the assigned approverId from the PO
    const assignedApproverId = purchaseOrder.approverId;
    if (!assignedApproverId) {
      await connection.rollback();
      return NextResponse.json({ error: 'No approver assigned to this Purchase Order.' }, { status: 400 });
    }

    // 4. Fetch the Approver details
    const [approverRows]: any[] = await connection.execute('SELECT * FROM Approver WHERE id = ?', [assignedApproverId]);
    let finalApprovedByUserId: string | null = null;

    if (approverRows.length > 0) {
      const approver: Approver = approverRows[0] as Approver;
      // 5. If approver has an email, try to find matching User.id
      if (approver.email) {
        const [userRows]: any[] = await connection.execute('SELECT id FROM User WHERE email = ?', [approver.email]);
        if (userRows.length > 0) {
          finalApprovedByUserId = (userRows[0] as UserType).id;
        } else {
          console.warn(`No User found with email ${approver.email} for Approver ID ${assignedApproverId}. approvedByUserId will be null.`);
        }
      } else {
        console.warn(`Approver ID ${assignedApproverId} has no email. approvedByUserId will be null.`);
      }
    } else {
      console.warn(`Approver with ID ${assignedApproverId} not found. approvedByUserId will be null.`);
    }

    // 6. Update the Purchase Order
    const approvalDate = new Date();
    await connection.execute(
      'UPDATE PurchaseOrder SET status = ?, approvalDate = ?, approvedByUserId = ? WHERE id = ?',
      ['Approved', approvalDate, finalApprovedByUserId, numericPoId]
    );

    await connection.commit();

    return NextResponse.json({ 
      message: 'Purchase Order approved successfully.', 
      poId: numericPoId, 
      newStatus: 'Approved', 
      approvalDate: approvalDate.toISOString(),
      approvedByUserId: finalApprovedByUserId 
    });

  } catch (error: any) {
    if (connection) await connection.rollback();
    // Log the full error object to the server console for better inspection
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
      stack: errorStack // Send stack to client for more debugging info if needed
    }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
