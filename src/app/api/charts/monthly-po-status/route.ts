
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
    // Query to get counts of POs grouped by creation month/year and status
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

    // Process the raw data into the format expected by the chart
    const monthlyData: { [key: string]: ChartDataPoint } = {};
    const monthOrder: string[] = [];

    rows.forEach((row: MonthlyPOQueryResult) => {
      const monthYear = row.month_year;
      if (!monthlyData[monthYear]) {
        // Format monthYear to 'Mon YYYY' for display, e.g., 'Jul 2024'
        const [year, monthNum] = monthYear.split('-');
        const date = new Date(Number(year), Number(monthNum) - 1);
        const displayMonth = date.toLocaleString('default', { month: 'short' });
        
        monthlyData[monthYear] = { 
          name: `${displayMonth} ${year}`, // Chart X-axis label
          Completed: 0, 
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
      } else if (row.status === 'Approved') { // 'Approved' POs are considered 'Open' for receiving
        monthlyData[monthYear].Open = (monthlyData[monthYear].Open as number) + count;
      } else if (row.status === 'Pending Approval') {
        monthlyData[monthYear].Pending = (monthlyData[monthYear].Pending as number) + count;
      }
      // Other statuses (e.g., 'Rejected') are ignored for this chart
    });
    
    // Sort by monthOrder to ensure chronological display
    const chartData = monthOrder.sort().map(monthYear => monthlyData[monthYear]);

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
