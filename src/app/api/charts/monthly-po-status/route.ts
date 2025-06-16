
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js'; 
import type { ChartDataPoint } from '@/types';

interface MonthlyPOQueryResult {
  month_year: string; // Format 'YYYY-MM'
  status: string;
  count: number | string; 
}

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
      SELECT 
        DATE_FORMAT(creationDate, '%Y-%m') as month_year,
        status,
        COUNT(*) as count
      FROM PurchaseOrder
      WHERE status IN ('Pending Approval', 'Approved') -- Only these two are direct PO statuses now
      GROUP BY month_year, status
      ORDER BY month_year ASC, status ASC;
    `;
    const [rows]: any[] = await connection.execute(query);

    const monthlyData: { [key: string]: ChartDataPoint } = {};
    const monthOrder: string[] = [];

    rows.forEach((row: MonthlyPOQueryResult) => {
      const monthYear = row.month_year;
      if (!monthlyData[monthYear]) {
        const [year, monthNum] = monthYear.split('-');
        const date = new Date(Number(year), Number(monthNum) - 1);
        const displayMonth = date.toLocaleString('default', { month: 'short' });
        
        monthlyData[monthYear] = { 
          name: `${displayMonth} ${year}`, // Chart X-axis label
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
