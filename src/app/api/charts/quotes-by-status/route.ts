
import { NextResponse } from 'next/server';
import type { ChartDataPoint } from '@/types';
import { getDbPool } from '../../../../../backend/db.js';

interface QuoteStatusQueryResult {
  status_name: string | null;
  count: number | string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    let whereClauses: string[] = [];
    const queryParams: (string | number)[] = [];

    if (month && month !== 'all') {
      whereClauses.push("MONTH(quoteDate) = ?");
      queryParams.push(parseInt(month, 10));
    }
    if (year && year !== 'all') {
      whereClauses.push("YEAR(quoteDate) = ?");
      queryParams.push(parseInt(year, 10));
    }
    
    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT 
        COALESCE(status, 'Unknown') as status_name, 
        COUNT(*) as count 
      FROM Quote
      ${whereString}
      GROUP BY status_name
      ORDER BY count DESC;
    `;
    const [rows]: any[] = await connection.execute(query, queryParams);

    const chartData: ChartDataPoint[] = rows.map((row: QuoteStatusQueryResult) => ({
      name: row.status_name || 'Unknown',
      Count: Number(row.count),
    }));

    return NextResponse.json(chartData);
  } catch (error: any) {
    console.error('Error fetching quotes by status data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes by status data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
