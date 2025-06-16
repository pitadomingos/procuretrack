
import { NextResponse } from 'next/server';
import { pool } from '../../../../backend/db.js';
import type { Client } from '@/types';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM Client ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching clients from DB:', error);
    return NextResponse.json({ error: 'Failed to fetch clients from database', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clientData = await request.json() as Omit<Client, 'createdAt' | 'updatedAt'>;

    if (!clientData.id || !clientData.name) {
      return NextResponse.json({ error: 'Client ID and Name are required.' }, { status: 400 });
    }

    const query = `
      INSERT INTO Client (id, name, email, contactPerson, contactNumber, address, nuit, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    await pool.execute(query, [
      clientData.id,
      clientData.name,
      clientData.email || null,
      clientData.contactPerson || null,
      clientData.contactNumber || null,
      clientData.address || null,
      clientData.nuit || null,
    ]);

    const [newClientRows]: any[] = await pool.execute('SELECT * FROM Client WHERE id = ?', [clientData.id]);
    if (newClientRows.length === 0) {
        return NextResponse.json({ error: 'Client created but failed to retrieve.' }, { status: 500 });
    }
    return NextResponse.json(newClientRows[0], { status: 201 });

  } catch (error: any) {
    console.error('Error creating client:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Client with this ID already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create client', details: error.message }, { status: 500 });
  }
}
