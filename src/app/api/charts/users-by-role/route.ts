
import { NextResponse } from 'next/server';
import type { ChartDataPoint } from '@/types';

interface UserRoleQueryResult {
  role_name: string | null; // Role can be null
  count: number | string;
}

export async function GET() {
  let connection;
  try {
    const { pool } = await import('../../../../../backend/db.js');
    connection = await pool.getConnection();
    const query = `
      SELECT 
        COALESCE(role, 'Unassigned') as role_name, 
        COUNT(*) as count 
      FROM User 
      GROUP BY role_name
      ORDER BY count DESC;
    `;
    const [rows]: any[] = await connection.execute(query);

    const chartData: ChartDataPoint[] = rows.map((row: UserRoleQueryResult) => ({
      name: row.role_name || 'Unassigned', // Ensure name is a string
      Count: Number(row.count),
    }));

    return NextResponse.json(chartData);
  } catch (error: any) {
    console.error('Error fetching users by role data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users by role data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
