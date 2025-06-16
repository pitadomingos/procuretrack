
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { Supplier } from '@/types';
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
    bodyParser: false, // Important for multer
  },
};

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM Supplier ORDER BY supplierName ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers', details: error.message }, { status: 500 });
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
            console.log('Parsed CSV data for suppliers:', results);
            // TODO: Add logic for validating and inserting supplier data into the database
            // For now, just logging.
            resolve();
          })
          .on('error', (error) => reject(error));
      });

      return NextResponse.json({ message: `Suppliers CSV uploaded and parsed successfully. ${results.length} records found. (Data not saved to DB yet)` }, { status: 200 });

    } catch (error: any) {
      console.error('Error handling supplier CSV upload:', error);
      if (error instanceof multer.MulterError) {
        return NextResponse.json({ error: `Multer error: ${error.message}` }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to handle supplier CSV upload.', details: error.message }, { status: 500 });
    }

  } else if (contentType && contentType.includes('application/json')) {
    // JSON Payload for single supplier creation
    try {
      const supplierData = await request.json() as Supplier;

      if (!supplierData.supplierCode || !supplierData.supplierName) {
        return NextResponse.json({ error: 'Supplier Code and Name are required.' }, { status: 400 });
      }
      
      const query = `
        INSERT INTO Supplier (supplierCode, supplierName, salesPerson, cellNumber, physicalAddress, nuitNumber, emailAddress)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.execute(query, [
        supplierData.supplierCode,
        supplierData.supplierName,
        supplierData.salesPerson || null,
        supplierData.cellNumber || null,
        supplierData.physicalAddress || null,
        supplierData.nuitNumber || null,
        supplierData.emailAddress || null,
      ]);

      const [newSupplierRows]: any[] = await pool.execute('SELECT * FROM Supplier WHERE supplierCode = ?', [supplierData.supplierCode]);
      if (newSupplierRows.length === 0) {
          return NextResponse.json({ error: 'Supplier created but failed to retrieve.' }, { status: 500 });
      }
      return NextResponse.json(newSupplierRows[0], { status: 201 });

    } catch (error: any) {
      console.error('Error creating supplier (JSON):', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Supplier with this Code already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create supplier (JSON)', details: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
