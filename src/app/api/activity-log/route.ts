
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js'; // Ensure this path is correct
import type { ActivityLogEntry } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 100; // Default to 100 logs if no limit specified

  if (isNaN(limit) || limit <= 0) {
    return NextResponse.json({ error: 'Invalid limit parameter' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
      SELECT id, user, action, timestamp, details 
      FROM ActivityLog 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    const [rows]: any[] = await connection.execute(query, [limit]);
    
    const activityLog: ActivityLogEntry[] = rows.map(row => ({
        ...row,
        timestamp: new Date(row.timestamp).toLocaleString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
        }) // Format for display
    }));

    return NextResponse.json(activityLog);
  } catch (error: any) {
    console.error('Error fetching activity log:', error);
    return NextResponse.json({ error: 'Failed to fetch activity log', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
