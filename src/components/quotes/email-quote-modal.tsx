
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
import { Loader2, Send, Paperclip, ExternalLink } from 'lucide-react'; // Added ExternalLink
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
  const [isPreparing, setIsPreparing] = useState(false); // Changed from isSending
  const { toast } = useToast();

  useEffect(() => {
    if (quoteData) {
      setToEmail(quoteData.clientEmail || '');
      const creatorCC = quoteData.creatorEmail || MOCK_SENDER_EMAIL; // Use placeholder if creator not set
      setCcEmails(creatorCC);
      setSubject(`${DEFAULT_EMAIL_SUBJECT_PREFIX} ${quoteData.quoteNumber} for ${quoteData.clientName || 'Your Company'}`);
      setBody(generateDefaultEmailBody(quoteData));
    }
  }, [quoteData, open]);

  const handlePrepareEmail = async () => {
    setIsPreparing(true);

    const mailtoTo = encodeURIComponent(toEmail);
    const mailtoCc = encodeURIComponent(ccEmails.split(',').map(e => e.trim()).filter(e => e).join(','));
    const mailtoSubject = encodeURIComponent(subject);
    const mailtoBody = encodeURIComponent(body);

    let mailtoUrl = `mailto:${mailtoTo}?subject=${mailtoSubject}`;
    if (mailtoCc) {
      mailtoUrl += `&cc=${mailtoCc}`;
    }
    mailtoUrl += `&body=${mailtoBody}`;
    
    // Log for debugging, especially if mailto doesn't work as expected
    console.log("Constructed mailto URL:", mailtoUrl);
    if (mailtoUrl.length > 2000) { // Common limit for mailto URLs, varies by client
        console.warn("Mailto URL is very long and might be truncated by some email clients.");
    }

    // Attempt to open mailto link
    // Using window.open for potentially better behavior than direct assignment in some browsers for _blank
    // However, for mailto, direct assignment or a simple link click is often more reliable.
    // Let's try direct assignment first as it's simpler and often works well for mailto.
    window.location.href = mailtoUrl;

    toast({
      title: 'Email Ready to Prepare',
      description: `Your default email client should open. Please review the email, attach the quote PDF (${quoteData.quoteNumber}.pdf), and send.`,
      duration: 8000, // Longer duration for this type of message
    });

    setIsPreparing(false);
    onOpenChange(false); // Close modal
  };

  if (!quoteData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Prepare Email for Quotation: {quoteData.quoteNumber}</DialogTitle>
          <DialogDescription>
            Review and edit the details below. Clicking &quot;Open in Email Client&quot; will prepare a new email in your default mail application.
            <span className="font-semibold block mt-1">You will need to manually attach the quote PDF.</span>
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
            <span>To be attached manually: {quoteData.quoteNumber}.pdf</span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPreparing}>Cancel</Button>
          </DialogClose>
          <Button onClick={handlePrepareEmail} disabled={isPreparing || !toEmail || !subject || !body}>
            {isPreparing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
            {isPreparing ? 'Preparing...' : 'Open in Email Client'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

