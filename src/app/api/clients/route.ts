
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js'; // Adjust path as needed

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM Client ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching clients from DB:', error);
    return NextResponse.json({ error: 'Failed to fetch clients from database', details: error.message }, { status: 500 });
  }
}

// POST, PUT, DELETE handlers for clients will be added later.
// For now, we'll keep it simple with just GET.
// If you need to add a client for testing, you can do so directly in your database.
