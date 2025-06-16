
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js'; // Adjust path as needed
import type { ChartDataPoint } from '@/types';

interface SitePOValueQueryResult {
  site_identifier: string; // Site Code or Name
  status: string;
  total_value: number | string; // MySQL SUM returns BigInt, which serializes to string
}

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    // Query to get sum of grandTotal of POs grouped by site and status
    const query = `
      SELECT 
        COALESCE(s.siteCode, s.name, 'Unassigned') as site_identifier,
        po.status,
        SUM(po.grandTotal) as total_value
      FROM PurchaseOrder po
      LEFT JOIN Site s ON po.siteId = s.id 
      GROUP BY site_identifier, po.status
      ORDER BY site_identifier ASC, po.status ASC;
    `;
    const [rows]: any[] = await connection.execute(query);

    // Process the raw data into the format expected by the chart
    const siteData: { [key: string]: ChartDataPoint } = {};
    const siteOrder: string[] = [];

    rows.forEach((row: SitePOValueQueryResult) => {
      const siteIdentifier = row.site_identifier;
      if (!siteData[siteIdentifier]) {
        siteData[siteIdentifier] = { 
          name: siteIdentifier, // Chart X-axis label (Site Code/Name)
          'Completed Value': 0, 
          'Open Value': 0,      // For 'Approved' POs
          'Pending Value': 0    // For 'Pending Approval' POs
        };
        if (!siteOrder.includes(siteIdentifier)) {
          siteOrder.push(siteIdentifier);
        }
      }

      const value = Number(row.total_value);
      if (row.status === 'Completed') {
        siteData[siteIdentifier]['Completed Value'] = (siteData[siteIdentifier]['Completed Value'] as number) + value;
      } else if (row.status === 'Approved') { 
        siteData[siteIdentifier]['Open Value'] = (siteData[siteIdentifier]['Open Value'] as number) + value;
      } else if (row.status === 'Pending Approval') {
        siteData[siteIdentifier]['Pending Value'] = (siteData[siteIdentifier]['Pending Value'] as number) + value;
      }
      // Other statuses (e.g., 'Rejected', 'Draft') are ignored for this chart
    });
    
    // Sort by siteOrder to ensure consistent display
    const chartData = siteOrder.sort().map(siteIdentifier => siteData[siteIdentifier]);

    return NextResponse.json(chartData);

  } catch (error: any) {
    console.error('Error fetching site PO value status data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site PO value status data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
