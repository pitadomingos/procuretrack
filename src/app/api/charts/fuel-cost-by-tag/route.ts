
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { ChartDataPoint } from '@/types';

interface FuelCostQueryResult {
  name: string;
  value: number | string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const siteId = searchParams.get('siteId');

  let connection;
  try {
    connection = await pool.getConnection();
    let whereClauses: string[] = [];
    const queryParams: (string | number)[] = [];

    if (month && month !== 'all') { whereClauses.push("MONTH(fr.fuelDate) = ?"); queryParams.push(parseInt(month, 10)); }
    if (year && year !== 'all') { whereClauses.push("YEAR(fr.fuelDate) = ?"); queryParams.push(parseInt(year, 10)); }
    if (siteId && siteId !== 'all') { whereClauses.push("fr.siteId = ?"); queryParams.push(parseInt(siteId, 10)); }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT
        t.tagNumber as name,
        SUM(fr.quantity * fr.unitCost) as value
      FROM FuelRecord fr
      JOIN Tag t ON fr.tagId = t.id
      ${whereString}
      GROUP BY t.tagNumber
      HAVING SUM(fr.quantity * fr.unitCost) > 0
      ORDER BY value DESC
      LIMIT 15;
    `;

    const [rows]: any[] = await connection.execute(query, queryParams);

    const chartData: ChartDataPoint[] = rows.map((row: FuelCostQueryResult) => ({
      name: row.name,
      value: Number(row.value || 0),
    }));

    return NextResponse.json(chartData);

  } catch (error: any) {
    console.error('[API_ERROR] /api/charts/fuel-cost-by-tag GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fuel cost by tag data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
