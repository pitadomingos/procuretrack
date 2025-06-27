
import { getDbPool } from '../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pool = await getDbPool();
    // Fetch active approvers directly from the Approver table
    const query = `
      SELECT 
        id,
        name, 
        email, 
        department, 
        isActive
      FROM Approver
      WHERE isActive = TRUE;
    `;
    const [rows] = await pool.execute(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching approvers:', error);
    return NextResponse.json({ error: 'Failed to fetch approvers' }, { status: 500 });
  }
}
