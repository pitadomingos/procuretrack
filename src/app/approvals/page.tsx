
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import type { UnifiedApprovalItem, POApprovalQueueItem, QuoteApprovalQueueItem, RequisitionApprovalQueueItem } from '@/types';
import { Eye, Loader2, ThumbsDown, MessageSquareText, CheckCircle2, RefreshCw, AlertTriangle, FileText, ShoppingBag, ClipboardList as RequisitionListIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { RejectDocumentModal } from '@/components/approvals/RejectDocumentModal';
import { ReviewPOModal } from '@/components/approvals/ReviewPOModal';

// --- AUTHENTICATION PLACEHOLDER ---
const MOCK_LOGGED_IN_APPROVER_EMAIL = 'pita.domingos@jachris.com';

export default function ApprovalsPage() {
  const [pendingItems, setPendingItems] = useState<UnifiedApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [selectedItemForReject, setSelectedItemForReject] = useState<UnifiedApprovalItem | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [selectedPOForReview, setSelectedPOForReview] = useState<UnifiedApprovalItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  const [isProcessingItemId, setIsProcessingItemId] = useState<string | number | null>(null);

  const fetchPendingApprovals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!MOCK_LOGGED_IN_APPROVER_EMAIL) {
        throw new Error("Approver email is not defined (authentication placeholder).");
      }

      const [poResponse, quoteResponse, requisitionResponse] = await Promise.all([
        fetch(`/api/purchase-orders/pending-approval?approverEmail=${encodeURIComponent(MOCK_LOGGED_IN_APPROVER_EMAIL)}`),
        fetch(`/api/quotes/pending-approval?approverEmail=${encodeURIComponent(MOCK_LOGGED_IN_APPROVER_EMAIL)}`),
        fetch(`/api/requisitions/pending-approval?approverEmail=${encodeURIComponent(MOCK_LOGGED_IN_APPROVER_EMAIL)}`)
      ]);

      let allPendingItems: UnifiedApprovalItem[] = [];

      if (poResponse.ok) {
        const poData: POApprovalQueueItem[] = await poResponse.json();
        const mappedPOs: UnifiedApprovalItem[] = poData.map(po => ({
          id: po.id,
          documentType: 'PO',
          documentNumber: po.poNumber,
          creationDate: po.creationDate,
          submittedBy: po.creatorName || po.requestedByName || 'N/A',
          entityName: po.supplierName || 'N/A',
          totalAmount: po.grandTotal,
          currency: po.currency,
          status: po.status,
        }));
        allPendingItems = allPendingItems.concat(mappedPOs);
      } else {
        const poErrorData = await poResponse.json().catch(() => ({ message: 'Failed to fetch PO approvals.' }));
        console.warn('Error fetching PO approvals:', poErrorData.message);
      }

      if (quoteResponse.ok) {
        const quoteData: QuoteApprovalQueueItem[] = await quoteResponse.json();
        const mappedQuotes: UnifiedApprovalItem[] = quoteData.map(quote => ({
          id: quote.id,
          documentType: 'Quote',
          documentNumber: quote.quoteNumber,
          creationDate: quote.quoteDate,
          submittedBy: quote.creatorEmail || 'N/A',
          entityName: quote.clientName || 'N/A',
          totalAmount: quote.grandTotal,
          currency: quote.currency,
          status: quote.status,
        }));
        allPendingItems = allPendingItems.concat(mappedQuotes);
      } else {
        const quoteErrorData = await quoteResponse.json().catch(() => ({ message: 'Failed to fetch Quote approvals.' }));
        console.warn('Error fetching Quote approvals:', quoteErrorData.message);
      }

      if (requisitionResponse.ok) {
        const reqData: RequisitionApprovalQueueItem[] = await requisitionResponse.json();
        const mappedRequisitions: UnifiedApprovalItem[] = reqData.map(req => ({
          id: req.id,
          documentType: 'Requisition',
          documentNumber: req.documentNumber,
          creationDate: req.creationDate,
          submittedBy: req.submittedBy || 'N/A',
          entityName: req.entityName || 'N/A', // Site name/code
          totalAmount: req.totalAmount, 
          currency: req.currency,
          status: req.status,
        }));
        allPendingItems = allPendingItems.concat(mappedRequisitions);
      } else {
        const reqErrorData = await requisitionResponse.json().catch(() => ({ message: 'Failed to fetch Requisition approvals.' }));
        console.warn('Error fetching Requisition approvals:', reqErrorData.message);
      }
      
      allPendingItems.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
      setPendingItems(allPendingItems);

    } catch (err: any) {
      console.error('Error fetching pending approvals:', err);
      setError(err.message || 'Failed to load some or all approval items.');
      toast({ title: "Error", description: `Could not load all approvals: ${err.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const handleOpenRejectModal = (item: UnifiedApprovalItem) => {
    setSelectedItemForReject(item);
    setIsRejectModalOpen(true);
  };

  const handleOpenReviewModal = (item: UnifiedApprovalItem) => {
    if (item.documentType === 'PO') {
      setSelectedPOForReview(item);
      setIsReviewModalOpen(true);
    } else {
      toast({ title: "Info", description: `Review comments for ${item.documentType}s can be added manually after viewing.`});
    }
  };

  const handleApproveItem = async (item: UnifiedApprovalItem) => {
    if (item.status !== 'Pending Approval') {
      toast({ title: "Cannot Approve", description: `${item.documentType} ${item.documentNumber} is not pending approval.`, variant: "destructive" });
      return;
    }
    
    setIsProcessingItemId(item.id);
    let apiUrl = '';
    switch (item.documentType) {
      case 'PO':
        apiUrl = `/api/purchase-orders/${item.id}/approve`;
        break;
      case 'Quote':
        apiUrl = `/api/quotes/${item.id}/approve`;
        break;
      case 'Requisition':
        apiUrl = `/api/requisitions/${item.id}/approve`;
        break;
      default:
        toast({title: "Error", description: "Invalid document type for approval.", variant: "destructive"});
        setIsProcessingItemId(null);
        return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Approval failed.' }));
        throw new Error(errorData.error || `Approval failed for ${item.documentType} ${item.id}.`);
      }

      const result = await response.json();
      toast({
        title: "Success!",
        description: result.message || `${item.documentType} ${item.documentNumber} approved.`,
      });
      fetchPendingApprovals(); 
    } catch (err: any) {
      toast({ title: `Error Approving ${item.documentType}`, description: err.message, variant: 'destructive' });
    } finally {
      setIsProcessingItemId(null);
    }
  };
  
  const handleRejectConfirmed = () => { 
    fetchPendingApprovals();
    setSelectedItemForReject(null);
  };

  const columns: ColumnDef<UnifiedApprovalItem>[] = [
    { 
      accessorKey: 'documentType', 
      header: 'Type',
      cell: (item: UnifiedApprovalItem) => { 
        if (item.documentType === 'PO') return <span className="flex items-center"><ShoppingBag className="mr-2 h-4 w-4 text-blue-500" /> PO</span>;
        if (item.documentType === 'Quote') return <span className="flex items-center"><FileText className="mr-2 h-4 w-4 text-green-500" /> Quote</span>;
        if (item.documentType === 'Requisition') return <span className="flex items-center"><RequisitionListIcon className="mr-2 h-4 w-4 text-purple-500" /> Requisition</span>;
        return item.documentType;
      }
    },
    { 
      accessorKey: 'documentNumber', 
      header: 'Doc. Number',
      cell: (item: UnifiedApprovalItem) => <span className="font-medium">{item.documentNumber}</span>
    },
    { 
      accessorKey: 'creationDate', 
      header: 'Created On',
      cell: (item: UnifiedApprovalItem) => format(new Date(item.creationDate), 'PP')
    },
    { 
      accessorKey: 'submittedBy', 
      header: 'Submitted By',
      cell: (item: UnifiedApprovalItem) => item.submittedBy || 'N/A'
    },
    { 
      accessorKey: 'entityName', 
      header: 'Supplier/Client/Site',
      cell: (item: UnifiedApprovalItem) => item.entityName || 'N/A'
    },
    { 
      accessorKey: 'totalAmount', 
      header: 'Total Amount',
      cell: (item: UnifiedApprovalItem) => { 
        if (item.totalAmount === null || item.totalAmount === undefined) return 'N/A';
        return `${item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${item.currency || ''}`;
      }
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: (item: UnifiedApprovalItem) => <span className="text-orange-600 font-semibold">{item.status}</span>
    },
  ];

  if (loading && !pendingItems.length) { 
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading pending approvals for {MOCK_LOGGED_IN_APPROVER_EMAIL}...</p>
      </div>
    );
  }

  if (error && !pendingItems.length) { 
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-destructive p-4">
        <AlertTriangle className="h-10 w-10 mb-3" />
        <p className="font-semibold text-center mb-2">Error loading approvals:</p>
        <p className="text-sm text-center mb-4">{error}</p>
        <Button onClick={fetchPendingApprovals} variant="outline" className="border-destructive text-destructive-foreground hover:bg-destructive/20">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-2xl">My Pending Approvals</CardTitle>
            <CardDescription>
              Documents awaiting your approval. (Showing for: <span className="font-semibold">{MOCK_LOGGED_IN_APPROVER_EMAIL}</span>)
            </CardDescription>
          </div>
          <Button onClick={fetchPendingApprovals} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh List'}
          </Button>
        </CardHeader>
        <CardContent>
          {loading && pendingItems.length > 0 && ( 
            <div className="flex items-center justify-center py-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Refreshing data...</span>
            </div>
          )}
          {error && pendingItems.length > 0 && ( 
            <div className="mb-4 p-3 border-l-4 border-destructive bg-destructive/10 text-destructive-foreground flex items-start text-sm">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Failed to refresh fully:</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          <DataTable
            columns={columns}
            data={pendingItems}
            renderRowActions={(item) => {
              let viewPath = '';
              if (item.documentType === 'PO') viewPath = `/purchase-orders/${item.id}/print`;
              else if (item.documentType === 'Quote') viewPath = `/quotes/${item.id}/print`;
              else if (item.documentType === 'Requisition') viewPath = `/requisitions/${item.id}/print`;
              
              return (
                <div className="space-x-1">
                  {viewPath && (
                    <Link href={viewPath} passHref legacyBehavior={false}>
                      <Button variant="ghost" size="sm" title={`View ${item.documentType} Details`}>
                        <Eye className="mr-1 h-4 w-4 text-muted-foreground" /> View
                      </Button>
                    </Link>
                  )}
                  <Button 
                      variant="outline" 
                      size="sm" 
                      title={`Approve ${item.documentType}`}
                      onClick={() => handleApproveItem(item)}
                      disabled={isProcessingItemId === item.id}
                      className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700 hover:bg-green-50"
                  >
                    {isProcessingItemId === item.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-1 h-4 w-4" />} 
                    Approve
                  </Button>
                  {item.documentType === 'PO' && ( 
                    <Button variant="outline" size="sm" title="Review PO" onClick={() => handleOpenReviewModal(item)} className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700 hover:bg-blue-50">
                      <MessageSquareText className="mr-1 h-4 w-4" /> Review
                    </Button>
                  )}
                   <Button variant="outline" size="sm" title={`Reject ${item.documentType}`} onClick={() => handleOpenRejectModal(item)} className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700 hover:bg-red-50">
                    <ThumbsDown className="mr-1 h-4 w-4" /> Reject
                  </Button>
                </div>
              );
            }}
          />
           {pendingItems.length === 0 && !loading && !error && (
             <div className="text-center py-8 text-muted-foreground">
                No documents are currently pending your approval.
             </div>
           )}
        </CardContent>
      </Card>

      {selectedItemForReject && (
        <RejectDocumentModal
          documentId={selectedItemForReject.id}
          documentNumber={selectedItemForReject.documentNumber}
          documentType={selectedItemForReject.documentType}
          open={isRejectModalOpen}
          onOpenChange={setIsRejectModalOpen}
          onRejected={handleRejectConfirmed}
        />
      )}

      {selectedPOForReview && selectedPOForReview.documentType === 'PO' && (
        <ReviewPOModal
          poId={selectedPOForReview.id as number} 
          poNumber={selectedPOForReview.documentNumber}
          creatorName={selectedPOForReview.submittedBy}
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
    