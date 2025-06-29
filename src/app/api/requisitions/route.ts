
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../backend/db.js';
import type { RequisitionPayload, RequisitionItem } from '@/types';
import { randomUUID } from 'crypto';

const safeToISOString = (dateValue: any): string | null => {
  if (!dateValue) return null;
  const dateObj = new Date(dateValue);
  if (isNaN(dateObj.getTime())) {
    console.warn(`[API WARN] Invalid date value encountered: ${dateValue}. Returning null.`);
    return null;
  }
  return dateObj.toISOString();
};


export async function POST(request: Request) {
  let connection;
  try {
    const pool = await getDbPool();
    const requisitionData = await request.json() as Omit<RequisitionPayload, 'totalEstimatedValue' | 'items' | 'status' | 'justification'> & { items: RequisitionItem[], status?: RequisitionPayload['status'], approverId?: string | null, siteId: number }; // siteId (header) is now expected to be number
    
    const generatedId = requisitionData.id || randomUUID();

    // Validate header siteId
    if (!requisitionData.siteId) {
        return NextResponse.json({ error: 'Site/Department is required for the requisition header.' }, { status: 400 });
    }
    if (!requisitionData.requisitionNumber || !requisitionData.requisitionDate || !requisitionData.requestedByName) {
        return NextResponse.json({ error: 'Missing required fields for requisition header (Req No, Date, Requested By).' }, { status: 400 });
    }
    if (!requisitionData.items || requisitionData.items.length === 0) {
        return NextResponse.json({ error: 'Requisition must have at least one item.' }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const statusToSave = requisitionData.approverId ? 'Pending Approval' : 'Draft';

    // Header justification field removed from INSERT
    await connection.execute(
      `INSERT INTO Requisition (id, requisitionNumber, requisitionDate, requestedByUserId, requestedByName, siteId, status, approverId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, // justification removed
      [
        generatedId,
        requisitionData.requisitionNumber,
        new Date(requisitionData.requisitionDate).toISOString().slice(0, 19).replace('T', ' '),
        requisitionData.requestedByUserId || null,
        requisitionData.requestedByName,
        Number(requisitionData.siteId), // Header siteId
        statusToSave, 
        requisitionData.approverId || null, 
      ]
    );

    for (const item of requisitionData.items) {
      if (!item.description || !item.quantity) { // Item-level justification is now in item.justification (mapped to DB notes column)
          await connection.rollback();
          return NextResponse.json({ error: `Item description and quantity are required. Item problematic: ${JSON.stringify(item)}` }, { status: 400 });
      }
      // Item siteId removed from INSERT
      await connection.execute(
        `INSERT INTO RequisitionItem (id, requisitionId, partNumber, description, categoryId, quantity, notes, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, // siteId removed, notes now stores item justification
        [
          item.id || randomUUID(),
          generatedId, 
          item.partNumber, 
          item.description, 
          item.categoryId ? Number(item.categoryId) : null, 
          Number(item.quantity), 
          item.justification, // This was item.notes (renamed to justification in type, maps to 'notes' DB column)
        ]
      );
    }

    await connection.commit();
    return NextResponse.json({ message: 'Requisition created successfully', requisitionId: generatedId, requisitionNumber: requisitionData.requisitionNumber, status: statusToSave }, { status: 201 });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error('[API_ERROR] /api/requisitions POST:', error);
    
    let errorMessage = 'Failed to create requisition.';
    let statusCode = 500;
    let errorDetails = error.message || 'An unknown database error occurred.';

    if (error.code) {
      switch (error.code) {
        case 'ER_DUP_ENTRY':
          errorMessage = 'Requisition with this ID or Number already exists.';
          statusCode = 409;
          break;
        case 'ER_NO_REFERENCED_ROW_2':
          let field = 'a related record';
          const fkMatch = error.message.match(/FOREIGN KEY \(`(\w+)`\)/);
          if (fkMatch && fkMatch[1]) {
              field = `field '${fkMatch[1]}'`;
          } else if (error.message.includes('fk_requisition_site')) field = 'Site ID for requisition header';
          else if (error.message.includes('fk_requisition_user')) field = 'Requested By User ID';
          else if (error.message.includes('fk_requisition_approver')) field = 'Approver ID';
          else if (error.message.includes('fk_reqitem_category')) field = 'Item Category ID';
          errorMessage = `Invalid reference for ${field}. Please ensure the selected value exists.`;
          statusCode = 400;
          break;
        case 'ER_BAD_NULL_ERROR':
             errorMessage = `A required field was not provided or was invalid. Field: ${error.message.match(/Column '(\w+)'/)?.[1] || 'unknown'}`;
             statusCode = 400;
             break;
        case 'ER_BAD_FIELD_ERROR': 
             const columnMatch = error.message.match(/Unknown column '(\w+)'/);
             const unknownColumn = columnMatch ? columnMatch[1].toLowerCase() : 'an unknown column';
             errorMessage = `Database error: Unknown column '${unknownColumn}' in field list.`;
             errorDetails = `The database table (possibly Requisition or RequisitionItem) is missing the column '${unknownColumn}' or it's misspelled in the query. Please ensure database migrations have been run correctly. Original DB error: ${error.message}`;
             statusCode = 500; 
             break;
        default:
          break;
      }
    }
    return NextResponse.json({ error: errorMessage, details: errorDetails, code: error.code || 'UNKNOWN_DB_ERROR' }, { status: statusCode });
  } finally {
    if (connection) connection.release();
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const siteId = searchParams.get('siteId'); // This will filter by Requisition.siteId (header site)
  const requestedByUserId = searchParams.get('requestedByUserId');
  const status = searchParams.get('status');
  const pool = await getDbPool();

  let query = `
    SELECT 
      r.id, r.requisitionNumber, r.requisitionDate, r.requestedByName, r.status, 
      r.approverId, r.approvalDate,
      s.name as siteName, s.siteCode, -- This is for the header site
      u.name as requestorFullName,
      app.name as approverName
      -- Removed r.justification as it's no longer a header field from form
    FROM Requisition r
    LEFT JOIN Site s ON r.siteId = s.id -- Join for header site
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
  if (siteId && siteId !== 'all') { // Filters by header siteId
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
        siteName: row.siteCode || row.siteName, // Header site display
        requestedByName: row.requestorFullName || row.requestedByName,
        approverName: row.approverName,
        approvalDate: safeToISOString(row.approvalDate),
        requisitionDate: safeToISOString(row.requisitionDate),
    }));
    return NextResponse.json(requisitions);
  } catch (error: any) {
    console.error('[API_ERROR] /api/requisitions GET:', error); 
    const errorMessage = error.sqlMessage || error.message || 'An unknown database error occurred.';
    const errorCode = error.code || 'UNKNOWN_DB_ERROR';
    const sqlState = error.sqlState || 'N/A';
    
    console.error(`[API_ERROR_DETAILS] /api/requisitions GET: Code: ${errorCode}, SQL State: ${sqlState}, Message: "${errorMessage}"`);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch requisitions due to a server-side database error.',
        details: `Database operation failed with message: "${errorMessage}". Error Code: ${errorCode}. SQL State: ${sqlState}. Please check server logs for the full query and parameters if the issue persists.`,
        code: errorCode,
        sqlState: sqlState 
      }, 
      { status: 500 }
    );
  }
}
