
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { Tag } from '@/types';

export async function GET() {
  try {
    // Join with Site table to get siteName (using siteCode preferably)
    const query = `
      SELECT 
        t.id, t.tagNumber, t.registration, t.make, t.model, 
        t.tankCapacity, t.year, t.chassisNo, t.type, t.siteId,
        s.siteCode AS siteName 
      FROM Tag t
      LEFT JOIN Site s ON t.siteId = s.id
      ORDER BY t.tagNumber ASC;
    `;
    const [rows] = await pool.execute(query);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tagData = await request.json() as Tag;

    if (!tagData.id || !tagData.tagNumber) {
      return NextResponse.json({ error: 'Tag ID and Tag Number are required.' }, { status: 400 });
    }
    
    const query = `
      INSERT INTO Tag (id, tagNumber, registration, make, model, tankCapacity, year, chassisNo, type, siteId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    await pool.execute(query, [
      tagData.id,
      tagData.tagNumber,
      tagData.registration || null,
      tagData.make || null,
      tagData.model || null,
      tagData.tankCapacity ? Number(tagData.tankCapacity) : null,
      tagData.year ? Number(tagData.year) : null,
      tagData.chassisNo || null,
      tagData.type || null,
      tagData.siteId ? Number(tagData.siteId) : null,
    ]);

    const [newTagRows]: any[] = await pool.execute('SELECT t.*, s.siteCode as siteName FROM Tag t LEFT JOIN Site s ON t.siteId = s.id WHERE t.id = ?', [tagData.id]);
    if (newTagRows.length === 0) {
        return NextResponse.json({ error: 'Tag created but failed to retrieve.' }, { status: 500 });
    }
    return NextResponse.json(newTagRows[0], { status: 201 });

  } catch (error: any) {
    console.error('Error creating tag:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Tag with this ID or Tag Number already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create tag', details: error.message }, { status: 500 });
  }
}
