
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js'; // Adjust path as needed
import type { ChartDataPoint } from '@/types';

interface MonthlyPOQueryResult {
  month_year: string; // Format 'YYYY-MM'
  status: string;
  count: number | string; // MySQL COUNT returns BigInt, which serializes to string
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
          Completed: 0, 
          PartiallyCompleted: 0,
          Open: 0,      // Corresponds to 'Approved' POs
          Pending: 0   // Corresponds to 'Pending Approval' POs
        };
        if (!monthOrder.includes(monthYear)) {
          monthOrder.push(monthYear);
        }
      }

      const count = Number(row.count);
      if (row.status === 'Completed') {
        monthlyData[monthYear].Completed = (monthlyData[monthYear].Completed as number) + count;
      } else if (row.status === 'Partially Completed') {
        monthlyData[monthYear].PartiallyCompleted = (monthlyData[monthYear].PartiallyCompleted as number) + count;
      } else if (row.status === 'Approved') { 
        monthlyData[monthYear].Open = (monthlyData[monthYear].Open as number) + count;
      } else if (row.status === 'Pending Approval') {
        monthlyData[monthYear].Pending = (monthlyData[monthYear].Pending as number) + count;
      }
      // Other statuses are ignored for this specific chart's series
    });
    
    // Ensure monthOrder is sorted chronologically before mapping
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
