
import { NextResponse } from 'next/server';
import { analyzePurchaseOrders, type POAnalysisInput, type POAnalysisOutput } from '@/ai/flows/po-analysis-flow';

export async function POST(request: Request) {
  console.log('[API /api/ai/analyze-po] Received POST request.');
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      console.error('[API /api/ai/analyze-po] Validation Error: Prompt is required.');
      return NextResponse.json({ error: 'Prompt is required and must be a string.' }, { status: 400 });
    }

    console.log(`[API /api/ai/analyze-po] Calling analyzePurchaseOrders flow with prompt: "${prompt}"`);
    const input: POAnalysisInput = { prompt };
    const result: POAnalysisOutput = await analyzePurchaseOrders(input);

    console.log('[API /api/ai/analyze-po] Flow executed successfully. Sending result to client.');
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[API /api/ai/analyze-po] CRITICAL ERROR in POST handler:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred in the API handler.', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }, 
      { status: 500 }
    );
  }
}
