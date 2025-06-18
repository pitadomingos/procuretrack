
'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { UnifiedApprovalItem } from '@/types';


interface RejectDocumentModalProps {
  documentId: string | number;
  documentNumber: string;
  documentType: UnifiedApprovalItem['documentType'];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRejected: () => void; 
}

export function RejectDocumentModal({ documentId, documentNumber, documentType, open, onOpenChange, onRejected }: RejectDocumentModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleReject = async () => {
    setIsSubmitting(true);
    let apiUrl = '';
    switch (documentType) {
      case 'PO':
        apiUrl = `/api/purchase-orders/${documentId}/reject`;
        break;
      case 'Quote':
        apiUrl = `/api/quotes/${documentId}/reject`;
        break;
      case 'Requisition':
        apiUrl = `/api/requisitions/${documentId}/reject`;
        break;
      default:
        toast({ title: 'Error', description: 'Invalid document type for rejection.', variant: 'destructive' });
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }), // API might not use reason, but good to send
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Failed to reject ${documentType}.` }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      toast({ title: 'Success', description: `${documentType} ${documentNumber} has been rejected.` });
      onRejected(); 
      onOpenChange(false);
      setReason('');
    } catch (error: any) {
      toast({
        title: `Error Rejecting ${documentType}`,
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject {documentType}: {documentNumber}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will mark the {documentType.toLowerCase()} as &quot;Rejected&quot;. The creator will be able to view it but may need to create a new one or revise it based on feedback (if communicated separately).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
          <Textarea
            id="rejection-reason"
            placeholder="Provide a reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
           <p className="text-xs text-muted-foreground">Note: Rejection reasons are not currently stored in the database but this field is provided for future use.</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <Button onClick={handleReject} disabled={isSubmitting} variant="destructive">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Confirm Reject
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
