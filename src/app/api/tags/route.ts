
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { Tag } from '@/types';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to run multer middleware
const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Ensure Next.js doesn't parse the body for file uploads for this route
export const config = {
  api: {
    bodyParser: false, 
  },
};

export async function GET() {
  try {
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
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('multipart/form-data')) {
    // CSV Upload
    // @ts-ignore 
    const req = request as Request & { file?: any };
    const res = new NextResponse(); 

    try {
      await runMiddleware(req, res, upload.single('file'));
      
      // @ts-ignore
      if (!req.file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      
      // @ts-ignore
      const fileBuffer = req.file.buffer;
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);

      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            console.log('Parsed CSV data for tags:', results);
            // TODO: Add logic for validating and inserting tag data into the database
            // For example, iterate through results and call DB insert for each valid tag.
            // Handle potential errors, duplicates, etc.
            resolve();
          })
          .on('error', (error) => reject(error));
      });

      return NextResponse.json({ message: `Tags CSV uploaded and parsed successfully. ${results.length} records found. (Data not saved to DB yet)` }, { status: 200 });

    } catch (error: any) {
      console.error('Error handling tag CSV upload:', error);
      if (error instanceof multer.MulterError) {
        return NextResponse.json({ error: `Multer error: ${error.message}` }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to handle tag CSV upload.', details: error.message }, { status: 500 });
    }

  } else if (contentType && contentType.includes('application/json')) {
    // JSON Payload for single tag creation
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
      console.error('Error creating tag (JSON):', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Tag with this ID or Tag Number already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create tag (JSON)', details: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
