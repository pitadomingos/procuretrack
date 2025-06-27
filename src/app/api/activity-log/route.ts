
import { NextResponse } from 'next/server';
import type { ActivityLogEntry } from '@/types';
import { getDbPool } from '../../../../backend/db.js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const userFilter = searchParams.get('userFilter');
  const actionTypeFilter = searchParams.get('actionTypeFilter');

  let limit = 100;
  if (limitParam) {
    const parsedLimit = parseInt(limitParam, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limit = parsedLimit;
    }
  }

  console.log(`[API_INFO] /api/activity-log GET: Received params - limit: ${limit}, month: ${month}, year: ${year}, userFilter: ${userFilter}, actionTypeFilter: ${actionTypeFilter}`);

  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    console.log(`[API_INFO] /api/activity-log GET: Database connection obtained.`);

    let query = `
      SELECT id, user, action, timestamp, details
      FROM ActivityLog
    `;
    const whereClauses: string[] = [];
    const queryParams: (string | number)[] = [];

    if (month && month !== 'all') {
      const parsedMonth = parseInt(month, 10);
      if(!isNaN(parsedMonth)){
        whereClauses.push("MONTH(timestamp) = ?");
        queryParams.push(parsedMonth);
      } else {
        console.warn(`[API_WARN] /api/activity-log GET: Invalid month value received: ${month}. Ignoring month filter.`);
      }
    }
    if (year && year !== 'all') {
      const parsedYear = parseInt(year, 10);
      if(!isNaN(parsedYear)){
        whereClauses.push("YEAR(timestamp) = ?");
        queryParams.push(parsedYear);
      } else {
        console.warn(`[API_WARN] /api/activity-log GET: Invalid year value received: ${year}. Ignoring year filter.`);
      }
    }
    if (userFilter && userFilter.trim() !== '') {
      whereClauses.push("user LIKE ?");
      queryParams.push(`%${userFilter.trim()}%`);
    }
    if (actionTypeFilter && actionTypeFilter.trim() !== '') {
      whereClauses.push("action LIKE ?");
      queryParams.push(`%${actionTypeFilter.trim()}%`);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ` ORDER BY timestamp DESC LIMIT ?`;
    queryParams.push(limit);
    
    console.log(`[API_INFO] /api/activity-log GET: Executing query: ${query.replace(/\s+/g, ' ').trim()} with params: ${JSON.stringify(queryParams)}`);
    
    const [rows]: any[] = await connection.query(query, queryParams); 

    console.log(`[API_INFO] /api/activity-log GET: Successfully fetched ${rows.length} activity log entries.`);
    
    const activityLog: ActivityLogEntry[] = rows.map((row: any) => ({
        ...row,
        timestamp: new Date(row.timestamp).toLocaleString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
        })
    }));

    return NextResponse.json(activityLog);
  } catch (error: any) {
    console.error('[API_ERROR] /api/activity-log GET: Error fetching activity log:', error);
    const errorCode = error.code || 'N/A';
    const sqlMessage = error.sqlMessage || error.message;
    const details = `Error Code: ${errorCode}. Message: ${sqlMessage}. SQL State: ${error.sqlState || 'N/A'}`;
    
    return NextResponse.json(
        { 
            error: 'Failed to fetch activity log data from the database.', 
            details: details,
            rawErrorMessage: error.message
        }, 
        { status: 500 }
    );
  } finally {
    if (connection) {
        try {
            await connection.release();
            console.log('[API_INFO] /api/activity-log GET: Database connection released.');
        } catch (releaseError: any) {
            console.error('[API_ERROR] /api/activity-log GET: Error releasing DB connection:', releaseError.message);
        }
    }
  }
}
