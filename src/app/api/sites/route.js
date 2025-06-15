
import { pool } from '../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM Site ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, location, siteCode } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Site name is required' }, { status: 400 });
    }

    const [result] = await pool.execute(
      'INSERT INTO Site (name, location, siteCode) VALUES (?, ?, ?)',
      [name, location || null, siteCode || null]
    );

    // MySQL insertId is part of the OkPacket, which is the first element of the array returned by execute
    const insertId = result.insertId;

    if (!insertId) {
        console.error('Failed to get insertId from site creation:', result);
        return NextResponse.json({ error: 'Failed to create site, could not retrieve ID.' }, { status: 500 });
    }

    const [newSiteRows] = await pool.execute('SELECT * FROM Site WHERE id = ?', [insertId]);
    
    if (Array.isArray(newSiteRows) && newSiteRows.length > 0) {
        return NextResponse.json(newSiteRows[0], { status: 201 });
    } else {
        return NextResponse.json({ error: 'Site created but failed to retrieve it.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error creating site:', error);
    if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'A site with this name or code may already exist.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create site', details: error.message }, { status: 500 });
  }
}
