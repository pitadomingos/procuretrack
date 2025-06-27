
import { NextResponse } from 'next/server';
import type { ChartDataPoint } from '@/types';
import { getDbPool } from '../../../../../backend/db.js';

interface CycleTimeQueryResult {
  cycle_time_bucket: string;
  count: number | string;
}

// Define the order of buckets for sorting
const BUCKET_ORDER = ['0-1 Day(s)', '2-3 Days', '4-7 Days', '8-14 Days', '15+ Days'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    let whereClauses: string[] = ["status = 'Approved'", "approvalDate IS NOT NULL", "creationDate IS NOT NULL"];
    const queryParams: (string | number)[] = [];

    if (month && month !== 'all') {
      const parsedMonth = parseInt(month, 10);
      if (!isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
        whereClauses.push("MONTH(creationDate) = ?");
        queryParams.push(parsedMonth);
      }
    }
    if (year && year !== 'all') {
      const parsedYear = parseInt(year, 10);
      if (!isNaN(parsedYear)) {
        whereClauses.push("YEAR(creationDate) = ?");
        queryParams.push(parsedYear);
      }
    }
    
    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT
        CASE
          WHEN DATEDIFF(approvalDate, creationDate) <= 1 THEN '0-1 Day(s)'
          WHEN DATEDIFF(approvalDate, creationDate) <= 3 THEN '2-3 Days'
          WHEN DATEDIFF(approvalDate, creationDate) <= 7 THEN '4-7 Days'
          WHEN DATEDIFF(approvalDate, creationDate) <= 14 THEN '8-14 Days'
          ELSE '15+ Days'
        END as cycle_time_bucket,
        COUNT(*) as count
      FROM PurchaseOrder
      ${whereString}
      GROUP BY cycle_time_bucket;
    `;

    const [rows]: any[] = await connection.execute(query, queryParams);

    const chartData: ChartDataPoint[] = rows.map((row: CycleTimeQueryResult) => ({
      name: row.cycle_time_bucket,
      Count: Number(row.count),
    }));

    // Sort the data according to the predefined bucket order
    chartData.sort((a, b) => {
      return BUCKET_ORDER.indexOf(a.name as string) - BUCKET_ORDER.indexOf(b.name as string);
    });
    
    // Ensure all defined buckets are present, even if count is 0
    const finalChartData = BUCKET_ORDER.map(bucketName => {
        const existingBucket = chartData.find(d => d.name === bucketName);
        return existingBucket || { name: bucketName, Count: 0 };
    });


    return NextResponse.json(finalChartData);

  } catch (error: any) {
    console.error('Error fetching PO cycle time data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PO cycle time data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
