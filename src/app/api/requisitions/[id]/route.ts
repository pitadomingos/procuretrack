
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { RequisitionPayload, RequisitionItem, Site, Category as CategoryType, User as UserType } from '@/types';

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
        u.name as requestorFullName 
      FROM Requisition r
      LEFT JOIN Site s ON r.siteId = s.id
      LEFT JOIN User u ON r.requestedByUserId = u.id
      WHERE r.id = ?
    `;
    const [reqRows]: any[] = await connection.execute(requisitionQuery, [id]);

    if (reqRows.length === 0) {
      return NextResponse.json({ error: `Requisition with ID ${id} not found.` }, { status: 404 });
    }

    const requisitionData: RequisitionPayload = {
      ...reqRows[0],
      requisitionDate: new Date(reqRows[0].requisitionDate).toISOString(),
      // totalEstimatedValue will be whatever is in DB, but not actively used in UI
      totalEstimatedValue: parseFloat(reqRows[0].totalEstimatedValue || 0),
      requestedByName: reqRows[0].requestorFullName || reqRows[0].requestedByName,
    };

    const itemsQuery = `
      SELECT ri.id, ri.requisitionId, ri.partNumber, ri.description, ri.categoryId, ri.quantity, ri.notes, ri.createdAt, ri.updatedAt, 
             c.category as categoryName 
      FROM RequisitionItem ri
      LEFT JOIN Category c ON ri.categoryId = c.id
      WHERE ri.requisitionId = ?
    `; // Removed estimatedUnitPrice from select
    const [itemRows]: any[] = await connection.execute(itemsQuery, [id]);
    
    // Map items without estimatedUnitPrice
    requisitionData.items = itemRows.map((item: any) => ({
      id: item.id,
      requisitionId: item.requisitionId,
      partNumber: item.partNumber,
      description: item.description,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      quantity: parseInt(item.quantity, 10),
      notes: item.notes,
      // estimatedUnitPrice is omitted
    })) as Omit<RequisitionItem, 'estimatedUnitPrice'>[];

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
    const requisitionData = await request.json() as Omit<RequisitionPayload, 'totalEstimatedValue' | 'items'> & { items: Omit<RequisitionItem, 'estimatedUnitPrice'>[] };
    
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [currentReq]:any[] = await connection.execute('SELECT status FROM Requisition WHERE id = ?', [id]);
    if (currentReq.length === 0) {
        await connection.rollback();
        return NextResponse.json({ error: 'Requisition not found for update.'}, { status: 404});
    }
    if (currentReq[0].status !== 'Draft') {
        await connection.rollback();
        return NextResponse.json({ error: `Cannot update requisition. Status is '${currentReq[0].status}'. Only 'Draft' requisitions can be edited.`}, { status: 400});
    }

    // totalEstimatedValue is not updated from form
    await connection.execute(
      `UPDATE Requisition SET 
        requisitionDate = ?, requestedByUserId = ?, requestedByName = ?, siteId = ?, 
        status = ?, justification = ?, updatedAt = NOW() 
       WHERE id = ?`,
      [
        new Date(requisitionData.requisitionDate).toISOString().slice(0, 19).replace('T', ' '),
        requisitionData.requestedByUserId || null,
        requisitionData.requestedByName,
        requisitionData.siteId ? Number(requisitionData.siteId) : null,
        requisitionData.status,
        requisitionData.justification,
        // totalEstimatedValue not updated here
        id
      ]
    );

    await connection.execute('DELETE FROM RequisitionItem WHERE requisitionId = ?', [id]);

    if (requisitionData.items && requisitionData.items.length > 0) {
      for (const item of requisitionData.items) {
        // estimatedUnitPrice not inserted
        await connection.execute(
          `INSERT INTO RequisitionItem (id, requisitionId, partNumber, description, categoryId, quantity, notes, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            item.id || crypto.randomUUID(),
            id, 
            item.partNumber, 
            item.description, 
            item.categoryId ? Number(item.categoryId) : null, 
            item.quantity, 
            item.notes
          ]
        );
      }
    }

    await connection.commit();
    return NextResponse.json({ message: `Requisition ${requisitionData.requisitionNumber} updated successfully.`, id });

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
        if (currentReq[0].status !== 'Draft') {
            await connection.rollback();
            return NextResponse.json({ error: `Cannot delete requisition. Status is '${currentReq[0].status}'. Only 'Draft' requisitions can be deleted.`}, { status: 400});
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

    