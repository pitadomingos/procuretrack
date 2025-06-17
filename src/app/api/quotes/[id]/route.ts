
import { NextResponse } from 'next/server';
import type { QuotePayload } from '@/types';
import { getMockQuoteById, mockApproversData } from '@/lib/mock-data'; // Use in-memory mock

export async function GET( // Stays async for consistency, though mock is sync
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: quoteId } = params;
  console.log(`[API_INFO] /api/quotes/${quoteId} GET: Received request for quote ID: ${quoteId}`);

  try {
    const quoteFromMockDB = getMockQuoteById(quoteId); // Use synchronous version

    if (quoteFromMockDB) {
      console.log(`[API_INFO] /api/quotes/${quoteId} GET: Found quote in MOCK_QUOTES_DB: ${quoteFromMockDB.quoteNumber}`);
      const quoteToReturn = { ...quoteFromMockDB };
      if (quoteToReturn.approverId && !quoteToReturn.approverName) { 
          const approver = mockApproversData.find(appr => appr.id === quoteToReturn.approverId);
          quoteToReturn.approverName = approver?.name;
      }
      return NextResponse.json(quoteToReturn);
    } else {
      console.warn(`[API_WARN] /api/quotes/${quoteId} GET: Quote with ID ${quoteId} not found in MOCK_QUOTES_DB.`);
      return NextResponse.json({ error: `Quote with ID ${quoteId} not found.` }, { status: 404 });
    }
  } catch (error: any) {
    console.error(`[API_ERROR] /api/quotes/${quoteId} GET: Error fetching quote:`, error);
    return NextResponse.json({ error: `Failed to fetch quote with ID ${quoteId}.`, details: error.message }, { status: 500 });
  }
}

// PUT and DELETE methods for single quote (if needed for form editing persistence in mock)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.warn(`[API_WARN][PUT /api/quotes/${params.id}] PUT method not fully implemented for in-memory mock DB yet.`);
  return NextResponse.json({ error: 'PUT method for single quote not fully implemented for in-memory mock DB yet.' }, { status: 501 });
}
