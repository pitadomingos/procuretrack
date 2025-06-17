
import { NextResponse } from 'next/server';
import { updateMockQuote, getMockQuoteById } from '@/lib/mock-data';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
  }

  try {
    const quote = getMockQuoteById(id); 

    if (!quote) {
      return NextResponse.json({ error: `Quote with ID ${id} not found` }, { status: 404 });
    }

    if (quote.status !== 'Pending Approval') {
      return NextResponse.json({ error: `Quote is not pending approval. Current status: ${quote.status}` }, { status: 400 });
    }

    const updatedQuote = updateMockQuote(id, {
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
      // This case should ideally not be reached if getMockQuoteById found it initially
      return NextResponse.json({ error: `Failed to update quote with ID ${id} after finding it.` }, { status: 500 });
    }

  } catch (error: any) {
    console.error(`Error approving quote ${id} (mock):`, error);
    return NextResponse.json({
      error: `Failed to approve quote ${id}.`,
      details: error.message,
    }, { status: 500 });
  }
}
