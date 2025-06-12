
import { pool } from '../../../../../../backend/db.js'; // Corrected relative path
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

// Ensure the request is not body-parsed by Next.js
export const config = {
 api: {
    bodyParser: false,
 },
};

export async function GET(request, { params }) {
  const { poId } = params;

  try {
    const [rows] = await pool.execute('SELECT * FROM POItem WHERE poId = ?', [poId]);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(`Error fetching PO items for PO ${poId}:`, error);
    return NextResponse.json({ error: `Failed to fetch PO items for PO ${poId}` }, { status: 500 });
  }
}

// POST handler for uploading PO items
export async function POST(request, { params }) {
  const res = new NextResponse(); // Create a NextResponse instance
  const { poId } = params; // Get poId from parameters if needed

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
        .on('end', () => resolve())
        .on('error', (error) => reject(error));
    });

    console.log('Parsed PO item CSV data:', results);
    // TODO: Add logic for validating and inserting PO item data, linking to poId
    return NextResponse.json({ message: 'File uploaded and parsed successfully', data: results });
  } catch (error) {
    console.error('Error handling PO item file upload:', error);
    return NextResponse.json({ error: 'Failed to handle PO item file upload' }, { status: 500 });
  }
}
