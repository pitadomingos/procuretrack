
import { pool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const approverId = searchParams.get('approverId');
  const creatorUserId = searchParams.get('creatorUserId'); 
  // const overallSiteId = searchParams.get('siteId'); // Overall PO siteId filter removed

  let query = `
    SELECT
        po.id, po.poNumber, po.creationDate, po.status, po.subTotal, po.vatAmount,
        po.grandTotal, po.currency, po.pricesIncludeVat, po.notes, po.requestedByName, 
        po.creatorUserId, po.approverId, po.supplierId, po.siteId AS overallSiteId, 
        s.supplierName, app.name AS approverName, u.name AS creatorName,
        overall_site.siteCode AS overallSiteName 
    FROM PurchaseOrder po
    LEFT JOIN Supplier s ON po.supplierId = s.supplierCode
    LEFT JOIN Approver app ON po.approverId = app.id
    LEFT JOIN User u ON po.creatorUserId = u.id
    LEFT JOIN Site overall_site ON po.siteId = overall_site.id 
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
  if (approverId && approverId !== 'all') {
    query += ' AND po.approverId = ?';
    queryParams.push(approverId);
  }
  if (creatorUserId && creatorUserId !== 'all') {
    query += ' AND po.creatorUserId = ?';
    queryParams.push(creatorUserId);
  }
  // Overall PO siteId filter is removed as the field is removed from the form
  // if (overallSiteId && overallSiteId !== 'all') { 
  //   query += ' AND po.siteId = ?';
  //   queryParams.push(parseInt(overallSiteId, 10));
  // }


  query += ' ORDER BY po.creationDate DESC';

  try {
    const [rows] = await pool.execute(query, queryParams);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[API_ERROR] /api/purchase-orders GET: Error fetching purchase orders:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    console.log('[API_INFO] /api/purchase-orders POST: Received application/json request.');
    let connection;
    try {
      const poData = await request.json();
      const {
        poNumber, creationDate, creatorUserId, requestedByName, supplierId,    
        approverId, /* siteId, */ status, subTotal, vatAmount, grandTotal, currency, // siteId (overall PO siteId) removed
        pricesIncludeVat, notes, items, selectedRequisitionId, // Added selectedRequisitionId
      } = poData;

      connection = await pool.getConnection();
      await connection.beginTransaction();

      const finalCreatorUserId = creatorUserId || null;
      // const finalSiteId = siteId ? Number(siteId) : null; // Removed finalSiteId, PO header siteId will be NULL

      const [poResult] = await connection.execute(
        `INSERT INTO PurchaseOrder (poNumber, creationDate, creatorUserId, requestedByName, supplierId, approverId, siteId, status, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [poNumber, new Date(creationDate), finalCreatorUserId, requestedByName, supplierId, approverId, null, status, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes] // siteId set to null
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

      if (selectedRequisitionId) {
        console.log(`[API_INFO] PO created from Requisition ID: ${selectedRequisitionId}. Attempting to update Requisition status.`);
        const [updateReqResult] = await connection.execute(
          'UPDATE Requisition SET status = ? WHERE id = ? AND status = ?',
          ['Closed', selectedRequisitionId, 'Approved'] // Mark as 'Closed', ensure it was 'Approved'
        );
        if (updateReqResult.affectedRows > 0) {
          console.log(`[API_INFO] Requisition ID ${selectedRequisitionId} status updated to 'Closed'.`);
        } else {
          console.warn(`[API_WARN] Failed to update Requisition ID ${selectedRequisitionId} status to 'Closed', or it was not in 'Approved' state.`);
        }
      }

      await connection.commit();
      return NextResponse.json({ message: 'Purchase order created successfully', poId: newPoId, poNumber: poNumber }, { status: 201 });

    } catch (dbError) {
      if (connection) {
        await connection.rollback();
      }
      console.error('[API_ERROR] /api/purchase-orders POST JSON: Error creating purchase order:', dbError);
      return NextResponse.json({ error: 'Failed to create purchase order due to a server error.', details: dbError.message }, { status: 500 });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  } else if (contentType && contentType.includes('multipart/form-data')) {
    console.log('[API_INFO] /api/purchase-orders POST: Received multipart/form-data request for CSV upload.');
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file || typeof file === 'string') { 
        console.error('[API_ERROR] /api/purchase-orders POST CSV: No file uploaded or file is not a File object.');
        return NextResponse.json({ error: 'No file uploaded or invalid file type' }, { status: 400 });
      }
      console.log(`[API_INFO] /api/purchase-orders POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results = [];
      const stream = Readable.from(fileBuffer);
      let firstRecordLogged = false;

      console.log('[API_INFO] /api/purchase-orders POST CSV: Starting CSV parsing...');
      await new Promise((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header }) => header.trim() 
          }))
          .on('headers', (headers) => {
            console.log('[API_INFO] /api/purchase-orders POST CSV: Detected CSV Headers:', headers);
          })
          .on('data', (data) => {
            if (!firstRecordLogged) {
              console.log('[API_DEBUG] /api/purchase-orders POST CSV: First parsed data record from CSV:', data);
              firstRecordLogged = true;
            }
            results.push(data);
          })
          .on('end', () => {
            console.log(`[API_INFO] /api/purchase-orders POST CSV: CSV parsing finished. ${results.length} records found.`);
            resolve();
          })
          .on('error', (parseError) => {
            console.error('[API_ERROR] /api/purchase-orders POST CSV: Error during CSV parsing:', parseError);
            reject(parseError);
          });
      });

      if (results.length === 0) {
        console.warn('[API_WARN] /api/purchase-orders POST CSV: CSV file is empty or could not be parsed into records.');
        return NextResponse.json({ message: 'Purchase Order CSV file is empty or yielded no records.' }, { status: 400 });
      }

      return NextResponse.json({ message: `Purchase order CSV uploaded and parsed successfully. ${results.length} POs found. (Data not saved to DB yet)`, data: results });
    } catch (error) {
      console.error('[API_ERROR] /api/purchase-orders POST CSV: Error handling purchase order file upload:', error);
      return NextResponse.json({ error: 'Failed to handle purchase order file upload', details: error.message }, { status: 500 });
    }
  } else {
    console.warn(`[API_WARN] /api/purchase-orders POST: Unsupported Content-Type: ${contentType}`);
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
