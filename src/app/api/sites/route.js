
import { pool } from '../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM Site');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}

