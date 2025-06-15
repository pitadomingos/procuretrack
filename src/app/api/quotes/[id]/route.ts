
import { NextResponse } from 'next/server';
import type { QuotePayload } from '@/types';

// Access the MOCK_QUOTES_DB (assuming it's somehow shareable or re-fetch if needed)
// For simplicity in this mock, we'll filter the same in-memory array.
// This is NOT how a real DB works.
let MOCK_QUOTES_DB_REFERENCE: QuotePayload[] = []; 
// A bit of a hack for mock: try to re-initialize if empty on first call
const ensureMockDb = () => {
    if (MOCK_QUOTES_DB_REFERENCE.length === 0) {
        // This won't truly repopulate from other route's memory,
        // but shows intent for a standalone mock.
        // In a real app, you'd query your database.
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
    // This relies on the POST /api/quotes route having added to a shared MOCK_QUOTES_DB if in the same process,
    // or you'd need a more persistent mock storage.
    // For now, let's just return a generic mock quote if not found, or the first if any exist from previous POSTs in same runtime.
    
    // To make this more robust for preview after "save", we should try to find the actual quote.
    // However, the /api/quotes POST route has its own MOCK_QUOTES_DB instance.
    // For true mock persistence across requests, a simple file or a slightly more complex in-memory store would be needed.
    // For now, let's assume the ID is the one just "created" and we'll construct a similar mock object for preview.

    const MOCK_CREATED_QUOTE: QuotePayload = {
        id: id, // Use the ID from the URL
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
            { id: 'item-2', description: 'Custom Software Module', quantity: 1, unitPrice: 0 }, // Example of a free item or part of a package
        ],
        status: 'Draft',
    };
    
    // If you had a shared MOCK_QUOTES_DB from the POST route:
    // const quote = MOCK_QUOTES_DB.find(q => q.id === id);
    // if (quote) {
    //   return NextResponse.json(quote);
    // }

    // Fallback to the generic MOCK_CREATED_QUOTE for preview demonstration
    return NextResponse.json(MOCK_CREATED_QUOTE);
    
  } catch (error: any) {
    console.error(`Error fetching quote (mock) with ID ${id}:`, error);
    return NextResponse.json({ error: `Failed to fetch quote with ID ${id}.`, details: error.message }, { status: 500 });
  }
}
