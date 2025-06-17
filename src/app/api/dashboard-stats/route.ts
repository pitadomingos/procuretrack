
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js'; // Adjust path as needed

interface FetchedStats {
  totalPOs: number;
  pendingApprovalPOs: number;
  openPOs: number;
  totalRequisitions: number;
  clientQuotesCount: number;
  fuelRecordsCount: number;
  grnCount: number; // Number of POs with GRN activity
}

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();

    // Purchase Order Stats
    const [poRows]: any[] = await connection.execute('SELECT status, COUNT(*) as count FROM PurchaseOrder GROUP BY status');
    let totalPOs = 0;
    let pendingApprovalPOs = 0;
    let openPOs = 0;

    poRows.forEach((row: { status: string, count: number | string }) => {
      const count = Number(row.count);
      totalPOs += count;
      if (row.status === 'Pending Approval') pendingApprovalPOs = count;
      else if (row.status === 'Approved') openPOs = count;
    });

    // Requisition Stats
    const [requisitionRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Requisition');
    const totalRequisitions = Number(requisitionRows[0]?.count || 0);
    
    // Client Quotes Count
    const [quoteRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Quote');
    const clientQuotesCount = Number(quoteRows[0]?.count || 0);
    
    // Fuel Records Count
    const [fuelRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM FuelRecord');
    const fuelRecordsCount = Number(fuelRows[0]?.count || 0);

    // GRN Count (Number of POs with GRN activity)
    const [grnPOsRows]: any[] = await connection.execute(
      `SELECT COUNT(DISTINCT po.id) as count
       FROM PurchaseOrder po
       JOIN POItem poi ON po.id = poi.poId
       WHERE poi.quantityReceived > 0`
    );
    const grnCount = Number(grnPOsRows[0]?.count || 0);

    const responsePayload: FetchedStats = {
      totalPOs,
      pendingApprovalPOs,
      openPOs, 
      totalRequisitions,
      clientQuotesCount,
      fuelRecordsCount,
      grnCount,
    };
    
    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

