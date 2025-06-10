import { pool } from '../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM Approver');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching approvers:', error);
    return NextResponse.json({ error: 'Failed to fetch approvers' }, { status: 500 });
  }
}