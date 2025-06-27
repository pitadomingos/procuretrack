
import { getDbPool } from '../../../../../backend/db.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pool = await getDbPool();
    const prefix = "PO-";
    const numberLength = 5; // Defines the length of the numeric part, e.g., 00001

    // Query to get the highest numeric part of PO numbers with the specified prefix
    // It extracts the numeric part after the prefix, casts it to a number, and orders to find the max.
    const [rows] = await pool.execute(
      `SELECT poNumber FROM PurchaseOrder 
       WHERE poNumber LIKE ? 
       ORDER BY CAST(SUBSTRING(poNumber, ?) AS UNSIGNED) DESC 
       LIMIT 1`,
      [`${prefix}%`, prefix.length + 1]
    );

    let nextNumericValue = 1; // Default to 1 if no POs are found or if parsing fails

    if (rows.length > 0) {
      const lastPoNumber = rows[0].poNumber;
      // Ensure the lastPoNumber actually starts with the prefix before trying to parse
      if (lastPoNumber && lastPoNumber.startsWith(prefix)) {
        const numericPartString = lastPoNumber.substring(prefix.length);
        const lastNumericValue = parseInt(numericPartString, 10);
        
        if (!isNaN(lastNumericValue)) {
          nextNumericValue = lastNumericValue + 1;
        }
      }
    }

    const nextPoNumber = `${prefix}${String(nextNumericValue).padStart(numberLength, '0')}`;

    return NextResponse.json({ nextPoNumber });

  } catch (error) {
    console.error('Error fetching next PO number:', error);
    return NextResponse.json({ error: 'Failed to generate next PO number' }, { status: 500 });
  }
}
