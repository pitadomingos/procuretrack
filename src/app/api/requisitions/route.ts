
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { RequisitionPayload, RequisitionItem } from '@/types';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  let connection;
  try {
    const requisitionData = await request.json() as Omit<RequisitionPayload, 'totalEstimatedValue' | 'items'> & { items: Omit<RequisitionItem, 'estimatedUnitPrice'>[] };
    
    if (!requisitionData.id) requisitionData.id = randomUUID();
    if (!requisitionData.requisitionNumber || !requisitionData.requisitionDate || !requisitionData.requestedByName || !requisitionData.siteId) {
        return NextResponse.json({ error: 'Missing required fields for requisition header.' }, { status: 400 });
    }
    if (!requisitionData.items || requisitionData.items.length === 0) {
        return NextResponse.json({ error: 'Requisition must have at least one item.' }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // totalEstimatedValue will default to 0.00 in DB as per schema
    await connection.execute(
      `INSERT INTO Requisition (id, requisitionNumber, requisitionDate, requestedByUserId, requestedByName, siteId, status, justification, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        requisitionData.id,
        requisitionData.requisitionNumber,
        new Date(requisitionData.requisitionDate).toISOString().slice(0, 19).replace('T', ' '),
        requisitionData.requestedByUserId || null,
        requisitionData.requestedByName,
        Number(requisitionData.siteId),
        requisitionData.status || 'Draft',
        requisitionData.justification,
        // totalEstimatedValue is omitted, DB will use default 0.00
      ]
    );

    for (const item of requisitionData.items) {
      if (!item.description || !item.quantity) {
          await connection.rollback();
          return NextResponse.json({ error: `Item description and quantity are required. Item problematic: ${JSON.stringify(item)}` }, { status: 400 });
      }
      // estimatedUnitPrice is omitted, DB will use default 0.00
      await connection.execute(
        `INSERT INTO RequisitionItem (id, requisitionId, partNumber, description, categoryId, quantity, notes, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          item.id || randomUUID(),
          requisitionData.id, 
          item.partNumber, 
          item.description, 
          item.categoryId ? Number(item.categoryId) : null, 
          Number(item.quantity), 
          item.notes
        ]
      );
    }

    await connection.commit();
    return NextResponse.json({ message: 'Requisition created successfully', requisitionId: requisitionData.id, requisitionNumber: requisitionData.requisitionNumber }, { status: 201 });

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
      -- r.totalEstimatedValue, -- No longer primarily displayed, but might be in DB
      s.name as siteName, s.siteCode,
      u.name as requestorFullName
    FROM Requisition r
    LEFT JOIN Site s ON r.siteId = s.id
    LEFT JOIN User u ON r.requestedByUserId = u.id
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
        // totalEstimatedValue is not transformed here as it's not a primary display field anymore
    }));
    return NextResponse.json(requisitions);
  } catch (error: any) {
    console.error('[API_ERROR] /api/requisitions GET:', error);
    return NextResponse.json({ error: 'Failed to fetch requisitions', details: error.message }, { status: 500 });
  }
}

    