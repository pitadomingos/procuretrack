
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { poId } = params;
  let connection;
  try {
    const { pool } = await import('../../../../../backend/db.js');
    connection = await pool.getConnection();
    // Selecting all columns, including siteId from PurchaseOrder table
    const [rows] = await connection.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [poId]);
    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ message: `Purchase order with ID ${poId} not found` }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error fetching purchase order with ID ${poId}:`, error);
    return NextResponse.json({ error: `Failed to fetch purchase order with ID ${poId}` }, { status: 500 });
  } finally {
      if (connection) connection.release();
  }
}

export async function PUT(request, { params }) {
  const { poId } = params;
  const numericPoId = Number(poId);

  if (isNaN(numericPoId)) {
    return NextResponse.json({ error: 'Invalid Purchase Order ID' }, { status: 400 });
  }

  let connection;
  try {
    const { pool } = await import('../../../../../backend/db.js');
    const poData = await request.json();
    const {
      poNumber,
      creationDate,
      requestedByName,
      supplierId,
      approverId,
      siteId, // Added overall PO siteId
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

    const finalSiteId = siteId ? Number(siteId) : null; // Ensure siteId is number or null

    const [poUpdateResult] = await connection.execute(
      `UPDATE PurchaseOrder SET 
        poNumber = ?, creationDate = ?, requestedByName = ?, supplierId = ?, approverId = ?, siteId = ?,
        subTotal = ?, vatAmount = ?, grandTotal = ?, currency = ?, pricesIncludeVat = ?, notes = ?
       WHERE id = ?`, // Added siteId to SET clause
      [
        poNumber, new Date(creationDate), requestedByName, supplierId, approverId, finalSiteId,
        subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes,
        numericPoId
      ]
    );

    if (poUpdateResult.affectedRows === 0) {
      await connection.rollback();
      return NextResponse.json({ error: `Purchase Order with ID ${numericPoId} not found for update.` }, { status: 404 });
    }

    await connection.execute('DELETE FROM POItem WHERE poId = ?', [numericPoId]);

    if (items && items.length > 0) {
      for (const item of items) {
        await connection.execute(
          `INSERT INTO POItem (poId, partNumber, description, categoryId, siteId, uom, quantity, unitPrice, quantityReceived, itemStatus)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            numericPoId, 
            item.partNumber || null, 
            item.description, 
            item.categoryId ? Number(item.categoryId) : null, 
            item.siteId ? Number(item.siteId) : null, // Item-level siteId
            item.uom, 
            Number(item.quantity), 
            Number(item.unitPrice),
            item.quantityReceived || 0, 
            item.itemStatus || 'Pending'   
          ]
        );
      }
    }

    await connection.commit();
    return NextResponse.json({ message: 'Purchase order updated successfully', poId: numericPoId, poNumber: poNumber });

  } catch (dbError) {
    if (connection) {
      await connection.rollback();
    }
    console.error(`Error updating purchase order ${numericPoId}:`, dbError);
    const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
    return NextResponse.json({ error: 'Failed to update purchase order.', details: errorMessage }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
