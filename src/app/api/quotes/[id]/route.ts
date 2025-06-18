
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { QuotePayload, QuoteItem, Client, Approver } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: quoteId } = params;
  if (!quoteId) {
    return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
  }
  console.log(`[API_INFO] /api/quotes/${quoteId} GET: Received request.`);

  let connection;
  try {
    connection = await pool.getConnection();
    const quoteQuery = `
      SELECT 
        q.*, 
        c.name as clientName, c.email as clientEmail, c.address as clientAddress, c.city as clientCity, c.country as clientCountry, c.contactPerson as clientContactPerson,
        app.name as approverName 
      FROM Quote q
      LEFT JOIN Client c ON q.clientId = c.id
      LEFT JOIN Approver app ON q.approverId = app.id
      WHERE q.id = ?
    `;
    const [quoteRows]: any[] = await connection.execute(quoteQuery, [quoteId]);

    if (quoteRows.length === 0) {
      console.warn(`[API_WARN] /api/quotes/${quoteId} GET: Quote not found.`);
      return NextResponse.json({ error: `Quote with ID ${quoteId} not found.` }, { status: 404 });
    }

    const quoteData: QuotePayload = {
      ...quoteRows[0],
      subTotal: parseFloat(quoteRows[0].subTotal || 0),
      vatAmount: parseFloat(quoteRows[0].vatAmount || 0),
      grandTotal: parseFloat(quoteRows[0].grandTotal || 0),
      approvalDate: quoteRows[0].approvalDate ? new Date(quoteRows[0].approvalDate).toISOString() : null,
    };

    const [itemRows]: any[] = await connection.execute('SELECT * FROM QuoteItem WHERE quoteId = ?', [quoteId]);
    quoteData.items = itemRows.map((item: any) => ({
        ...item,
        quantity: parseInt(item.quantity, 10),
        unitPrice: parseFloat(item.unitPrice),
    })) as QuoteItem[];

    console.log(`[API_INFO] /api/quotes/${quoteId} GET: Successfully fetched quote with ${quoteData.items.length} items.`);
    return NextResponse.json(quoteData);

  } catch (error: any) {
    console.error(`[API_ERROR] /api/quotes/${quoteId} GET:`, error);
    return NextResponse.json({ error: `Failed to fetch quote with ID ${quoteId}.`, details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: quoteId } = params;
  if (!quoteId) {
    return NextResponse.json({ error: 'Quote ID is required for update' }, { status: 400 });
  }
  console.log(`[API_INFO] /api/quotes/${quoteId} PUT: Received request.`);

  let connection;
  try {
    const quoteData = await request.json() as QuotePayload;
    console.log(`[API_INFO] /api/quotes/${quoteId} PUT: Data:`, JSON.stringify(quoteData).substring(0, 500));
    console.log(`[API_INFO] /api/quotes PUT JSON: Received approverId for update: '${quoteData.approverId}', Type: ${typeof quoteData.approverId}`);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [existingQuote]: any[] = await connection.execute('SELECT status FROM Quote WHERE id = ?', [quoteId]);
    if (existingQuote.length === 0) {
        await connection.rollback();
        return NextResponse.json({ error: `Quote with ID ${quoteId} not found for update.` }, { status: 404 });
    }
    
    const rawApproverId = quoteData.approverId;
    const finalApproverId = (rawApproverId === "" || rawApproverId === undefined) ? null : rawApproverId;
    console.log(`[API_INFO] /api/quotes PUT JSON: Final approverId for DB update: '${finalApproverId}', Type: ${typeof finalApproverId}`);


    await connection.execute(
      `UPDATE Quote SET 
        quoteNumber = ?, quoteDate = ?, clientId = ?, creatorEmail = ?, 
        subTotal = ?, vatAmount = ?, grandTotal = ?, currency = ?, 
        termsAndConditions = ?, notes = ?, status = ?, approverId = ?, approvalDate = ?,
        updatedAt = NOW()
       WHERE id = ?`,
      [
        quoteData.quoteNumber, new Date(quoteData.quoteDate).toISOString().slice(0, 19).replace('T', ' '), quoteData.clientId, quoteData.creatorEmail,
        quoteData.subTotal, quoteData.vatAmount, quoteData.grandTotal, quoteData.currency,
        quoteData.termsAndConditions, quoteData.notes, quoteData.status, 
        finalApproverId,
        quoteData.approvalDate ? new Date(quoteData.approvalDate).toISOString().slice(0, 19).replace('T', ' ') : null,
        quoteId
      ]
    );

    await connection.execute('DELETE FROM QuoteItem WHERE quoteId = ?', [quoteId]);
    if (quoteData.items && quoteData.items.length > 0) {
      for (const item of quoteData.items) {
        await connection.execute(
          `INSERT INTO QuoteItem (id, quoteId, partNumber, customerRef, description, quantity, unitPrice)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [item.id || crypto.randomUUID(), quoteId, item.partNumber, item.customerRef, item.description, item.quantity, item.unitPrice]
        );
      }
    }

    await connection.commit();
    console.log(`[API_INFO] /api/quotes/${quoteId} PUT: Successfully updated quote.`);
    
    const getUpdatedQuery = `
      SELECT q.*, c.name as clientName, c.email as clientEmail, app.name as approverName 
      FROM Quote q
      LEFT JOIN Client c ON q.clientId = c.id
      LEFT JOIN Approver app ON q.approverId = app.id
      WHERE q.id = ?
    `;
    const [updatedQuoteRows]: any[] = await connection.execute(getUpdatedQuery, [quoteId]);
    const updatedQuoteData = updatedQuoteRows[0];
    const [updatedItemRows]: any[] = await connection.execute('SELECT * FROM QuoteItem WHERE quoteId = ?', [quoteId]);
    updatedQuoteData.items = updatedItemRows;
     updatedQuoteData.approvalDate = updatedQuoteData.approvalDate ? new Date(updatedQuoteData.approvalDate).toISOString() : null;


    return NextResponse.json(updatedQuoteData);

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error(`[API_ERROR] /api/quotes/${quoteId} PUT:`, error);
    console.error(`[API_ERROR_DETAILS] /api/quotes PUT JSON: Code: ${error.code}, Message: ${error.message}, Stack: ${error.stack}`);
    return NextResponse.json({ error: `Failed to update quote with ID ${quoteId}.`, details: error.message, code: error.code }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
    
