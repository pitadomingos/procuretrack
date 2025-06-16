
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { Client } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const [rows]: any[] = await pool.execute(
      'SELECT id, name, address, city, country, contactPerson, email, createdAt, updatedAt FROM Client WHERE id = ?', 
      [id]
    );
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
      SET name = ?, address = ?, city = ?, country = ?, contactPerson = ?, email = ?, updatedAt = NOW()
      WHERE id = ?
    `;
    const [result]: any[] = await pool.execute(query, [
      clientData.name,
      clientData.address || null,
      clientData.city || null,
      clientData.country || null,
      clientData.contactPerson || null,
      clientData.email || null,
      id
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Client not found or no changes made' }, { status: 404 });
    }
    
    const [updatedClientRows]: any[] = await pool.execute(
      'SELECT id, name, address, city, country, contactPerson, email, createdAt, updatedAt FROM Client WHERE id = ?', 
      [id]
    );
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
    // Before deleting, check if this client is referenced in the Quote table
    const [quoteRows]: any[] = await pool.execute(
      'SELECT COUNT(*) as count FROM Quote WHERE clientId = ?',
      [id]
    );

    if (quoteRows[0].count > 0) {
      return NextResponse.json({ 
        error: `Cannot delete client. It is currently referenced by ${quoteRows[0].count} quote(s). Please remove or reassign those references first.` 
      }, { status: 409 }); // 409 Conflict
    }

    const [result]: any[] = await pool.execute('DELETE FROM Client WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Client deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting client with ID ${id}:`, error);
    // General check for other foreign key constraints if any
    if (error.code === 'ER_ROW_IS_REFERENCED_2') { 
        return NextResponse.json({ error: 'Cannot delete client. It is currently referenced by other records. Please remove those references first.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete client', details: error.message }, { status: 500 });
  }
}
