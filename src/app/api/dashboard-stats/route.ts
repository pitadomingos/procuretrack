
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js'; // Adjust path as needed

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();

    // Purchase Order Stats
    const [poRows]: any[] = await connection.execute('SELECT status, COUNT(*) as count FROM PurchaseOrder GROUP BY status');
    let totalPOs = 0;
    let pendingApprovalPOs = 0;
    let openPOs = 0; // Specifically for 'Approved' status

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
    
    // Placeholders for other stats
    const fuelRecordsCount = "N/A";  
    const grnCount = "N/A"; 

    return NextResponse.json({
      totalPOs,
      pendingApprovalPOs,
      openPOs, 
      totalRequisitions,
      clientQuotesCount, // Now a real count
      fuelRecordsCount,
      grnCount,
    });

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
