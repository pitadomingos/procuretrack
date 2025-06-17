
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Save, Eye, Loader2 } from 'lucide-react'; // Added Loader2
import type { Client, QuoteItem, QuotePayload, Approver } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { mockApproversData } from '@/lib/mock-data';

const defaultItem: QuoteItem = { id: crypto.randomUUID(), partNumber: '', customerRef: '', description: '', quantity: 1, unitPrice: 0.00 };

interface QuoteFormValues {
  clientId: string | null;
  clientNameDisplay: string;
  clientEmailDisplay: string;
  quoteDate: string;
  quoteNumberDisplay: string;
  currency: string;
  termsAndConditions: string;
  notes: string;
  items: QuoteItem[];
  approverId: string | null;
}

const MOCK_CREATOR_EMAIL = 'creator@jachris.com';
const NO_APPROVER_VALUE = "__none__";

export function QuoteForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [subTotal, setSubTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);


  const form = useForm<QuoteFormValues>({
    defaultValues: {
      clientId: null,
      clientNameDisplay: '',
      clientEmailDisplay: '',
      quoteDate: format(new Date(), 'yyyy-MM-dd'),
      quoteNumberDisplay: 'Loading Q...',
      currency: 'MZN',
      termsAndConditions: 'Standard Payment Terms: 30 days. Prices valid for 15 days.',
      notes: '',
      items: [defaultItem],
      approverId: null,
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const fetchInitialData = useCallback(async () => {
    try {
      const [clientsRes, nextQuoteNumRes, approversRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/quotes/next-quote-number'),
        fetch('/api/approvers')
      ]);

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData);
      } else {
        toast({ title: "Error", description: "Could not load clients.", variant: "destructive" });
      }

      if (nextQuoteNumRes.ok) {
        const data = await nextQuoteNumRes.json();
        form.setValue('quoteNumberDisplay', data.nextQuoteNumber || 'Q-ERROR');
      } else {
        form.setValue('quoteNumberDisplay', 'Q-ERROR');
        toast({ title: "Error", description: "Could not load next quote number.", variant: "destructive" });
      }

      if (approversRes.ok) {
        const approversData = await approversRes.json();
        setApprovers(approversData);
      } else {
        console.warn('Failed to fetch approvers from API, using mock data.');
        setApprovers(mockApproversData);
      }

    } catch (error) {
      toast({ title: "Error Loading Data", description: "Could not load initial form data.", variant: "destructive" });
      form.setValue('quoteNumberDisplay', 'Q-ERROR');
      setApprovers(mockApproversData);
    }
  }, [form, toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const watchedItems = form.watch('items');
  const watchedCurrency = form.watch('currency');

  useEffect(() => {
    const items = watchedItems || [];
    let calculatedInputSum = 0;
    items.forEach((item: QuoteItem) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        calculatedInputSum += quantity * unitPrice;
    });

    let newDisplaySubTotal = calculatedInputSum;
    let newDisplayVatAmount = 0;
    if (watchedCurrency === 'MZN') {
        newDisplayVatAmount = newDisplaySubTotal * 0.16;
    }
    setSubTotal(parseFloat(newDisplaySubTotal.toFixed(2)));
    setVatAmount(parseFloat(newDisplayVatAmount.toFixed(2)));
    setGrandTotal(parseFloat((newDisplaySubTotal + newDisplayVatAmount).toFixed(2)));
  }, [watchedItems, watchedCurrency]);

  const handleClientChange = (selectedClientId: string | null) => {
    const selectedClient = clients.find(c => c.id === selectedClientId);
    if (selectedClient) {
      form.setValue('clientId', selectedClient.id);
      form.setValue('clientNameDisplay', selectedClient.name);
      form.setValue('clientEmailDisplay', selectedClient.email || '');
    } else {
      form.setValue('clientId', null);
      form.setValue('clientNameDisplay', '');
      form.setValue('clientEmailDisplay', '');
    }
  };

  const onSubmitAndPreview = async (formData: QuoteFormValues) => {
    if (!formData.clientId) {
      toast({ title: "Validation Error", description: "Please select a client.", variant: "destructive" });
      return;
    }
    if (!formData.items || formData.items.length === 0) {
      toast({ title: "Validation Error", description: "Please add at least one item to the quote.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const selectedClient = clients.find(c => c.id === formData.clientId);
    const quoteStatus = (formData.approverId && formData.approverId !== NO_APPROVER_VALUE) ? 'Pending Approval' : 'Draft';
    const clientGeneratedQuoteId = `Q-MOCK-${Date.now()}`; // Generate a unique ID for the quote

    const payload: QuotePayload = {
      id: clientGeneratedQuoteId, // Use the generated ID
      quoteNumber: formData.quoteNumberDisplay,
      quoteDate: new Date(formData.quoteDate).toISOString(),
      clientId: formData.clientId,
      clientName: selectedClient?.name,
      clientEmail: selectedClient?.email,
      creatorEmail: MOCK_CREATOR_EMAIL,
      subTotal: subTotal,
      vatAmount: vatAmount,
      grandTotal: grandTotal,
      currency: formData.currency,
      termsAndConditions: formData.termsAndConditions,
      notes: formData.notes,
      items: formData.items.map(item => ({
        id: item.id,
        partNumber: item.partNumber,
        customerRef: item.customerRef,
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      status: quoteStatus,
      approverId: (formData.approverId && formData.approverId !== NO_APPROVER_VALUE) ? formData.approverId : null,
    };

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save quote. Server error.' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      toast({ title: 'Quote Saved (Simulated)', description: `Quote ${payload.quoteNumber} has been saved with status: ${quoteStatus}. Navigating to preview.` });

      // Ensure result.quoteId is the one we expect (it should be payload.id)
      router.push(`/quotes/${result.quoteId}/print`);

    } catch (error: any) {
      toast({ title: 'Error Saving Quote', description: error.message || 'An unexpected error occurred.', variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencySymbol = watchedCurrency === 'MZN' ? 'MZN' : (watchedCurrency === 'USD' ? '$' : watchedCurrency);
  const formatValue = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create New Client Quotation</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitAndPreview)} className="space-y-8">

            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control} name="clientId" rules={{ required: 'Client is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={(value) => { field.onChange(value); handleClientChange(value); }} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger></FormControl>
                      <SelectContent>{clients.map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="quoteNumberDisplay" render={({ field }) => ( <FormItem> <FormLabel>Quote Number</FormLabel> <FormControl><Input {...field} readOnly /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="quoteDate" rules={{ required: 'Quote Date is required' }} render={({ field }) => ( <FormItem> <FormLabel>Quote Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="currency" render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'MZN'}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="MZN">MZN</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ZAR">ZAR</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField
                  control={form.control} name="approverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign Approver (Optional)</FormLabel>
                      <Select
                        onValueChange={(selectedValue) => {
                          field.onChange(selectedValue === NO_APPROVER_VALUE ? null : selectedValue);
                        }}
                        value={field.value || NO_APPROVER_VALUE}
                      >
                        <FormControl><SelectTrigger><SelectValue placeholder="Select an approver" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value={NO_APPROVER_VALUE}>None (Save as Draft)</SelectItem>
                          {approvers.map(appr => (<SelectItem key={appr.id} value={appr.id}>{appr.name}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <Separator />
            <h3 className="text-lg font-medium font-headline">Quotation Items</h3>
            {fields.map((itemField, index) => {
              const itemQuantity = form.watch(`items.${index}.quantity`) || 0;
              const itemUnitPrice = form.watch(`items.${index}.unitPrice`) || 0;
              const itemTotal = (Number(itemQuantity) * Number(itemUnitPrice));
              return (
                <Card key={itemField.id} className="p-4 space-y-4 relative mb-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-end">
                    <FormField control={form.control} name={`items.${index}.partNumber`} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Part Number</FormLabel>
                        <FormControl><Input placeholder="Optional" {...field} value={field.value ?? ''} /></FormControl>
                      </FormItem>
                    )} />
                     <FormField control={form.control} name={`items.${index}.customerRef`} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Customer Ref</FormLabel>
                        <FormControl><Input placeholder="Optional" {...field} value={field.value ?? ''} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.description`} rules={{ required: 'Description is required' }} render={({ field }) => (
                      <FormItem className="lg:col-span-3">
                        <FormLabel>Description</FormLabel>
                        <FormControl><Input placeholder="Service or item description" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.quantity`} rules={{ required: 'Quantity is required', min: { value: 1, message: 'Must be at least 1' } }} render={({ field }) => (
                      <FormItem className="lg:col-span-1">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.unitPrice`} rules={{ required: 'Unit Price is required', min: { value: 0.01, message: 'Must be positive' } }} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Unit Price ({currencySymbol})</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0.00)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Item Total ({currencySymbol})</FormLabel>
                      <div className="h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground flex items-center">{formatValue(itemTotal)}</div>
                    </FormItem>
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2" title="Remove Item"><Trash2 className="h-4 w-4" /></Button>
                </Card>
              );
            })}
            <Button type="button" variant="outline" onClick={() => append({...defaultItem, id: crypto.randomUUID() })} className="mt-0"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>

            <Separator className="my-6"/>

            <div className="grid md:grid-cols-3 gap-6 mt-8 items-start">
              <div className="md:col-span-1 space-y-4">
                <FormField
                  control={form.control} name="termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter terms and conditions..." className="resize-none h-24" {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control} name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any relevant notes for the client..." className="resize-none h-24" {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-1 space-y-2 text-left border p-4 rounded-md bg-muted/20">
                <div className="text-md">Subtotal ({currencySymbol}): <span className="font-semibold">{formatValue(subTotal)}</span></div>
                {currencySymbol === 'MZN' && <div className="text-md">VAT (16%) ({currencySymbol}): <span className="font-semibold">{formatValue(vatAmount)}</span></div>}
                <div className="text-xl font-bold font-headline">Grand Total ({currencySymbol}): <span className="font-semibold">{formatValue(grandTotal)}</span></div>
              </div>

              <div className="md:col-span-1 flex flex-col gap-3 w-full pt-6">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !form.formState.isValid}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Saving...' : 'Save & Preview Quote'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Select an approver to submit the quote for approval, or leave blank to save as a draft.
        </p>
      </CardFooter>
    </Card>
  );
}
