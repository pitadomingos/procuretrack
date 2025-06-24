
import { NextResponse } from 'next/server';
import type { ChartDataPoint } from '@/types';

interface ValueDistributionQueryResult {
  value_bucket: string;
  count: number | string;
}

// Define the order of buckets for consistent sorting
const BUCKET_ORDER = ['0-500 MZN', '501-2,000 MZN', '2,001-10,000 MZN', '10,001-50,000 MZN', '50,001+ MZN'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  let connection;
  try {
    const { pool } = await import('../../../../../backend/db.js');
    connection = await pool.getConnection();
    let whereClauses: string[] = []; // POs of any status are considered for value distribution
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

    // Assuming grandTotal is stored as DECIMAL or similar numeric type
    const query = `
      SELECT
        CASE
          WHEN grandTotal <= 500 THEN '0-500 MZN'
          WHEN grandTotal <= 2000 THEN '501-2,000 MZN'
          WHEN grandTotal <= 10000 THEN '2,001-10,000 MZN'
          WHEN grandTotal <= 50000 THEN '10,001-50,000 MZN'
          ELSE '50,001+ MZN'
        END as value_bucket,
        COUNT(*) as count
      FROM PurchaseOrder
      ${whereString}
      GROUP BY value_bucket;
    `;

    const [rows]: any[] = await connection.execute(query, queryParams);

    const chartDataMap = new Map<string, number>();
    rows.forEach((row: ValueDistributionQueryResult) => {
      chartDataMap.set(row.value_bucket, Number(row.count));
    });

    // Ensure all buckets are present in the final data, sorted correctly
    const finalChartData: ChartDataPoint[] = BUCKET_ORDER.map(bucketName => ({
      name: bucketName,
      Count: chartDataMap.get(bucketName) || 0,
    }));

    return NextResponse.json(finalChartData);

  } catch (error: any) {
    console.error('[API_ERROR] /api/charts/po-value-distribution GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PO value distribution data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
