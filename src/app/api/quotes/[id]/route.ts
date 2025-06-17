
import { NextResponse } from 'next/server';
import type { QuotePayload } from '@/types';
import { getMockQuoteById, mockApproversData, updateMockQuote } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: quoteId } = params;
  console.log(`[API_INFO] /api/quotes/${quoteId} GET: Received request for quote ID: ${quoteId}`);

  try {
    const quoteFromMockDB = getMockQuoteById(quoteId);

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: quoteId } = params;
  console.log(`[API_INFO] /api/quotes/${quoteId} PUT: Received request to update quote.`);
  try {
    const quoteDataToUpdate = await request.json() as Partial<QuotePayload>;
    const updatedQuote = updateMockQuote(quoteId, quoteDataToUpdate);

    if (updatedQuote) {
      console.log(`[API_INFO] /api/quotes/${quoteId} PUT: Successfully updated quote.`);
      return NextResponse.json(updatedQuote);
    } else {
      console.warn(`[API_WARN] /api/quotes/${quoteId} PUT: Quote not found for update.`);
      return NextResponse.json({ error: `Quote with ID ${quoteId} not found for update.` }, { status: 404 });
    }
  } catch (error: any) {
    console.error(`[API_ERROR] /api/quotes/${quoteId} PUT: Error updating quote:`, error);
    return NextResponse.json({ error: `Failed to update quote with ID ${quoteId}.`, details: error.message }, { status: 500 });
  }
}
