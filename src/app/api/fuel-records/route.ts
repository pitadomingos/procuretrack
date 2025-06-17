
import { NextResponse } from 'next/server';
import type { FuelRecord } from '@/types';
import { mockFuelRecordsData, mockTagsData, mockSitesData } from '@/lib/mock-data';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Mock database for fuel records
let MOCK_FUEL_RECORDS_DB: FuelRecord[] = [...mockFuelRecordsData];

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('multipart/form-data')) {
    console.log('[API_INFO] /api/fuel-records POST: Received multipart/form-data request for CSV upload.');
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        console.error('[API_ERROR] /api/fuel-records POST CSV: No file found in formData.');
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      console.log(`[API_INFO] /api/fuel-records POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);
      let firstRecordLogged = false;

      console.log('[API_INFO] /api/fuel-records POST CSV: Starting CSV parsing...');
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header }) => header.trim() // Trim headers
          }))
          .on('headers', (headers) => {
            console.log('[API_INFO] /api/fuel-records POST CSV: Detected CSV Headers:', headers);
          })
          .on('data', (data) => {
            if (!firstRecordLogged) {
              console.log('[API_DEBUG] /api/fuel-records POST CSV: First parsed data record from CSV:', data);
              firstRecordLogged = true;
            }
            results.push(data);
          })
          .on('end', () => {
            console.log(`[API_INFO] /api/fuel-records POST CSV: CSV parsing finished. ${results.length} records found.`);
            // TODO: Here you would typically validate and process `results` into your DB
            // For now, just logging and returning success.
            resolve();
          })
          .on('error', (parseError) => {
            console.error('[API_ERROR] /api/fuel-records POST CSV: Error during CSV parsing:', parseError);
            reject(parseError);
          });
      });

      if (results.length === 0) {
        console.warn('[API_WARN] /api/fuel-records POST CSV: CSV file is empty or could not be parsed into records.');
        return NextResponse.json({ message: 'CSV file is empty or yielded no records.' }, { status: 400 });
      }
      
      return NextResponse.json({ message: `Fuel records CSV uploaded and parsed successfully. ${results.length} records found. (Data not saved to DB yet)` }, { status: 200 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/fuel-records POST CSV: Error handling fuel record CSV upload (outer try-catch):', error);
      return NextResponse.json({ error: 'Failed to handle fuel record CSV upload.', details: error.message }, { status: 500 });
    }

  } else if (contentType && contentType.includes('application/json')) {
    console.log('[API_INFO] /api/fuel-records POST: Received application/json request.');
    try {
      const fuelData = await request.json() as Omit<FuelRecord, 'id' | 'totalCost' | 'tagName' | 'siteName' | 'distanceTravelled'>;

      const newFuelRecordId = `MOCK-FUELID-${Date.now()}`;
      const newFuelRecord: FuelRecord = {
        ...fuelData,
        id: newFuelRecordId,
        totalCost: (fuelData.quantity || 0) * (fuelData.unitCost || 0),
        tagName: mockTagsData.find(t => t.id === fuelData.tagId)?.tagNumber || 'N/A',
        siteName: mockSitesData.find(s => s.id === fuelData.siteId)?.siteCode || 'N/A',
        distanceTravelled: null,
      };
      MOCK_FUEL_RECORDS_DB.push(newFuelRecord);
      MOCK_FUEL_RECORDS_DB.sort((a, b) => new Date(b.fuelDate).getTime() - new Date(a.fuelDate).getTime());

      console.log('Mocked saving fuel record (JSON):', newFuelRecord);
      return NextResponse.json({ message: 'Fuel record saved successfully (simulated)', fuelRecordId: newFuelRecordId }, { status: 201 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/fuel-records POST JSON: Error creating fuel record:', error);
      return NextResponse.json({ error: 'Failed to create fuel record.', details: error.message }, { status: 500 });
    }
  } else {
    console.warn(`[API_WARN] /api/fuel-records POST: Unsupported Content-Type: ${contentType}`);
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

  let filteredRecords = [...MOCK_FUEL_RECORDS_DB];

  if (month && month !== 'all') {
    filteredRecords = filteredRecords.filter(rec => {
      const recMonth = new Date(rec.fuelDate).getMonth() + 1;
      return recMonth.toString().padStart(2, '0') === month;
    });
  }
  if (year && year !== 'all') {
    filteredRecords = filteredRecords.filter(rec => {
      const recYear = new Date(rec.fuelDate).getFullYear();
      return recYear.toString() === year;
    });
  }
  if (siteIdParam && siteIdParam !== 'all') {
    filteredRecords = filteredRecords.filter(rec => rec.siteId?.toString() === siteIdParam);
  }
  if (tagIdParam && tagIdParam !== 'all') {
    filteredRecords = filteredRecords.filter(rec => rec.tagId === tagIdParam);
  }
  if (driver && driver.trim() !== '') {
    filteredRecords = filteredRecords.filter(rec => rec.driver?.toLowerCase().includes(driver.toLowerCase()));
  }

  const recordsByTag: { [key: string]: FuelRecord[] } = {};
  filteredRecords.forEach(rec => {
    if (!recordsByTag[rec.tagId]) {
      recordsByTag[rec.tagId] = [];
    }
    recordsByTag[rec.tagId].push(rec);
  });

  const recordsWithDistance: FuelRecord[] = [];
  for (const tagId in recordsByTag) {
    const tagRecords = recordsByTag[tagId].sort((a, b) => {
      const dateDiff = new Date(a.fuelDate).getTime() - new Date(b.fuelDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return (a.odometer || 0) - (b.odometer || 0);
    });

    for (let i = 0; i < tagRecords.length; i++) {
      const currentRecord = { ...tagRecords[i] };
      if (i > 0 && currentRecord.odometer && tagRecords[i-1].odometer) {
        currentRecord.distanceTravelled = currentRecord.odometer - tagRecords[i-1].odometer!;
      } else {
        currentRecord.distanceTravelled = null;
      }
      currentRecord.tagName = mockTagsData.find(t => t.id === currentRecord.tagId)?.tagNumber || currentRecord.tagId || 'N/A';
      currentRecord.siteName = mockSitesData.find(s => s.id === currentRecord.siteId)?.siteCode || (currentRecord.siteId ? `Site ID ${currentRecord.siteId}` : 'N/A'); // Use siteCode
      recordsWithDistance.push(currentRecord);
    }
  }

  recordsWithDistance.sort((a, b) => new Date(b.fuelDate).getTime() - new Date(a.fuelDate).getTime());

  try {
    return NextResponse.json(recordsWithDistance);
  } catch (error) {
    console.error('Error fetching fuel records (mock):', error);
    return NextResponse.json({ error: 'Failed to fetch fuel records' }, { status: 500 });
  }
}
