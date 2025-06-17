
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { FetchedDashboardStats } from '@/types';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();

    // Users Stats
    const [userRows]: any[] = await connection.execute('SELECT isActive, COUNT(*) as count FROM User GROUP BY isActive');
    let totalUsers = 0;
    let activeUsers = 0;
    let inactiveUsers = 0;
    userRows.forEach((row: { isActive: boolean | number, count: number | string }) => {
      const count = Number(row.count);
      totalUsers += count;
      if (row.isActive) activeUsers = count; else inactiveUsers = count;
    });

    // Purchase Order Stats
    const [poRows]: any[] = await connection.execute('SELECT status, COUNT(*) as count FROM PurchaseOrder GROUP BY status');
    let totalPOs = 0;
    let approvedPOs = 0;
    let pendingPOs = 0;
    let rejectedPOs = 0;
    poRows.forEach((row: { status: string, count: number | string }) => {
      const count = Number(row.count);
      totalPOs += count;
      if (row.status === 'Approved') approvedPOs = count;
      else if (row.status === 'Pending Approval') pendingPOs = count;
      else if (row.status === 'Rejected') rejectedPOs = count;
    });

    // Goods Received (based on PO status and item received quantity)
    const [grnPOsRows]: any[] = await connection.execute(
      `SELECT COUNT(DISTINCT po.id) as count
       FROM PurchaseOrder po
       JOIN POItem poi ON po.id = poi.poId
       WHERE poi.quantityReceived > 0`
    );
    const totalPOsWithGRNActivity = Number(grnPOsRows[0]?.count || 0);
    // More granular GRN statuses like 'Completed', 'Partially' need complex per-PO item checks
    // For now, totalApprovedPOs (openPOs) can represent those ready for/in receiving.

    // Requisition Stats
    const [requisitionRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Requisition');
    const totalRequisitions = Number(requisitionRows[0]?.count || 0);
    // Requisition status breakdown to be added later when statuses are defined

    // Fuel Records Stats
    const [fuelRecordsRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM FuelRecord');
    const totalFuelRecords = Number(fuelRecordsRows[0]?.count || 0);
    const [fuelTagsRows]: any[] = await connection.execute('SELECT COUNT(DISTINCT id) as count FROM Tag'); // Assuming all tags are vehicles/equipment
    const totalFuelTags = Number(fuelTagsRows[0]?.count || 0);
    
    // Client Quotes Stats
    const [quoteRows]: any[] = await connection.execute('SELECT status, COUNT(*) as count FROM Quote GROUP BY status');
    let totalQuotes = 0;
    let approvedQuotes = 0;
    let pendingQuotes = 0;
    let rejectedQuotes = 0;
    quoteRows.forEach((row: { status: string, count: number | string }) => {
        const count = Number(row.count);
        totalQuotes += count;
        if (row.status === 'Approved') approvedQuotes = count;
        else if (row.status === 'Pending Approval') pendingQuotes = count;
        else if (row.status === 'Rejected') rejectedQuotes = count;
    });


    const responsePayload: FetchedDashboardStats = {
      users: { total: totalUsers, active: activeUsers, inactive: inactiveUsers },
      purchaseOrders: { total: totalPOs, approved: approvedPOs, pending: pendingPOs, rejected: rejectedPOs },
      goodsReceived: { 
        totalApprovedPOs: approvedPOs, // POs in 'Approved' status
        totalPOsWithGRNActivity: totalPOsWithGRNActivity
      },
      requisitions: { total: totalRequisitions },
      fuel: { totalTags: totalFuelTags, totalRecords: totalFuelRecords },
      clientQuotes: { total: totalQuotes, approved: approvedQuotes, pending: pendingQuotes, rejected: rejectedQuotes },
    };
    
    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

    