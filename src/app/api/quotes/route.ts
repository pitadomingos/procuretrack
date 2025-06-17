
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { QuotePayload, QuoteItem, Client } from '@/types';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');
  let connection;

  if (contentType && contentType.includes('multipart/form-data')) {
    console.log('[API_INFO] /api/quotes POST: Received multipart/form-data request for CSV upload.');
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded for quotes' }, { status: 400 });
      }
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);

      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
          .on('headers', (headers) => console.log('[API_INFO] /api/quotes POST CSV: Detected CSV Headers:', headers))
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      if (results.length === 0) {
        return NextResponse.json({ message: 'CSV file is empty or yielded no records for quotes.' }, { status: 400 });
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

      let successfulImports = 0;
      const importErrors: string[] = [];

      for (const record of results) {
        const quoteId = record['ID'] || randomUUID();
        const quoteData: Partial<QuotePayload> = {
          id: quoteId,
          quoteNumber: record['QuoteNumber'] || `CSV-Q-${quoteId.slice(0,8)}`,
          quoteDate: record['QuoteDate'] ? new Date(record['QuoteDate']).toISOString() : new Date().toISOString(),
          clientId: record['ClientID'],
          creatorEmail: record['CreatorEmail'] || 'csv_import@system.com',
          subTotal: parseFloat(record['SubTotal'] || 0),
          vatAmount: parseFloat(record['VATAmount'] || 0),
          grandTotal: parseFloat(record['GrandTotal'] || 0),
          currency: record['Currency'] || 'MZN',
          termsAndConditions: record['TermsAndConditions'],
          notes: record['Notes'],
          status: (record['Status'] || 'Draft') as QuotePayload['status'],
          approverId: record['ApproverID'] || null,
        };

        if (!quoteData.clientId) {
          importErrors.push(`Skipped Quote ${quoteData.quoteNumber}: ClientID is missing.`);
          continue;
        }
        
        try {
          await connection.execute(
            `INSERT INTO Quote (id, quoteNumber, quoteDate, clientId, creatorEmail, subTotal, vatAmount, grandTotal, currency, termsAndConditions, notes, status, approverId, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE
               quoteDate=VALUES(quoteDate), clientId=VALUES(clientId), creatorEmail=VALUES(creatorEmail), subTotal=VALUES(subTotal), vatAmount=VALUES(vatAmount), grandTotal=VALUES(grandTotal), currency=VALUES(currency), termsAndConditions=VALUES(termsAndConditions), notes=VALUES(notes), status=VALUES(status), approverId=VALUES(approverId), updatedAt=NOW()`,
            [
              quoteData.id, quoteData.quoteNumber, quoteData.quoteDate, quoteData.clientId, quoteData.creatorEmail,
              quoteData.subTotal, quoteData.vatAmount, quoteData.grandTotal, quoteData.currency,
              quoteData.termsAndConditions, quoteData.notes, quoteData.status, quoteData.approverId
            ]
          );
          successfulImports++;
        } catch (dbError: any) {
            importErrors.push(`Error importing Quote ${quoteData.quoteNumber}: ${dbError.message}`);
        }
      }
      
      await connection.commit();
      return NextResponse.json({ 
        message: `${successfulImports} quote header(s) processed from CSV. ${importErrors.length} errors.`,
        errors: importErrors.length > 0 ? importErrors : undefined 
      }, { status: importErrors.length > 0 && successfulImports === 0 ? 400 : 200 });

    } catch (error: any) {
      if (connection) await connection.rollback();
      console.error('[API_ERROR] /api/quotes POST CSV:', error);
      return NextResponse.json({ error: 'Failed to handle quote CSV upload.', details: error.message }, { status: 500 });
    } finally {
      if (connection) connection.release();
    }

  } else if (contentType && contentType.includes('application/json')) {
    let quoteDataFromForm: QuotePayload | null = null; // To store data for potential error logging
    try {
      quoteDataFromForm = await request.json() as QuotePayload;
      console.log('[API_INFO] /api/quotes POST JSON: Received quote data:', JSON.stringify(quoteDataFromForm).substring(0, 500));

      if (!quoteDataFromForm.id || !quoteDataFromForm.clientId || !quoteDataFromForm.quoteNumber) {
        return NextResponse.json({ error: 'Quote ID, Client ID, and Quote Number are required.' }, { status: 400 });
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

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

      if (quoteDataFromForm.items && quoteDataFromForm.items.length > 0) {
        for (const item of quoteDataFromForm.items) {
          await connection.execute(
            `INSERT INTO QuoteItem (id, quoteId, partNumber, customerRef, description, quantity, unitPrice)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [item.id, quoteDataFromForm.id, item.partNumber, item.customerRef, item.description, item.quantity, item.unitPrice]
          );
        }
      }

      await connection.commit();
      console.log(`[API_INFO] /api/quotes POST JSON: Quote ${quoteDataFromForm.quoteNumber} (ID: ${quoteDataFromForm.id}) saved successfully.`);
      return NextResponse.json({ message: 'Quote saved successfully', quoteId: quoteDataFromForm.id, quoteNumber: quoteDataFromForm.quoteNumber }, { status: 201 });

    } catch (error: any) {
      if (connection) await connection.rollback();
      console.error('[API_ERROR] /api/quotes POST JSON:', error);
      const quoteIdentifier = quoteDataFromForm ? `ID ${quoteDataFromForm.id} or Number ${quoteDataFromForm.quoteNumber}` : 'given details';
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: `Quote with ${quoteIdentifier} already exists.` }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create quote.', details: error.message }, { status: 500 });
    } finally {
      if (connection) connection.release();
    }
  } else {
    return NextResponse.json({ error: 'Unsupported Content-Type for Quotes POST' }, { status: 415 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  // Add other filters as needed, e.g., status, clientId

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
  // Add more filter conditions here based on other params

  query += ' ORDER BY q.quoteDate DESC, q.quoteNumber DESC';

  try {
    const [rows] = await pool.execute(query, queryParams);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('[API_ERROR] /api/quotes GET:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes', details: error.message }, { status: 500 });
  }
}
    
