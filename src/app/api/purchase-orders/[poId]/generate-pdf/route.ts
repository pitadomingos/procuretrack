
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
// Removed: ReactDOMServer, PrintablePO, fs, path, React, pool, type imports (if only used for direct render)

export async function GET(
  request: Request,
  { params }: { params: { poId: string } }
) {
  const { poId } = params;
  const numericPoId = Number(poId);

  if (!poId || isNaN(numericPoId)) {
    return NextResponse.json({ error: 'Valid Purchase Order ID is required' }, { status: 400 });
  }

  try {
    // Determine the base URL for fetching the internal print page.
    // This might need to be more robust in production (e.g., from environment variables).
    const internalPageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/internal-print-po/${poId}`;
    
    console.log(`Fetching HTML for PDF generation from: ${internalPageUrl}`);

    const response = await fetch(internalPageUrl, { cache: 'no-store' }); // Fetch the internal page
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching internal print page: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch HTML for PDF generation. Status: ${response.status}. Details: ${errorText.substring(0, 200)}`);
    }
    
    const htmlContent = await response.text();

    if (!htmlContent) {
        throw new Error('Fetched HTML content for PDF generation is empty.');
    }
    
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] // Added --disable-dev-shm-usage
    });
    const page = await browser.newPage();
    
    // Set content and emulate print media type.
    // This allows CSS media queries for print to apply.
    // We are injecting the full HTML, so it should contain its own styles or link to them.
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); 
    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm', // Reduced margins slightly
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    await browser.close();

    // Extract PO number from HTML for filename (simple parsing, could be improved)
    let poNumberForFile = `PO-${poId}`;
    const titleMatch = htmlContent.match(/<title>Purchase Order (PO-.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
        poNumberForFile = titleMatch[1];
    }


    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${poNumberForFile}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error(`Error generating PDF for PO ${poId}:`, error);
    return NextResponse.json({ 
        error: 'Failed to generate PDF.', 
        details: error.message, 
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
