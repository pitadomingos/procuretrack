
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { Supplier } from '@/types';
import csv from 'csv-parser';
import { Readable } from 'stream';

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
    console.log('[API_INFO] /api/suppliers POST: Received multipart/form-data request for CSV upload.');
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        console.error('[API_ERROR] /api/suppliers POST CSV: No file found in formData.');
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      console.log(`[API_INFO] /api/suppliers POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);
      let firstRecordLogged = false;

      console.log('[API_INFO] /api/suppliers POST CSV: Starting CSV parsing...');
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header }) => header.trim() // Trim headers
          }))
          .on('headers', (headers) => {
            console.log('[API_INFO] /api/suppliers POST CSV: Detected CSV Headers:', headers);
          })
          .on('data', (data) => {
            if (!firstRecordLogged) {
              console.log('[API_DEBUG] /api/suppliers POST CSV: First parsed data record from CSV:', data);
              firstRecordLogged = true;
            }
            results.push(data);
          })
          .on('end', () => {
            console.log(`[API_INFO] /api/suppliers POST CSV: CSV parsing finished. ${results.length} records found.`);
            // TODO: Add logic for validating and inserting supplier data into the database.
            // For now, just logging.
            resolve();
          })
          .on('error', (parseError) => {
            console.error('[API_ERROR] /api/suppliers POST CSV: Error during CSV parsing:', parseError);
            reject(parseError);
          });
      });

      if (results.length === 0) {
        console.warn('[API_WARN] /api/suppliers POST CSV: CSV file is empty or could not be parsed into records.');
        return NextResponse.json({ message: 'CSV file is empty or yielded no records.' }, { status: 400 });
      }

      // Placeholder for actual database operations
      // For example, you would loop through `results` and insert/update the database.
      // let successfulInserts = 0;
      // let failedInserts = 0;
      // const errors: string[] = [];
      // await connection.beginTransaction(); // If using DB transactions
      // try { ... } catch { await connection.rollback(); } finally { connection.release(); }
      // await connection.commit();

      return NextResponse.json({ message: `Suppliers CSV uploaded and parsed successfully. ${results.length} records found. (Data not saved to DB yet)` }, { status: 200 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/suppliers POST CSV: Error handling supplier CSV upload (outer try-catch):', error);
      return NextResponse.json({ error: 'Failed to handle supplier CSV upload.', details: error.message }, { status: 500 });
    }

  } else if (contentType && contentType.includes('application/json')) {
    console.log('[API_INFO] /api/suppliers POST: Received application/json request.');
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
      console.error('[API_ERROR] /api/suppliers POST JSON: Error creating supplier:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Supplier with this Code already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create supplier (JSON)', details: error.message }, { status: 500 });
    }
  } else {
    console.warn(`[API_WARN] /api/suppliers POST: Unsupported Content-Type: ${contentType}`);
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
