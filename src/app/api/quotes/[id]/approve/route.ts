
import { NextResponse } from 'next/server';
import { updateMockQuote, MOCK_QUOTES_DB } from '@/lib/mock-data'; // Use shared MOCK_QUOTES_DB and update function

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
  }

  try {
    const quoteIndex = MOCK_QUOTES_DB.findIndex(q => q.id === id);

    if (quoteIndex === -1) {
      return NextResponse.json({ error: `Quote with ID ${id} not found` }, { status: 404 });
    }

    const quote = MOCK_QUOTES_DB[quoteIndex];

    if (quote.status !== 'Pending Approval') {
      return NextResponse.json({ error: `Quote is not pending approval. Current status: ${quote.status}` }, { status: 400 });
    }

    // Simulate approval
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
      // Should not happen if findIndex found it, but as a safeguard
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
