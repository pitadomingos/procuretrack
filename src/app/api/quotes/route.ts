
import { NextResponse } from 'next/server';
import type { QuotePayload, Approver } from '@/types';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { mockApproversData, MOCK_QUOTES_DB, addMockQuote, updateMockQuote } from '@/lib/mock-data';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');

  if (contentType && contentType.includes('multipart/form-data')) {
    console.log('[API_INFO] /api/quotes POST: Received multipart/form-data request for CSV upload.');
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        console.error('[API_ERROR] /api/quotes POST CSV: No file found in formData.');
        return NextResponse.json({ error: 'No file uploaded for quotes' }, { status: 400 });
      }
      console.log(`[API_INFO] /api/quotes POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const results: any[] = [];
      const stream = Readable.from(fileBuffer);
      let firstRecordLogged = false;

      console.log('[API_INFO] /api/quotes POST CSV: Starting CSV parsing...');
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv({
            mapHeaders: ({ header }) => header.trim()
          }))
          .on('headers', (headers) => {
            console.log('[API_INFO] /api/quotes POST CSV: Detected CSV Headers:', headers);
          })
          .on('data', (data) => {
            if (!firstRecordLogged) {
              console.log('[API_DEBUG] /api/quotes POST CSV: First parsed data record from CSV:', data);
              firstRecordLogged = true;
            }
            results.push(data);
          })
          .on('end', () => {
            console.log(`[API_INFO] /api/quotes POST CSV: CSV parsing finished. ${results.length} records found.`);
            results.forEach(quoteHeader => {
                const newQuote: QuotePayload = {
                    id: quoteHeader['ID'] || `MOCK-QID-CSV-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                    quoteNumber: quoteHeader['QuoteNumber'] || `Q-CSV-${(quoteHeader['ID'] || Date.now()).toString().slice(-5)}`,
                    quoteDate: quoteHeader['QuoteDate'] ? new Date(quoteHeader['QuoteDate']).toISOString() : new Date().toISOString(),
                    clientId: quoteHeader['ClientID'],
                    currency: quoteHeader['Currency'] || 'MZN',
                    termsAndConditions: quoteHeader['TermsAndConditions'],
                    notes: quoteHeader['Notes'],
                    subTotal: parseFloat(quoteHeader['SubTotal'] || 0),
                    vatAmount: parseFloat(quoteHeader['VATAmount'] || 0),
                    grandTotal: parseFloat(quoteHeader['GrandTotal'] || 0),
                    items: [],
                    status: (quoteHeader['Status'] || 'Draft') as QuotePayload['status'],
                    approverId: quoteHeader['ApproverID'] || null,
                    creatorEmail: quoteHeader['CreatorEmail'] || 'csv_import@jachris.com',
                };
                addMockQuote(newQuote);
            });
            resolve();
          })
          .on('error', (parseError) => {
            console.error('[API_ERROR] /api/quotes POST CSV: Error during CSV parsing:', parseError);
            reject(parseError);
          });
      });

      if (results.length === 0) {
        console.warn('[API_WARN] /api/quotes POST CSV: CSV file is empty or could not be parsed into records.');
        return NextResponse.json({ message: 'CSV file is empty or yielded no records for quotes.' }, { status: 400 });
      }

      return NextResponse.json({ message: `Quote headers CSV uploaded and parsed. ${results.length} headers processed and added/updated in mock DB.` }, { status: 200 });

    } catch (error: any) {
      console.error('[API_ERROR] /api/quotes POST CSV: Error handling quote CSV upload (outer try-catch):', error);
      return NextResponse.json({ error: 'Failed to handle quote CSV upload.', details: error.message }, { status: 500 });
    }

  } else if (contentType && contentType.includes('application/json')) {
    console.log('[API_INFO] /api/quotes POST: Received application/json request.');
    try {
      const quoteDataFromForm = await request.json() as QuotePayload;
      // addMockQuote handles ID generation if not present, but form should send it
      const newQuote = addMockQuote(quoteDataFromForm);
      console.log(`[API_INFO] /api/quotes POST JSON: Mocked saving quote. ID: ${newQuote.id}, Number: ${newQuote.quoteNumber}. MOCK_QUOTES_DB length: ${MOCK_QUOTES_DB.length}`);
      return NextResponse.json({ message: 'Quote saved successfully (simulated)', quoteId: newQuote.id }, { status: 201 });
    } catch (error: any) {
      console.error('[API_ERROR] /api/quotes POST JSON: Error creating quote:', error);
      return NextResponse.json({ error: 'Failed to create quote.', details: error.message }, { status: 500 });
    }
  } else {
    console.warn(`[API_WARN] /api/quotes POST: Unsupported Content-Type: ${contentType}`);
    return NextResponse.json({ error: 'Unsupported Content-Type for Quotes POST' }, { status: 415 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  let filteredQuotes = MOCK_QUOTES_DB.map(quote => {
    let approverName;
    if (quote.approverId) {
      const approver = mockApproversData.find(appr => appr.id === quote.approverId);
      approverName = approver?.name;
    }
    return { ...quote, approverName };
  });

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
    console.log(`[API_INFO] /api/quotes GET: Returning ${filteredQuotes.length} quotes. MOCK_QUOTES_DB size: ${MOCK_QUOTES_DB.length}`);
    return NextResponse.json(filteredQuotes.sort((a, b) => new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime()));
  } catch (error) {
    console.error('[API_ERROR] /api/quotes GET: Error fetching quotes (mock):', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
