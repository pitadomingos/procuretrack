
'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrintableQuote } from '@/components/quotes/printable-quote';
import type { QuotePayload, QuoteStatus, Approver } from '@/types'; 
import { ArrowLeft, Printer, Loader2, Edit, FileText } from 'lucide-react'; // Removed ThumbsUp, ThumbsDown
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
  const [logoDataUri, setLogoDataUri] = useState<string | undefined>(undefined);
  const [isProcessingAction, setIsProcessingAction] = useState(false); // Kept for edit, print potentially


  const fetchQuoteDataForPrint = useCallback(async () => {
    if (!quoteId) return;
    setLoading(true);
    setError(null);
    try {
      const [quoteRes, approversRes] = await Promise.all([
        fetch(`/api/quotes/${quoteId}`),
        fetch('/api/approvers')
      ]);

      if (!quoteRes.ok) {
        let errorDetail = `Server responded with ${quoteRes.status} ${quoteRes.statusText || '(No status text)'}`;
        try {
          const errorData = await quoteRes.json();
          errorDetail = errorData.error || errorData.message || errorDetail; 
        } catch (jsonError) {
          console.warn("Could not parse error response as JSON:", jsonError);
        }
        throw new Error(`Failed to fetch quote: ${errorDetail}`);
      }

      const data: QuotePayload = await quoteRes.json();

      let approverSignatureUrl: string | undefined = undefined;
      if (approversRes.ok && data.status === 'Approved' && data.approverId) {
        const allApprovers: Approver[] = await approversRes.json();
        const approverDetails = allApprovers.find(a => a.id === data.approverId);
        if (approverDetails) {
          approverSignatureUrl = `/signatures/${approverDetails.id}.png`;
        }
      }

      setQuoteData({
        ...data,
        approverSignatureUrl,
      });

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
  
  const handleEditQuote = () => {
    if (!quoteData || !quoteId) return;
    router.push(`/create-document?editQuoteId=${quoteId}`); 
  };


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
  
  const canEdit = quoteData.status === 'Draft' || quoteData.status === 'Pending Approval';
  // Approval actions are removed from this page, handled in /approvals

  return (
    <div className="print-page-container">
      <div className="print-page-inner-container">
        <Card className="mb-6 print:hidden shadow-lg">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
                  Quote: {quoteData.quoteNumber}
                </h1>
                <span className={`text-sm font-semibold px-2 py-1 rounded-md ${
                    quoteData.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    quoteData.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-700' :
                    quoteData.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    quoteData.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700' // Default for 'Sent to Client', 'Archived'
                }`}>
                    {quoteData.status}
                </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <Button onClick={() => router.back()} variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Close
              </Button>
              {canEdit && (
                <Button onClick={handleEditQuote} variant="outline" size="sm" disabled={isProcessingAction}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Quote
                </Button>
              )}
               <Button onClick={handlePrint} size="sm" variant="default">
                <Printer className="mr-2 h-4 w-4" /> Print Quote
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="printable-quote-content-wrapper">
         <PrintableQuote quoteData={quoteData} logoDataUri={logoDataUri} />
        </div>
      </div>
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
