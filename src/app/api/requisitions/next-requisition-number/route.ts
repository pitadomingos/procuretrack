
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';

export async function GET() {
  try {
    const prefix = "REQ-";
    const numberLength = 5; 

    const [rows]: any[] = await pool.execute(
      `SELECT requisitionNumber FROM Requisition 
       WHERE requisitionNumber LIKE ? 
       ORDER BY CAST(SUBSTRING(requisitionNumber, ?) AS UNSIGNED) DESC 
       LIMIT 1`,
      [`${prefix}%`, prefix.length + 1]
    );

    let nextNumericValue = 1; 

    if (rows.length > 0) {
      const lastReqNumber = rows[0].requisitionNumber;
      if (lastReqNumber && lastReqNumber.startsWith(prefix)) {
        const numericPartString = lastReqNumber.substring(prefix.length);
        const lastNumericValue = parseInt(numericPartString, 10);
        
        if (!isNaN(lastNumericValue)) {
          nextNumericValue = lastNumericValue + 1;
        }
      }
    }

    const nextRequisitionNumber = `${prefix}${String(nextNumericValue).padStart(numberLength, '0')}`;
    return NextResponse.json({ nextRequisitionNumber });

  } catch (error: any) {
    console.error('[API_ERROR] /api/requisitions/next-requisition-number:', error);
    return NextResponse.json({ error: 'Failed to generate next requisition number', details: error.message }, { status: 500 });
  }
}
    
