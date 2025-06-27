
import { getDbPool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pool = await getDbPool();
    const [rows] = await pool.execute('SELECT * FROM User');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
