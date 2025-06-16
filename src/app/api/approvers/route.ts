
import { pool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';
import type { Approver } from '@/types';

export async function GET() {
  try {
    const query = `
      SELECT 
        id,
        name, 
        email, 
        department, 
        isActive,
        approvalLimit
      FROM Approver
      ORDER BY name ASC;
    `;
    const [rows] = await pool.execute(query);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching approvers:', error);
    return NextResponse.json({ error: 'Failed to fetch approvers', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const approverData = await request.json() as Approver;

    if (!approverData.id || !approverData.name) {
      return NextResponse.json({ error: 'Approver ID and Name are required.' }, { status: 400 });
    }
    
    const query = `
      INSERT INTO Approver (id, name, email, department, isActive, approvalLimit)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(query, [
      approverData.id,
      approverData.name,
      approverData.email || null,
      approverData.department || null,
      typeof approverData.isActive === 'boolean' ? approverData.isActive : true, // Default to true if not provided
      approverData.approvalLimit || null,
    ]);

    const [newApproverRows]: any[] = await pool.execute('SELECT * FROM Approver WHERE id = ?', [approverData.id]);
    if (newApproverRows.length === 0) {
        return NextResponse.json({ error: 'Approver created but failed to retrieve.' }, { status: 500 });
    }
    return NextResponse.json(newApproverRows[0], { status: 201 });

  } catch (error: any) {
    console.error('Error creating approver:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Approver with this ID already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create approver', details: error.message }, { status: 500 });
  }
}
