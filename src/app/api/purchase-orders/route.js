
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

// POST handler for uploading purchase orders OR creating a new PO via JSON
export async function POST(request) {
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    // Handle JSON PO creation
    let connection;
    try {
      const poData = await request.json();
      const {
        poNumber,
        creationDate,
        creatorUserId,
        supplierId, // This is supplierCode
        approverUserId,
        status,
        subTotal,
        vatAmount,
        grandTotal,
        currency,
        pricesIncludeVat,
        notes,
        items
      } = poData;

      connection = await pool.getConnection();
      await connection.beginTransaction();

      const [poResult] = await connection.execute(
        `INSERT INTO PurchaseOrder (poNumber, creationDate, creatorUserId, supplierId, approverUserId, status, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [poNumber, new Date(creationDate), creatorUserId, supplierId, approverUserId, status, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes]
      );

      const newPoId = poResult.insertId;

      if (items && items.length > 0) {
        for (const item of items) {
          let categoryIdToInsert = Number(item.categoryId);
          if (isNaN(categoryIdToInsert) || categoryIdToInsert === 0) {
            categoryIdToInsert = null; // Handle empty/invalid category selection
          }

          await connection.execute(
            `INSERT INTO POItem (poId, partNumber, description, categoryId, uom, quantity, unitPrice)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [newPoId, item.partNumber, item.description, categoryIdToInsert, item.uom, Number(item.quantity), Number(item.unitPrice)]
          );
        }
      }

      await connection.commit();
      return NextResponse.json({ message: 'Purchase order created successfully', poId: newPoId, poNumber: poNumber }, { status: 201 });

    } catch (dbError) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Error creating purchase order from JSON:', dbError);
      // It's good to send a more generic error message to the client for security.
      // Specific details are logged on the server.
      return NextResponse.json({ error: 'Failed to create purchase order due to a server error.', details: dbError.message }, { status: 500 });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } else {
    // Handle existing CSV file upload logic
    const res = new NextResponse(); // Create a NextResponse instance for multer

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
            // TODO: Add logic for validating and inserting purchase order data from CSV
            resolve();
          })
          .on('error', reject);
      });

      return NextResponse.json({ message: 'Purchase order file uploaded and parsed successfully. Processing not yet implemented.', data: results });

    } catch (error) {
      console.error('Error handling purchase order file upload:', error);
      return NextResponse.json({ error: 'Failed to handle purchase order file upload' }, { status: 500 });
    }
  }
}
