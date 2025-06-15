
import { NextResponse } from 'next/server';
import type { FuelRecord } from '@/types';
import { mockFuelRecordsData, mockTagsData, mockSitesData } from '@/lib/mock-data'; // Using mock data

// Mock database for fuel records
let MOCK_FUEL_RECORDS_DB: FuelRecord[] = [...mockFuelRecordsData];

export async function POST(request: Request) {
  try {
    const fuelData = await request.json() as Omit<FuelRecord, 'id' | 'totalCost' | 'tagName' | 'siteName' | 'distanceTravelled'>;

    const newFuelRecordId = `MOCK-FUELID-${Date.now()}`;
    const newFuelRecord: FuelRecord = {
      ...fuelData,
      id: newFuelRecordId,
      totalCost: (fuelData.quantity || 0) * (fuelData.unitCost || 0),
      tagName: mockTagsData.find(t => t.id === fuelData.tagId)?.tagNumber || 'N/A',
      siteName: mockSitesData.find(s => s.id === fuelData.siteId)?.siteCode || 'N/A', // Use siteCode
      distanceTravelled: null, // Calculated on GET
    };
    MOCK_FUEL_RECORDS_DB.push(newFuelRecord);
    // Re-sort by date for distance calculation logic if needed immediately, though GET does this.
    MOCK_FUEL_RECORDS_DB.sort((a, b) => new Date(b.fuelDate).getTime() - new Date(a.fuelDate).getTime());


    console.log('Mocked saving fuel record:', newFuelRecord);

    return NextResponse.json({ message: 'Fuel record saved successfully (simulated)', fuelRecordId: newFuelRecordId }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating fuel record (mock):', error);
    return NextResponse.json({ error: 'Failed to create fuel record.', details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const siteIdParam = searchParams.get('siteId');
  const tagIdParam = searchParams.get('tagId');
  const driver = searchParams.get('driver');

  let filteredRecords = [...MOCK_FUEL_RECORDS_DB]; // Work with a copy

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

  // Calculate distance travelled
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
      return (a.odometer || 0) - (b.odometer || 0); // Secondary sort by odometer
    });

    for (let i = 0; i < tagRecords.length; i++) {
      const currentRecord = { ...tagRecords[i] }; // Clone record
      if (i > 0 && currentRecord.odometer && tagRecords[i-1].odometer) {
        currentRecord.distanceTravelled = currentRecord.odometer - tagRecords[i-1].odometer!;
      } else {
        currentRecord.distanceTravelled = null; // Or 0, or N/A - first record or missing odometer
      }
      // Ensure denormalized fields are present
      currentRecord.tagName = mockTagsData.find(t => t.id === currentRecord.tagId)?.tagNumber || currentRecord.tagId || 'N/A';
      currentRecord.siteName = mockSitesData.find(s => s.id === currentRecord.siteId)?.siteCode || (currentRecord.siteId ? `Site ID ${currentRecord.siteId}` : 'N/A');
      recordsWithDistance.push(currentRecord);
    }
  }
  
  // Sort final list by date descending as it was before distance calculation
  recordsWithDistance.sort((a, b) => new Date(b.fuelDate).getTime() - new Date(a.fuelDate).getTime());

  try {
    return NextResponse.json(recordsWithDistance);
  } catch (error) {
    console.error('Error fetching fuel records (mock):', error);
    return NextResponse.json({ error: 'Failed to fetch fuel records' }, { status: 500 });
  }
}
    