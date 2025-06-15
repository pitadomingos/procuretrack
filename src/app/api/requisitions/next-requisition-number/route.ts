
import { NextResponse } from 'next/server';

// Simulate fetching the next requisition number
let lastRequisitionNumericValue = 0; // In-memory counter for mock purposes

export async function GET() {
  try {
    const prefix = "REQ-";
    const numberLength = 5; 

    lastRequisitionNumericValue += 1; // Increment for mock
    const nextRequisitionNumber = `${prefix}${String(lastRequisitionNumericValue).padStart(numberLength, '0')}`;

    return NextResponse.json({ nextRequisitionNumber });

  } catch (error) {
    console.error('Error generating next requisition number (mock):', error);
    return NextResponse.json({ error: 'Failed to generate next requisition number' }, { status: 500 });
  }
}
