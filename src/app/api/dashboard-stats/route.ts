
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
      // 'Completed' and 'Partially Completed' are no longer direct PO statuses
    });

    // Requisition Stats
    const [requisitionRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Requisition');
    const totalRequisitions = Number(requisitionRows[0]?.count || 0);
    
    // Placeholders for other stats
    const clientQuotesCount = "N/A"; 
    const fuelRecordsCount = "N/A";  
    const grnCount = "N/A"; // GRN count will be based on actual GRN records when implemented

    return NextResponse.json({
      totalPOs,
      pendingApprovalPOs,
      openPOs, // 'Approved' POs
      totalRequisitions,
      clientQuotesCount,
      fuelRecordsCount,
      grnCount,
      // Removed: completedPOs, partiallyCompletedPOs (as these are GRN concepts now)
    });

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
