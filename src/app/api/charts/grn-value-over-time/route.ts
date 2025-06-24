
import { NextResponse } from 'next/server';
import type { ChartDataPoint } from '@/types';

interface GrnValueQueryResult {
  month_year: string;
  total_received_value: number | string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const siteId = searchParams.get('siteId');

  let connection;
  try {
    const { pool } = await import('../../../../../backend/db.js');
    connection = await pool.getConnection();
    let whereClauses: string[] = ["po.approvalDate IS NOT NULL"];
    const queryParams: (string | number)[] = [];

    if (month && month !== 'all') {
      whereClauses.push("MONTH(po.approvalDate) = ?");
      queryParams.push(parseInt(month, 10));
    }
    if (year && year !== 'all') {
      whereClauses.push("YEAR(po.approvalDate) = ?");
      queryParams.push(parseInt(year, 10));
    }
    // Filter by item-level siteId
    if (siteId && siteId !== 'all') {
      whereClauses.push("poi.siteId = ?");
      queryParams.push(parseInt(siteId, 10));
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT
        SUM(poi.quantityReceived * poi.unitPrice) as total_received_value,
        DATE_FORMAT(po.approvalDate, '%Y-%m') as month_year
      FROM POItem poi
      JOIN PurchaseOrder po ON poi.poId = po.id
      ${whereString}
      GROUP BY month_year
      ORDER BY month_year ASC;
    `;

    const [rows]: any[] = await connection.execute(query, queryParams);

    const monthlyData: { [key: string]: { name: string, value: number } } = {};
    const monthOrder: string[] = [];

    rows.forEach((row: GrnValueQueryResult) => {
        const monthYear = row.month_year;
        if (!monthlyData[monthYear]) {
            const [y, mNum] = monthYear.split('-');
            const date = new Date(Number(y), Number(mNum) - 1);
            const displayMonth = date.toLocaleString('default', { month: 'short' });
            
            monthlyData[monthYear] = { 
                name: `${displayMonth} ${y}`,
                value: 0
            };
            if (!monthOrder.includes(monthYear)) {
                monthOrder.push(monthYear);
            }
        }
        monthlyData[monthYear].value += Number(row.total_received_value || 0);
    });
    
    monthOrder.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const chartData = monthOrder.map(monthYear => monthlyData[monthYear]);

    return NextResponse.json(chartData);

  } catch (error: any) {
    console.error('[API_ERROR] /api/charts/grn-value-over-time GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GRN value data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
