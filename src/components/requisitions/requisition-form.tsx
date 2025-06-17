
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
import { PlusCircle, Trash2, Save, Eye, Loader2 } from 'lucide-react';
import type { Site, Category as CategoryType, RequisitionItem, RequisitionPayload } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const defaultItem: RequisitionItem = { id: crypto.randomUUID(), partNumber: '', description: '', categoryId: null, quantity: 1, estimatedUnitPrice: 0.00, notes: '' };

interface RequisitionFormValues {
  requestedByName: string;
  siteId: string | null;
  requisitionDate: string;
  requisitionNumberDisplay: string;
  justification: string;
  items: RequisitionItem[];
}

const MOCK_REQUESTOR_USER_ID = 'USR_MOCK_001';
const MOCK_REQUESTOR_NAME = 'Mock User';

export function RequisitionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [totalEstimatedValue, setTotalEstimatedValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

  const [sites, setSites] = useState<Site[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const form = useForm<RequisitionFormValues>({
    defaultValues: {
      requestedByName: MOCK_REQUESTOR_NAME,
      siteId: null,
      requisitionDate: format(new Date(), 'yyyy-MM-dd'),
      requisitionNumberDisplay: 'Loading REQ...',
      justification: '',
      items: [defaultItem],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const fetchInitialData = useCallback(async () => {
    setIsLoadingInitialData(true);
    try {
      const [sitesRes, categoriesRes, nextReqNumRes] = await Promise.all([
        fetch('/api/sites'),
        fetch('/api/categories'),
        fetch('/api/requisitions/next-requisition-number')
      ]);

      if (sitesRes.ok) setSites(await sitesRes.json());
      else toast({ title: "Error", description: "Could not load sites.", variant: "destructive" });

      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      else toast({ title: "Error", description: "Could not load categories.", variant: "destructive" });
      
      if (nextReqNumRes.ok) {
        const data = await nextReqNumRes.json();
        form.setValue('requisitionNumberDisplay', data.nextRequisitionNumber || 'REQ-ERROR');
      } else {
        form.setValue('requisitionNumberDisplay', 'REQ-ERROR');
        toast({ title: "Error", description: "Could not load next requisition number.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error Loading Data", description: "Could not load initial form data for requisitions.", variant: "destructive" });
      form.setValue('requisitionNumberDisplay', 'REQ-ERROR');
    } finally {
        setIsLoadingInitialData(false);
    }
  }, [form, toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const watchedItems = form.watch('items');

  useEffect(() => {
    const items = watchedItems || [];
    let calculatedTotal = 0;
    items.forEach((item: RequisitionItem) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.estimatedUnitPrice) || 0;
        calculatedTotal += quantity * unitPrice;
    });
    setTotalEstimatedValue(parseFloat(calculatedTotal.toFixed(2)));
  }, [watchedItems]);

  const onSubmitAndPreview = async (formData: RequisitionFormValues) => {
    if (!formData.items || formData.items.length === 0) {
      toast({ title: "Validation Error", description: "Please add at least one item to the requisition.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const payload: RequisitionPayload = {
      id: `MOCK-REQID-${Date.now()}`, // Mock ID generation
      requisitionNumber: formData.requisitionNumberDisplay,
      requisitionDate: new Date(formData.requisitionDate).toISOString(),
      requestedByUserId: MOCK_REQUESTOR_USER_ID,
      requestedByName: formData.requestedByName,
      siteId: formData.siteId ? Number(formData.siteId) : null,
      status: 'Draft',
      justification: formData.justification,
      items: formData.items.map(item => ({
        id: item.id,
        partNumber: item.partNumber,
        description: item.description,
        categoryId: item.categoryId ? Number(item.categoryId) : null,
        quantity: Number(item.quantity),
        estimatedUnitPrice: item.estimatedUnitPrice ? Number(item.estimatedUnitPrice) : 0,
        notes: item.notes,
      })),
      totalEstimatedValue: totalEstimatedValue,
    };

    try {
      const response = await fetch('/api/requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save requisition. Server error.' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      toast({ title: 'Requisition Saved (Simulated)', description: `Requisition ${payload.requisitionNumber} has been saved.` });
      router.push(`/requisitions/${result.requisitionId}/print`);

    } catch (error: any) {
      toast({ title: 'Error Saving Requisition', description: error.message || 'An unexpected error occurred.', variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatValue = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  if (isLoadingInitialData) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading form data...</div>;
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create New Purchase Requisition</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitAndPreview)} className="space-y-8">

            <div className="grid md:grid-cols-3 gap-4">
              <FormField control={form.control} name="requisitionNumberDisplay" render={({ field }) => ( <FormItem> <FormLabel>Requisition Number</FormLabel> <FormControl><Input {...field} readOnly /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="requisitionDate" rules={{ required: 'Date is required' }} render={({ field }) => ( <FormItem> <FormLabel>Requisition Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="requestedByName" rules={{ required: 'Requested By name is required' }} render={({ field }) => ( <FormItem> <FormLabel>Requested By</FormLabel> <FormControl><Input placeholder="Enter your name" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control} name="siteId" rules={{ required: 'Site is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site/Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a site" /></SelectTrigger></FormControl>
                        <SelectContent>{sites.map(s => (<SelectItem key={s.id} value={s.id.toString()}>{s.name} ({s.siteCode})</SelectItem>))}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control} name="justification" rules={{ required: 'Justification is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justification</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Briefly explain why these items are needed..." className="resize-none h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <Separator />
            <h3 className="text-lg font-medium font-headline">Requested Items</h3>
            {fields.map((itemField, index) => {
              const itemQuantity = form.watch(`items.${index}.quantity`) || 0;
              const itemEstUnitPrice = form.watch(`items.${index}.estimatedUnitPrice`) || 0;
              const itemTotalEst = (Number(itemQuantity) * Number(itemEstUnitPrice));
              return (
                <Card key={itemField.id} className="p-4 space-y-4 relative mb-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-end">
                    <FormField control={form.control} name={`items.${index}.partNumber`} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Part Number</FormLabel>
                        <FormControl><Input placeholder="Optional" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.description`} rules={{ required: 'Description is required' }} render={({ field }) => (
                      <FormItem className="lg:col-span-3">
                        <FormLabel>Description</FormLabel>
                        <FormControl><Input placeholder="Item or service description" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name={`items.${index}.categoryId`} rules={{ required: 'Category is required' }} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() || ''}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>{categories.map(cat => (<SelectItem key={cat.id} value={cat.id.toString()}>{cat.category}</SelectItem>))}</SelectContent>
                        </Select>
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
                    <FormField control={form.control} name={`items.${index}.estimatedUnitPrice`} render={({ field }) => (
                      <FormItem className="lg:col-span-1">
                        <FormLabel>Est. Unit Price (MZN)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0.00)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Est. Total (MZN)</FormLabel>
                      <div className="h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground flex items-center">{formatValue(itemTotalEst)}</div>
                    </FormItem>
                     <FormField control={form.control} name={`items.${index}.notes`} render={({ field }) => (
                      <FormItem className="lg:col-span-1">
                        <FormLabel>Item Notes</FormLabel>
                        <FormControl><Input placeholder="Optional notes" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2" title="Remove Item"><Trash2 className="h-4 w-4" /></Button>
                </Card>
              );
            })}
            <Button type="button" variant="outline" onClick={() => append({...defaultItem, id: crypto.randomUUID() })} className="mt-0"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>

            <Separator className="my-6"/>

            <div className="flex justify-between items-start mt-8">
              <div className="space-y-2 text-left border p-4 rounded-md bg-muted/20">
                <div className="text-xl font-bold font-headline">Total Estimated Value (MZN): <span className="font-semibold">{formatValue(totalEstimatedValue)}</span></div>
              </div>
              <div className="flex flex-col gap-3 w-auto md:w-1/3">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !form.formState.isValid || isLoadingInitialData}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Saving...' : 'Save & Preview Requisition'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          This requisition will be saved as a Draft. Further approval steps will be required.
        </p>
      </CardFooter>
    </Card>
  );
}
