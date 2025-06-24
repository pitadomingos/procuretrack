
import { NextResponse } from 'next/server';
import type { GRNPostPayload, POItemPayload, PurchaseOrderPayload } from '@/types';

// Mock user ID for now, replace with actual authenticated user ID
const MOCK_SYSTEM_USER_ID_FOR_GRN_LOG = 'GRN_PROCESSOR_001'; 

export async function POST(request: Request) {
  let connection;
  try {
    const { pool } = await import('../../../../backend/db.js');
    const payload = await request.json() as GRNPostPayload;
    const { poId, grnDate, deliveryNoteNumber, overallGrnNotes, receivedByUserId, items: receivedItems } = payload;

    if (!poId || !grnDate || !receivedByUserId || !receivedItems || receivedItems.length === 0) {
      return NextResponse.json({ error: 'Missing required GRN data.' }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Fetch the Purchase Order to verify its status
    const [poRows]: any[] = await connection.execute('SELECT * FROM PurchaseOrder WHERE id = ? FOR UPDATE', [poId]);
    if (poRows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: `Purchase Order with ID ${poId} not found.` }, { status: 404 });
    }
    const purchaseOrder: PurchaseOrderPayload = poRows[0];

    if (purchaseOrder.status !== 'Approved' && purchaseOrder.status !== 'Partially Received') {
      await connection.rollback();
      return NextResponse.json({ error: `Cannot receive items for PO ${purchaseOrder.poNumber}. Status is '${purchaseOrder.status}'.` }, { status: 400 });
    }

    // 2. Process each received item
    for (const receivedItem of receivedItems) {
      const [poItemRows]: any[] = await connection.execute('SELECT * FROM POItem WHERE id = ? AND poId = ? FOR UPDATE', [receivedItem.poItemId, poId]);
      if (poItemRows.length === 0) {
        throw new Error(`PO Item ID ${receivedItem.poItemId} not found for PO ${poId}.`);
      }
      const poItem: POItemPayload = poItemRows[0];
      
      const quantityToReceive = Number(receivedItem.quantityReceivedNow);
      if (isNaN(quantityToReceive) || quantityToReceive <= 0) {
        continue; // Skip if quantity is invalid or zero
      }

      const currentReceived = Number(poItem.quantityReceived || 0);
      const orderedQuantity = Number(poItem.quantity);
      const outstandingQty = orderedQuantity - currentReceived;

      if (quantityToReceive > outstandingQty) {
        throw new Error(`Cannot receive ${quantityToReceive} for item ${poItem.description}. Only ${outstandingQty} outstanding.`);
      }

      const newTotalReceived = currentReceived + quantityToReceive;
      let newItemStatus = poItem.itemStatus;
      if (newTotalReceived >= orderedQuantity) {
        newItemStatus = 'Fully Received';
      } else if (newTotalReceived > 0) {
        newItemStatus = 'Partially Received';
      }

      await connection.execute(
        'UPDATE POItem SET quantityReceived = ?, itemStatus = ? WHERE id = ?',
        [newTotalReceived, newItemStatus, receivedItem.poItemId]
      );
    }

    // 3. Update overall PO status
    const [updatedPoItems]: any[] = await connection.execute('SELECT quantity, quantityReceived FROM POItem WHERE poId = ?', [poId]);
    const allItemsFullyReceived = updatedPoItems.every((item: any) => Number(item.quantityReceived || 0) >= Number(item.quantity));
    
    let newPOStatus = purchaseOrder.status;
    if (allItemsFullyReceived) {
      newPOStatus = 'Completed';
    } else if (updatedPoItems.some((item: any) => Number(item.quantityReceived || 0) > 0)) {
      // If any item has been received at all (even partially) and not all are complete
      newPOStatus = 'Partially Received';
    }

    if (newPOStatus !== purchaseOrder.status) {
      await connection.execute('UPDATE PurchaseOrder SET status = ? WHERE id = ?', [newPOStatus, poId]);
    }

    // 4. Log activity (simplified)
    const grnNumberSimulated = `GRN-${poId}-${Date.now().toString().slice(-5)}`;
    const logDetails = `GRN: ${grnNumberSimulated} for PO: ${purchaseOrder.poNumber}. Delivery Note: ${deliveryNoteNumber || 'N/A'}. Notes: ${overallGrnNotes || 'None'}. Items received: ${receivedItems.filter(i => i.quantityReceivedNow > 0).length}. PO Status: ${newPOStatus}.`;
    await connection.execute(
      'INSERT INTO ActivityLog (id, user, action, timestamp, details) VALUES (?, ?, ?, NOW(), ?)',
      [crypto.randomUUID(), receivedByUserId, 'GRN Processed', logDetails]
    );
    
    await connection.commit();

    return NextResponse.json({ 
      message: 'GRN processed successfully.', 
      grnNumber: grnNumberSimulated, 
      poId: poId,
      newPOStatus: newPOStatus
    }, { status: 200 });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error('[API_ERROR] /api/grn POST:', error);
    return NextResponse.json({ error: 'Failed to process GRN.', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
