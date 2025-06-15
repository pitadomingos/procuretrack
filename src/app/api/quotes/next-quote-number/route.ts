
import { NextResponse } from 'next/server';

// Simulate fetching the next quote number
let lastQuoteNumericValue = 0; // In-memory counter for mock purposes

export async function GET() {
  try {
    const prefix = "Q-";
    const numberLength = 5; 

    lastQuoteNumericValue += 1; // Increment for mock
    const nextQuoteNumber = `${prefix}${String(lastQuoteNumericValue).padStart(numberLength, '0')}`;

    return NextResponse.json({ nextQuoteNumber });

  } catch (error) {
    console.error('Error generating next quote number (mock):', error);
    return NextResponse.json({ error: 'Failed to generate next quote number' }, { status: 500 });
  }
}
