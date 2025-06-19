
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js'; // Ensure this path is correct
import type { ActivityLogEntry } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  let limit = limitParam ? parseInt(limitParam, 10) : 100; // Default to 100 logs if no limit specified

  if (isNaN(limit) || limit <= 0) {
    // If invalid, default to a safe value rather than erroring out, or adjust as needed.
    console.warn(`[API_WARN] /api/activity-log GET: Invalid limit parameter "${limitParam}". Defaulting to 100.`);
    limit = 100; 
  }

  let connection;
  try {
    connection = await pool.getConnection();
    console.log(`[API_INFO] /api/activity-log GET: Fetching activity log with limit: ${limit}`);

    // Diagnostic: Using direct interpolation for LIMIT after validation
    const query = `
      SELECT id, user, action, timestamp, details
      FROM ActivityLog
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `;
    // const [rows]: any[] = await connection.execute(query, [limit]); // Original
    const [rows]: any[] = await connection.execute(query); // Changed for diagnostic

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
    const details = `Error Code: ${errorCode}. Message: ${sqlMessage}.`;
    
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
