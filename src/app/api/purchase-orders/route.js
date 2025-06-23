
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
  const status = searchParams.get('status');
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
  if (status && status !== 'all') {
    query += ' AND po.status = ?';
    queryParams.push(status);
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
    let connection;
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file || typeof file === 'string') { 
        return NextResponse.json({ error: 'No file uploaded or invalid file type' }, { status: 400 });
      }
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results = [];
      const stream = Readable.from(fileBuffer);

      await new Promise((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header }) => header.trim().toLowerCase() // Normalize headers
          }))
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      if (results.length === 0) {
        return NextResponse.json({ message: 'Purchase Order CSV file is empty or could not be parsed.' }, { status: 400 });
      }

      // Group by PO number
      const posGroupedByNumber = results.reduce((acc, row) => {
        const poNumber = row.ponumber;
        if (!poNumber) return acc;
        if (!acc[poNumber]) acc[poNumber] = [];
        acc[poNumber].push(row);
        return acc;
      }, {});

      connection = await pool.getConnection();
      
      const [suppliers] = await connection.execute('SELECT supplierCode FROM Supplier');
      const [approvers] = await connection.execute('SELECT id FROM Approver');
      const [categories] = await connection.execute('SELECT id FROM Category');
      const [sites] = await connection.execute('SELECT id FROM Site');

      const supplierSet = new Set(suppliers.map(s => s.supplierCode));
      const approverSet = new Set(approvers.map(a => a.id));
      const categorySet = new Set(categories.map(c => c.id));
      const siteSet = new Set(sites.map(s => s.id));

      let successfulImports = 0;
      let failedImports = 0;
      const errors = [];

      await connection.beginTransaction();

      for (const poNumber in posGroupedByNumber) {
        const poItems = posGroupedByNumber[poNumber];
        const headerRow = poItems[0];

        try {
          if (!supplierSet.has(headerRow.supplierid)) {
            throw new Error(`Supplier ID '${headerRow.supplierid}' does not exist.`);
          }
          if (headerRow.approverid && !approverSet.has(headerRow.approverid)) {
            throw new Error(`Approver ID '${headerRow.approverid}' does not exist.`);
          }
          
          let subTotal = 0;
          for (const item of poItems) {
            const qty = parseFloat(item.quantity);
            const price = parseFloat(item.unitprice);
            if (isNaN(qty) || isNaN(price)) {
              throw new Error(`Invalid quantity or unit price for an item in PO ${poNumber}.`);
            }
            subTotal += qty * price;
          }

          const pricesIncludeVat = ['true', '1', 'yes'].includes((headerRow.pricesincludevat || '').toLowerCase());
          let vatAmount = 0;
          if (headerRow.currency === 'MZN' && !pricesIncludeVat) {
              vatAmount = subTotal * 0.16;
          }
          const grandTotal = subTotal + vatAmount;

          const poInsertQuery = `
            INSERT INTO PurchaseOrder (poNumber, creationDate, creatorUserId, requestedByName, supplierId, approverId, siteId, status, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const [poResult] = await connection.execute(poInsertQuery, [
            poNumber,
            headerRow.creationdate ? new Date(headerRow.creationdate) : new Date(),
            null,
            headerRow.requestedbyname || null,
            headerRow.supplierid || null,
            headerRow.approverid || null,
            null,
            headerRow.status || 'Approved',
            subTotal, vatAmount, grandTotal,
            headerRow.currency || 'MZN',
            pricesIncludeVat,
            headerRow.notes || null,
          ]);
          const newPoId = poResult.insertId;

          for (const item of poItems) {
            const categoryId = item.categoryid ? parseInt(item.categoryid, 10) : null;
            const siteId = item.siteid ? parseInt(item.siteid, 10) : null;
            if (categoryId && !categorySet.has(categoryId)) {
                throw new Error(`Item in PO ${poNumber} has an invalid Category ID: ${categoryId}`);
            }
            if (siteId && !siteSet.has(siteId)) {
                throw new Error(`Item in PO ${poNumber} has an invalid Site ID: ${siteId}`);
            }

            const itemInsertQuery = `
              INSERT INTO POItem (poId, partNumber, description, categoryId, siteId, uom, quantity, unitPrice)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await connection.execute(itemInsertQuery, [
              newPoId,
              item.partnumber || null,
              item.description || 'N/A',
              categoryId, siteId,
              item.uom || 'EA',
              parseFloat(item.quantity) || 0,
              parseFloat(item.unitprice) || 0,
            ]);
          }
          successfulImports++;
        } catch (error) {
          failedImports++;
          errors.push(`Failed to import PO ${poNumber}: ${error.message}`);
        }
      }

      if (failedImports > 0) {
        await connection.rollback();
        console.warn(`[API_WARN] PO CSV Upload: Rolled back transaction due to ${failedImports} errors.`, errors);
        return NextResponse.json({
            message: `Processing complete. ${successfulImports} POs were valid but the transaction was rolled back due to ${failedImports} errors. Please fix the CSV and re-upload.`,
            errors: errors
        }, { status: 400 });
      } else {
        await connection.commit();
        console.log(`[API_INFO] PO CSV Upload: Transaction committed successfully for ${successfulImports} POs.`);
        return NextResponse.json({
            message: `Successfully imported ${successfulImports} Purchase Orders and their items into the database.`,
        }, { status: 200 });
      }
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('[API_ERROR] /api/purchase-orders POST CSV: Error handling purchase order file upload:', error);
      return NextResponse.json({ error: 'Failed to handle purchase order file upload', details: error.message }, { status: 500 });
    } finally {
      if (connection) connection.release();
    }
  } else {
    console.warn(`[API_WARN] /api/purchase-orders POST: Unsupported Content-Type: ${contentType}`);
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
