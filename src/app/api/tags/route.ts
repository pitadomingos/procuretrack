
import { NextResponse } from 'next/server';
import { mockTagsData } from '@/lib/mock-data'; // Using mock data

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return NextResponse.json(mockTagsData);
  } catch (error) {
    console.error('Error fetching tags (mock):', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

    