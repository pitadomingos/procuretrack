
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js'; // Adjust path as needed

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();

    // Purchase Order Stats
    const [poRows]: any[] = await connection.execute('SELECT status, COUNT(*) as count FROM PurchaseOrder GROUP BY status');
    let totalPOs = 0;
    let completedPOs = 0;
    let partiallyCompletedPOs = 0;
    let pendingApprovalPOs = 0;
    let openPOs = 0; 

    poRows.forEach((row: { status: string, count: number | string }) => {
      const count = Number(row.count);
      totalPOs += count;
      if (row.status === 'Completed') completedPOs = count;
      if (row.status === 'Partially Completed') partiallyCompletedPOs = count;
      if (row.status === 'Pending Approval') pendingApprovalPOs = count;
      if (row.status === 'Approved') openPOs = count;
    });

    // Requisition Stats
    const [requisitionRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Requisition');
    const totalRequisitions = Number(requisitionRows[0]?.count || 0);
    
    const clientQuotesCount = "N/A"; 
    const fuelRecordsCount = "N/A";  
    const grnCount = "N/A";          

    return NextResponse.json({
      totalPOs,
      completedPOs,
      partiallyCompletedPOs,
      pendingApprovalPOs,
      openPOs,
      totalRequisitions,
      clientQuotesCount,
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
