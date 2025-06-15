
import { NextResponse } from 'next/server';
import type { RequisitionPayload } from '@/types';
import { mockRequisitionsData } from '@/lib/mock-data'; // Using mock data

// Mock database for requisitions (can be shared or re-initialized)
const MOCK_REQUISITIONS_DB_SINGLE: RequisitionPayload[] = [...mockRequisitionsData];


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const requisition = MOCK_REQUISITIONS_DB_SINGLE.find(r => r.id === id);
    
    if (requisition) {
      return NextResponse.json(requisition);
    } else {
      // Fallback if not in initial mock data (e.g., just created)
      const newRequisitionId = id;
      const fallbackRequisition: RequisitionPayload = {
        id: newRequisitionId,
        requisitionNumber: `REQ-PREVIEW-${newRequisitionId.slice(-4)}`,
        requisitionDate: new Date().toISOString(),
        requestedByName: 'Preview User',
        siteId: 1, 
        status: 'Draft',
        items: [
          { id: 'prev-item-1', description: 'Sample Item for Preview', categoryId: 1, quantity: 1, estimatedUnitPrice: 100 },
        ],
        totalEstimatedValue: 100,
      };
      return NextResponse.json(fallbackRequisition);
    }
    
  } catch (error: any) {
    console.error(`Error fetching requisition (mock) with ID ${id}:`, error);
    return NextResponse.json({ error: `Failed to fetch requisition with ID ${id}.`, details: error.message }, { status: 500 });
  }
}
