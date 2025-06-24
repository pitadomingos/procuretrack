
import { NextResponse } from 'next/server';
import type { ChartDataPoint } from '@/types';

interface MonthlyPOQueryResult {
  month_year: string; 
  status: string;
  count: number | string; 
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  let connection;
  try {
    const { pool } = await import('../../../../../backend/db.js');
    connection = await pool.getConnection();
    
    let whereClauses: string[] = [];
    const queryParams: (string | number)[] = [];

    if (month && month !== 'all') {
      whereClauses.push("MONTH(creationDate) = ?");
      queryParams.push(parseInt(month, 10));
    }
    if (year && year !== 'all') {
      whereClauses.push("YEAR(creationDate) = ?");
      queryParams.push(parseInt(year, 10));
    }
    
    whereClauses.push("status IN ('Pending Approval', 'Approved')");

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT 
        DATE_FORMAT(creationDate, '%Y-%m') as month_year,
        status,
        COUNT(*) as count
      FROM PurchaseOrder
      ${whereString}
      GROUP BY month_year, status
      ORDER BY month_year ASC, status ASC;
    `;

    const [rows]: any[] = await connection.execute(query, queryParams);

    const monthlyData: { [key: string]: ChartDataPoint } = {};
    const monthOrder: string[] = [];

    rows.forEach((row: MonthlyPOQueryResult) => {
      const monthYear = row.month_year;
      if (!monthlyData[monthYear]) {
        const [y, mNum] = monthYear.split('-');
        const date = new Date(Number(y), Number(mNum) - 1);
        const displayMonth = date.toLocaleString('default', { month: 'short' });
        
        monthlyData[monthYear] = { 
          name: `${displayMonth} ${y}`, 
          'Approved': 0,      
          'Pending Approval': 0   
        };
        if (!monthOrder.includes(monthYear)) {
          monthOrder.push(monthYear);
        }
      }

      const count = Number(row.count);
      if (row.status === 'Approved') { 
        monthlyData[monthYear]['Approved'] = (monthlyData[monthYear]['Approved'] as number) + count;
      } else if (row.status === 'Pending Approval') {
        monthlyData[monthYear]['Pending Approval'] = (monthlyData[monthYear]['Pending Approval'] as number) + count;
      }
    });
    
    monthOrder.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const chartData = monthOrder.map(monthYear => monthlyData[monthYear]);

    return NextResponse.json(chartData);

  } catch (error: any) {
    console.error('Error fetching monthly PO status data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly PO status data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
