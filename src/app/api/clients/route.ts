
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { Client } from '@/types';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { randomUUID } from 'crypto'; // For generating IDs

// Multer and related config are no longer needed with request.formData()

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT id, name, address, city, country, contactPerson, email, createdAt, updatedAt FROM Client ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('[API_ERROR] /api/clients GET: Error fetching clients from DB:', error);
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
    // CSV Upload using request.formData()
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);

      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header }) => header.trim() // Trim headers
          }))
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      if (results.length === 0) {
        return NextResponse.json({ message: 'CSV file is empty or could not be parsed.' }, { status: 400 });
      }

      let successfulInserts = 0;
      let failedInserts = 0;
      const errors: string[] = [];
      
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        for (const record of results) {
          const clientId = record.ID || record.id || randomUUID(); 
          const clientName = record.Name || record.name;
          const clientAddress = record.Address || record.address || null;
          const clientCity = record.City || record.city || null;
          const clientCountry = record.Country || record.country || null;
          const clientContactPerson = record['Contact Person'] || record.contactPerson || record.Contact || null;
          const clientEmail = record['Contact Email'] || record.contactEmail || record.Email || null;

          if (!clientName) {
            failedInserts++;
            errors.push(`Skipped record: Name is required. Record: ${JSON.stringify(record)}`);
            continue;
          }

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
          } catch (dbError: any) {
            failedInserts++;
            errors.push(`Failed to insert/update record ID ${clientId} (${clientName || 'N/A'}): ${dbError.message}`);
          }
        }
        await connection.commit();
      } catch (transactionError: any) {
        await connection.rollback();
        console.error('[API_ERROR] /api/clients POST CSV: Transaction error during client import:', transactionError);
        return NextResponse.json({ error: 'Transaction failed during CSV import.', details: transactionError.message, errors }, { status: 500 });
      } finally {
        connection.release();
      }

      let message = `${successfulInserts} client(s) processed successfully.`;
      if (failedInserts > 0) {
        message += ` ${failedInserts} client(s) failed.`;
      }
      
      return NextResponse.json({ message, errors: errors.length > 0 ? errors : undefined }, { status: errors.length > 0 && successfulInserts === 0 ? 400 : 200 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/clients POST CSV: Error handling client CSV upload:', error);
      return NextResponse.json({ error: 'Failed to handle client CSV upload.', details: error.message }, { status: 500 });
    }

  } else if (contentType && contentType.includes('application/json')) {
    // JSON Payload for single client creation
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
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
