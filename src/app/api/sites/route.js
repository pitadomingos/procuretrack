
import { getDbPool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';

export async function GET() {
  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Site ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  } finally {
      if (connection) connection.release();
  }
}

export async function POST(request) { // Removed ": Request" type annotation
  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    const { name, location, siteCode } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Site name is required' }, { status: 400 });
    }

    const [result] = await connection.execute(
      'INSERT INTO Site (name, location, siteCode) VALUES (?, ?, ?)',
      [name, location || null, siteCode || null]
    );

    const insertId = result.insertId;

    if (!insertId) {
        console.error('Failed to get insertId from site creation:', result);
        return NextResponse.json({ error: 'Failed to create site, could not retrieve ID.' }, { status: 500 });
    }

    const [newSiteRows] = await connection.execute('SELECT * FROM Site WHERE id = ?', [insertId]);
    
    if (Array.isArray(newSiteRows) && newSiteRows.length > 0) {
        return NextResponse.json(newSiteRows[0], { status: 201 });
    } else {
        return NextResponse.json({ error: 'Site created but failed to retrieve it.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error creating site:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'A site with this name or code may already exist.' }, { status: 409 });
    }
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to create site', details: errorMessage }, { status: 500 });
  } finally {
      if (connection) connection.release();
  }
}
