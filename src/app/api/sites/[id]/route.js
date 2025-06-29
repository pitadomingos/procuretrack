
import { getDbPool } from '../../../../../backend/db.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  const numericId = Number(id);
  let connection;

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid site ID format' }, { status: 400 });
  }

  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Site WHERE id = ?', [numericId]);
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error fetching site with ID ${id}:`, error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch site', details: errorMessage }, { status: 500 });
  } finally {
      if (connection) connection.release();
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const numericId = Number(id);
  let connection;

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid site ID format' }, { status: 400 });
  }

  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    const { name, location, siteCode } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Site name is required' }, { status: 400 });
    }

    const [result] = await connection.execute(
      'UPDATE Site SET name = ?, location = ?, siteCode = ? WHERE id = ?',
      [name, location || null, siteCode || null, numericId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Site not found or no changes made' }, { status: 404 });
    }

    const [updatedSiteRows] = await connection.execute('SELECT * FROM Site WHERE id = ?', [numericId]);
    
    if (Array.isArray(updatedSiteRows) && updatedSiteRows.length > 0) {
        return NextResponse.json(updatedSiteRows[0]);
    } else {
         return NextResponse.json({ error: 'Site updated but failed to retrieve it.' }, { status: 500 });
    }

  } catch (error) {
    console.error(`Error updating site with ID ${id}:`, error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    const errorCode = (error && typeof error === 'object' && 'code' in error) ? error.code : null;
     if (errorCode === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'A site with this name or code may already exist.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update site', details: errorMessage }, { status: 500 });
  } finally {
      if (connection) connection.release();
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const numericId = Number(id);
  let connection;

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid site ID format' }, { status: 400 });
  }

  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    const [result] = await connection.execute('DELETE FROM Site WHERE id = ?', [numericId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Site deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting site with ID ${id}:`, error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    const errorCode = (error && typeof error === 'object' && 'code' in error) ? error.code : null;
    if (errorCode === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({ error: 'Cannot delete site. It is currently referenced by other records (e.g., Purchase Orders, Users, Tags). Please remove those references first.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete site', details: errorMessage }, { status: 500 });
  } finally {
      if (connection) connection.release();
  }
}
