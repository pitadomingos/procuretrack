
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../../../backend/db.js'; // Corrected path

export async function GET(
  request: Request,
  { params }: { params: { quoteNumber: string } }
) {
  const { quoteNumber } = params;

  if (!quoteNumber) {
    return NextResponse.json({ error: 'Quote Number is required' }, { status: 400 });
  }

  const decodedQuoteNumber = decodeURIComponent(quoteNumber);
  let connection;

  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    // Fetch the ID as that's what's needed for the form to then fetch full details
    const [rows]: any[] = await connection.execute(
      'SELECT id FROM Quote WHERE quoteNumber = ?',
      [decodedQuoteNumber]
    );

    if (rows.length > 0) {
      const quoteData = rows[0] as { id: string }; // Quote ID is string
      return NextResponse.json({ id: quoteData.id });
    } else {
      return NextResponse.json({ error: `Quote with number ${decodedQuoteNumber} not found` }, { status: 404 });
    }
  } catch (error: any) {
    console.error(`[API_ERROR] /api/quotes/get-by-quote-number: Error fetching quote by number ${decodedQuoteNumber}:`, error);
    return NextResponse.json({ error: 'Failed to fetch quote details by number.', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
