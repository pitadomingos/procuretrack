
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
      return NextResponse.json({ error: `Quote is not pending approval. Current status: ${quote.status}` }, { status: 400 });
    }

    const updatedQuote = updateMockQuote(id, { // Sync call
      status: 'Approved',
      approvalDate: new Date().toISOString(),
    });

    if (updatedQuote) {
      return NextResponse.json({
        message: 'Quote approved successfully (simulated).',
        quoteId: id,
        newStatus: 'Approved',
        approvalDate: updatedQuote.approvalDate,
      });
    } else {
      return NextResponse.json({ error: `Failed to update quote with ID ${id}` }, { status: 500 });
    }

  } catch (error: any) {
    console.error(`Error approving quote ${id} (mock):`, error);
    return NextResponse.json({
      error: `Failed to approve quote ${id}.`,
      details: error.message,
    }, { status: 500 });
  }
}
