
import { NextResponse } from 'next/server';
import type { FuelRecord } from '@/types';
import { mockFuelRecordsData, mockTagsData, mockSitesData } from '@/lib/mock-data'; // Using mock data

// Mock database for fuel records
const MOCK_FUEL_RECORDS_DB: FuelRecord[] = [...mockFuelRecordsData];

export async function POST(request: Request) {
  try {
    const fuelData = await request.json() as Omit<FuelRecord, 'id' | 'totalCost' | 'tagName' | 'siteName'>;

    const newFuelRecordId = `MOCK-FUELID-${Date.now()}`;
    const newFuelRecord: FuelRecord = {
      ...fuelData,
      id: newFuelRecordId,
      totalCost: (fuelData.quantity || 0) * (fuelData.unitCost || 0),
      // Denormalized fields would ideally be joined or handled by a proper DB query
      tagName: mockTagsData.find(t => t.id === fuelData.tagId)?.tagNumber || 'N/A',
      siteName: mockSitesData.find(s => s.id === fuelData.siteId)?.name || 'N/A',
    };
    MOCK_FUEL_RECORDS_DB.push(newFuelRecord);

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
  const siteId = searchParams.get('siteId');
  const tagId = searchParams.get('tagId');
  const driver = searchParams.get('driver');

  let filteredRecords = MOCK_FUEL_RECORDS_DB;

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
  if (siteId && siteId !== 'all') {
    filteredRecords = filteredRecords.filter(rec => rec.siteId?.toString() === siteId);
  }
  if (tagId && tagId !== 'all') {
    filteredRecords = filteredRecords.filter(rec => rec.tagId === tagId);
  }
  if (driver && driver.trim() !== '') {
    filteredRecords = filteredRecords.filter(rec => rec.driver?.toLowerCase().includes(driver.toLowerCase()));
  }


  try {
    // Add tagName and siteName for display
    const recordsWithDetails = filteredRecords.map(rec => ({
        ...rec,
        tagName: mockTagsData.find(t => t.id === rec.tagId)?.tagNumber || rec.tagId || 'N/A',
        siteName: mockSitesData.find(s => s.id === rec.siteId)?.name || (rec.siteId ? `Site ID ${rec.siteId}` : 'N/A'),
    }));
    return NextResponse.json(recordsWithDetails);
  } catch (error) {
    console.error('Error fetching fuel records (mock):', error);
    return NextResponse.json({ error: 'Failed to fetch fuel records' }, { status: 500 });
  }
}

    