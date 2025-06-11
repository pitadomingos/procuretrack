import { pool } from '../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Join Approver with User on email to get the User.id for each approver
    // Only select active approvers who have a corresponding user entry
    const query = `
      SELECT 
        a.id,                 -- Approver table's primary key
        a.name, 
        a.email, 
        a.department, 
        a.isActive, 
        u.id AS userId        -- User table's primary key, aliased as userId
      FROM Approver a
      JOIN User u ON a.email = u.email
      WHERE a.isActive = TRUE;
    `;
    const [rows] = await pool.execute(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching approvers with user IDs:', error);
    return NextResponse.json({ error: 'Failed to fetch approvers' }, { status: 500 });
  }
}
