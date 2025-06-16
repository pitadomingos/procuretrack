
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
    let pendingApprovalPOs = 0;
    let openPOs = 0; // Assuming 'Approved' status means open for receiving

    poRows.forEach((row: { status: string, count: number | string }) => {
      const count = Number(row.count);
      totalPOs += count;
      if (row.status === 'Completed') completedPOs = count;
      if (row.status === 'Pending Approval') pendingApprovalPOs = count;
      if (row.status === 'Approved') openPOs = count;
    });

    // Requisition Stats
    const [requisitionRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Requisition');
    const totalRequisitions = Number(requisitionRows[0]?.count || 0);
    
    // For Quotes, Fuel Records, GRNs - these are currently using mock data or not fully implemented for aggregation.
    // We'll return "N/A" or a placeholder. This can be updated when their backends are fully integrated.
    const clientQuotesCount = "N/A"; // Or fetch from mock, e.g., mockQuotesData.length
    const fuelRecordsCount = "N/A";  // Or fetch from mock, e.g., mockFuelRecordsData.length
    const grnCount = "N/A";          // Placeholder

    return NextResponse.json({
      totalPOs,
      completedPOs,
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
