
import { NextResponse } from 'next/server';
import type { QuotePayload, Approver } from '@/types';
import { mockApproversData, MOCK_QUOTES_DB } from '@/lib/mock-data'; // Use shared MOCK_QUOTES_DB

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: quoteId } = params;
  console.log(`[API_INFO] /api/quotes/${quoteId} GET: Received request for quote ID: ${quoteId}`);
  
  const currentMockDbIds = MOCK_QUOTES_DB.map(q => q.id);
  console.log(`[API_INFO] /api/quotes/${quoteId} GET: Checking MOCK_QUOTES_DB. Current size: ${MOCK_QUOTES_DB.length}. Current IDs: [${currentMockDbIds.join(', ')}]`);


  try {
    const quoteFromMockDB = MOCK_QUOTES_DB.find(q => q.id === quoteId);

    if (quoteFromMockDB) {
      console.log(`[API_INFO] /api/quotes/${quoteId} GET: Found quote in MOCK_QUOTES_DB:`, quoteFromMockDB.quoteNumber);
      const quoteToReturn = { ...quoteFromMockDB };
      if (quoteToReturn.approverId) {
          const approver = mockApproversData.find(appr => appr.id === quoteToReturn.approverId);
          quoteToReturn.approverName = approver?.name;
      }
      return NextResponse.json(quoteToReturn);
    } else {
      console.warn(`[API_WARN] /api/quotes/${quoteId} GET: Quote with ID ${quoteId} not found in MOCK_QUOTES_DB.`);
      return NextResponse.json({ error: `Quote with ID ${quoteId} not found.` }, { status: 404 });
    }

  } catch (error: any) {
    console.error(`[API_ERROR] /api/quotes/${quoteId} GET: Error fetching quote (mock):`, error);
    return NextResponse.json({ error: `Failed to fetch quote with ID ${quoteId}.`, details: error.message }, { status: 500 });
  }
}

// PUT and DELETE methods for single quote (if needed for form editing persistence in mock)
// These would also need to use the shared MOCK_QUOTES_DB and updateMockQuote function from lib/mock-data.ts
// For now, focusing on GET.
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // This would need to be implemented using updateMockQuote from lib/mock-data
  return NextResponse.json({ error: 'PUT method for single quote not fully implemented for shared mock DB yet.' }, { status: 501 });
}

    