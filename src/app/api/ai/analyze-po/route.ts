
import { NextResponse } from 'next/server';
import { analyzePurchaseOrders, type POAnalysisInput, type POAnalysisOutput } from '@/ai/flows/po-analysis-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required and must be a string.' }, { status: 400 });
    }

    console.log('[API /api/ai/analyze-po] Received prompt:', prompt);

    const input: POAnalysisInput = { prompt };
    const result: POAnalysisOutput = await analyzePurchaseOrders(input);

    console.log('[API /api/ai/analyze-po] Flow result:', result);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[API /api/ai/analyze-po] Error processing AI request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process AI request.', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }, 
      { status: 500 }
    );
  }
}
