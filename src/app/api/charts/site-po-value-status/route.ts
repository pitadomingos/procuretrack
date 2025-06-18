
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js'; 
import type { ChartDataPoint, PurchaseOrderStatus } from '@/types';

interface SitePOValueQueryResult {
  site_identifier: string; 
  status: PurchaseOrderStatus; 
  total_value: number | string; 
  po_id: number; 
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    let poWhereClauses: string[] = ["po.status IN ('Pending Approval', 'Approved')"];
    const queryParams: (string | number)[] = [];

    if (month && month !== 'all') {
      poWhereClauses.push("MONTH(po.creationDate) = ?");
      queryParams.push(parseInt(month, 10));
    }
    if (year && year !== 'all') {
      poWhereClauses.push("YEAR(po.creationDate) = ?");
      queryParams.push(parseInt(year, 10));
    }
    
    const poWhereString = poWhereClauses.length > 0 ? `WHERE ${poWhereClauses.join(' AND ')}` : '';
    
    const poQuery = `
      SELECT 
        po.id as po_id,
        COALESCE(s.siteCode, s.name, 'Unassigned') as site_identifier,
        po.status,
        po.grandTotal as total_value
      FROM PurchaseOrder po
      LEFT JOIN POItem poi ON po.id = poi.poId 
      LEFT JOIN Site s ON poi.siteId = s.id 
      ${poWhereString}
      GROUP BY po.id, site_identifier, po.status, po.grandTotal 
      ORDER BY site_identifier ASC, po.status ASC;
    `;
    const [poRows]: any[] = await connection.execute(poQuery, queryParams);

    const siteData: { [key: string]: ChartDataPoint } = {};
    const siteOrder: string[] = [];

    for (const po of poRows as Array<Omit<SitePOValueQueryResult, 'total_value'> & {total_value: number | string | null}>) {
      const siteIdentifier = po.site_identifier;
      if (!siteData[siteIdentifier]) {
        siteData[siteIdentifier] = { 
          name: siteIdentifier,
          'ApprovedValue': 0,      
          'PendingApprovalValue': 0    
        };
        if (!siteOrder.includes(siteIdentifier)) {
          siteOrder.push(siteIdentifier);
        }
      }

      const poValue = Number(po.total_value) || 0;
      const currentStatus = po.status ? po.status.trim() as PurchaseOrderStatus : 'Draft';

      if (currentStatus === 'Pending Approval') {
        siteData[siteIdentifier]['PendingApprovalValue'] = (siteData[siteIdentifier]['PendingApprovalValue'] as number) + poValue;
      } else if (currentStatus === 'Approved') {
         siteData[siteIdentifier]['ApprovedValue'] = (siteData[siteIdentifier]['ApprovedValue'] as number) + poValue;
      }
    }
    
    siteOrder.sort();
    const chartData = siteOrder.map(siteIdentifier => siteData[siteIdentifier]);

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
