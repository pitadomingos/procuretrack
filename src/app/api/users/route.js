
import { getDbPool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';

export async function GET() {
  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM User');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  } finally {
      if (connection) connection.release();
  }
}
