
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { QuotePayload, QuoteItem, Client, Approver } from '@/types'; // Added Approver
import csv from 'csv-parser';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');
  let connection;
  console.log(`[API_INFO] /api/quotes POST: Received request with Content-Type: ${contentType}`);

  if (contentType && contentType.includes('multipart/form-data')) {
    console.log('[API_INFO] /api/quotes POST: Processing multipart/form-data for CSV upload.');
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        console.error('[API_ERROR] /api/quotes POST CSV: No file found in formData.');
        return NextResponse.json({ error: 'No file uploaded for quotes' }, { status: 400 });
      }
      console.log(`[API_INFO] /api/quotes POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);
      let firstRecordLogged = false;

      console.log('[API_INFO] /api/quotes POST CSV: Starting CSV parsing...');
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
          .on('headers', (headers) => console.log('[API_INFO] /api/quotes POST CSV: Detected CSV Headers:', headers))
          .on('data', (data) => {
             if (!firstRecordLogged) {
              console.log('[API_DEBUG] /api/quotes POST CSV: First parsed data record from CSV:', data);
              firstRecordLogged = true;
            }
            results.push(data);
          })
          .on('end', () => {
            console.log(`[API_INFO] /api/quotes POST CSV: CSV parsing finished. ${results.length} records found.`);
            resolve();
          })
          .on('error', (parseError) => {
            console.error('[API_ERROR] /api/quotes POST CSV: Error during CSV parsing:', parseError);
            reject(parseError);
          });
      });

      if (results.length === 0) {
        console.warn('[API_WARN] /api/quotes POST CSV: CSV file is empty or yielded no records.');
        return NextResponse.json({ message: 'CSV file is empty or yielded no records for quotes.' }, { status: 400 });
      }

      console.log('[API_INFO] /api/quotes POST CSV: Attempting to get database connection for batch insert/update.');
      connection = await pool.getConnection();
      console.log('[API_INFO] /api/quotes POST CSV: Database connection obtained.');
      await connection.beginTransaction();
      console.log('[API_INFO] /api/quotes POST CSV: Database transaction started.');

      let successfulImports = 0;
      const importErrors: string[] = [];

      for (const [index, record] of results.entries()) {
        const quoteId = record['ID'] || record['id'] || randomUUID(); // Allow 'id' or 'ID' from CSV, fallback to new UUID
        const quoteData: Partial<QuotePayload> = {
          id: quoteId,
          quoteNumber: record['QuoteNumber'] || `CSV-Q-${quoteId.slice(0,8)}`,
          quoteDate: record['QuoteDate'] ? new Date(record['QuoteDate']).toISOString() : new Date().toISOString(),
          clientId: record['ClientID'] || record['ClientId'] || record['clientId'], // Allow variations
          creatorEmail: record['CreatorEmail'] || 'csv_import@system.com',
          subTotal: parseFloat(record['SubTotal'] || 0),
          vatAmount: parseFloat(record['VATAmount'] || 0),
          grandTotal: parseFloat(record['GrandTotal'] || 0),
          currency: record['Currency'] || 'MZN',
          termsAndConditions: record['TermsAndConditions'],
          notes: record['Notes'],
          status: (record['Status'] || 'Draft') as QuotePayload['status'],
          approverId: record['ApproverID'] || record['ApproverId'] || record['approverId'] || null,
        };
        
        console.log(`[API_DEBUG] /api/quotes POST CSV: Processing record #${index + 1}: ${JSON.stringify(quoteData).substring(0,300)}...`);

        if (!quoteData.clientId) {
          const errorMsg = `Skipped record #${index + 1} (QuoteNumber: ${quoteData.quoteNumber}): ClientID is missing.`;
          console.warn(`[API_WARN] /api/quotes POST CSV: ${errorMsg}`);
          importErrors.push(errorMsg);
          continue;
        }
        
        try {
          // This example only inserts/updates the quote header. Items would need separate handling.
          await connection.execute(
            `INSERT INTO Quote (id, quoteNumber, quoteDate, clientId, creatorEmail, subTotal, vatAmount, grandTotal, currency, termsAndConditions, notes, status, approverId, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE
               quoteDate=VALUES(quoteDate), clientId=VALUES(clientId), creatorEmail=VALUES(creatorEmail), subTotal=VALUES(subTotal), vatAmount=VALUES(vatAmount), grandTotal=VALUES(grandTotal), currency=VALUES(currency), termsAndConditions=VALUES(termsAndConditions), notes=VALUES(notes), status=VALUES(status), approverId=VALUES(approverId), updatedAt=NOW()`,
            [
              quoteData.id, quoteData.quoteNumber, new Date(quoteData.quoteDate as string).toISOString().slice(0, 19).replace('T', ' '), quoteData.clientId, quoteData.creatorEmail,
              quoteData.subTotal, quoteData.vatAmount, quoteData.grandTotal, quoteData.currency,
              quoteData.termsAndConditions, quoteData.notes, quoteData.status, quoteData.approverId
            ]
          );
          successfulImports++;
          console.log(`[API_INFO] /api/quotes POST CSV: Successfully processed quote ID: ${quoteData.id}`);
        } catch (dbError: any) {
            const errorMsg = `Error importing record #${index + 1} (QuoteNumber ${quoteData.quoteNumber}): ${dbError.message}. SQL Error Code: ${dbError.code || 'N/A'}.`;
            console.error(`[API_ERROR] /api/quotes POST CSV: Database error for record: ${errorMsg}`, dbError);
            importErrors.push(errorMsg);
        }
      }
      
      await connection.commit();
      console.log('[API_INFO] /api/quotes POST CSV: Database transaction committed.');
      return NextResponse.json({ 
        message: `${successfulImports} quote header(s) processed from CSV. ${importErrors.length > 0 ? `${importErrors.length} error(s).` : ''}`,
        errors: importErrors.length > 0 ? importErrors : undefined 
      }, { status: importErrors.length > 0 && successfulImports === 0 ? 400 : 200 });

    } catch (error: any) {
      if (connection) {
        try { await connection.rollback(); console.log('[API_INFO] /api/quotes POST CSV: Database transaction rolled back due to error.'); }
        catch (rbError) { console.error('[API_ERROR] /api/quotes POST CSV: Error during transaction rollback:', rbError); }
      }
      console.error('[API_ERROR] /api/quotes POST CSV (outer try-catch):', error);
      return NextResponse.json({ error: 'Failed to handle quote CSV upload.', details: error.message }, { status: 500 });
    } finally {
      if (connection) {
        try { connection.release(); console.log('[API_INFO] /api/quotes POST CSV: Database connection released.'); }
        catch (relError) { console.error('[API_ERROR] /api/quotes POST CSV: Error releasing connection:', relError); }
      }
    }

  } else if (contentType && contentType.includes('application/json')) {
    console.log('[API_INFO] /api/quotes POST JSON: Processing application/json request.');
    let quoteDataFromForm: QuotePayload | null = null;
    try {
      quoteDataFromForm = await request.json() as QuotePayload;
      console.log(`[API_INFO] /api/quotes POST JSON: Received quote data: ${JSON.stringify(quoteDataFromForm).substring(0, 500)}...`);

      if (!quoteDataFromForm.id || !quoteDataFromForm.clientId || !quoteDataFromForm.quoteNumber) {
        console.error('[API_ERROR] /api/quotes POST JSON: Missing required fields (id, clientId, quoteNumber).');
        return NextResponse.json({ error: 'Quote ID, Client ID, and Quote Number are required.' }, { status: 400 });
      }
      
      console.log('[API_INFO] /api/quotes POST JSON: Attempting to get database connection.');
      connection = await pool.getConnection();
      console.log('[API_INFO] /api/quotes POST JSON: Database connection obtained.');
      await connection.beginTransaction();
      console.log('[API_INFO] /api/quotes POST JSON: Database transaction started.');

      await connection.execute(
        `INSERT INTO Quote (id, quoteNumber, quoteDate, clientId, creatorEmail, subTotal, vatAmount, grandTotal, currency, termsAndConditions, notes, status, approverId, approvalDate, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          quoteDataFromForm.id,
          quoteDataFromForm.quoteNumber,
          new Date(quoteDataFromForm.quoteDate).toISOString().slice(0, 19).replace('T', ' '),
          quoteDataFromForm.clientId,
          quoteDataFromForm.creatorEmail,
          quoteDataFromForm.subTotal,
          quoteDataFromForm.vatAmount,
          quoteDataFromForm.grandTotal,
          quoteDataFromForm.currency,
          quoteDataFromForm.termsAndConditions,
          quoteDataFromForm.notes,
          quoteDataFromForm.status,
          quoteDataFromForm.approverId,
          quoteDataFromForm.approvalDate ? new Date(quoteDataFromForm.approvalDate).toISOString().slice(0, 19).replace('T', ' ') : null,
        ]
      );
      console.log(`[API_INFO] /api/quotes POST JSON: Quote header inserted/updated for ID: ${quoteDataFromForm.id}.`);

      if (quoteDataFromForm.items && quoteDataFromForm.items.length > 0) {
        console.log(`[API_INFO] /api/quotes POST JSON: Processing ${quoteDataFromForm.items.length} items for quote ID: ${quoteDataFromForm.id}.`);
        for (const item of quoteDataFromForm.items) {
          await connection.execute(
            `INSERT INTO QuoteItem (id, quoteId, partNumber, customerRef, description, quantity, unitPrice)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [item.id || randomUUID(), quoteDataFromForm.id, item.partNumber, item.customerRef, item.description, item.quantity, item.unitPrice]
          );
        }
        console.log(`[API_INFO] /api/quotes POST JSON: Finished processing items for quote ID: ${quoteDataFromForm.id}.`);
      } else {
        console.log(`[API_INFO] /api/quotes POST JSON: No items to process for quote ID: ${quoteDataFromForm.id}.`);
      }

      await connection.commit();
      console.log(`[API_INFO] /api/quotes POST JSON: Database transaction committed for quote ID: ${quoteDataFromForm.id}.`);
      
      return NextResponse.json({ message: 'Quote saved successfully', quoteId: quoteDataFromForm.id, quoteNumber: quoteDataFromForm.quoteNumber }, { status: 201 });

    } catch (error: any) {
      if (connection) {
        try { await connection.rollback(); console.log('[API_INFO] /api/quotes POST JSON: Database transaction rolled back due to error.'); }
        catch (rbError) { console.error('[API_ERROR] /api/quotes POST JSON: Error during transaction rollback:', rbError); }
      }
      const quoteIdentifier = quoteDataFromForm ? `ID ${quoteDataFromForm.id} or Number ${quoteDataFromForm.quoteNumber}` : 'given details';
      console.error(`[API_ERROR] /api/quotes POST JSON (outer try-catch) for ${quoteIdentifier}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: `Quote with ${quoteIdentifier} already exists.` }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create quote.', details: error.message }, { status: 500 });
    } finally {
      if (connection) {
        try { connection.release(); console.log('[API_INFO] /api/quotes POST JSON: Database connection released.'); }
        catch (relError) { console.error('[API_ERROR] /api/quotes POST JSON: Error releasing connection:', relError); }
      }
    }
  } else {
    console.warn(`[API_WARN] /api/quotes POST: Unsupported Content-Type: ${contentType}`);
    return NextResponse.json({ error: 'Unsupported Content-Type for Quotes POST' }, { status: 415 });
  }
}

export async function GET(request: Request) {
  console.log('[API_INFO] /api/quotes GET: Request received.');
  let connection; 
  try {
    const { searchParams } = new URL(request.url);
    console.log('[API_INFO] /api/quotes GET: URL parsed successfully.');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let query = `
      SELECT 
        q.id, q.quoteNumber, q.quoteDate, q.clientId, q.creatorEmail, 
        q.subTotal, q.vatAmount, q.grandTotal, q.currency, 
        q.termsAndConditions, q.notes, q.status, q.approverId, q.approvalDate,
        c.name as clientName, c.email as clientEmail,
        app.name as approverName
      FROM Quote q
      LEFT JOIN Client c ON q.clientId = c.id
      LEFT JOIN Approver app ON q.approverId = app.id
      WHERE 1=1
    `;
    const queryParams: (string | number)[] = [];

    if (month && month !== 'all') {
      query += ' AND MONTH(q.quoteDate) = ?';
      queryParams.push(parseInt(month, 10));
    }
    if (year && year !== 'all') {
      query += ' AND YEAR(q.quoteDate) = ?';
      queryParams.push(parseInt(year, 10));
    }

    query += ' ORDER BY q.quoteDate DESC, q.quoteNumber DESC';
    
    console.log(`[API_INFO] /api/quotes GET: Query constructed. Params: ${JSON.stringify(queryParams)}. Query: ${query.substring(0, 300)}...`);
    
    console.log('[API_INFO] /api/quotes GET: Attempting to get database connection...');
    connection = await pool.getConnection();
    console.log('[API_INFO] /api/quotes GET: Database connection obtained.');

    console.log('[API_INFO] /api/quotes GET: Attempting to execute query...');
    const [rows] = await connection.execute(query, queryParams);
    console.log(`[API_INFO] /api/quotes GET: Query executed. Rows fetched: ${Array.isArray(rows) ? rows.length : 'N/A'}.`);
    
    return NextResponse.json(rows);

  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch quotes due to an unknown server error.';
    let errorDetails = '';
    let errorCode = 'UNKNOWN_ERROR';
    let errorStack = '';

    if (error instanceof Error) {
      errorMessage = `Failed to fetch quotes: ${error.name}`;
      errorDetails = error.message;
      errorStack = error.stack || 'No stack available.';
      if ((error as any).code) { errorCode = (error as any).code; }
    } else if (typeof error === 'string') {
      errorMessage = `Failed to fetch quotes: ${error}`;
      errorDetails = error;
    } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      errorMessage = `Failed to fetch quotes: Error`;
      errorDetails = error.message;
       if ('code' in error && typeof error.code === 'string') errorCode = error.code;
       if ('stack' in error && typeof error.stack === 'string') errorStack = error.stack;
    }

    console.error(`[API_ERROR] /api/quotes GET: ${errorMessage}. Details: ${errorDetails}. Code: ${errorCode}.`);
    console.error(`[API_ERROR_STACK] /api/quotes GET: ${errorStack}`);
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails, 
        code: errorCode, 
        // stack: process.env.NODE_ENV === 'development' ? errorStack : undefined // Only expose stack in dev for security
      }, 
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        console.log('[API_INFO] /api/quotes GET: Attempting to release database connection in finally block.');
        connection.release();
        console.log('[API_INFO] /api/quotes GET: Database connection released.');
      } catch (releaseError: any) {
        console.error(`[API_ERROR] /api/quotes GET: Error releasing database connection in finally block: ${releaseError.message}`);
      }
    }
    console.log('[API_INFO] /api/quotes GET: Request processing finished.');
  }
}
    
