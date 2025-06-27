
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../backend/db.js';
import type { FuelRecord, Tag, Site } from '@/types';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');
  let connection;
  const pool = await getDbPool();

  if (contentType && contentType.includes('multipart/form-data')) {
    console.log('[API_INFO] /api/fuel-records POST: Received multipart/form-data for CSV upload.');
    try {
        connection = await pool.getConnection();
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const results: any[] = [];
        const stream = Readable.from(fileBuffer);

        await new Promise<void>((resolve, reject) => {
            stream.pipe(csv({ mapHeaders: ({ header }) => header.trim().toLowerCase() }))
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        if (results.length === 0) return NextResponse.json({ message: 'CSV file is empty.' }, { status: 400 });

        const [tags]: any[] = await connection.execute('SELECT id, tagNumber FROM Tag');
        const [sites]: any[] = await connection.execute('SELECT id, siteCode FROM Site');
        const tagMap = new Map(tags.map((t: Tag) => [t.tagNumber.toLowerCase(), t.id]));
        const siteMap = new Map(sites.map((s: Site) => [s.siteCode?.toLowerCase(), s.id]));

        await connection.beginTransaction();
        let successfulImports = 0;
        let failedImports = 0;
        const errors: string[] = [];

        for (const [index, record] of results.entries()) {
            const tagNumber = record.tagnumber || record['tag number'];
            const siteCode = record.sitecode || record['site code'];
            const fuelDate = record.fueldate || record.date;
            const quantity = record.quantity ? parseFloat(record.quantity) : null;
            const unitCost = record.unitcost || record['unit cost'] ? parseFloat(record.unitcost || record['unit cost']) : null;
            
            if (!tagNumber || !fuelDate || !quantity || !unitCost) {
                failedImports++;
                errors.push(`Skipped row ${index + 2}: Missing required fields (TagNumber, FuelDate, Quantity, UnitCost).`);
                continue;
            }

            const tagId = tagMap.get(tagNumber.toLowerCase());
            const siteId = siteCode ? siteMap.get(siteCode.toLowerCase()) : null;
            if (!tagId) {
                 failedImports++;
                 errors.push(`Skipped row ${index + 2}: TagNumber "${tagNumber}" not found in database.`);
                 continue;
            }

            const recordId = record.id || randomUUID();
            try {
                const query = `
                    INSERT INTO FuelRecord (id, fuelDate, reqNo, invNo, driver, odometer, tagId, siteId, description, uom, quantity, unitCost, recorderUserId, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                    ON DUPLICATE KEY UPDATE 
                        fuelDate=VALUES(fuelDate), reqNo=VALUES(reqNo), invNo=VALUES(invNo), driver=VALUES(driver), odometer=VALUES(odometer), tagId=VALUES(tagId), siteId=VALUES(siteId), 
                        description=VALUES(description), uom=VALUES(uom), quantity=VALUES(quantity), unitCost=VALUES(unitCost), recorderUserId=VALUES(recorderUserId), updatedAt=NOW()`;
                
                await connection.execute(query, [
                    recordId, new Date(fuelDate).toISOString().slice(0, 19).replace('T', ' '),
                    record.reqno || null, record.invno || null, record.driver || null,
                    record.odometer ? parseInt(record.odometer, 10) : null,
                    tagId, siteId, record.description || null, record.uom || 'Liters',
                    quantity, unitCost, record.recorderuserid || 'CSV_IMPORT'
                ]);
                successfulImports++;
            } catch (dbError: any) {
                failedImports++;
                errors.push(`Row ${index + 2} (ID ${recordId}): DB Error - ${dbError.message}`);
            }
        }

        await connection.commit();
        let message = `${successfulImports} record(s) processed. ${failedImports} failed.`;
        return NextResponse.json({ message, errors: errors.length > 0 ? errors : undefined }, { status: failedImports > 0 ? 207 : 200 });

    } catch (error: any) {
        if (connection) await connection.rollback();
        return NextResponse.json({ error: 'Failed to handle fuel record CSV upload.', details: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
  } else if (contentType && contentType.includes('application/json')) {
    try {
      const fuelData = await request.json() as Omit<FuelRecord, 'id' | 'tagName' | 'siteName' | 'totalCost' | 'distanceTravelled'>;
      const recordId = randomUUID();

      const query = `
        INSERT INTO FuelRecord (id, fuelDate, reqNo, invNo, driver, odometer, tagId, siteId, description, uom, quantity, unitCost, recorderUserId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(query, [
        recordId,
        new Date(fuelData.fuelDate).toISOString().slice(0, 19).replace('T', ' '),
        fuelData.reqNo || null, fuelData.invNo || null, fuelData.driver || null,
        fuelData.odometer ? Number(fuelData.odometer) : null,
        fuelData.tagId,
        fuelData.siteId ? Number(fuelData.siteId) : null,
        fuelData.description || 'Diesel',
        fuelData.uom || 'Liters',
        Number(fuelData.quantity),
        Number(fuelData.unitCost),
        fuelData.recorderUserId || null,
      ]);
      return NextResponse.json({ message: 'Fuel record saved successfully.', fuelRecordId: recordId }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: 'Failed to create fuel record.', details: error.message, code: error.code }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const siteIdParam = searchParams.get('siteId');
  const tagIdParam = searchParams.get('tagId');
  const driver = searchParams.get('driver');

  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();

    let query = `
      SELECT 
        fr.id, fr.fuelDate, fr.reqNo, fr.invNo, fr.driver, fr.odometer, fr.tagId, 
        fr.siteId, fr.description, fr.uom, fr.quantity, fr.unitCost,
        t.tagNumber as tagName, s.siteCode as siteName
      FROM FuelRecord fr
      JOIN Tag t ON fr.tagId = t.id
      LEFT JOIN Site s ON fr.siteId = s.id
      WHERE 1=1
    `;
    const queryParams: (string | number)[] = [];

    if (month && month !== 'all') { query += ' AND MONTH(fr.fuelDate) = ?'; queryParams.push(parseInt(month, 10)); }
    if (year && year !== 'all') { query += ' AND YEAR(fr.fuelDate) = ?'; queryParams.push(parseInt(year, 10)); }
    if (siteIdParam && siteIdParam !== 'all') { query += ' AND fr.siteId = ?'; queryParams.push(parseInt(siteIdParam, 10)); }
    if (tagIdParam && tagIdParam !== 'all') { query += ' AND fr.tagId = ?'; queryParams.push(tagIdParam); }
    if (driver && driver.trim() !== '') { query += ' AND fr.driver LIKE ?'; queryParams.push(`%${driver.trim()}%`); }

    query += ' ORDER BY fr.tagId, fr.fuelDate ASC, fr.odometer ASC';
    
    const [rows]: any[] = await connection.execute(query, queryParams);

    const recordsByTag: { [key: string]: any[] } = {};
    rows.forEach(rec => {
      if (!recordsByTag[rec.tagId]) {
        recordsByTag[rec.tagId] = [];
      }
      recordsByTag[rec.tagId].push(rec);
    });

    const recordsWithDistance: FuelRecord[] = [];
    for (const tagId in recordsByTag) {
      const tagRecords = recordsByTag[tagId]; // Already sorted by date/odometer
      for (let i = 0; i < tagRecords.length; i++) {
        const currentRecord = tagRecords[i];
        let distanceTravelled: number | null = null;
        if (i > 0 && currentRecord.odometer && tagRecords[i-1].odometer) {
          distanceTravelled = currentRecord.odometer - tagRecords[i-1].odometer;
        }
        recordsWithDistance.push({
          ...currentRecord,
          quantity: parseFloat(currentRecord.quantity),
          unitCost: parseFloat(currentRecord.unitCost),
          totalCost: parseFloat(currentRecord.quantity) * parseFloat(currentRecord.unitCost),
          distanceTravelled: distanceTravelled,
        });
      }
    }

    recordsWithDistance.sort((a, b) => new Date(b.fuelDate).getTime() - new Date(a.fuelDate).getTime());

    return NextResponse.json(recordsWithDistance);

  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch fuel records', details: error.message, code: error.code }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
