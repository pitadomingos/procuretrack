
import { NextResponse } from 'next/server';
import type { TagStatus } from '@/types';

interface ManagementStats {
  suppliersCount: number;
  approversCount: number;
  usersCount: number;
  sitesCount: number;
  categoriesCount: number;
  tagsCount: number;
  tagStatusSummary?: Record<TagStatus, number>;
  clientsCount: number;
}

export async function GET() {
  let connection;
  try {
    const { pool } = await import('../../../../backend/db.js');
    connection = await pool.getConnection();

    const [suppliersRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Supplier');
    const suppliersCount = Number(suppliersRows[0]?.count || 0);

    const [approversRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Approver');
    const approversCount = Number(approversRows[0]?.count || 0);

    const [usersRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM User');
    const usersCount = Number(usersRows[0]?.count || 0);

    const [sitesRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Site');
    const sitesCount = Number(sitesRows[0]?.count || 0);

    const [categoriesRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Category');
    const categoriesCount = Number(categoriesRows[0]?.count || 0);

    const [tagsTotalRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Tag');
    const tagsCount = Number(tagsTotalRows[0]?.count || 0);

    const [tagStatusRows]: any[] = await connection.execute('SELECT status, COUNT(*) as count FROM Tag GROUP BY status');
    const tagStatusSummary: Record<string, number> = {};
    if (Array.isArray(tagStatusRows)) {
      tagStatusRows.forEach((row: { status: TagStatus, count: number | string }) => {
        tagStatusSummary[row.status] = Number(row.count);
      });
    }
    
    const [clientsRows]: any[] = await connection.execute('SELECT COUNT(*) as count FROM Client');
    const clientsCount = Number(clientsRows[0]?.count || 0);

    const responsePayload: ManagementStats = {
      suppliersCount,
      approversCount,
      usersCount,
      sitesCount,
      categoriesCount,
      tagsCount,
      tagStatusSummary: tagStatusSummary as Record<TagStatus, number>,
      clientsCount,
    };
    
    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('[API_ERROR] /api/management-stats GET: Error fetching management entity counts:', error);
    return NextResponse.json(
        { 
            error: 'Failed to fetch management entity counts from database.', 
            details: error.message 
        }, 
        { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
