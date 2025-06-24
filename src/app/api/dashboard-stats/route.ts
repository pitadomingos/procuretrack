
import { NextResponse } from 'next/server';
import type { FetchedDashboardStats } from '@/types';
// The static pool import is removed from here

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  
  let connection;
  try {
    // Dynamic import: The database pool is imported only when the API is called.
    // This allows the try/catch block to handle missing DB environment variables gracefully.
    const { pool } = await import('../../../../backend/db.js');
    connection = await pool.getConnection();

    let poWhereClause = '';
    let quoteWhereClause = '';
    let fuelWhereClause = '';
    let requisitionWhereClause = '';
    const queryParams: (string | number)[] = [];
    const quoteQueryParams: (string | number)[] = [];
    const fuelQueryParams: (string | number)[] = [];
    const requisitionQueryParams: (string | number)[] = [];


    if (month && month !== 'all' && year && year !== 'all') {
      poWhereClause = 'WHERE MONTH(creationDate) = ? AND YEAR(creationDate) = ?';
      quoteWhereClause = 'WHERE MONTH(quoteDate) = ? AND YEAR(quoteDate) = ?';
      fuelWhereClause = 'WHERE MONTH(fuelDate) = ? AND YEAR(fuelDate) = ?';
      requisitionWhereClause = 'WHERE MONTH(requisitionDate) = ? AND YEAR(requisitionDate) = ?';
      
      queryParams.push(parseInt(month, 10), parseInt(year, 10));
      quoteQueryParams.push(parseInt(month, 10), parseInt(year, 10));
      fuelQueryParams.push(parseInt(month, 10), parseInt(year, 10));
      requisitionQueryParams.push(parseInt(month, 10), parseInt(year, 10));
    } else if (year && year !== 'all') {
      poWhereClause = 'WHERE YEAR(creationDate) = ?';
      quoteWhereClause = 'WHERE YEAR(quoteDate) = ?';
      fuelWhereClause = 'WHERE YEAR(fuelDate) = ?';
      requisitionWhereClause = 'WHERE YEAR(requisitionDate) = ?';
      
      queryParams.push(parseInt(year, 10));
      quoteQueryParams.push(parseInt(year, 10));
      fuelQueryParams.push(parseInt(year, 10));
      requisitionQueryParams.push(parseInt(year, 10));
    }


    // Users Stats (not time-filtered for now)
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
    const [poRows]: any[] = await connection.execute(`SELECT status, COUNT(*) as count FROM PurchaseOrder ${poWhereClause} GROUP BY status`, queryParams);
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

    // Goods Received
    const grnActivityBaseQuery = `
       FROM PurchaseOrder po
       JOIN POItem poi ON po.id = poi.poId
       WHERE poi.quantityReceived > 0 
    `;
    let grnActivityWhereClause = '';
    const grnActivityParams = [];
    if (month && month !== 'all' && year && year !== 'all') {
      grnActivityWhereClause = 'AND MONTH(po.creationDate) = ? AND YEAR(po.creationDate) = ?';
      grnActivityParams.push(parseInt(month, 10), parseInt(year, 10));
    } else if (year && year !== 'all') {
      grnActivityWhereClause = 'AND YEAR(po.creationDate) = ?';
      grnActivityParams.push(parseInt(year, 10));
    }
    const [grnPOsRows]: any[] = await connection.execute(
      `SELECT COUNT(DISTINCT po.id) as count ${grnActivityBaseQuery} ${grnActivityWhereClause}`,
      grnActivityParams
    );
    const totalPOsWithGRNActivity = Number(grnPOsRows[0]?.count || 0);
    
    // Approved POs for GRN stat (this count might also be filtered by date)
    const [approvedPORowsForGRN]: any[] = await connection.execute(`SELECT COUNT(*) as count FROM PurchaseOrder WHERE status = 'Approved' ${poWhereClause ? `AND ${poWhereClause.substring(6)}` : ''}`, queryParams);
    const totalApprovedPOsForGRN = Number(approvedPORowsForGRN[0]?.count || 0);


    // Requisition Stats
    const [requisitionRows]: any[] = await connection.execute(`SELECT COUNT(*) as count FROM Requisition ${requisitionWhereClause}`, requisitionQueryParams);
    const totalRequisitions = Number(requisitionRows[0]?.count || 0);

    // Fuel Records Stats
    const [fuelRecordsRows]: any[] = await connection.execute(`SELECT COUNT(*) as count FROM FuelRecord ${fuelWhereClause}`, fuelQueryParams);
    const totalFuelRecords = Number(fuelRecordsRows[0]?.count || 0);
    const [fuelTagsRows]: any[] = await connection.execute('SELECT COUNT(DISTINCT id) as count FROM Tag');
    const totalFuelTags = Number(fuelTagsRows[0]?.count || 0);
    
    // Client Quotes Stats
    const [quoteRows]: any[] = await connection.execute(`SELECT status, COUNT(*) as count FROM Quote ${quoteWhereClause} GROUP BY status`, quoteQueryParams);
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
        totalApprovedPOs: totalApprovedPOsForGRN,
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
