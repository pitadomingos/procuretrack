
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { Client } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const [rows]: any[] = await pool.execute('SELECT * FROM Client WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error(`Error fetching client with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch client', details: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const clientData = await request.json() as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

    if (!clientData.name) {
      return NextResponse.json({ error: 'Client name is required.' }, { status: 400 });
    }

    const query = `
      UPDATE Client 
      SET name = ?, email = ?, contactPerson = ?, contactNumber = ?, address = ?, nuit = ?, updatedAt = NOW()
      WHERE id = ?
    `;
    const [result]: any[] = await pool.execute(query, [
      clientData.name,
      clientData.email || null,
      clientData.contactPerson || null,
      clientData.contactNumber || null,
      clientData.address || null,
      clientData.nuit || null,
      id
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Client not found or no changes made' }, { status: 404 });
    }
    
    const [updatedClientRows]: any[] = await pool.execute('SELECT * FROM Client WHERE id = ?', [id]);
     if (updatedClientRows.length === 0) {
        return NextResponse.json({ error: 'Client updated but failed to retrieve.' }, { status: 500 });
    }
    return NextResponse.json(updatedClientRows[0]);

  } catch (error: any) {
    console.error(`Error updating client with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update client', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const [result]: any[] = await pool.execute('DELETE FROM Client WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Client deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting client with ID ${id}:`, error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({ error: 'Cannot delete client. It is currently referenced by other records (e.g., Quotes). Please remove those references first.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete client', details: error.message }, { status: 500 });
  }
}
