import { pool } from '../../../../../backend/db.js'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { poId } = params;
  try {
    const [rows] = await pool.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [poId]);
    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ message: `Purchase order with ID ${poId} not found` }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error fetching purchase order with ID ${poId}:`, error);
    return NextResponse.json({ error: `Failed to fetch purchase order with ID ${poId}` }, { status: 500 });
  }
}