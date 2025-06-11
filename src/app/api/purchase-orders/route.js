
import { pool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

const upload = multer({ dest: '/tmp/uploads/' });

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

export async function POST(request) {
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    let connection;
    try {
      const poData = await request.json();
      const {
        poNumber,
        creationDate,
        creatorUserId, // Expecting null for now, or Firebase User ID later
        requestedByName, // New field for the requester's name
        supplierId,    // This is supplierCode
        approverId,    // This is Approver.id
        // siteId,     // Overall PO siteId, not currently in form header
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

      // Ensure creatorUserId is explicitly null if not provided or empty
      const finalCreatorUserId = creatorUserId || null;

      const [poResult] = await connection.execute(
        `INSERT INTO PurchaseOrder (poNumber, creationDate, creatorUserId, requestedByName, supplierId, approverId, status, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [poNumber, new Date(creationDate), finalCreatorUserId, requestedByName, supplierId, approverId, status, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes]
      );

      const newPoId = poResult.insertId;

      if (items && items.length > 0) {
        for (const item of items) {
          // item.allocation is Site.id, item.categoryId is Category.id (number | null)
          // The POItem table itself doesn't have an 'allocation' or 'siteId' column in the current schema.
          // If it needs to be linked to a site per item, the POItem table needs a siteId column.
          // For now, item.allocation is not saved to POItem table.
          await connection.execute(
            `INSERT INTO POItem (poId, partNumber, description, categoryId, uom, quantity, unitPrice)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [newPoId, item.partNumber, item.description, item.categoryId, item.uom, Number(item.quantity), Number(item.unitPrice)]
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
      return NextResponse.json({ error: 'Failed to create purchase order due to a server error.', details: dbError.message }, { status: 500 });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } else {
    // Handle existing CSV file upload logic
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
            console.log('Parsed CSV data for purchase orders:', results);
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
