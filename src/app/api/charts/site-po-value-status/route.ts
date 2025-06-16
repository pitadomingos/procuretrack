
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js'; 
import type { ChartDataPoint, PurchaseOrderPayload, POItemPayload, PurchaseOrderStatus } from '@/types';

interface SitePOValueQueryResult {
  site_identifier: string; 
  status: PurchaseOrderStatus; 
  total_value: number | string; 
  po_id: number; 
}

interface POItemDetails {
  quantity: number;
  quantityReceived: number;
}

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const poQuery = `
      SELECT 
        po.id as po_id,
        COALESCE(s.siteCode, s.name, 'Unassigned') as site_identifier,
        po.status,
        po.grandTotal as total_value
      FROM PurchaseOrder po
      LEFT JOIN Site s ON po.siteId = s.id 
      WHERE po.status IN ('Pending Approval', 'Approved', 'Completed', 'Partially Completed') 
      ORDER BY site_identifier ASC, po.status ASC;
    `;
    const [poRows]: any[] = await connection.execute(poQuery);

    const siteData: { [key: string]: ChartDataPoint } = {};
    const siteOrder: string[] = [];

    for (const po of poRows as Array<Omit<SitePOValueQueryResult, 'total_value'> & {total_value: number | string | null}>) {
      const siteIdentifier = po.site_identifier;
      if (!siteData[siteIdentifier]) {
        siteData[siteIdentifier] = { 
          name: siteIdentifier,
          'Completed Value': 0, 
          'Partially Completed Value': 0,
          'Open Value': 0,      
          'Pending Value': 0    
        };
        if (!siteOrder.includes(siteIdentifier)) {
          siteOrder.push(siteIdentifier);
        }
      }

      const poValue = Number(po.total_value) || 0;

      const currentStatus = po.status ? po.status.trim() as PurchaseOrderStatus : 'Draft';

      if (currentStatus === 'Pending Approval') {
        siteData[siteIdentifier]['Pending Value'] = (siteData[siteIdentifier]['Pending Value'] as number) + poValue;
      } else if (currentStatus === 'Completed') {
        siteData[siteIdentifier]['Completed Value'] = (siteData[siteIdentifier]['Completed Value'] as number) + poValue;
      } else if (currentStatus === 'Partially Completed') {
        siteData[siteIdentifier]['Partially Completed Value'] = (siteData[siteIdentifier]['Partially Completed Value'] as number) + poValue;
      } else if (currentStatus === 'Approved') {
        const [itemRows]: any[] = await connection.execute(
          'SELECT quantity, quantityReceived FROM POItem WHERE poId = ?', 
          [po.po_id]
        );
        
        let allItemsFullyReceived = true;
        if (itemRows.length === 0) { 
          allItemsFullyReceived = false; 
        }

        for (const item of itemRows as POItemDetails[]) {
          if ((item.quantityReceived || 0) < item.quantity) {
            allItemsFullyReceived = false;
            break;
          }
        }

        if (allItemsFullyReceived) {
          siteData[siteIdentifier]['Completed Value'] = (siteData[siteIdentifier]['Completed Value'] as number) + poValue;
        } else {
          siteData[siteIdentifier]['Open Value'] = (siteData[siteIdentifier]['Open Value'] as number) + poValue;
        }
      }
    }
    
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
