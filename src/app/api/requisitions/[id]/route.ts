
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../../backend/db.js';
import type { RequisitionPayload, RequisitionItem, Site, Category as CategoryType, User as UserType, Approver } from '@/types';
import { randomUUID } from 'crypto';

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
    const pool = await getDbPool();
    connection = await pool.getConnection();

    // Header justification removed from select
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
      siteId: Number(reqRows[0].siteId), // Ensure header siteId is number
      requisitionDate: new Date(reqRows[0].requisitionDate).toISOString(),
      approvalDate: reqRows[0].approvalDate ? new Date(reqRows[0].approvalDate).toISOString() : null,
      totalEstimatedValue: parseFloat(reqRows[0].totalEstimatedValue || 0),
      requestedByName: reqRows[0].requestorFullName || reqRows[0].requestedByName,
      approverName: reqRows[0].approverName,
      // Header justification removed
      items: [], // items will be populated next
    };

    // Item siteId removed from select, item.notes now holds item justification
    const itemsQuery = `
      SELECT ri.id, ri.requisitionId, ri.partNumber, ri.description, ri.categoryId, ri.quantity, ri.notes, ri.createdAt, ri.updatedAt,
             c.category as categoryName 
      FROM RequisitionItem ri
      LEFT JOIN Category c ON ri.categoryId = c.id
      WHERE ri.requisitionId = ?
    `;
    const [itemRows]: any[] = await connection.execute(itemsQuery, [id]);
    
    // Map to RequisitionItem type, which now has justification instead of notes, and no siteId
    requisitionData.items = itemRows.map((item: any) => ({
      id: item.id,
      requisitionId: item.requisitionId,
      partNumber: item.partNumber,
      description: item.description,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      quantity: parseInt(item.quantity, 10),
      justification: item.notes, // `notes` from DB is now item's `justification`
      // siteId removed from item mapping
    })) as RequisitionItem[];

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
    const pool = await getDbPool();
    // Expecting header siteId, no header justification. Item justification is in item.justification.
    const requisitionData = await request.json() as Omit<RequisitionPayload, 'totalEstimatedValue' | 'items' | 'justification'> & { items: RequisitionItem[], siteId: number };
    
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [currentReq]:any[] = await connection.execute('SELECT status FROM Requisition WHERE id = ?', [id]);
    if (currentReq.length === 0) {
        await connection.rollback();
        return NextResponse.json({ error: 'Requisition not found for update.'}, { status: 404});
    }
    if (currentReq[0].status !== 'Draft' && currentReq[0].status !== 'Pending Approval') {
        await connection.rollback();
        return NextResponse.json({ error: `Cannot update requisition. Status is '${currentReq[0].status}'. Only 'Draft' or 'Pending Approval' requisitions can be edited.`}, { status: 400});
    }

    const newStatus = requisitionData.approverId ? 'Pending Approval' : 'Draft';
    
    // Header justification removed from UPDATE
    await connection.execute(
      `UPDATE Requisition SET 
        requisitionDate = ?, requestedByUserId = ?, requestedByName = ?, siteId = ?, 
        status = ?, approverId = ?, updatedAt = NOW() 
       WHERE id = ?`, // justification removed
      [
        new Date(requisitionData.requisitionDate).toISOString().slice(0, 19).replace('T', ' '),
        requisitionData.requestedByUserId || null,
        requisitionData.requestedByName,
        Number(requisitionData.siteId), // Header siteId
        newStatus, 
        requisitionData.approverId || null,
        id
      ]
    );

    await connection.execute('DELETE FROM RequisitionItem WHERE requisitionId = ?', [id]);

    if (requisitionData.items && requisitionData.items.length > 0) {
      for (const item of requisitionData.items) {
        // item.siteId removed from INSERT, item.justification inserted into DB 'notes' column
        await connection.execute(
          `INSERT INTO RequisitionItem (id, requisitionId, partNumber, description, categoryId, quantity, notes, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, // siteId removed, notes for item justification
          [
            item.id || randomUUID(),
            id, 
            item.partNumber, 
            item.description, 
            item.categoryId ? Number(item.categoryId) : null, 
            item.quantity, 
            item.justification, // This is the item-specific justification
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
    const updatedRequisition: RequisitionPayload = {
        ...updatedReqRows[0],
        siteId: Number(updatedReqRows[0].siteId),
        approvalDate: updatedReqRows[0].approvalDate ? new Date(updatedReqRows[0].approvalDate).toISOString() : null,
        requisitionDate: new Date(updatedReqRows[0].requisitionDate).toISOString(),
        items: [] // initialize items
    };

    // Re-fetch items with the new structure
    const itemsQueryUpdated = `
      SELECT ri.id, ri.requisitionId, ri.partNumber, ri.description, ri.categoryId, ri.quantity, ri.notes, 
             c.category as categoryName 
      FROM RequisitionItem ri
      LEFT JOIN Category c ON ri.categoryId = c.id
      WHERE ri.requisitionId = ?
    `;
    const [updatedItemRows]: any[] = await connection.execute(itemsQueryUpdated, [id]);
    updatedRequisition.items = updatedItemRows.map((item: any) => ({
      id: item.id,
      requisitionId: item.requisitionId,
      partNumber: item.partNumber,
      description: item.description,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      quantity: parseInt(item.quantity, 10),
      justification: item.notes, // DB notes column holds item justification
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
        const pool = await getDbPool();
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [currentReq]:any[] = await connection.execute('SELECT status FROM Requisition WHERE id = ?', [id]);
        if (currentReq.length === 0) {
            await connection.rollback();
            return NextResponse.json({ error: 'Requisition not found for deletion.'}, { status: 404});
        }
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
