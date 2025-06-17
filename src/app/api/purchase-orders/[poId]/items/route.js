
import { pool } from '../../../../../../backend/db.js'; 
import { NextResponse } from 'next/server';
import csv from 'csv-parser';
import { Readable } from 'stream'; 

export async function GET(request, { params }) {
  const { poId } = params;

  try {
    const [rows] = await pool.execute('SELECT * FROM POItem WHERE poId = ?', [poId]);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(`[API_ERROR] /api/purchase-orders/${poId}/items GET: Error fetching PO items:`, error);
    return NextResponse.json({ error: `Failed to fetch PO items for PO ${poId}`, details: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { poId } = params; 
  const contentType = request.headers.get('content-type');

  if (!(contentType && contentType.includes('multipart/form-data'))) {
    console.warn(`[API_WARN] /api/purchase-orders/${poId}/items POST: Unsupported Content-Type: ${contentType}`);
    return NextResponse.json({ error: 'Unsupported Content-Type, expected multipart/form-data.' }, { status: 415 });
  }

  console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST: Received multipart/form-data request for CSV upload.`);
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') { // Check if file is a File object
      console.error(`[API_ERROR] /api/purchase-orders/${poId}/items POST CSV: No file uploaded or file is not a File object.`);
      return NextResponse.json({ error: 'No file uploaded or invalid file type' }, { status: 400 });
    }
    console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);
    
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const results = [];
    const stream = Readable.from(fileBuffer);
    let firstRecordLogged = false;

    console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST CSV: Starting CSV parsing...`);
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv({
          mapHeaders: ({ header }) => header.trim() // Trim headers
        }))
        .on('headers', (headers) => {
          console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST CSV: Detected CSV Headers:`, headers);
        })
        .on('data', (data) => {
          if (!firstRecordLogged) {
            console.log(`[API_DEBUG] /api/purchase-orders/${poId}/items POST CSV: First parsed data record from CSV:`, data);
            firstRecordLogged = true;
          }
          results.push(data);
        })
        .on('end', () => {
          console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST CSV: CSV parsing finished. ${results.length} items found.`);
          // TODO: Add logic for validating and inserting PO item data into POItem table,
          // ensuring each item is correctly linked to the poId.
          resolve();
        })
        .on('error', (parseError) => {
          console.error(`[API_ERROR] /api/purchase-orders/${poId}/items POST CSV: Error during CSV parsing:`, parseError);
          reject(parseError);
        });
    });

    if (results.length === 0) {
      console.warn(`[API_WARN] /api/purchase-orders/${poId}/items POST CSV: CSV file is empty or could not be parsed into records.`);
      return NextResponse.json({ message: `PO Items CSV file for PO ID ${poId} is empty or yielded no records.` }, { status: 400 });
    }

    return NextResponse.json({ message: `PO Items CSV uploaded and parsed successfully for PO ID ${poId}. ${results.length} items found. (Data not saved to DB yet)`, data: results });
  } catch (error) {
    console.error(`[API_ERROR] /api/purchase-orders/${poId}/items POST CSV: Error handling PO item file upload:`, error);
    return NextResponse.json({ error: 'Failed to handle PO item file upload', details: error.message }, { status: 500 });
  }
}
