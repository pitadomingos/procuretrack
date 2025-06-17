
import { NextResponse } from 'next/server';
import { updateMockQuote, getMockQuoteById } from '@/lib/mock-data'; // Use in-memory mock

export async function POST( // Stays async for consistency, though mock is sync
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
  }

  try {
    const quote = getMockQuoteById(id); // Sync call

    if (!quote) {
      return NextResponse.json({ error: `Quote with ID ${id} not found` }, { status: 404 });
    }

    if (quote.status !== 'Pending Approval') {
      return NextResponse.json({ error: `Quote cannot be rejected. Current status: ${quote.status}` }, { status: 400 });
    }
    
    const updatedQuote = updateMockQuote(id, { // Sync call
      status: 'Rejected',
      approvalDate: null, 
    });

    if (updatedQuote) {
        return NextResponse.json({
        message: 'Quote rejected successfully (simulated).',
        quoteId: id,
        newStatus: 'Rejected',
      });
    } else {
        return NextResponse.json({ error: `Failed to update quote with ID ${id}` }, { status: 500 });
    }

  } catch (error: any) {
    console.error(`Error rejecting quote ${id} (mock):`, error);
    return NextResponse.json({
      error: `Failed to reject quote ${id}.`,
      details: error.message,
    }, { status: 500 });
  }
}
