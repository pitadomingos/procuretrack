
'use client';

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Paperclip } from 'lucide-react';
import type { QuotePayload } from '@/types';

interface EmailQuoteModalProps {
  quoteData: QuotePayload;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Placeholder for current user's email - replace with actual auth context later
const MOCK_SENDER_EMAIL = 'sales.moz@jachris.com'; // Jachris sales email
const MOCK_CREATOR_EMAIL_FOR_CC = quoteData?.creatorEmail || 'my.email@jachris.com'; // Creator's email from quote or a fallback

const DEFAULT_EMAIL_SUBJECT_PREFIX = "Quotation from Jachris Mozambique - Ref:";
const DEFAULT_EMAIL_BODY = (quoteNumber: string, clientName: string | undefined) => `Dear ${clientName || 'Valued Client'},

Please find attached our quotation ${quoteNumber} for your review.

This quotation includes:
${quoteData.items.map(item => `- ${item.description} (Qty: ${item.quantity})`).join('\n')}

Total Amount: ${quoteData.currency} ${quoteData.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

${quoteData.termsAndConditions ? `Terms & Conditions:\n${quoteData.termsAndConditions}\n` : ''}
${quoteData.notes ? `Additional Notes:\n${quoteData.notes}\n` : ''}

We trust this meets your approval and look forward to your confirmation.

Best regards,

The Jachris Mozambique Sales Team
${JACHRIS_COMPANY_DETAILS.website}
${JACHRIS_COMPANY_DETAILS.contactLine1}
`;

const JACHRIS_COMPANY_DETAILS = { // Duplicated for simplicity, ideally from a shared config
  name: 'JACHRIS MOZAMBIQUE (LTD)',
  contactLine1: 'M: +258 85 545 8462 | +27 (0)11 813 4009',
  website: 'www.jachris.com',
};


export function EmailQuoteModal({ quoteData, open, onOpenChange }: EmailQuoteModalProps) {
  const [toEmail, setToEmail] = useState('');
  const [ccEmails, setCcEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (quoteData) {
      setToEmail(quoteData.clientEmail || '');
      const creatorCC = quoteData.creatorEmail || MOCK_CREATOR_EMAIL_FOR_CC;
      setCcEmails(creatorCC); // Default CC to creator
      setSubject(`${DEFAULT_EMAIL_SUBJECT_PREFIX} ${quoteData.quoteNumber} for ${quoteData.clientName || 'Your Company'}`);
      setBody(DEFAULT_EMAIL_BODY(quoteData.quoteNumber, quoteData.clientName));
    }
  }, [quoteData, open]); // Re-populate when modal opens or quoteData changes

  const handleSendEmail = async () => {
    setIsSending(true);
    
    // Simulate sending email
    console.log('---- SIMULATING EMAIL SEND ----');
    console.log('To:', toEmail);
    console.log('CC:', ccEmails.split(',').map(e => e.trim()).filter(e => e));
    console.log('Subject:', subject);
    console.log('Body:\n', body);
    console.log('Attachment: Quote PDF (simulated)');
    console.log('---- END SIMULATION ----');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Email Sent (Simulated)',
      description: `Quotation ${quoteData.quoteNumber} would be emailed to ${toEmail}.`,
    });
    
    setIsSending(false);
    onOpenChange(false); // Close modal after "sending"
  };

  if (!quoteData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Quotation: {quoteData.quoteNumber}</DialogTitle>
          <DialogDescription>
            Configure and send the quotation email to {quoteData.clientName || 'the client'}.
            The quote PDF will be attached automatically (simulated).
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-1">
            <Label htmlFor="to-email">To:</Label>
            <Input id="to-email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} placeholder="client@example.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cc-emails">CC: (comma-separated)</Label>
            <Input id="cc-emails" value={ccEmails} onChange={(e) => setCcEmails(e.target.value)} placeholder="colleague1@example.com, colleague2@example.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="subject">Subject:</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="body">Body:</Label>
            <Textarea 
              id="body" 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              className="min-h-[250px] text-sm" 
            />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Paperclip className="h-4 w-4 mr-2" />
            <span>{quoteData.quoteNumber}.pdf (Attachment - Simulated)</span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSending}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSendEmail} disabled={isSending || !toEmail || !subject || !body}>
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Need to redefine JACHRIS_COMPANY_DETAILS and DEFAULT_EMAIL_BODY within the component or pass them if they depend on quoteData for now.
// For this structure, putting them inside the file is simpler.
// Re-defining quoteData inside DEFAULT_EMAIL_BODY (global scope) leads to reference error.
// The solution is to make DEFAULT_EMAIL_BODY a function that takes quoteData.
