
import { pool } from '../../../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { poNumber: string } }
) {
  const { poNumber } = params;

  if (!poNumber) {
    return NextResponse.json({ error: 'PO Number is required' }, { status: 400 });
  }

  const decodedPoNumber = decodeURIComponent(poNumber);

  try {
    // Fetch only the ID as that's what's needed for the print page navigation
    const [rows] = await pool.execute(
      'SELECT id FROM PurchaseOrder WHERE poNumber = ?',
      [decodedPoNumber]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const poData = rows[0] as { id: number };
      return NextResponse.json({ id: poData.id });
    } else {
      return NextResponse.json({ error: `Purchase Order with PO Number ${decodedPoNumber} not found` }, { status: 404 });
    }
  } catch (error: any) {
    console.error(`Error fetching purchase order by PO Number ${decodedPoNumber}:`, error);
    return NextResponse.json({ error: 'Failed to fetch purchase order details.', details: error.message }, { status: 500 });
  }
}
