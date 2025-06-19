
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { RequisitionPayload } from '@/types';

export async function GET() {
  try {
    // Fetches requisitions that are marked as 'Approved' and thus ready for PO creation
    // Only returns minimal data needed for selection in the PO form.
    // This query implicitly excludes 'Closed' requisitions because it only asks for 'Approved'.
    const query = `
      SELECT 
        r.id, 
        r.requisitionNumber, 
        r.requisitionDate, 
        r.requestedByName,
        r.siteId, -- Added Requisition Header siteId
        s.siteCode as siteName, -- siteName is actually siteCode here for display
        (SELECT COUNT(*) FROM RequisitionItem ri WHERE ri.requisitionId = r.id) as itemCount
      FROM Requisition r
      LEFT JOIN Site s ON r.siteId = s.id
      WHERE r.status = 'Approved' 
      ORDER BY r.requisitionDate DESC;
    `;
    const [rows]: any[] = await pool.execute(query);
    
    const approvedRequisitions = rows.map(row => ({
        id: row.id,
        requisitionNumber: row.requisitionNumber,
        requisitionDate: new Date(row.requisitionDate).toISOString(), // Keep as ISO string for consistency
        requestedByName: row.requestedByName,
        siteName: row.siteName || 'N/A', // This is siteCode
        siteId: Number(row.siteId), // Include the header siteId
        itemCount: Number(row.itemCount || 0),
    }));

    return NextResponse.json(approvedRequisitions);
  } catch (error: any) {
    console.error('[API_ERROR] /api/requisitions/for-po-creation GET:', error);
    return NextResponse.json({ error: 'Failed to fetch approved requisitions', details: error.message }, { status: 500 });
  }
}
