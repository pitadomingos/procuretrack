
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { Client } from '@/types';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { randomUUID } from 'crypto'; // For generating IDs

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to run multer middleware
const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Ensure Next.js doesn't parse the body for file uploads for this route
export const config = {
  api: {
    bodyParser: false, 
  },
};

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT id, name, address, city, country, contactPerson, email, createdAt, updatedAt FROM Client ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching clients from DB:', error);
    return NextResponse.json({ error: 'Failed to fetch clients from database', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('multipart/form-data')) {
    // CSV Upload
    // @ts-ignore
    const req = request as Request & { file?: any };
    const res = new NextResponse(); 

    try {
      await runMiddleware(req, res, upload.single('file'));
      
      // @ts-ignore
      if (!req.file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      
      // @ts-ignore
      const fileBuffer = req.file.buffer;
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
          const clientId = record.ID || record.id || randomUUID(); // Allow 'ID' or 'id' from CSV or generate
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
            errors.push(`Failed to insert/update record ID ${clientId} (${clientName}): ${dbError.message}`);
          }
        }
        await connection.commit();
      } catch (transactionError: any) {
        await connection.rollback();
        console.error('Transaction error during CSV client import:', transactionError);
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
      console.error('Error handling client CSV upload:', error);
      if (error instanceof multer.MulterError) {
        return NextResponse.json({ error: `Multer error: ${error.message}` }, { status: 400 });
      }
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
      console.error('Error creating client (JSON):', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Client with this ID already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create client (JSON)', details: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
