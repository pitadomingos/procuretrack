
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { Approver } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const [rows]: any[] = await pool.execute('SELECT * FROM Approver WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Approver not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error(`Error fetching approver with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch approver', details: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const approverData = await request.json() as Omit<Approver, 'id'>;

    if (!approverData.name) {
      return NextResponse.json({ error: 'Approver name is required.' }, { status: 400 });
    }

    const query = `
      UPDATE Approver 
      SET name = ?, email = ?, department = ?, isActive = ?, approvalLimit = ?
      WHERE id = ?
    `;
    const [result]: any[] = await pool.execute(query, [
      approverData.name,
      approverData.email || null,
      approverData.department || null,
      typeof approverData.isActive === 'boolean' ? approverData.isActive : true,
      approverData.approvalLimit || null,
      id
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Approver not found or no changes made' }, { status: 404 });
    }
    
    const [updatedRows]: any[] = await pool.execute('SELECT * FROM Approver WHERE id = ?', [id]);
    return NextResponse.json(updatedRows[0]);

  } catch (error: any) {
    console.error(`Error updating approver with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update approver', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const [result]: any[] = await pool.execute('DELETE FROM Approver WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Approver not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Approver deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting approver with ID ${id}:`, error);
     if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({ error: 'Cannot delete approver. They are currently referenced by Purchase Orders. Please reassign or remove those references first.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete approver', details: error.message }, { status: 500 });
  }
}
