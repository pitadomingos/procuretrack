
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { RequisitionPayload, RequisitionItem } from '@/types';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  let connection;
  try {
    const requisitionData = await request.json() as Omit<RequisitionPayload, 'totalEstimatedValue' | 'items' | 'status'> & { items: (Omit<RequisitionItem, 'estimatedUnitPrice'> & {siteId?: number | null})[], status?: RequisitionPayload['status'], approverId?: string | null };
    
    const generatedId = requisitionData.id || randomUUID();

    if (!requisitionData.requisitionNumber || !requisitionData.requisitionDate || !requisitionData.requestedByName || !requisitionData.siteId) {
        return NextResponse.json({ error: 'Missing required fields for requisition header.' }, { status: 400 });
    }
    if (!requisitionData.items || requisitionData.items.length === 0) {
        return NextResponse.json({ error: 'Requisition must have at least one item.' }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const statusToSave = requisitionData.approverId ? 'Pending Approval' : 'Draft';

    await connection.execute(
      `INSERT INTO Requisition (id, requisitionNumber, requisitionDate, requestedByUserId, requestedByName, siteId, status, justification, approverId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        generatedId,
        requisitionData.requisitionNumber,
        new Date(requisitionData.requisitionDate).toISOString().slice(0, 19).replace('T', ' '),
        requisitionData.requestedByUserId || null,
        requisitionData.requestedByName,
        Number(requisitionData.siteId),
        statusToSave, // Set status based on approverId
        requisitionData.justification,
        requisitionData.approverId || null, // Save approverId
      ]
    );

    for (const item of requisitionData.items) {
      if (!item.description || !item.quantity) {
          await connection.rollback();
          return NextResponse.json({ error: `Item description and quantity are required. Item problematic: ${JSON.stringify(item)}` }, { status: 400 });
      }
      await connection.execute(
        `INSERT INTO RequisitionItem (id, requisitionId, partNumber, description, categoryId, quantity, notes, siteId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          item.id || randomUUID(),
          generatedId, 
          item.partNumber, 
          item.description, 
          item.categoryId ? Number(item.categoryId) : null, 
          Number(item.quantity), 
          item.notes,
          item.siteId ? Number(item.siteId) : null // Save item-level siteId
        ]
      );
    }

    await connection.commit();
    return NextResponse.json({ message: 'Requisition created successfully', requisitionId: generatedId, requisitionNumber: requisitionData.requisitionNumber, status: statusToSave }, { status: 201 });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error('[API_ERROR] /api/requisitions POST:', error);
    if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Requisition with this ID or Number already exists.', details: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create requisition.', details: error.message, code: error.code }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const siteId = searchParams.get('siteId');
  const requestedByUserId = searchParams.get('requestedByUserId');
  const status = searchParams.get('status');

  let query = `
    SELECT 
      r.id, r.requisitionNumber, r.requisitionDate, r.requestedByName, r.status, 
      r.approverId, r.approvalDate,
      s.name as siteName, s.siteCode,
      u.name as requestorFullName,
      app.name as approverName
    FROM Requisition r
    LEFT JOIN Site s ON r.siteId = s.id
    LEFT JOIN User u ON r.requestedByUserId = u.id
    LEFT JOIN Approver app ON r.approverId = app.id
    WHERE 1=1
  `;
  const queryParams: (string | number)[] = [];

  if (month && month !== 'all') {
    query += ' AND MONTH(r.requisitionDate) = ?';
    queryParams.push(parseInt(month, 10));
  }
  if (year && year !== 'all') {
    query += ' AND YEAR(r.requisitionDate) = ?';
    queryParams.push(parseInt(year, 10));
  }
  if (siteId && siteId !== 'all') {
    query += ' AND r.siteId = ?';
    queryParams.push(parseInt(siteId, 10));
  }
  if (requestedByUserId && requestedByUserId !== 'all') {
    query += ' AND r.requestedByUserId = ?';
    queryParams.push(requestedByUserId);
  }
  if (status && status !== 'all') {
    query += ' AND r.status = ?';
    queryParams.push(status);
  }

  query += ' ORDER BY r.requisitionDate DESC, r.requisitionNumber DESC';

  try {
    const [rows]: any[] = await pool.execute(query, queryParams);
    const requisitions = rows.map(row => ({
        ...row,
        siteName: row.siteCode || row.siteName,
        requestedByName: row.requestorFullName || row.requestedByName,
        approverName: row.approverName,
        approvalDate: row.approvalDate ? new Date(row.approvalDate).toISOString() : null,
        requisitionDate: new Date(row.requisitionDate).toISOString(),
    }));
    return NextResponse.json(requisitions);
  } catch (error: any) {
    console.error('[API_ERROR] /api/requisitions GET:', error);
    return NextResponse.json({ error: 'Failed to fetch requisitions', details: error.message }, { status: 500 });
  }
}
