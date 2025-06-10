import { pool } from '../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream'; // Import Readable stream

// Configure multer for file uploads
const upload = multer({ dest: '/tmp/uploads/' }); // Store uploads temporarily

// Helper function to run multer middleware
const runMiddleware = (req, res, fn) => {
 return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
 });
};
export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM PurchaseOrder');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 });
  }
}

// POST handler for uploading purchase orders
export async function POST(request) {
  const res = new NextResponse(); // Create a NextResponse instance

  try {
    // Run the multer middleware
    await runMiddleware(request, res, upload.single('file'));

    const file = request.file; // Access the uploaded file

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const results = [];
    const stream = Readable.from(file.buffer); // Create a readable stream from the buffer

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          console.log('Parsed CSV data for purchase orders:', results);
          // TODO: Add logic for validating and inserting purchase order data
          resolve();
        })
        .on('error', reject);
    });

    return NextResponse.json({ message: 'Purchase order file uploaded and parsed successfully', data: results });

  } catch (error) {
    console.error('Error handling purchase order file upload:', error);
    return NextResponse.json({ error: 'Failed to handle purchase order file upload' }, { status: 500 });
  }
}