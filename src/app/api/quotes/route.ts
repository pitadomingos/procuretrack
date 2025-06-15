
import { NextResponse } from 'next/server';
import type { QuotePayload } from '@/types';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Mock database for quotes
const MOCK_QUOTES_DB: QuotePayload[] = [];

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to run multer middleware
const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Ensure Next.js doesn't parse the body for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('multipart/form-data')) {
    // CSV Upload for Quote Headers
    // @ts-ignore
    const req = request as Request & { file?: any };
    const res = new NextResponse(); // Dummy response for middleware

    try {
      await runMiddleware(req, res, upload.single('file'));

      // @ts-ignore
      if (!req.file) {
        return NextResponse.json({ error: 'No file uploaded for quotes' }, { status: 400 });
      }
      
      // @ts-ignore
      const fileBuffer = req.file.buffer;
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);

      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            console.log('Parsed Quote Header CSV data:', results);
            // Here you would typically validate and process `results` into your DB
            // For now, just logging. Items would be added via UI.
            results.forEach(quoteHeader => {
                // Simulate adding to mock DB if needed for testing list view
                const newQuoteId = `MOCK-QID-CSV-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                MOCK_QUOTES_DB.push({
                    id: newQuoteId,
                    quoteNumber: `Q-CSV-${newQuoteId.slice(-5)}`, // Placeholder number
                    quoteDate: quoteHeader['QuoteDate (YYYY-MM-DD)'] ? new Date(quoteHeader['QuoteDate (YYYY-MM-DD)']).toISOString() : new Date().toISOString(),
                    clientId: quoteHeader['ClientID'],
                    currency: quoteHeader['Currency'] || 'MZN',
                    termsAndConditions: quoteHeader['TermsAndConditions'],
                    notes: quoteHeader['Notes'],
                    subTotal: 0, // Items to be added via UI
                    vatAmount: 0,
                    grandTotal: 0,
                    items: [],
                    status: 'Draft',
                });
            });
            resolve();
          })
          .on('error', (error) => reject(error));
      });
      return NextResponse.json({ message: `Quote headers CSV uploaded and parsed. ${results.length} headers processed. (Data not fully saved to DB yet, items need manual entry)` }, { status: 200 });

    } catch (error: any) {
      console.error('Error handling quote CSV upload:', error);
      return NextResponse.json({ error: 'Failed to handle quote CSV upload.', details: error.message }, { status: 500 });
    }

  } else if (contentType && contentType.includes('application/json')) {
    // JSON Payload for single quote creation (from form)
    try {
      const quoteData = await request.json() as QuotePayload;
      const newQuoteId = `MOCK-QID-${Date.now()}`;
      const newQuote: QuotePayload = {
        ...quoteData,
        id: newQuoteId,
        status: 'Draft',
      };
      MOCK_QUOTES_DB.push(newQuote);
      console.log('Mocked saving quote (JSON):', newQuote);
      return NextResponse.json({ message: 'Quote saved successfully (simulated)', quoteId: newQuoteId }, { status: 201 });
    } catch (error: any) {
      console.error('Error creating quote (JSON):', error);
      return NextResponse.json({ error: 'Failed to create quote.', details: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Unsupported Content-Type for Quotes POST' }, { status: 415 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  let filteredQuotes = MOCK_QUOTES_DB;

  if (month && month !== 'all') {
    filteredQuotes = filteredQuotes.filter(q => {
        const quoteMonth = new Date(q.quoteDate).getMonth() + 1;
        return quoteMonth.toString().padStart(2,'0') === month;
    });
  }
   if (year && year !== 'all') {
    filteredQuotes = filteredQuotes.filter(q => {
        const quoteYear = new Date(q.quoteDate).getFullYear();
        return quoteYear.toString() === year;
    });
  }

  try {
    return NextResponse.json(filteredQuotes.sort((a, b) => new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime()));
  } catch (error) {
    console.error('Error fetching quotes (mock):', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
