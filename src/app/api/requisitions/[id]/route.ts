
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { RequisitionPayload, RequisitionItem, Site, Category as CategoryType, User as UserType, Approver } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Requisition ID is required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const requisitionQuery = `
      SELECT 
        r.*, 
        s.name as siteName, s.siteCode,
        u.name as requestorFullName,
        app.name as approverName
      FROM Requisition r
      LEFT JOIN Site s ON r.siteId = s.id
      LEFT JOIN User u ON r.requestedByUserId = u.id
      LEFT JOIN Approver app ON r.approverId = app.id
      WHERE r.id = ?
    `;
    const [reqRows]: any[] = await connection.execute(requisitionQuery, [id]);

    if (reqRows.length === 0) {
      return NextResponse.json({ error: `Requisition with ID ${id} not found.` }, { status: 404 });
    }

    const requisitionData: RequisitionPayload = {
      ...reqRows[0],
      requisitionDate: new Date(reqRows[0].requisitionDate).toISOString(),
      approvalDate: reqRows[0].approvalDate ? new Date(reqRows[0].approvalDate).toISOString() : null,
      totalEstimatedValue: parseFloat(reqRows[0].totalEstimatedValue || 0),
      requestedByName: reqRows[0].requestorFullName || reqRows[0].requestedByName,
      approverName: reqRows[0].approverName,
    };

    const itemsQuery = `
      SELECT ri.id, ri.requisitionId, ri.partNumber, ri.description, ri.categoryId, ri.quantity, ri.notes, ri.createdAt, ri.updatedAt, ri.siteId,
             c.category as categoryName 
      FROM RequisitionItem ri
      LEFT JOIN Category c ON ri.categoryId = c.id
      WHERE ri.requisitionId = ?
    `;
    const [itemRows]: any[] = await connection.execute(itemsQuery, [id]);
    
    requisitionData.items = itemRows.map((item: any) => ({
      id: item.id,
      requisitionId: item.requisitionId,
      partNumber: item.partNumber,
      description: item.description,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      quantity: parseInt(item.quantity, 10),
      notes: item.notes,
      siteId: item.siteId,
    })) as (Omit<RequisitionItem, 'estimatedUnitPrice'> & {categoryName?: string, siteId?: number | null})[];

    return NextResponse.json(requisitionData);

  } catch (error: any) {
    console.error(`[API_ERROR] /api/requisitions/${id} GET:`, error);
    return NextResponse.json({ error: `Failed to fetch requisition ${id}.`, details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Requisition ID is required for update' }, { status: 400 });
  }

  let connection;
  try {
    const requisitionData = await request.json() as Omit<RequisitionPayload, 'totalEstimatedValue' | 'items'> & { items: (Omit<RequisitionItem, 'estimatedUnitPrice'> & {siteId?: number | null})[] };
    
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [currentReq]:any[] = await connection.execute('SELECT status FROM Requisition WHERE id = ?', [id]);
    if (currentReq.length === 0) {
        await connection.rollback();
        return NextResponse.json({ error: 'Requisition not found for update.'}, { status: 404});
    }
    // Allow editing if Draft or Pending Approval (to change approver, for example)
    if (currentReq[0].status !== 'Draft' && currentReq[0].status !== 'Pending Approval') {
        await connection.rollback();
        return NextResponse.json({ error: `Cannot update requisition. Status is '${currentReq[0].status}'. Only 'Draft' or 'Pending Approval' requisitions can be edited.`}, { status: 400});
    }

    // If an approverId is provided, set status to 'Pending Approval', otherwise keep current (or set to Draft if it was Pending and approver removed)
    const newStatus = requisitionData.approverId ? 'Pending Approval' : 'Draft';

    await connection.execute(
      `UPDATE Requisition SET 
        requisitionDate = ?, requestedByUserId = ?, requestedByName = ?, siteId = ?, 
        status = ?, justification = ?, approverId = ?, updatedAt = NOW() 
       WHERE id = ?`,
      [
        new Date(requisitionData.requisitionDate).toISOString().slice(0, 19).replace('T', ' '),
        requisitionData.requestedByUserId || null,
        requisitionData.requestedByName,
        requisitionData.siteId ? Number(requisitionData.siteId) : null,
        newStatus, // Update status based on approverId
        requisitionData.justification,
        requisitionData.approverId || null,
        id
      ]
    );

    await connection.execute('DELETE FROM RequisitionItem WHERE requisitionId = ?', [id]);

    if (requisitionData.items && requisitionData.items.length > 0) {
      for (const item of requisitionData.items) {
        await connection.execute(
          `INSERT INTO RequisitionItem (id, requisitionId, partNumber, description, categoryId, quantity, notes, siteId, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            item.id || crypto.randomUUID(),
            id, 
            item.partNumber, 
            item.description, 
            item.categoryId ? Number(item.categoryId) : null, 
            item.quantity, 
            item.notes,
            item.siteId ? Number(item.siteId) : null, // Save item-level siteId
          ]
        );
      }
    }

    await connection.commit();
    // Fetch the updated requisition to return it with all joined data
    const getUpdatedQuery = `
      SELECT 
        r.*, 
        s.name as siteName, s.siteCode,
        u.name as requestorFullName,
        app.name as approverName
      FROM Requisition r
      LEFT JOIN Site s ON r.siteId = s.id
      LEFT JOIN User u ON r.requestedByUserId = u.id
      LEFT JOIN Approver app ON r.approverId = app.id
      WHERE r.id = ?
    `;
    const [updatedReqRows]: any[] = await connection.execute(getUpdatedQuery, [id]);
    const updatedRequisition = updatedReqRows[0];
    updatedRequisition.approvalDate = updatedRequisition.approvalDate ? new Date(updatedRequisition.approvalDate).toISOString() : null;
    updatedRequisition.requisitionDate = new Date(updatedRequisition.requisitionDate).toISOString();

    const [updatedItemRows]: any[] = await connection.execute(
       `SELECT ri.*, c.category as categoryName FROM RequisitionItem ri LEFT JOIN Category c ON ri.categoryId = c.id WHERE ri.requisitionId = ?`, [id]
    );
    updatedRequisition.items = updatedItemRows.map((item: any) => ({
      ...item,
      quantity: parseInt(item.quantity, 10),
    }));


    return NextResponse.json(updatedRequisition);


  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error(`[API_ERROR] /api/requisitions/${id} PUT:`, error);
    return NextResponse.json({ error: `Failed to update requisition ${id}.`, details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: 'Requisition ID is required' }, { status: 400 });
    }
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [currentReq]:any[] = await connection.execute('SELECT status FROM Requisition WHERE id = ?', [id]);
        if (currentReq.length === 0) {
            await connection.rollback();
            return NextResponse.json({ error: 'Requisition not found for deletion.'}, { status: 404});
        }
        // Only allow deleting Draft or Rejected requisitions through this direct DELETE
        if (currentReq[0].status !== 'Draft' && currentReq[0].status !== 'Rejected') {
            await connection.rollback();
            return NextResponse.json({ error: `Cannot delete requisition. Status is '${currentReq[0].status}'. Only 'Draft' or 'Rejected' requisitions can be deleted directly.`}, { status: 400});
        }

        await connection.execute('DELETE FROM RequisitionItem WHERE requisitionId = ?', [id]);
        const [result]: any = await connection.execute('DELETE FROM Requisition WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return NextResponse.json({ error: 'Requisition not found or already deleted' }, { status: 404 });
        }

        await connection.commit();
        return NextResponse.json({ message: 'Requisition deleted successfully' });
    } catch (error: any) {
        if (connection) await connection.rollback();
        console.error(`[API_ERROR] /api/requisitions/${id} DELETE:`, error);
        return NextResponse.json({ error: 'Failed to delete requisition', details: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
