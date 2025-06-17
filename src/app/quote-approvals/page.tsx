
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
// Assuming QuoteApprovalQueueItem will be a simplified version of QuotePayload for the queue
import type { QuotePayload } from '@/types'; // Using full QuotePayload for now, can be refined
import { Eye, Loader2, ThumbsDown, MessageSquareText, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
// Placeholder for modals, can adapt from PO modals if needed
// import { RejectQuoteModal } from '@/components/quotes/RejectQuoteModal'; 
// import { ReviewQuoteModal } from '@/components/quotes/ReviewQuoteModal';

// --- AUTHENTICATION PLACEHOLDER ---
const MOCK_LOGGED_IN_APPROVER_EMAIL = 'pita.domingos@jachris.com'; // Should match an email in your Approver table

interface QuoteApprovalQueueItem extends Omit<QuotePayload, 'items'> {
    // Simplified for queue display
    clientName?: string; // Already in QuotePayload, but ensure it's used
}


export default function QuoteApprovalsPage() {
  const [pendingQuotes, setPendingQuotes] = useState<QuoteApprovalQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [isProcessingQuoteId, setIsProcessingQuoteId] = useState<string | null>(null);

  // const [selectedQuoteForReject, setSelectedQuoteForReject] = useState<QuoteApprovalQueueItem | null>(null);
  // const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // const [selectedQuoteForReview, setSelectedQuoteForReview] = useState<QuoteApprovalQueueItem | null>(null);
  // const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  const fetchPendingQuoteApprovals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!MOCK_LOGGED_IN_APPROVER_EMAIL) {
        throw new Error("Approver email is not defined (authentication placeholder).");
      }
      const response = await fetch(`/api/quotes/pending-approval?approverEmail=${encodeURIComponent(MOCK_LOGGED_IN_APPROVER_EMAIL)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch pending quote approvals. Server returned an unreadable error.' }));
        throw new Error(errorData.message || `Failed to load quote approvals: ${response.statusText}`);
      }
      const data: QuoteApprovalQueueItem[] = await response.json();
      setPendingQuotes(data);
    } catch (err: any) {
      console.error('Error fetching pending quote approvals:', err);
      setError(err.message || 'Failed to load quote approvals.');
      toast({ title: "Error", description: `Could not load quote approvals: ${err.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPendingQuoteApprovals();
  }, [fetchPendingQuoteApprovals]);

  const handleApproveQuote = async (quote: QuoteApprovalQueueItem) => {
    if (!quote.id || quote.status !== 'Pending Approval') {
      toast({ title: "Cannot Approve", description: `Quote ${quote.quoteNumber} is not pending approval.`, variant: "destructive" });
      return;
    }
    
    setIsProcessingQuoteId(quote.id);
    try {
      const response = await fetch(`/api/quotes/${quote.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Approval failed.' }));
        throw new Error(errorData.error || `Approval failed for Quote ${quote.id}.`);
      }

      const result = await response.json();
      toast({
        title: "Success!",
        description: result.message || `Quote ${quote.quoteNumber} approved.`,
      });
      fetchPendingQuoteApprovals(); // Refresh data
    } catch (err: any) {
      toast({ title: 'Error Approving Quote', description: err.message, variant: 'destructive' });
    } finally {
      setIsProcessingQuoteId(null);
    }
  };

  const handleRejectQuote = async (quote: QuoteApprovalQueueItem) => {
    if (!quote.id || quote.status !== 'Pending Approval') {
      toast({ title: "Cannot Reject", description: `Quote ${quote.quoteNumber} is not pending approval.`, variant: "destructive" });
      return;
    }
    
    setIsProcessingQuoteId(quote.id);
    try {
      const response = await fetch(`/api/quotes/${quote.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ reason: "Rejected via queue" }) // Optional: if reject modal is not used
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Rejection failed.' }));
        throw new Error(errorData.error || `Rejection failed for Quote ${quote.id}.`);
      }

      const result = await response.json();
      toast({
        title: "Success!",
        description: result.message || `Quote ${quote.quoteNumber} rejected.`,
      });
      fetchPendingQuoteApprovals(); // Refresh data
    } catch (err: any) {
      toast({ title: 'Error Rejecting Quote', description: err.message, variant: 'destructive' });
    } finally {
      setIsProcessingQuoteId(null);
    }
  };


  const columns: ColumnDef<QuoteApprovalQueueItem>[] = [
    { 
      accessorKey: 'quoteNumber', 
      header: 'Quote Number',
      cell: ({ row }) => <span className="font-medium">{row.original.quoteNumber}</span>
    },
    { 
      accessorKey: 'quoteDate', 
      header: 'Created On',
      cell: ({ row }) => format(new Date(row.original.quoteDate), 'PP')
    },
    { 
      accessorKey: 'clientName', 
      header: 'Client',
      cell: ({ row }) => row.original.clientName || 'N/A'
    },
    { 
      accessorKey: 'grandTotal', 
      header: 'Total Amount',
      cell: ({ row }) => `${row.original.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${row.original.currency}`
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: ({ row }) => <span className="text-orange-600 font-semibold">{row.original.status}</span>
    },
  ];

  if (loading && !pendingQuotes.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading pending quote approvals for {MOCK_LOGGED_IN_APPROVER_EMAIL}...</p>
      </div>
    );
  }

  if (error && !pendingQuotes.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-destructive p-4">
        <AlertTriangle className="h-10 w-10 mb-3" />
        <p className="font-semibold text-center mb-2">Error loading quote approvals:</p>
        <p className="text-sm text-center mb-4">{error}</p>
        <Button onClick={fetchPendingQuoteApprovals} variant="outline" className="border-destructive text-destructive-foreground hover:bg-destructive/20">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-2xl">My Pending Quote Approvals</CardTitle>
            <CardDescription>
              Client Quotations awaiting your approval. (Showing for: <span className="font-semibold">{MOCK_LOGGED_IN_APPROVER_EMAIL}</span>)
            </CardDescription>
          </div>
          <Button onClick={fetchPendingQuoteApprovals} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh List'}
          </Button>
        </CardHeader>
        <CardContent>
          {loading && pendingQuotes.length > 0 && (
            <div className="flex items-center justify-center py-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> <span>Refreshing data...</span>
            </div>
          )}
          {error && pendingQuotes.length > 0 && (
            <div className="mb-4 p-3 border-l-4 border-destructive bg-destructive/10 text-destructive-foreground flex items-start text-sm">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div> <p className="font-semibold">Failed to refresh:</p> <p>{error}</p> </div>
            </div>
          )}
          <DataTable
            columns={columns}
            data={pendingQuotes}
            renderRowActions={(quote) => (
              <div className="space-x-1">
                <Link href={`/quotes/${quote.id}/print`} passHref legacyBehavior={false}>
                  <Button variant="ghost" size="sm" title="View Quote Details">
                    <Eye className="mr-1 h-4 w-4 text-muted-foreground" /> View
                  </Button>
                </Link>
                <Button 
                    variant="outline" size="sm" title="Approve Quote" 
                    onClick={() => handleApproveQuote(quote)}
                    disabled={isProcessingQuoteId === quote.id}
                    className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700 hover:bg-green-50"
                >
                  {isProcessingQuoteId === quote.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-1 h-4 w-4" />} Approve
                </Button>
                {/* Review Modal Placeholder - Add if needed
                <Button variant="outline" size="sm" title="Review Quote" onClick={() => {}} className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700 hover:bg-blue-50">
                  <MessageSquareText className="mr-1 h-4 w-4" /> Review
                </Button> */}
                <Button 
                    variant="outline" size="sm" title="Reject Quote"
                    onClick={() => handleRejectQuote(quote)} // Direct reject or open modal
                    disabled={isProcessingQuoteId === quote.id}
                    className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700 hover:bg-red-50">
                  <ThumbsDown className="mr-1 h-4 w-4" /> Reject
                </Button>
              </div>
            )}
          />
           {pendingQuotes.length === 0 && !loading && !error && (
             <div className="text-center py-8 text-muted-foreground">
                No client quotations are currently pending your approval.
             </div>
           )}
        </CardContent>
      </Card>
       <div className="text-center text-xs text-muted-foreground mt-4">
        <strong>Note:</strong> Quote approval workflow uses mock data. Full backend integration and notifications are pending.
      </div>
    </div>
  );
}
