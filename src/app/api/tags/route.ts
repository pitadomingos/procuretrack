
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../backend/db.js';
import type { Tag, Site, TagStatus } from '@/types';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

const tagStatuses: TagStatus[] = ['Active', 'Inactive', 'Under Maintenance', 'Sold', 'Decommissioned'];

export async function GET() {
  try {
    const pool = await getDbPool();
    const query = `
      SELECT 
        t.id, t.tagNumber, t.registration, t.make, t.model, 
        t.tankCapacity, t.year, t.chassisNo, t.type, t.siteId,
        t.status, 
        t.createdAt, t.updatedAt, 
        s.siteCode AS siteName 
      FROM Tag t
      LEFT JOIN Site s ON t.siteId = s.id
      ORDER BY t.tagNumber ASC;
    `;
    const [rows] = await pool.execute(query);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');
  const pool = await getDbPool();

  if (contentType && contentType.includes('multipart/form-data')) {
    console.log('[API_INFO] /api/tags POST: Received multipart/form-data request for CSV upload.');
    let connection;
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        console.error('[API_ERROR] /api/tags POST CSV: No file found in formData.');
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      console.log(`[API_INFO] /api/tags POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);
      let firstRecordLogged = false;

      console.log('[API_INFO] /api/tags POST CSV: Starting CSV parsing...');
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header }) => header.trim().toLowerCase() // Trim and lowercase headers for consistency
          }))
          .on('headers', (headers) => {
            console.log('[API_INFO] /api/tags POST CSV: Detected CSV Headers (lowercased):', headers);
          })
          .on('data', (data) => {
            if (!firstRecordLogged) {
              console.log('[API_DEBUG] /api/tags POST CSV: First parsed data record from CSV:', data);
              firstRecordLogged = true;
            }
            results.push(data);
          })
          .on('end', () => {
            console.log(`[API_INFO] /api/tags POST CSV: CSV parsing finished. ${results.length} records found.`);
            resolve();
          })
          .on('error', (parseError) => {
            console.error('[API_ERROR] /api/tags POST CSV: Error during CSV parsing:', parseError);
            reject(parseError);
          });
      });

      if (results.length === 0) {
        console.warn('[API_WARN] /api/tags POST CSV: CSV file is empty or could not be parsed into records.');
        return NextResponse.json({ message: 'CSV file is empty or yielded no records.' }, { status: 400 });
      }

      connection = await pool.getConnection();
      console.log('[API_INFO] /api/tags POST CSV: Database connection obtained for batch insert/update.');
      await connection.beginTransaction();
      console.log('[API_INFO] /api/tags POST CSV: Started database transaction.');

      let successfulImports = 0;
      let failedImports = 0;
      const importErrors: string[] = [];

      for (const [index, record] of results.entries()) {
        // Consistent header access (all lowercase due to mapHeaders)
        const tagId = record.id || record.tagid || randomUUID(); // Use provided ID or generate new one
        const tagNumber = record.tagnumber || record['tag number'];

        if (!tagNumber) {
          failedImports++;
          const errorMsg = `Skipped record #${index + 1} (ID: ${tagId}): Tag Number is required. Record data: ${JSON.stringify(record)}`;
          console.warn(`[API_WARN] /api/tags POST CSV: ${errorMsg}`);
          importErrors.push(errorMsg);
          continue;
        }

        const registration = record.registration || null;
        const make = record.make || null;
        const model = record.model || null;
        const tankCapacity = record.tankcapacity || record['tank capacity'] ? parseInt(record.tankcapacity || record['tank capacity'], 10) : null;
        const year = record.year ? parseInt(record.year, 10) : null;
        const chassisNo = record.chassisno || record['chassis no.'] || null;
        const type = record.type || null;
        const siteId = record.siteid || record['site id'] ? parseInt(record.siteid || record['site id'], 10) : null;
        
        let status = (record.status || 'Active') as TagStatus;
        if (!tagStatuses.includes(status)) {
            console.warn(`[API_WARN] /api/tags POST CSV: Invalid status "${status}" for Tag ID ${tagId}. Defaulting to 'Active'.`);
            status = 'Active';
        }

        console.log(`[API_DEBUG] /api/tags POST CSV: Processing record #${index + 1}: ID=${tagId}, TagNumber=${tagNumber}, Status=${status}`);

        try {
          const query = `
            INSERT INTO Tag (id, tagNumber, registration, make, model, tankCapacity, year, chassisNo, type, status, siteId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
              tagNumber = VALUES(tagNumber), registration = VALUES(registration), make = VALUES(make), model = VALUES(model),
              tankCapacity = VALUES(tankCapacity), year = VALUES(year), chassisNo = VALUES(chassisNo), type = VALUES(type),
              status = VALUES(status), siteId = VALUES(siteId), updatedAt = NOW();
          `;
          await connection.execute(query, [
            tagId, tagNumber, registration, make, model, 
            isNaN(tankCapacity as any) ? null : tankCapacity, 
            isNaN(year as any) ? null : year, 
            chassisNo, type, status, 
            isNaN(siteId as any) ? null : siteId
          ]);
          successfulImports++;
        } catch (dbError: any) {
          failedImports++;
          const errorMsg = `Failed to process record #${index + 1} (ID ${tagId}, TagNumber: ${tagNumber}): ${dbError.message}. SQL Error Code: ${dbError.code || 'N/A'}.`;
          console.error(`[API_ERROR] /api/tags POST CSV: Database error for record: ${errorMsg}`, dbError);
          importErrors.push(errorMsg);
        }
      }

      await connection.commit();
      console.log('[API_INFO] /api/tags POST CSV: Database transaction committed.');
      
      let message = `${successfulImports} tag(s) processed successfully from CSV.`;
      if (failedImports > 0) {
        message += ` ${failedImports} tag(s) failed.`;
      }
      console.log(`[API_INFO] /api/tags POST CSV: Final processing result - ${message}`);
      if (importErrors.length > 0) {
        console.warn('[API_WARN] /api/tags POST CSV: Errors encountered during processing:', importErrors);
      }

      return NextResponse.json({ 
        message, 
        processed: successfulImports,
        failed: failedImports,
        errors: importErrors.length > 0 ? importErrors : undefined 
      }, { status: importErrors.length > 0 && successfulImports === 0 ? 400 : 200 });


    } catch (error: any) {
      if (connection) {
        try { await connection.rollback(); console.log('[API_INFO] /api/tags POST CSV: Database transaction rolled back due to error.'); }
        catch (rbError) { console.error('[API_ERROR] /api/tags POST CSV: Error during transaction rollback:', rbError); }
      }
      console.error('[API_ERROR] /api/tags POST CSV (outer try-catch):', error);
      return NextResponse.json({ error: 'Failed to handle tag CSV upload.', details: error.message }, { status: 500 });
    } finally {
      if (connection) {
        try { connection.release(); console.log('[API_INFO] /api/tags POST CSV: Database connection released.'); }
        catch (relError) { console.error('[API_ERROR] /api/tags POST CSV: Error releasing connection:', relError); }
      }
    }

  } else if (contentType && contentType.includes('application/json')) {
    console.log('[API_INFO] /api/tags POST: Received application/json request.');
    try {
      const tagData = await request.json() as Omit<Tag, 'createdAt' | 'updatedAt' | 'siteName'>;

      if (!tagData.id || !tagData.tagNumber) {
        return NextResponse.json({ error: 'Tag ID and Tag Number are required.' }, { status: 400 });
      }
      
      let status = tagData.status || 'Active';
      if (!tagStatuses.includes(status)) {
          console.warn(`[API_WARN] /api/tags POST JSON: Invalid status "${status}" for Tag ID ${tagData.id}. Defaulting to 'Active'.`);
          status = 'Active';
      }

      const query = `
        INSERT INTO Tag (id, tagNumber, registration, make, model, tankCapacity, year, chassisNo, type, siteId, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(query, [
        tagData.id,
        tagData.tagNumber,
        tagData.registration || null,
        tagData.make || null,
        tagData.model || null,
        tagData.tankCapacity ? Number(tagData.tankCapacity) : null,
        tagData.year ? Number(tagData.year) : null,
        tagData.chassisNo || null,
        tagData.type || null,
        tagData.siteId ? Number(tagData.siteId) : null,
        status,
      ]);

      const [newTagRows]: any[] = await pool.execute('SELECT t.*, s.siteCode as siteName FROM Tag t LEFT JOIN Site s ON t.siteId = s.id WHERE t.id = ?', [tagData.id]);
      if (newTagRows.length === 0) {
          return NextResponse.json({ error: 'Tag created but failed to retrieve.' }, { status: 500 });
      }
      return NextResponse.json(newTagRows[0], { status: 201 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/tags POST JSON: Error creating tag:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'Tag with this ID or Tag Number already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create tag (JSON)', details: error.message }, { status: 500 });
    }
  } else {
    console.warn(`[API_WARN] /api/tags POST: Unsupported Content-Type: ${contentType}`);
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}
