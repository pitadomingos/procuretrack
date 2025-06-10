import { pool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';
import multer from 'multer';
import csv from 'csv-parser';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM Supplier');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

// Configure multer for file uploads
// Using memoryStorage for temporary storage
const upload = multer({ storage: multer.memoryStorage() });

// Export a POST handler for file uploads
// Use multer middleware to handle single file upload with field name 'file'
export async function POST(req) {
  try {
    const uploadMiddleware = upload.single('file');
    await new Promise((resolve, reject) => {
      uploadMiddleware(req, {}, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
    console.log('Received request to upload suppliers');
    // TODO: Add logic for parsing, validating, and inserting supplier data
    return NextResponse.json({ message: 'Supplier upload endpoint hit' });
  } catch (error) {
    console.error('Error uploading suppliers:', error);
    return NextResponse.json({ error: 'Failed to upload suppliers' }, { status: 500 });
  }
}