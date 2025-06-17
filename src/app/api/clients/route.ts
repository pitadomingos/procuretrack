
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { Client } from '@/types';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

export async function GET() {
  console.log('[API_INFO] /api/clients GET: Received request to fetch clients.');
  try {
    const [rows] = await pool.execute('SELECT id, name, address, city, country, contactPerson, email, createdAt, updatedAt FROM Client ORDER BY name ASC');
    console.log(`[API_INFO] /api/clients GET: Successfully fetched ${Array.isArray(rows) ? rows.length : 0} clients from DB.`);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('[API_ERROR] /api/clients GET: Error fetching clients from DB:', error);
    // Log more detailed error information if available
    console.error('[API_ERROR_DETAILS] /api/clients GET: Error message:', error.message);
    console.error('[API_ERROR_DETAILS] /api/clients GET: Error name:', error.name);
    console.error('[API_ERROR_DETAILS] /api/clients GET: Error code (if DB error):', error.code);
    console.error('[API_ERROR_DETAILS] /api/clients GET: Error stack:', error.stack);
    return NextResponse.json(
        { 
            error: 'Failed to fetch clients from database. Please check server logs for more details.', 
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error.'
        }, 
        { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('multipart/form-data')) {
    console.log('[API_INFO] /api/clients POST: Received multipart/form-data request for CSV upload.');
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        console.error('[API_ERROR] /api/clients POST CSV: No file found in formData.');
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      console.log(`[API_INFO] /api/clients POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);
      let firstRecordLogged = false;

      console.log('[API_INFO] /api/clients POST CSV: Starting CSV parsing...');
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header, index }) => {
              const trimmedHeader = header.trim();
              console.log(`[API_DEBUG] /api/clients POST CSV: Mapped CSV header at index ${index}: '${header}' to '${trimmedHeader}'`);
              return trimmedHeader;
            }
          }))
          .on('headers', (headers) => {
            console.log('[API_INFO] /api/clients POST CSV: Detected CSV Headers:', headers);
          })
          .on('data', (data) => {
            if (!firstRecordLogged) {
              console.log('[API_DEBUG] /api/clients POST CSV: First parsed data record from CSV:', data);
              firstRecordLogged = true;
            }
            results.push(data);
          })
          .on('end', () => {
            console.log(`[API_INFO] /api/clients POST CSV: CSV parsing finished. ${results.length} records found.`);
            resolve();
          })
          .on('error', (parseError) => {
            console.error('[API_ERROR] /api/clients POST CSV: Error during CSV parsing:', parseError);
            reject(parseError);
          });
      });

      if (results.length === 0) {
        console.warn('[API_WARN] /api/clients POST CSV: CSV file is empty or could not be parsed into records.');
        return NextResponse.json({ message: 'CSV file is empty or yielded no records.' }, { status: 400 });
      }

      let successfulInserts = 0;
      let failedInserts = 0;
      const errors: string[] = [];
      
      const connection = await pool.getConnection();
      console.log('[API_INFO] /api/clients POST CSV: Database connection obtained for batch insert/update.');
      try {
        await connection.beginTransaction();
        console.log('[API_INFO] /api/clients POST CSV: Started database transaction.');

        for (const [index, record] of results.entries()) {
          // Consistent header access, case-insensitive for common variations
          const clientId = record.ID || record.id || record.Id || randomUUID(); 
          const clientName = record.Name || record.name;
          const clientAddress = record.Address || record.address || null;
          const clientCity = record.City || record.city || null;
          const clientCountry = record.Country || record.country || null;
          const clientContactPerson = record['Contact Person'] || record.contactPerson || record.Contact || null;
          const clientEmail = record['Contact Email'] || record.contactEmail || record.Email || null;

          if (!clientName) {
            failedInserts++;
            const errorMsg = `Skipped record #${index + 1} (potential ID: ${clientId}): Name is required. Record data: ${JSON.stringify(record)}`;
            console.warn(`[API_WARN] /api/clients POST CSV: ${errorMsg}`);
            errors.push(errorMsg);
            continue;
          }

          console.log(`[API_DEBUG] /api/clients POST CSV: Processing record #${index + 1}: ID=${clientId}, Name=${clientName}, Address=${clientAddress}, City=${clientCity}, Country=${clientCountry}, ContactPerson=${clientContactPerson}, Email=${clientEmail}`);

          try {
            const query = `
              INSERT INTO Client (id, name, address, city, country, contactPerson, email, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
              ON DUPLICATE KEY UPDATE 
                name = VALUES(name), 
                address = VALUES(address), 
                city = VALUES(city), 
                country = VALUES(country), 
                contactPerson = VALUES(contactPerson), 
                email = VALUES(email), 
                updatedAt = NOW();
            `;
            await connection.execute(query, [
              clientId, clientName, clientAddress, clientCity, clientCountry, clientContactPerson, clientEmail
            ]);
            successfulInserts++;
            console.log(`[API_INFO] /api/clients POST CSV: Successfully processed client ID: ${clientId}`);
          } catch (dbError: any) {
            failedInserts++;
            const errorMsg = `Failed to insert/update record #${index + 1} (ID ${clientId}, Name: ${clientName || 'N/A'}): ${dbError.message}. SQL Error Code: ${dbError.code || 'N/A'}.`;
            console.error(`[API_ERROR] /api/clients POST CSV: Database error for record: ${errorMsg}`, dbError);
            errors.push(errorMsg);
          }
        }
        await connection.commit();
        console.log('[API_INFO] /api/clients POST CSV: Database transaction committed.');
      } catch (transactionError: any) {
        await connection.rollback();
        console.error('[API_ERROR] /api/clients POST CSV: Transaction error during client import:', transactionError);
        return NextResponse.json({ error: 'Transaction failed during CSV import.', details: transactionError.message, errors }, { status: 500 });
      } finally {
        connection.release();
        console.log('[API_INFO] /api/clients POST CSV: Database connection released.');
      }

      let message = `${successfulInserts} client(s) processed successfully.`;
      if (failedInserts > 0) {
        message += ` ${failedInserts} client(s) failed.`;
      }
      
      console.log(`[API_INFO] /api/clients POST CSV: Final processing result - ${message}`);
      if (errors.length > 0) {
        console.warn('[API_WARN] /api/clients POST CSV: Errors encountered during processing:', errors);
      }
      
      return NextResponse.json({ message, errors: errors.length > 0 ? errors : undefined }, { status: errors.length > 0 && successfulInserts === 0 ? 400 : 200 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/clients POST CSV: Error handling client CSV upload (outer try-catch):', error);
      return NextResponse.json({ error: 'Failed to handle client CSV upload.', details: error.message }, { status: 500 });
    }

  } else if (contentType && contentType.includes('application/json')) {
    console.log('[API_INFO] /api/clients POST: Received application/json request.');
    try {
      const clientData = await request.json() as Omit<Client, 'createdAt' | 'updatedAt'>;

      if (!clientData.id || !clientData.name) {
        return NextResponse.json({ error: 'Client ID and Name are required.' }, { status: 400 });
      }

      const query = `
        INSERT INTO Client (id, name, address, city, country, contactPerson, email, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(query, [
        clientData.id,
        clientData.name,
        clientData.address || null,
        clientData.city || null,
        clientData.country || null,
        clientData.contactPerson || null,
        clientData.email || null,
      ]);

      const [newClientRows]: any[] = await pool.execute(
        'SELECT id, name, address, city, country, contactPerson, email, createdAt, updatedAt FROM Client WHERE id = ?', 
        [clientData.id]
      );
      if (newClientRows.length === 0) {
          return NextResponse.json({ error: 'Client created but failed to retrieve.' }, { status: 500 });
      }
      return NextResponse.json(newClientRows[0], { status: 201 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/clients POST JSON: Error creating client:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Client with this ID already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create client (JSON)', details: error.message }, { status: 500 });
    }
  } else {
    console.warn(`[API_WARN] /api/clients POST: Unsupported Content-Type: ${contentType}`);
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}

    
