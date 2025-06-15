
import { NextResponse } from 'next/server';
import type { QuotePayload } from '@/types';

// Mock database for quotes
const MOCK_QUOTES_DB: QuotePayload[] = [];

export async function POST(request: Request) {
  try {
    const quoteData = await request.json() as QuotePayload;
    
    // Simulate saving to database
    const newQuoteId = `MOCK-QID-${Date.now()}`; // Generate a mock ID
    const newQuote: QuotePayload = {
      ...quoteData,
      id: newQuoteId, // Assign mock ID
      status: 'Draft', // Default status
    };
    MOCK_QUOTES_DB.push(newQuote);

    console.log('Mocked saving quote:', newQuote);

    return NextResponse.json({ message: 'Quote saved successfully (simulated)', quoteId: newQuoteId }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating quote (mock):', error);
    return NextResponse.json({ error: 'Failed to create quote.', details: error.message }, { status: 500 });
  }
}

// Optional: GET all quotes (for potential future listing page)
export async function GET() {
  try {
    return NextResponse.json(MOCK_QUOTES_DB);
  } catch (error) {
    console.error('Error fetching quotes (mock):', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
