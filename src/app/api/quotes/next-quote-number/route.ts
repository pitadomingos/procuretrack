
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../../backend/db.js';

export async function GET() {
  try {
    const pool = await getDbPool();
    const prefix = "Q-"; // Define your quote number prefix
    const numberLength = 5; // Desired length of the numeric part, e.g., 00001

    // Query to get the highest numeric part of Quote numbers with the specified prefix
    const [rows]: any[] = await pool.execute(
      `SELECT quoteNumber FROM Quote 
       WHERE quoteNumber LIKE ? 
       ORDER BY CAST(SUBSTRING(quoteNumber, ?) AS UNSIGNED) DESC 
       LIMIT 1`,
      [`${prefix}%`, prefix.length + 1]
    );

    let nextNumericValue = 1; 

    if (rows.length > 0) {
      const lastQuoteNumber = rows[0].quoteNumber;
      if (lastQuoteNumber && lastQuoteNumber.startsWith(prefix)) {
        const numericPartString = lastQuoteNumber.substring(prefix.length);
        const lastNumericValue = parseInt(numericPartString, 10);
        
        if (!isNaN(lastNumericValue)) {
          nextNumericValue = lastNumericValue + 1;
        }
      }
    }

    const nextQuoteNumber = `${prefix}${String(nextNumericValue).padStart(numberLength, '0')}`;
    return NextResponse.json({ nextQuoteNumber });

  } catch (error: any) {
    console.error('[API_ERROR] /api/quotes/next-quote-number:', error);
    return NextResponse.json({ error: 'Failed to generate next quote number', details: error.message }, { status: 500 });
  }
}
