
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

const DEFAULT_EMAIL_SUBJECT_PREFIX = "Quotation from Jachris Mozambique - Ref:";

const JACHRIS_COMPANY_DETAILS = { // Duplicated for simplicity, ideally from a shared config
  name: 'JACHRIS MOZAMBIQUE (LTD)',
  contactLine1: 'M: +258 85 545 8462 | +27 (0)11 813 4009',
  website: 'www.jachris.com',
};

// Refactored DEFAULT_EMAIL_BODY to accept quoteData
const generateDefaultEmailBody = (quoteDataForBody: QuotePayload) => `Dear ${quoteDataForBody.clientName || 'Valued Client'},

Please find attached our quotation ${quoteDataForBody.quoteNumber} for your review.

This quotation includes:
${(quoteDataForBody.items || []).map(item => `- ${item.description} (Part No: ${item.partNumber || 'N/A'}, Cust Ref: ${item.customerRef || 'N/A'}, Qty: ${item.quantity})`).join('\n')}

Total Amount: ${quoteDataForBody.currency} ${quoteDataForBody.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

${quoteDataForBody.termsAndConditions ? `Terms & Conditions:\n${quoteDataForBody.termsAndConditions}\n` : ''}
${quoteDataForBody.notes ? `Additional Notes:\n${quoteDataForBody.notes}\n` : ''}

We trust this meets your approval and look forward to your confirmation.

Best regards,

The Jachris Mozambique Sales Team
${JACHRIS_COMPANY_DETAILS.website}
${JACHRIS_COMPANY_DETAILS.contactLine1}
`;


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
      // Determine CC email using quoteData within the effect
      const creatorCC = quoteData.creatorEmail || 'my.email@jachris.com'; // Fallback if quoteData.creatorEmail is not set
      setCcEmails(creatorCC);
      setSubject(`${DEFAULT_EMAIL_SUBJECT_PREFIX} ${quoteData.quoteNumber} for ${quoteData.clientName || 'Your Company'}`);
      // Generate email body using the new function and current quoteData
      setBody(generateDefaultEmailBody(quoteData));
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
