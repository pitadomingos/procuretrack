
import { NextResponse } from 'next/server';
import type { QuotePayload, Approver } from '@/types';
import { mockApproversData } from '@/lib/mock-data'; // For fetching approver names

// Access the MOCK_QUOTES_DB (assuming it's somehow shareable or re-fetch if needed)
// This is NOT how a real DB works.
let MOCK_QUOTES_DB_REFERENCE: QuotePayload[] = []; 
const ensureMockDb = () => {
    if (MOCK_QUOTES_DB_REFERENCE.length === 0) {
        // This won't truly repopulate from other route's memory,
        // but shows intent for a standalone mock.
    }
}


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  ensureMockDb();
  const { id } = params;
  try {
    // Simulate finding the quote by ID from the MOCK_QUOTES_DB
    // For now, let's assume the ID is the one just "created" from the POST mock.
    // In a real scenario, you'd fetch from the database.
    // For this mock, we'll find it in the (potentially empty) MOCK_QUOTES_DB_REFERENCE
    // or construct a generic one if not found, which is what the previous code did.
    // Let's try to make it slightly more consistent with the POST mock.
    
    const quoteFromPostMock = MOCK_QUOTES_DB_REFERENCE.find(q => q.id === id); // This array is likely empty.

    let quoteToReturn: QuotePayload;

    if (quoteFromPostMock) {
      quoteToReturn = { ...quoteFromPostMock };
    } else {
      // Fallback to a generic MOCK_CREATED_QUOTE for preview demonstration if not found in memory
      quoteToReturn = {
          id: id, 
          quoteNumber: `Q-PREVIEW-${id.slice(-4)}`,
          quoteDate: new Date().toISOString(),
          clientId: 'client-001', // Default mock client
          clientName: 'Vale Mozambique',
          clientEmail: 'procurement@vale.co.mz',
          creatorEmail: 'creator@jachris.com',
          subTotal: 1000,
          vatAmount: 160,
          grandTotal: 1160,
          currency: 'MZN',
          termsAndConditions: 'Standard Payment Terms: 30 days. Prices valid for 15 days.',
          notes: 'This is a sample quote for preview purposes.',
          items: [
              { id: 'item-1', description: 'Consulting Services - Phase 1', quantity: 10, unitPrice: 100 },
              { id: 'item-2', description: 'Custom Software Module', quantity: 1, unitPrice: 0 },
          ],
          status: 'Pending Approval', // Default status for preview
          approverId: mockApproversData[0]?.id || null, // Assign first mock approver for testing
      };
    }

    // If approverId exists, try to fetch approver name (mocked for now)
    if (quoteToReturn.approverId) {
        const approver = mockApproversData.find(appr => appr.id === quoteToReturn.approverId);
        quoteToReturn.approverName = approver?.name;
    }
    
    return NextResponse.json(quoteToReturn);
    
  } catch (error: any) {
    console.error(`Error fetching quote (mock) with ID ${id}:`, error);
    return NextResponse.json({ error: `Failed to fetch quote with ID ${id}.`, details: error.message }, { status: 500 });
  }
}
