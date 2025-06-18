
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
      totalEstimatedValue: parseFloat(reqRows[0].totalEstimatedValue || 0),
      // siteName is already included from join
      requestedByName: reqRows[0].requestorFullName || reqRows[0].requestedByName, // Prioritize joined name
    };

    const itemsQuery = `
      SELECT ri.*, c.category as categoryName 
      FROM RequisitionItem ri
      LEFT JOIN Category c ON ri.categoryId = c.id
      WHERE ri.requisitionId = ?
    `;
    const [itemRows]: any[] = await connection.execute(itemsQuery, [id]);
    
    requisitionData.items = itemRows.map((item: any) => ({
      ...item,
      quantity: parseInt(item.quantity, 10),
      estimatedUnitPrice: parseFloat(item.estimatedUnitPrice || 0),
      categoryName: item.categoryName, // Add category name from join
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
    const requisitionData = await request.json() as RequisitionPayload;
    
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check current status - for now, allow updates only if Draft
    const [currentReq]:any[] = await connection.execute('SELECT status FROM Requisition WHERE id = ?', [id]);
    if (currentReq.length === 0) {
        await connection.rollback();
        return NextResponse.json({ error: 'Requisition not found for update.'}, { status: 404});
    }
    if (currentReq[0].status !== 'Draft') {
        await connection.rollback();
        return NextResponse.json({ error: `Cannot update requisition. Status is '${currentReq[0].status}'. Only 'Draft' requisitions can be edited.`}, { status: 400});
    }

    await connection.execute(
      `UPDATE Requisition SET 
        requisitionDate = ?, requestedByUserId = ?, requestedByName = ?, siteId = ?, 
        status = ?, justification = ?, totalEstimatedValue = ?, updatedAt = NOW()
       WHERE id = ?`,
      [
        new Date(requisitionData.requisitionDate).toISOString().slice(0, 19).replace('T', ' '),
        requisitionData.requestedByUserId || null,
        requisitionData.requestedByName,
        requisitionData.siteId ? Number(requisitionData.siteId) : null,
        requisitionData.status,
        requisitionData.justification,
        requisitionData.totalEstimatedValue || 0,
        id
      ]
    );

    await connection.execute('DELETE FROM RequisitionItem WHERE requisitionId = ?', [id]);

    if (requisitionData.items && requisitionData.items.length > 0) {
      for (const item of requisitionData.items) {
        await connection.execute(
          `INSERT INTO RequisitionItem (id, requisitionId, partNumber, description, categoryId, quantity, estimatedUnitPrice, notes, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            item.id || crypto.randomUUID(), // Ensure item has an ID
            id, 
            item.partNumber, 
            item.description, 
            item.categoryId ? Number(item.categoryId) : null, 
            item.quantity, 
            item.estimatedUnitPrice || 0, 
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

        // First delete items, then header
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
