
import { pool } from '../../../../../../backend/db.js'; // Corrected relative path
import { NextResponse } from 'next/server';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream'; // Import Readable stream

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

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
  const res = new NextResponse(); 
  const { poId } = params; 

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
            console.log(`Parsed PO item CSV data for PO ID ${poId}:`, results);
            // TODO: Add logic for validating and inserting PO item data into POItem table,
            // ensuring each item is correctly linked to the poId.
            resolve();
        })
        .on('error', (error) => reject(error));
    });

    return NextResponse.json({ message: `PO Items CSV uploaded and parsed successfully for PO ID ${poId}. ${results.length} items found. (Data not saved to DB yet)`, data: results });
  } catch (error) {
    console.error(`Error handling PO item file upload for PO ID ${poId}:`, error);
    if (error instanceof multer.MulterError) {
        return NextResponse.json({ error: `Multer error: ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to handle PO item file upload' }, { status: 500 });
  }
}
