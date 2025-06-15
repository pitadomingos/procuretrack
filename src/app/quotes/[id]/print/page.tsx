
'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrintableQuote } from '@/components/quotes/printable-quote';
import { EmailQuoteModal } from '@/components/quotes/email-quote-modal';
import type { QuotePayload } from '@/types';
import { ArrowLeft, Send, Download, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

function PrintQuotePageContent() {
  const router = useRouter();
  const params = useParams();
  const quoteId = params.id as string;
  const { toast } = useToast();

  const [quoteData, setQuoteData] = useState<QuotePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  // const [isDownloading, setIsDownloading] = useState(false); // For PDF download if needed
  const [logoDataUri, setLogoDataUri] = useState<string | undefined>(undefined);


  const fetchQuoteDataForPrint = useCallback(async () => {
    if (!quoteId) return;
    setLoading(true);
    setError(null);
    try {
      const quoteRes = await fetch(`/api/quotes/${quoteId}`); // Mocked API
      if (!quoteRes.ok) {
        const errorData = await quoteRes.json().catch(() => ({ message: 'Failed to fetch quote details.' }));
        throw new Error(errorData.message || `Failed to fetch quote: ${quoteRes.statusText}`);
      }
      const data: QuotePayload = await quoteRes.json();
      setQuoteData(data);

      // Fetch logo (same as PO print page)
      try {
        const logoResponse = await fetch('/jachris-logo.png'); 
        if (logoResponse.ok) {
            const logoBlob = await logoResponse.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoDataUri(reader.result as string);
            };
            reader.readAsDataURL(logoBlob);
        } else {
            console.warn('Client-side logo fetch failed for quote, using default path for preview.');
            setLogoDataUri(undefined); 
        }
      } catch (logoError) {
          console.warn('Error fetching client-side logo for quote:', logoError);
          setLogoDataUri(undefined); 
      }

    } catch (err: any) {
      console.error('Error fetching quote data for printing:', err);
      setError(err.message || 'Failed to load quotation data.');
      toast({ title: "Error", description: `Failed to load quote data: ${err.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [quoteId, toast]);

  useEffect(() => {
    fetchQuoteDataForPrint();
  }, [fetchQuoteDataForPrint]);

  const handlePrint = () => {
    window.print();
  };

  // PDF Download for Quotes - can be implemented similarly to POs if needed
  // const handleDownloadPdf = async () => { ... };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Quotation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-destructive p-4">
        <p className="font-semibold">Error loading Quotation:</p>
        <p className="text-sm mb-4 text-center">{error}</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p>Quotation not found.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="print-page-container bg-gray-100 min-h-screen py-2 print:bg-white print:py-0">
      <div className="print-page-inner-container container mx-auto max-w-4xl print:max-w-full print:p-0">
        <Card className="mb-6 print:hidden shadow-lg">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
              Quote Preview: {quoteData.quoteNumber}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <Button onClick={() => router.back()} variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Close Preview
              </Button>
              <Button onClick={() => setIsEmailModalOpen(true)} size="sm">
                <Send className="mr-2 h-4 w-4" /> Prepare Email to Send Quote
              </Button>
              {/* <Button onClick={handlePrint} size="sm" variant="outline">
                <Printer className="mr-2 h-4 w-4" /> Print Quote
              </Button> */}
              {/* <Button onClick={handleDownloadPdf} disabled={isDownloading} size="sm">
                {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isDownloading ? 'Preparing...' : 'Download PDF'}
              </Button> */}
            </div>
          </CardContent>
        </Card>
        
        <div className="printable-po-content-wrapper bg-white p-2 sm:p-4 print:p-0 shadow-lg">
         <PrintableQuote quoteData={quoteData} logoDataUri={logoDataUri} />
        </div>
      </div>
      {isEmailModalOpen && quoteData && (
        <EmailQuoteModal
          open={isEmailModalOpen}
          onOpenChange={setIsEmailModalOpen}
          quoteData={quoteData}
        />
      )}
    </div>
  );
}

export default function PrintQuotePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /> Loading Quotation Details...</div>}>
      <PrintQuotePageContent />
    </Suspense>
  );
}
