

import { pool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const siteId = searchParams.get('siteId');
  const approverId = searchParams.get('approverId');
  const creatorUserId = searchParams.get('creatorUserId'); // For "Requestor" filter

  let query = `
    SELECT
        po.id,
        po.poNumber,
        po.creationDate,
        po.status,
        po.subTotal,
        po.vatAmount,
        po.grandTotal,
        po.currency,
        po.pricesIncludeVat,
        po.notes,
        po.requestedByName, 
        po.creatorUserId,   
        po.approverId,
        po.supplierId,
        s.supplierName,
        app.name AS approverName,
        u.name AS creatorName 
    FROM PurchaseOrder po
    LEFT JOIN Supplier s ON po.supplierId = s.supplierCode
    LEFT JOIN Approver app ON po.approverId = app.id
    LEFT JOIN User u ON po.creatorUserId = u.id
    WHERE 1=1
  `;
  const queryParams = [];

  if (month && month !== 'all') {
    query += ' AND MONTH(po.creationDate) = ?';
    queryParams.push(parseInt(month, 10));
  }
  if (year && year !== 'all') {
    query += ' AND YEAR(po.creationDate) = ?';
    queryParams.push(parseInt(year, 10));
  }
  if (siteId && siteId !== 'all') {
    query += ' AND po.siteId = ?'; 
    queryParams.push(parseInt(siteId, 10));
  }
  if (approverId && approverId !== 'all') {
    query += ' AND po.approverId = ?';
    queryParams.push(approverId);
  }
  if (creatorUserId && creatorUserId !== 'all') {
    query += ' AND po.creatorUserId = ?';
    queryParams.push(creatorUserId);
  }

  query += ' ORDER BY po.creationDate DESC';

  try {
    const [rows] = await pool.execute(query, queryParams);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders', details: error.message }, { status: 500 });
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
        creatorUserId, 
        requestedByName, 
        supplierId,    
        approverId,    
        status,
        subTotal,
        vatAmount,
        grandTotal,
        currency,
        pricesIncludeVat,
        notes,
        items,
        siteId, 
      } = poData;

      connection = await pool.getConnection();
      await connection.beginTransaction();

      const finalCreatorUserId = creatorUserId || null;

      const [poResult] = await connection.execute(
        `INSERT INTO PurchaseOrder (poNumber, creationDate, creatorUserId, requestedByName, supplierId, approverId, siteId, status, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [poNumber, new Date(creationDate), finalCreatorUserId, requestedByName, supplierId, approverId, siteId || null, status, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes]
      );

      const newPoId = poResult.insertId;

      if (items && items.length > 0) {
        for (const item of items) {
          await connection.execute(
            `INSERT INTO POItem (poId, partNumber, description, categoryId, siteId, uom, quantity, unitPrice, quantityReceived, itemStatus)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [newPoId, item.partNumber, item.description, item.categoryId, item.siteId || null, item.uom, Number(item.quantity), Number(item.unitPrice), item.quantityReceived || 0, item.itemStatus || 'Pending']
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
  } else if (contentType && contentType.includes('multipart/form-data')) {
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
      return NextResponse.json({ message: `Purchase order CSV uploaded and parsed successfully. ${results.length} POs found. (Data not saved to DB yet)`, data: results });
    } catch (error) {
      console.error('Error handling purchase order file upload:', error);
      if (error instanceof multer.MulterError) {
        return NextResponse.json({ error: `Multer error: ${error.message}` }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to handle purchase order file upload' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
