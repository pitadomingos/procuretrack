
import { NextResponse } from 'next/server';
import { updateMockQuote, MOCK_QUOTES_DB } from '@/lib/mock-data'; // Use shared MOCK_QUOTES_DB and update function

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // const { reason } = await request.json(); // Optional: Get reason if needed later

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
      return NextResponse.json({ error: `Quote cannot be rejected. Current status: ${quote.status}` }, { status: 400 });
    }
    
    // Simulate rejection
    const updatedQuote = updateMockQuote(id, {
      status: 'Rejected',
      approvalDate: null, // Clear approval date if any
      // rejectionReason: reason, // If you decide to store reason
      // rejectionDate: new Date().toISOString(),
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
