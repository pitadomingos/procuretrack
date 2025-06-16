
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
    let openPOs = 0; // Specifically for 'Approved' status

    poRows.forEach((row: { status: string, count: number | string }) => {
      const count = Number(row.count);
      totalPOs += count;
      if (row.status === 'Completed') completedPOs = count;
      else if (row.status === 'Partially Completed') partiallyCompletedPOs = count;
      else if (row.status === 'Pending Approval') pendingApprovalPOs = count;
      else if (row.status === 'Approved') openPOs = count;
      // Other statuses like 'Rejected', 'Draft' contribute to totalPOs but not to these specific cards
    });

    // Requisition Stats
    const [requisitionRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Requisition');
    const totalRequisitions = Number(requisitionRows[0]?.count || 0);
    
    // For now, Client Quotes, Fuel Records, GRN Count are placeholders.
    // In a real scenario, you would query their respective tables.
    const clientQuotesCount = "N/A"; // Example: await connection.execute('SELECT COUNT(*) as count FROM Quote');
    const fuelRecordsCount = "N/A";  // Example: await connection.execute('SELECT COUNT(*) as count FROM FuelRecord');
    const grnCount = "N/A";          // Example: await connection.execute('SELECT COUNT(*) as count FROM GoodsReceivedNote'); // Assuming a GRN table

    return NextResponse.json({
      totalPOs,
      completedPOs,
      partiallyCompletedPOs, // Ensure this is included
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
