
import { NextResponse } from 'next/server';
import { getAllMockQuotes, mockApproversData, mockClients } from '@/lib/mock-data'; // Use in-memory mock
import type { QuotePayload } from '@/types';

interface QuoteApprovalQueueItem {
  id: string;
  quoteNumber: string;
  quoteDate: string;
  clientName: string | null | undefined;
  creatorEmail: string | null | undefined;
  grandTotal: number;
  currency: string;
  status: string;
}

export async function GET(request: Request) { // Stays async for consistency, though mock is sync
  const { searchParams } = new URL(request.url);
  const approverEmail = searchParams.get('approverEmail');

  if (!approverEmail) {
    return NextResponse.json({ error: 'Approver email is required' }, { status: 400 });
  }

  try {
    const approver = mockApproversData.find(appr => appr.email === approverEmail && appr.isActive);
    if (!approver) {
      return NextResponse.json({ error: `No active approver found with email ${approverEmail}` }, { status: 404 });
    }

    const allQuotes = getAllMockQuotes(); // Sync call
    const pendingQuotes = allQuotes.filter(
      quote => quote.approverId === approver.id && quote.status === 'Pending Approval'
    );

    const results: QuoteApprovalQueueItem[] = pendingQuotes.map(quote => {
      const client = mockClients.find(c => c.id === quote.clientId);
      return {
        id: quote.id || `temp-id-${Math.random()}`, 
        quoteNumber: quote.quoteNumber,
        quoteDate: quote.quoteDate,
        clientName: client?.name || quote.clientName || 'N/A',
        creatorEmail: quote.creatorEmail || 'N/A',
        grandTotal: quote.grandTotal,
        currency: quote.currency,
        status: quote.status,
      };
    });

    return NextResponse.json(results.sort((a,b) => new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime()));

  } catch (error: any) {
    console.error('Error fetching pending quote approvals (mock):', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending quote approvals.', details: error.message },
      { status: 500 }
    );
  }
}
