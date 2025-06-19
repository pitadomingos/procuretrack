
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js'; // Ensure this path is correct
import type { ActivityLogEntry } from '@/types';

export async function GET(request: Request) {
  // Forcing no limit for now to simplify diagnosis
  console.log('[API_INFO] /api/activity-log GET: Fetching ALL activity logs (limit removed for diagnosis).');

  let connection;
  try {
    connection = await pool.getConnection();
    console.log(`[API_INFO] /api/activity-log GET: Database connection obtained.`);

    // Simplest possible query - REMOVED LIMIT CLAUSE ENTIRELY
    const query = `
      SELECT id, user, action, timestamp, details
      FROM ActivityLog
      ORDER BY timestamp DESC
    `;
    
    console.log(`[API_INFO] /api/activity-log GET: Executing query: ${query.replace(/\s+/g, ' ').trim()}`);
    // NO PARAMETERS PASSED to execute()
    const [rows]: any[] = await connection.execute(query); 

    console.log(`[API_INFO] /api/activity-log GET: Successfully fetched ${rows.length} activity log entries.`);
    
    const activityLog: ActivityLogEntry[] = rows.map((row: any) => ({
        ...row,
        timestamp: new Date(row.timestamp).toLocaleString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
        }) // Format for display
    }));

    return NextResponse.json(activityLog);
  } catch (error: any) {
    console.error('[API_ERROR] /api/activity-log GET: Error fetching activity log:', error);
    // Log more details from the error object if they exist
    const errorCode = error.code || 'N/A';
    const sqlMessage = error.sqlMessage || error.message; // Prefer sqlMessage if available
    const details = `Error Code: ${errorCode}. Message: ${sqlMessage}. SQL State: ${error.sqlState || 'N/A'}`;
    
    return NextResponse.json(
        { 
            error: 'Failed to fetch activity log data from the database.', 
            details: details,
            rawErrorMessage: error.message // Keep original message for client-side if needed
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
