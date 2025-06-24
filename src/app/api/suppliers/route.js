
import { NextResponse } from 'next/server';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream'; // Import Readable stream

export async function GET() {
  let connection;
  try {
    const { pool } = await import('../../../../backend/db.js');
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Supplier');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  } finally {
      if (connection) connection.release();
  }
}

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

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

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  const res = new NextResponse(); 

  try {
    await runMiddleware(request, res, upload.single('file'));

    const file = request.file;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const results = [];
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
    if (error instanceof multer.MulterError) {
      return NextResponse.json({ error: `Multer error: ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to upload or process supplier file' }, { status: 500 });
  }
}
