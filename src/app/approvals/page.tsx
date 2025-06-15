
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import type { ApprovalQueueItem } from '@/types';
import { Eye, Loader2, ThumbsDown, MessageSquareText, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { RejectPOModal } from '@/components/approvals/RejectPOModal';
import { ReviewPOModal } from '@/components/approvals/ReviewPOModal';

// --- AUTHENTICATION PLACEHOLDER ---
const MOCK_LOGGED_IN_APPROVER_EMAIL = 'pita.domingos@jachris.com'; // Should match an email in your Approver table

export default function ApprovalsPage() {
  const [pendingPOs, setPendingPOs] = useState<ApprovalQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [selectedPOForReject, setSelectedPOForReject] = useState<ApprovalQueueItem | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [selectedPOForReview, setSelectedPOForReview] = useState<ApprovalQueueItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  const [isApprovingPoId, setIsApprovingPoId] = useState<number | null>(null);


  const fetchPendingApprovals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!MOCK_LOGGED_IN_APPROVER_EMAIL) {
        throw new Error("Approver email is not defined (authentication placeholder).");
      }
      const response = await fetch(`/api/purchase-orders/pending-approval?approverEmail=${encodeURIComponent(MOCK_LOGGED_IN_APPROVER_EMAIL)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch pending approvals. Server returned an unreadable error.' }));
        throw new Error(errorData.message || `Failed to load approvals: ${response.statusText}`);
      }
      const data: ApprovalQueueItem[] = await response.json();
      setPendingPOs(data);
    } catch (err: any) {
      console.error('Error fetching pending approvals:', err);
      setError(err.message || 'Failed to load approvals.');
      toast({ title: "Error", description: `Could not load approvals: ${err.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const handleOpenRejectModal = (po: ApprovalQueueItem) => {
    setSelectedPOForReject(po);
    setIsRejectModalOpen(true);
  };

  const handleOpenReviewModal = (po: ApprovalQueueItem) => {
    setSelectedPOForReview(po);
    setIsReviewModalOpen(true);
  };

  const handleApprovePO = async (po: ApprovalQueueItem) => {
    if (po.status !== 'Pending Approval') {
      toast({ title: "Cannot Approve", description: `PO ${po.poNumber} is not pending approval.`, variant: "destructive" });
      return;
    }
    
    setIsApprovingPoId(po.id);
    try {
      const response = await fetch(`/api/purchase-orders/${po.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
            error: 'Approval failed.', 
            details: `Server responded with status: ${response.status} ${response.statusText}`,
        }));
        let clientErrorMessage = errorData.error || `Approval failed for PO ${po.id}.`;
        if (errorData.details) clientErrorMessage += ` Details: ${errorData.details}`;
        throw new Error(clientErrorMessage);
      }

      const result = await response.json();
      toast({
        title: "Success!",
        description: result.message || `Purchase Order ${po.poNumber} approved.`,
      });
      fetchPendingApprovals(); // Refresh data to show new status
    } catch (err: any) {
      console.error(`Error approving PO (client-side catch):`, err); 
      let errorMessage = 'Could not approve the PO.';
      if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }
      toast({
        title: 'Error Approving PO',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsApprovingPoId(null);
    }
  };

  const columns: ColumnDef<ApprovalQueueItem>[] = [
    { 
      accessorKey: 'poNumber', 
      header: 'PO Number',
      cell: (item) => <span className="font-medium">{item.poNumber}</span>
    },
    { 
      accessorKey: 'creationDate', 
      header: 'Created On',
      cell: (item) => format(new Date(item.creationDate), 'PP')
    },
    { 
      accessorKey: 'creatorName', 
      header: 'Creator',
      cell: (item) => item.creatorName || 'N/A'
    },
    { 
      accessorKey: 'supplierName', 
      header: 'Supplier',
      cell: (item) => item.supplierName || 'N/A'
    },
    { 
      accessorKey: 'requestedByName', 
      header: 'Requested By',
      cell: (item) => item.requestedByName || 'N/A'
    },
    { 
      accessorKey: 'grandTotal', 
      header: 'Total Amount',
      cell: (item) => `${item.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${item.currency}`
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: (item) => <span className="text-orange-600 font-semibold">{item.status}</span>
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading pending approvals for {MOCK_LOGGED_IN_APPROVER_EMAIL}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-destructive p-4">
        <p className="font-semibold">Error loading approvals:</p>
        <p className="text-sm mb-4 text-center">{error}</p>
        <Button onClick={fetchPendingApprovals} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">My Pending Approvals</CardTitle>
          <CardDescription>
            Purchase Orders awaiting your approval. (Showing for: <span className="font-semibold">{MOCK_LOGGED_IN_APPROVER_EMAIL}</span>)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={pendingPOs}
            renderRowActions={(po) => (
              <div className="space-x-1">
                <Link href={`/purchase-orders/${po.id}/print`} passHref legacyBehavior={false}>
                  <Button variant="ghost" size="sm" title="View PO Details">
                    <Eye className="mr-1 h-4 w-4 text-muted-foreground" /> View
                  </Button>
                </Link>
                <Button 
                    variant="outline" 
                    size="sm" 
                    title="Approve PO" 
                    onClick={() => handleApprovePO(po)}
                    disabled={isApprovingPoId === po.id}
                    className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700 hover:bg-green-50"
                >
                  {isApprovingPoId === po.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-1 h-4 w-4" />} 
                  Approve
                </Button>
                <Button variant="outline" size="sm" title="Review PO" onClick={() => handleOpenReviewModal(po)} className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700 hover:bg-blue-50">
                  <MessageSquareText className="mr-1 h-4 w-4" /> Review
                </Button>
                <Button variant="outline" size="sm" title="Reject PO" onClick={() => handleOpenRejectModal(po)} className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700 hover:bg-red-50">
                  <ThumbsDown className="mr-1 h-4 w-4" /> Reject
                </Button>
              </div>
            )}
          />
           {pendingPOs.length === 0 && !loading && (
             <div className="text-center py-8 text-muted-foreground">
                No purchase orders are currently pending your approval.
             </div>
           )}
        </CardContent>
      </Card>

      {selectedPOForReject && (
        <RejectPOModal
          poId={selectedPOForReject.id}
          poNumber={selectedPOForReject.poNumber}
          open={isRejectModalOpen}
          onOpenChange={setIsRejectModalOpen}
          onRejected={() => {
            fetchPendingApprovals(); 
            setSelectedPOForReject(null);
          }}
        />
      )}

      {selectedPOForReview && (
        <ReviewPOModal
          poId={selectedPOForReview.id}
          poNumber={selectedPOForReview.poNumber}
          creatorName={selectedPOForReview.creatorName}
          open={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
        />
      )}
       <div className="text-center text-xs text-muted-foreground mt-4">
        <strong>Note:</strong> Full authentication and user-specific approval queues will be implemented in a future update.
        Email notifications for review feedback are simulated.
      </div>
    </div>
  );
}
