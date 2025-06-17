
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { Tag } from '@/types';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function GET() {
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
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('multipart/form-data')) {
    console.log('[API_INFO] /api/tags POST: Received multipart/form-data request for CSV upload.');
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        console.error('[API_ERROR] /api/tags POST CSV: No file found in formData.');
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      console.log(`[API_INFO] /api/tags POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);
      let firstRecordLogged = false;

      console.log('[API_INFO] /api/tags POST CSV: Starting CSV parsing...');
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header }) => header.trim() // Trim headers
          }))
          .on('headers', (headers) => {
            console.log('[API_INFO] /api/tags POST CSV: Detected CSV Headers:', headers);
          })
          .on('data', (data) => {
            if (!firstRecordLogged) {
              console.log('[API_DEBUG] /api/tags POST CSV: First parsed data record from CSV:', data);
              firstRecordLogged = true;
            }
            results.push(data);
          })
          .on('end', () => {
            console.log(`[API_INFO] /api/tags POST CSV: CSV parsing finished. ${results.length} records found.`);
            // TODO: Add logic for validating and inserting tag data (including status) into the database.
            resolve();
          })
          .on('error', (parseError) => {
            console.error('[API_ERROR] /api/tags POST CSV: Error during CSV parsing:', parseError);
            reject(parseError);
          });
      });

      if (results.length === 0) {
        console.warn('[API_WARN] /api/tags POST CSV: CSV file is empty or could not be parsed into records.');
        return NextResponse.json({ message: 'CSV file is empty or yielded no records.' }, { status: 400 });
      }

      return NextResponse.json({ message: `Tags CSV uploaded and parsed successfully. ${results.length} records found. (Data not saved to DB yet)` }, { status: 200 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/tags POST CSV: Error handling tag CSV upload (outer try-catch):', error);
      return NextResponse.json({ error: 'Failed to handle tag CSV upload.', details: error.message }, { status: 500 });
    }

  } else if (contentType && contentType.includes('application/json')) {
    console.log('[API_INFO] /api/tags POST: Received application/json request.');
    try {
      const tagData = await request.json() as Omit<Tag, 'createdAt' | 'updatedAt' | 'siteName'>;

      if (!tagData.id || !tagData.tagNumber) {
        return NextResponse.json({ error: 'Tag ID and Tag Number are required.' }, { status: 400 });
      }
      
      const query = `
        INSERT INTO Tag (id, tagNumber, registration, make, model, tankCapacity, year, chassisNo, type, siteId, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
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
        tagData.status || 'Active', // Default to 'Active' if not provided
      ]);

      const [newTagRows]: any[] = await pool.execute('SELECT t.*, s.siteCode as siteName FROM Tag t LEFT JOIN Site s ON t.siteId = s.id WHERE t.id = ?', [tagData.id]);
      if (newTagRows.length === 0) {
          return NextResponse.json({ error: 'Tag created but failed to retrieve.' }, { status: 500 });
      }
      return NextResponse.json(newTagRows[0], { status: 201 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/tags POST JSON: Error creating tag:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Tag with this ID or Tag Number already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create tag (JSON)', details: error.message }, { status: 500 });
    }
  } else {
    console.warn(`[API_WARN] /api/tags POST: Unsupported Content-Type: ${contentType}`);
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
