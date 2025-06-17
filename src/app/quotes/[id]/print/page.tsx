
'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrintableQuote } from '@/components/quotes/printable-quote';
import type { QuotePayload, Approver } from '@/types'; // Added Approver
import { ArrowLeft, Printer, Loader2, ThumbsUp, ThumbsDown, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockApproversData, MOCK_QUOTES_DB, updateMockQuote } from '@/lib/mock-data'; // For fetching approver names and updating mock DB

function PrintQuotePageContent() {
  const router = useRouter();
  const params = useParams();
  const quoteId = params.id as string;
  const { toast } = useToast();

  const [quoteData, setQuoteData] = useState<QuotePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoDataUri, setLogoDataUri] = useState<string | undefined>(undefined);
  const [isProcessingAction, setIsProcessingAction] = useState(false);


  const fetchQuoteDataForPrint = useCallback(async () => {
    if (!quoteId) return;
    setLoading(true);
    setError(null);
    try {
      // Directly use the shared MOCK_QUOTES_DB for fetching
      const data = MOCK_QUOTES_DB.find(q => q.id === quoteId);
      
      if (!data) {
        // Fallback if not found (e.g., direct navigation to a non-existent mock ID)
        const quoteRes = await fetch(`/api/quotes/${quoteId}`); 
        if (!quoteRes.ok) {
          const errorData = await quoteRes.json().catch(() => ({ message: 'Failed to fetch quote details.' }));
          throw new Error(errorData.message || `Failed to fetch quote: ${quoteRes.statusText}`);
        }
        const fallbackData: QuotePayload = await quoteRes.json();
        setQuoteData(fallbackData);
      } else {
        const populatedData = {...data};
         if (populatedData.approverId) {
            const approver = mockApproversData.find(appr => appr.id === populatedData.approverId);
            populatedData.approverName = approver?.name;
        }
        setQuoteData(populatedData);
      }


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
  
  const handleApproveQuote = async () => {
    if (!quoteData || !quoteData.id) return;
    setIsProcessingAction(true);
    try {
      const response = await fetch(`/api/quotes/${quoteData.id}/approve`, { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Approval failed.' }));
        throw new Error(errorData.error || `Approval failed for Quote ${quoteData.id}.`);
      }
      const result = await response.json();
      toast({ title: "Quote Approved", description: result.message || `${quoteData.quoteNumber} marked as Approved.`});
      // Refetch data to show updated status
      fetchQuoteDataForPrint();
    } catch (err: any) {
      toast({ title: "Error Approving Quote", description: err.message, variant: "destructive" });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleRejectQuote = async () => {
    if (!quoteData || !quoteData.id) return;
    setIsProcessingAction(true);
    try {
      const response = await fetch(`/api/quotes/${quoteData.id}/reject`, { method: 'POST' });
       if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Rejection failed.' }));
        throw new Error(errorData.error || `Rejection failed for Quote ${quoteData.id}.`);
      }
      const result = await response.json();
      toast({ title: "Quote Rejected", description: result.message || `${quoteData.quoteNumber} marked as Rejected.`});
      // Refetch data to show updated status
      fetchQuoteDataForPrint();
    } catch (err: any) {
      toast({ title: "Error Rejecting Quote", description: err.message, variant: "destructive" });
    } finally {
      setIsProcessingAction(false);
    }
  };
  
  const handleEditQuote = () => {
    if (!quoteData || !quoteId) return;
    // This will need a new page or modal for editing quotes.
    // For now, link to create-document with a query param (similar to PO editing)
    // Ensure the QuoteForm can handle an editQuoteId prop if this is the desired UX.
    // Currently, QuoteForm does not have an editQuoteId prop.
    router.push(`/create-document?editQuoteId=${quoteId}`); // Needs QuoteForm to support this
    toast({ title: "Edit Quote", description: "Redirecting to edit (functionality may be partial).", variant: "default"});
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
  const canApproveOrReject = quoteData.status === 'Pending Approval';

  return (
    <div className="print-page-container bg-gray-100 min-h-screen py-2 print:bg-white print:py-0">
      <div className="print-page-inner-container container mx-auto max-w-4xl print:max-w-full print:p-0">
        <Card className="mb-6 print:hidden shadow-lg">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
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
              {canApproveOrReject && (
                <>
                  <Button onClick={handleApproveQuote} size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" disabled={isProcessingAction}>
                    {isProcessingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />} Approve
                  </Button>
                  <Button onClick={handleRejectQuote} size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" disabled={isProcessingAction}>
                    {isProcessingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsDown className="mr-2 h-4 w-4" />} Reject
                  </Button>
                </>
              )}
               <Button onClick={handlePrint} size="sm" variant="default">
                <Printer className="mr-2 h-4 w-4" /> Print Quote
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="printable-po-content-wrapper bg-white p-2 sm:p-4 print:p-0 shadow-lg">
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
