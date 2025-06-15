
import { NextResponse } from 'next/server';
import type { RequisitionPayload } from '@/types';
import { mockRequisitionsData } from '@/lib/mock-data'; // Using mock data

// Mock database for requisitions
const MOCK_REQUISITIONS_DB: RequisitionPayload[] = [...mockRequisitionsData];

export async function POST(request: Request) {
  try {
    const requisitionData = await request.json() as RequisitionPayload;
    
    const newRequisitionId = `MOCK-REQID-${Date.now()}`; 
    const newRequisition: RequisitionPayload = {
      ...requisitionData,
      id: newRequisitionId,
      status: 'Draft', // Default status
    };
    MOCK_REQUISITIONS_DB.push(newRequisition);

    console.log('Mocked saving requisition:', newRequisition);

    return NextResponse.json({ message: 'Requisition saved successfully (simulated)', requisitionId: newRequisitionId }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating requisition (mock):', error);
    return NextResponse.json({ error: 'Failed to create requisition.', details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  // Add other filters like siteId, requestedByUserId if needed for requisitions

  // Basic filtering simulation for month and year on mock data
  let filteredRequisitions = MOCK_REQUISITIONS_DB;

  if (month && month !== 'all') {
    filteredRequisitions = filteredRequisitions.filter(req => {
      const reqMonth = new Date(req.requisitionDate).getMonth() + 1;
      return reqMonth.toString().padStart(2, '0') === month;
    });
  }
  if (year && year !== 'all') {
    filteredRequisitions = filteredRequisitions.filter(req => {
      const reqYear = new Date(req.requisitionDate).getFullYear();
      return reqYear.toString() === year;
    });
  }
  // Add more filtering logic here based on other params

  try {
    return NextResponse.json(filteredRequisitions);
  } catch (error) {
    console.error('Error fetching requisitions (mock):', error);
    return NextResponse.json({ error: 'Failed to fetch requisitions' }, { status: 500 });
  }
}
