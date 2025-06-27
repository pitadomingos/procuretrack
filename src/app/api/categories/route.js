
import { getDbPool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pool = await getDbPool();
    const [rows] = await pool.execute('SELECT * FROM Category');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
