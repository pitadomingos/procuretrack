
import { pool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream'; // Import Readable stream

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

// Helper function to run multer middleware (needed for Next.js API Routes with multer)
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

// Ensure the request is not body-parsed by Next.js for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};


// Export a POST handler for file uploads
export async function POST(request) {
  const res = new NextResponse(); // Create a NextResponse instance for multer

  try {
    // Run the multer middleware
    await runMiddleware(request, res, upload.single('file'));

    const file = request.file; // Access the uploaded file (available after multer processing)

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const results = [];
    // Create a readable stream from the file buffer
    const stream = Readable.from(file.buffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          console.log('Parsed CSV data for suppliers:', results);
          // TODO: Add logic for validating and inserting supplier data into the database
          resolve();
        })
        .on('error', (error) => reject(error));
    });

    return NextResponse.json({ message: 'Supplier file uploaded and parsed successfully', data: results });

  } catch (error) {
    console.error('Error uploading or parsing supplier CSV:', error);
    // Check if the error is from multer (e.g., file size limit)
    if (error instanceof multer.MulterError) {
      return NextResponse.json({ error: `Multer error: ${error.message}` }, { status: 400 });
    }
    // General error
    return NextResponse.json({ error: 'Failed to upload or process supplier file' }, { status: 500 });
  }
}
