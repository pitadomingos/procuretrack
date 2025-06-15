
'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
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

interface RejectPOModalProps {
  poId: number;
  poNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRejected: () => void; // Callback after successful rejection
}

export function RejectPOModal({ poId, poNumber, open, onOpenChange, onRejected }: RejectPOModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/purchase-orders/${poId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }), // Sending reason, though API doesn't store it yet
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to reject PO.' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      toast({ title: 'Success', description: `Purchase Order ${poNumber} has been rejected.` });
      onRejected(); // Trigger refresh or state update in parent
      onOpenChange(false); // Close modal
      setReason(''); // Reset reason
    } catch (error: any) {
      toast({
        title: 'Error Rejecting PO',
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
          <AlertDialogTitle>Reject Purchase Order: {poNumber}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will mark the PO as &quot;Rejected&quot;. The creator will be able to view it but may need to create a new PO or revise it based on feedback (if communicated separately).
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
