
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
import { PlusCircle, Trash2, Save, Eye, Loader2, Edit, Search } from 'lucide-react';
import type { Client, QuoteItem, QuotePayload, Approver } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

const defaultItem: Omit<QuoteItem, 'quoteId'> = { id: '', partNumber: '', customerRef: '', description: '', quantity: 1, unitPrice: 0.00 };

interface QuoteFormValues {
  clientId: string | null;
  clientNameDisplay: string;
  clientEmailDisplay: string;
  quoteDate: string;
  quoteNumberDisplay: string;
  currency: string;
  termsAndConditions: string;
  notes: string;
  items: Omit<QuoteItem, 'quoteId'>[];
  approverId: string | null;
  approvalDate?: string | null | undefined; // Added for completeness in form state
}

const MOCK_CREATOR_EMAIL = 'creator@jachris.com';
const NO_APPROVER_VALUE = "__none__";

interface QuoteFormProps {
  quoteIdToEditProp?: string | null;
}

export function QuoteForm({ quoteIdToEditProp }: QuoteFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [subTotal, setSubTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isLoadingQuoteForEdit, setIsLoadingQuoteForEdit] = useState(false);

  const [isEditingLoadedQuote, setIsEditingLoadedQuote] = useState(false);
  const [loadedQuoteId, setLoadedQuoteId] = useState<string | null>(null);

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
      items: [{...defaultItem, id: crypto.randomUUID()}],
      approverId: null,
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const loadQuoteDataIntoForm = useCallback((data: QuotePayload, currentClients: Client[]) => {
    form.reset({
      clientId: data.clientId,
      clientNameDisplay: data.clientName || '',
      clientEmailDisplay: data.clientEmail || '',
      quoteDate: data.quoteDate ? format(parseISO(data.quoteDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      quoteNumberDisplay: data.quoteNumber,
      currency: data.currency,
      termsAndConditions: data.termsAndConditions || 'Standard Payment Terms: 30 days. Prices valid for 15 days.',
      notes: data.notes || '',
      items: (data.items || []).map(item => ({
        ...defaultItem,
        ...item,
        id: item.id || crypto.randomUUID(),
      })),
      approverId: data.approverId || null,
      approvalDate: data.approvalDate ? format(parseISO(data.approvalDate), 'yyyy-MM-dd') : null,
    });

    const selectedClient = currentClients.find(c => c.id === data.clientId);
    if (selectedClient) {
        form.setValue('clientNameDisplay', selectedClient.name);
        form.setValue('clientEmailDisplay', selectedClient.email || '');
    }

    setIsEditingLoadedQuote(true);
    setLoadedQuoteId(data.id || null);
  }, [form]);
  
  const resetFormForNew = useCallback(async (fetchNextNumber = true) => {
    form.reset({
      clientId: null, clientNameDisplay: '', clientEmailDisplay: '',
      quoteDate: format(new Date(), 'yyyy-MM-dd'),
      quoteNumberDisplay: fetchNextNumber ? 'Fetching...' : form.getValues('quoteNumberDisplay'),
      currency: 'MZN',
      termsAndConditions: 'Standard Payment Terms: 30 days. Prices valid for 15 days.',
      notes: '', items: [{...defaultItem, id: crypto.randomUUID()}],
      approverId: null,
    });
    setIsEditingLoadedQuote(false);
    setLoadedQuoteId(null);
    if (fetchNextNumber) {
      try {
        const response = await fetch('/api/quotes/next-quote-number');
        if (!response.ok) throw new Error('Failed to fetch next quote number');
        const data = await response.json();
        form.setValue('quoteNumberDisplay', data.nextQuoteNumber || 'Q-ERROR');
      } catch (error) {
        form.setValue('quoteNumberDisplay', 'Q-ERROR');
        toast({ title: "Error", description: "Could not load next quote number.", variant: "destructive" });
      }
    }
  }, [form, toast]);

  useEffect(() => {
    const fetchCoreDataAndInitializeForm = async () => {
      setIsLoadingInitialData(true);
      let fetchedClients: Client[] = [];
      try {
        const [clientsRes, approversRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/approvers')
        ]);

        fetchedClients = clientsRes.ok ? await clientsRes.json() : [];
        const fetchedApprovers: Approver[] = approversRes.ok ? await approversRes.json() : [];
        
        setClients(fetchedClients);
        setApprovers(fetchedApprovers);

        if (quoteIdToEditProp) {
          setIsLoadingQuoteForEdit(true);
          const quoteRes = await fetch(`/api/quotes/${quoteIdToEditProp}`);
          if (!quoteRes.ok) throw new Error(`Failed to fetch Quote ${quoteIdToEditProp}`);
          const quoteDataToEdit: QuotePayload = await quoteRes.json();
          loadQuoteDataIntoForm(quoteDataToEdit, fetchedClients);
          setIsLoadingQuoteForEdit(false);
        } else {
          await resetFormForNew();
        }
      } catch (error) {
        toast({ title: "Error Loading Data", description: `Failed to load initial form data: ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
        if (!quoteIdToEditProp) form.setValue('quoteNumberDisplay', 'Q-ERROR');
      } finally {
        setIsLoadingInitialData(false);
      }
    };
    fetchCoreDataAndInitializeForm();
  }, [quoteIdToEditProp, toast, loadQuoteDataIntoForm, resetFormForNew]);

  const watchedItems = form.watch('items');
  const watchedCurrency = form.watch('currency');

  useEffect(() => {
    const items = watchedItems || [];
    let calculatedInputSum = 0;
    items.forEach((item: Omit<QuoteItem, 'quoteId'>) => {
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
  
  const handleLoadQuoteForEditing = async () => {
    const quoteNumberToLoad = form.getValues('quoteNumberDisplay');
    if (!quoteNumberToLoad || ['Loading Q...', 'Fetching...', 'Q-ERROR'].includes(quoteNumberToLoad)) {
      toast({ title: "Quote Number Required", description: "Please enter a Quote number to load.", variant: "destructive" });
      return;
    }
    setIsLoadingQuoteForEdit(true);
    try {
      const idRes = await fetch(`/api/quotes/get-by-quote-number/${encodeURIComponent(quoteNumberToLoad)}`);
      if (!idRes.ok) {
        const errorData = await idRes.json().catch(() => ({}));
        throw new Error(errorData.error || `Quote Number ${quoteNumberToLoad} not found.`);
      }
      const { id: foundQuoteId } = await idRes.json();

      if (!foundQuoteId) throw new Error(`Quote Number ${quoteNumberToLoad} not found.`);

      const quoteDataRes = await fetch(`/api/quotes/${foundQuoteId}`);
      if (!quoteDataRes.ok) throw new Error(`Failed to fetch details for Quote ID ${foundQuoteId}.`);
      const quoteDataToLoad: QuotePayload = await quoteDataRes.json();
      
      // Check if editable (e.g., Draft or Pending Approval)
      if (quoteDataToLoad.status !== 'Draft' && quoteDataToLoad.status !== 'Pending Approval') {
          toast({ title: "Cannot Edit", description: `Quote ${quoteNumberToLoad} is in '${quoteDataToLoad.status}' status and cannot be edited here. View it from the list.`, variant: "destructive"});
          setIsLoadingQuoteForEdit(false);
          return;
      }

      loadQuoteDataIntoForm(quoteDataToLoad, clients);
      toast({ title: "Quote Loaded", description: `Quote ${quoteNumberToLoad} loaded for editing.` });
    } catch (error) {
      toast({ title: "Error Loading Quote", description: `${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
    } finally {
      setIsLoadingQuoteForEdit(false);
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
    
    const generatedQuoteId = isEditingLoadedQuote && loadedQuoteId ? loadedQuoteId : crypto.randomUUID();
    const quoteStatus = (formData.approverId && formData.approverId !== NO_APPROVER_VALUE) ? 'Pending Approval' : 'Draft';
    
    const payload: QuotePayload = {
      id: generatedQuoteId, 
      quoteNumber: formData.quoteNumberDisplay,
      quoteDate: new Date(formData.quoteDate).toISOString(),
      clientId: formData.clientId,
      creatorEmail: MOCK_CREATOR_EMAIL,
      subTotal: subTotal,
      vatAmount: vatAmount,
      grandTotal: grandTotal,
      currency: formData.currency,
      termsAndConditions: formData.termsAndConditions,
      notes: formData.notes,
      items: formData.items.map(item => ({
        id: item.id || crypto.randomUUID(), 
        partNumber: item.partNumber,
        customerRef: item.customerRef,
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      status: quoteStatus,
      approverId: (formData.approverId && formData.approverId !== NO_APPROVER_VALUE) ? formData.approverId : null,
      approvalDate: isEditingLoadedQuote ? formData.approvalDate : undefined, 
    };

    try {
      let response;
      let successMessage = '';
      const url = isEditingLoadedQuote && loadedQuoteId ? `/api/quotes/${loadedQuoteId}` : '/api/quotes';
      const method = isEditingLoadedQuote && loadedQuoteId ? 'PUT' : 'POST';

      response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json(); 

      if (!response.ok) {
        const errorDetail = result.error || result.details || result.message || `Server error: ${response.status}`;
        throw new Error(errorDetail);
      }

      successMessage = `Quote ${payload.quoteNumber} ${isEditingLoadedQuote ? 'updated' : 'saved'} successfully with status: ${payload.status}. Navigating to preview.`;
      toast({ title: 'Success!', description: successMessage });
      
      const finalQuoteId = method === 'POST' ? result.quoteId : loadedQuoteId;
      if (finalQuoteId) {
        router.push(`/quotes/${finalQuoteId}/print`); 
      } else {
        // If new, reset form
        await resetFormForNew();
      }

    } catch (error: any) {
      console.error("Error saving quote (frontend):", error);
      toast({ 
        title: `Error ${isEditingLoadedQuote ? 'Updating' : 'Saving'} Quote`, 
        description: error.message || 'An unexpected error occurred.', 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencySymbol = watchedCurrency === 'MZN' ? 'MZN' : (watchedCurrency === 'USD' ? '$' : watchedCurrency);
  const formatValue = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  if (isLoadingInitialData && !quoteIdToEditProp) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading form data...</div>;
  }
  if (isLoadingQuoteForEdit && quoteIdToEditProp) {
     return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading Quote for editing...</div>;
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {isEditingLoadedQuote ? `Edit Quotation: ${form.getValues('quoteNumberDisplay')}` : 'Create New Client Quotation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitAndPreview)} className="space-y-8">

            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control} name="clientId" rules={{ required: 'Client is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client *</FormLabel>
                    <Select onValueChange={(value) => { field.onChange(value); handleClientChange(value); }} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger></FormControl>
                      <SelectContent>{clients.map(c => (<SelectItem key={c.id} value={c.id}>{c.name} ({c.id})</SelectItem>))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control} name="quoteNumberDisplay" rules={{ required: 'Quote Number is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote Number</FormLabel>
                       <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Quote Number or type to load" {...field} readOnly={isEditingLoadedQuote} />
                        </FormControl>
                        {!isEditingLoadedQuote && (
                           <Button type="button" variant="outline" onClick={handleLoadQuoteForEditing} disabled={isLoadingQuoteForEdit} className="shrink-0">
                            {isLoadingQuoteForEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Load
                           </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField control={form.control} name="quoteDate" rules={{ required: 'Quote Date is required' }} render={({ field }) => ( <FormItem> <FormLabel>Quote Date *</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="currency" render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Currency *</FormLabel>
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
                        <FormLabel>Description *</FormLabel>
                        <FormControl><Input placeholder="Service or item description" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.quantity`} rules={{ required: 'Quantity is required', min: { value: 1, message: 'Must be at least 1' } }} render={({ field }) => (
                      <FormItem className="lg:col-span-1">
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.unitPrice`} rules={{ required: 'Unit Price is required', min: { value: 0.01, message: 'Must be positive' } }} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Unit Price ({currencySymbol}) *</FormLabel>
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
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !form.formState.isValid || isLoadingInitialData || isLoadingQuoteForEdit}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditingLoadedQuote ? <Edit className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />)}
                  {isSubmitting ? (isEditingLoadedQuote ? 'Updating...' : 'Saving...') : (isEditingLoadedQuote ? 'Update & Preview Quote' : 'Save & Preview Quote')}
                </Button>
                 {!isEditingLoadedQuote && (
                  <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => resetFormForNew(false)} disabled={isSubmitting || isLoadingInitialData || isLoadingQuoteForEdit}>
                    Clear / New Quote
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
         {isEditingLoadedQuote
            ? `Editing Quote: ${form.getValues('quoteNumberDisplay')}. Quote Number is read-only.`
            : "Enter Quote details. Use 'Load' for existing editable Quotes or create a new one. Select an approver to submit for approval, or leave blank to save as Draft."}
        </p>
      </CardFooter>
    </Card>
  );
}
