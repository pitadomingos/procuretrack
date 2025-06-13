
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import type { ApprovalQueueItem } from '@/types';
import { Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';

// --- AUTHENTICATION PLACEHOLDER ---
// In a real application, you would get the logged-in user's email from your authentication system.
const MOCK_LOGGED_IN_APPROVER_EMAIL = 'pita.domingos@jachris.com';
// This should match an email in your Approver table for testing.

export default function ApprovalsPage() {
  const [pendingPOs, setPendingPOs] = useState<ApprovalQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  const columns: ColumnDef<ApprovalQueueItem>[] = [
    { 
      accessorKey: 'poNumber', 
      header: 'PO Number',
      cell: (item) => <span className="font-medium">{item.poNumber}</span>
    },
    { 
      accessorKey: 'creationDate', 
      header: 'Created On',
      cell: (item) => format(new Date(item.creationDate), 'PP') // E.g., Jul 29, 2024
    },
    { accessorKey: 'supplierName', header: 'Supplier' },
    { accessorKey: 'requestedByName', header: 'Requested By' },
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
        <p className="text-xs text-muted-foreground mt-2">(Using placeholder email for current user)</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-destructive p-4">
        <p className="font-semibold">Error loading approvals:</p>
        <p className="text-sm mb-4 text-center">{error}</p>
        <Button onClick={fetchPendingApprovals} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">My Pending Approvals</CardTitle>
          <CardDescription>
            Purchase Orders awaiting your approval. 
            (Showing for: <span className="font-semibold">{MOCK_LOGGED_IN_APPROVER_EMAIL}</span> - this is a placeholder for actual user login)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={pendingPOs}
            renderRowActions={(po) => (
              <Link href={`/purchase-orders/${po.id}/print`} passHref legacyBehavior={false}>
                <Button variant="outline" size="sm" title="View & Approve PO">
                  <Eye className="mr-2 h-4 w-4" /> View & Approve
                </Button>
              </Link>
            )}
          />
           {pendingPOs.length === 0 && !loading && (
             <div className="text-center py-8 text-muted-foreground">
                No purchase orders are currently pending your approval.
             </div>
           )}
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground mt-4">
        <strong>Note:</strong> Full authentication and user-specific approval queues will be implemented in a future update.
        Email notifications are also planned.
      </div>
    </div>
  );
}
