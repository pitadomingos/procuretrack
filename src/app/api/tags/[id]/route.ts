
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { Tag } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const query = `
      SELECT 
        t.id, t.tagNumber, t.registration, t.make, t.model, 
        t.tankCapacity, t.year, t.chassisNo, t.type, t.siteId,
        t.status, -- Added status
        t.createdAt, t.updatedAt, -- Added timestamps
        s.siteCode AS siteName 
      FROM Tag t
      LEFT JOIN Site s ON t.siteId = s.id
      WHERE t.id = ?;
    `;
    const [rows]: any[] = await pool.execute(query, [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error(`Error fetching tag with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch tag', details: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const tagData = await request.json() as Omit<Tag, 'id' | 'siteName' | 'createdAt' | 'updatedAt'>;

    if (!tagData.tagNumber) {
      return NextResponse.json({ error: 'Tag Number is required.' }, { status: 400 });
    }

    const query = `
      UPDATE Tag 
      SET tagNumber = ?, registration = ?, make = ?, model = ?, 
          tankCapacity = ?, year = ?, chassisNo = ?, type = ?, siteId = ?,
          status = ?, -- Added status
          updatedAt = NOW()
      WHERE id = ?
    `;
    const [result]: any[] = await pool.execute(query, [
      tagData.tagNumber,
      tagData.registration || null,
      tagData.make || null,
      tagData.model || null,
      tagData.tankCapacity ? Number(tagData.tankCapacity) : null,
      tagData.year ? Number(tagData.year) : null,
      tagData.chassisNo || null,
      tagData.type || null,
      tagData.siteId ? Number(tagData.siteId) : null,
      tagData.status || 'Active', // Default to 'Active' if not provided
      id
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Tag not found or no changes made' }, { status: 404 });
    }
    
    const getUpdatedQuery = `
      SELECT t.*, s.siteCode as siteName 
      FROM Tag t LEFT JOIN Site s ON t.siteId = s.id 
      WHERE t.id = ?
    `;
    const [updatedTagRows]: any[] = await pool.execute(getUpdatedQuery, [id]);
    if (updatedTagRows.length === 0) {
        return NextResponse.json({ error: 'Tag updated but failed to retrieve.' }, { status: 500 });
    }
    return NextResponse.json(updatedTagRows[0]);

  } catch (error: any) {
    console.error(`Error updating tag with ID ${id}:`, error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Another tag with this Tag Number already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update tag', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const [result]: any[] = await pool.execute('DELETE FROM Tag WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Tag deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting tag with ID ${id}:`, error);
     if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({ error: 'Cannot delete tag. It is currently referenced by other records (e.g., Fuel Records). Please remove those references first.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete tag', details: error.message }, { status: 500 });
  }
}
