
import { NextResponse } from 'next/server';
import { mockClients } from '@/lib/mock-data'; // Assuming mockClients is exported from mock-data

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    // For now, returning mock data
    return NextResponse.json(mockClients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}
