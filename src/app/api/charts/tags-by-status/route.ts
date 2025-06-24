
import { NextResponse } from 'next/server';
import type { ChartDataPoint, TagStatus } from '@/types';

interface TagStatusQueryResult {
  status_name: TagStatus | null;
  count: number | string;
}

export async function GET() {
  let connection;
  try {
    const { pool } = await import('../../../../../backend/db.js');
    connection = await pool.getConnection();
    const query = `
      SELECT 
        COALESCE(status, 'Unknown') as status_name, 
        COUNT(*) as count 
      FROM Tag 
      GROUP BY status_name
      ORDER BY count DESC;
    `;
    const [rows]: any[] = await connection.execute(query);

    const chartData: ChartDataPoint[] = rows.map((row: TagStatusQueryResult) => ({
      name: row.status_name || 'Unknown', // Ensure name is a string
      Count: Number(row.count),
    }));

    return NextResponse.json(chartData);
  } catch (error: any) {
    console.error('Error fetching tags by status data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags by status data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
