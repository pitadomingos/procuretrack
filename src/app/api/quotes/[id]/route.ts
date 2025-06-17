
import { NextResponse } from 'next/server';
import type { QuotePayload, Approver } from '@/types';
import { mockApproversData } from '@/lib/mock-data'; // For fetching approver names

// Access the MOCK_QUOTES_DB (assuming it's somehow shareable or re-fetch if needed)
// This is NOT how a real DB works.
let MOCK_QUOTES_DB_REFERENCE: QuotePayload[] = []; 
const ensureMockDb = () => {
    if (MOCK_QUOTES_DB_REFERENCE.length === 0) {
        // This won't truly repopulate from other route's memory,
        // but shows intent for a standalone mock.
    }
}


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  ensureMockDb();
  const { id } = params;
  try {
    const quoteFromMockDB = MOCK_QUOTES_DB_REFERENCE.find(q => q.id === id);

    let quoteToReturn: QuotePayload;

    if (quoteFromMockDB) {
      quoteToReturn = { ...quoteFromMockDB };
    } else {
      // Fallback for previewing a "newly created" mock quote
      // Construct a default quote structure with calculated totals
      const defaultItems = [
        { id: 'item-prev-1', description: 'Sample Service A', quantity: 10, unitPrice: 150.75, partNumber: 'SVC-A', customerRef: 'REF001' },
        { id: 'item-prev-2', description: 'Sample Product B', quantity: 2, unitPrice: 1200.50, partNumber: 'PROD-B', customerRef: 'REF002' },
      ];
      const currency = 'MZN';
      let calculatedSubTotal = 0;
      defaultItems.forEach(item => {
        calculatedSubTotal += (item.quantity || 0) * (item.unitPrice || 0);
      });
      const calculatedVatAmount = currency === 'MZN' ? calculatedSubTotal * 0.16 : 0;
      const calculatedGrandTotal = calculatedSubTotal + calculatedVatAmount;

      quoteToReturn = {
          id: id, 
          quoteNumber: `Q-PREVIEW-${id.slice(-5)}`,
          quoteDate: new Date().toISOString(),
          clientId: 'client-preview-001', 
          clientName: 'Preview Client Inc.',
          clientEmail: 'preview@example.com',
          creatorEmail: 'creator@jachris.com', // Mock creator
          subTotal: parseFloat(calculatedSubTotal.toFixed(2)),
          vatAmount: parseFloat(calculatedVatAmount.toFixed(2)),
          grandTotal: parseFloat(calculatedGrandTotal.toFixed(2)),
          currency: currency,
          termsAndConditions: 'Standard Payment Terms: 30 days. Prices valid for 15 days. This is a preview.',
          notes: 'This quotation is a preview generated for a newly created mock entry.',
          items: defaultItems,
          status: 'Draft', // Default status for this preview
          approverId: mockApproversData[0]?.id || null, 
      };
    }

    // If approverId exists, try to fetch approver name (mocked for now)
    if (quoteToReturn.approverId) {
        const approver = mockApproversData.find(appr => appr.id === quoteToReturn.approverId);
        quoteToReturn.approverName = approver?.name;
    }
    
    return NextResponse.json(quoteToReturn);
    
  } catch (error: any) {
    console.error(`Error fetching quote (mock) with ID ${id}:`, error);
    return NextResponse.json({ error: `Failed to fetch quote with ID ${id}.`, details: error.message }, { status: 500 });
  }
}

