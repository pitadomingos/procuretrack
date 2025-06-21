'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import type { POItemPayload, POReviewItem, PurchaseOrderPayload } from '@/types';

interface ReviewPOModalProps {
  poId: number;
  poNumber: string;
  creatorName: string | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewPOModal({ poId, poNumber, creatorName, open, onOpenChange }: ReviewPOModalProps) {
  const [itemsToReview, setItemsToReview] = useState<POReviewItem[]>([]);
  const [generalComment, setGeneralComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchPOItems = useCallback(async () => {
    if (!poId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/purchase-orders/${poId}/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch PO items.');
      }
      const data: POItemPayload[] = await response.json();
      setItemsToReview(
        data.map((item) => ({
          ...item,
          isChecked: false,
          reviewComment: '',
          totalPrice: (item.quantity || 0) * (item.unitPrice || 0),
        }))
      );
    } catch (error: any) {
      toast({ title: 'Error', description: `Could not load PO items: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [poId, toast]);

  useEffect(() => {
    if (open && poId) {
      fetchPOItems();
    } else if (!open) {
      // Reset state when modal closes
      setItemsToReview([]);
      setGeneralComment('');
    }
  }, [open, poId, fetchPOItems]);

  const handleItemCheckChange = (itemId: number | undefined, checked: boolean) => {
    if (!itemId) return;
    setItemsToReview((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, isChecked: checked } : item))
    );
  };

  const handleItemCommentChange = (itemId: number | undefined, comment: string) => {
     if (!itemId) return;
    setItemsToReview((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, reviewComment: comment } : item))
    );
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    const feedback = {
      poId,
      poNumber,
      creatorName,
      generalComment,
      items: itemsToReview.filter(item => item.isChecked).map(item => ({
        itemId: item.id,
        description: item.description,
        comment: item.reviewComment,
      })),
    };

    console.log('Simulating sending review feedback:', feedback);
    // In a real app, this would be an API call:
    // await fetch(`/api/purchase-orders/${poId}/submit-review`, { method: 'POST', body: JSON.stringify(feedback) });

    toast({
      title: 'Feedback Submitted (Simulated)',
      description: `Review comments for PO ${poNumber} have been noted. An email would be sent to ${creatorName || 'the creator'}.`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '0.00';
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Purchase Order: {poNumber}</DialogTitle>
          <DialogDescription>
            Review items for PO created by {creatorName || 'N/A'}. Check items that require attention and add comments.
            The PO status will remain &quot;Pending Approval&quot;.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading PO items...</p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <ScrollArea className="h-[400px] border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[200px]">Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsToReview.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          id={`item-check-${item.id}`}
                          checked={item.isChecked}
                          onCheckedChange={(checked) => handleItemCheckChange(item.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                      <TableCell>
                        <Textarea
                          id={`item-comment-${item.id}`}
                          value={item.reviewComment}
                          onChange={(e) => handleItemCommentChange(item.id, e.target.value)}
                          placeholder="Item specific comment..."
                          className="h-16 text-xs"
                          disabled={!item.isChecked}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div>
              <Label htmlFor="general-review-comment">General Comments (Optional)</Label>
              <Textarea
                id="general-review-comment"
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                placeholder="Add any overall comments about this PO..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmitReview} disabled={isLoading || isSubmitting || itemsToReview.length === 0}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send Feedback to Creator
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
