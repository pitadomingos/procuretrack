
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { ChartDataPoint } from '@/types';

interface MaverickSpendQueryResult {
  total_value: number | string | null;
  count: number | string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  let connection;
  try {
    connection = await pool.getConnection();
    let whereClauses: string[] = ["notes LIKE '%emergency%'"]; // Case-insensitive might depend on DB collation, otherwise use LOWER(notes)
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
    
    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : "WHERE notes LIKE '%emergency%'"; // Ensure base condition if no date filter

    const query = `
      SELECT
        SUM(grandTotal) as total_value,
        COUNT(*) as count
      FROM PurchaseOrder
      ${whereString};
    `;

    const [rows]: any[] = await connection.execute(query, queryParams);
    
    let emergencyValue = 0;
    let emergencyCount = 0;

    if (rows.length > 0 && rows[0]) {
      emergencyValue = parseFloat(rows[0].total_value || 0);
      emergencyCount = parseInt(rows[0].count || 0, 10);
    }

    const chartData: ChartDataPoint[] = [
      { name: "Emergency POs Value (MZN)", value: emergencyValue }, // Assuming MZN, adjust if currency varies
      { name: "Emergency POs Count", value: emergencyCount },
    ];

    return NextResponse.json(chartData);

  } catch (error: any) {
    console.error('[API_ERROR] /api/charts/maverick-spend GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maverick spend data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
