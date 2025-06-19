
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
import type { Site, Category as CategoryType, RequisitionItem, RequisitionPayload, User, Approver } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { randomUUID } from 'crypto';

// Items in form still don't need price, but siteId for item level is added
const defaultItem: Omit<RequisitionItem, 'estimatedUnitPrice' | 'requisitionId' | 'categoryName'> & {siteId?: number | null} = { 
  id: '', 
  partNumber: '', 
  description: '', 
  categoryId: null, 
  quantity: 1, 
  notes: '',
  siteId: null, // Item-level site defaults to null
};

interface RequisitionFormValues {
  requestedByUserId: string | null;
  requestedByNameDisplay: string;
  // siteId: string | null; // REMOVED Header-level siteId from form values
  requisitionDate: string;
  requisitionNumberDisplay: string;
  justification: string;
  items: (Omit<RequisitionItem, 'estimatedUnitPrice' | 'requisitionId' | 'categoryName'> & {siteId?: number | null})[];
  approverId: string | null; // For selecting an approver
}

const MOCK_LOGGED_IN_USER_ID = 'user_005'; 
const MOCK_LOGGED_IN_USER_NAME = 'Gil Lunguze';
const NO_APPROVER_VALUE = "__none__";

export function RequisitionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

  const [sites, setSites] = useState<Site[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);

  const form = useForm<RequisitionFormValues>({
    defaultValues: {
      requestedByUserId: MOCK_LOGGED_IN_USER_ID,
      requestedByNameDisplay: MOCK_LOGGED_IN_USER_NAME,
      // siteId: null, // REMOVED: Header siteId default
      requisitionDate: format(new Date(), 'yyyy-MM-dd'),
      requisitionNumberDisplay: 'Loading REQ...',
      justification: '',
      items: [{...defaultItem, id: crypto.randomUUID(), siteId: null}],
      approverId: null,
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
      const [sitesRes, categoriesRes, usersRes, approversRes, nextReqNumRes] = await Promise.all([
        fetch('/api/sites'),
        fetch('/api/categories'),
        fetch('/api/users'),
        fetch('/api/approvers'),
        fetch('/api/requisitions/next-requisition-number')
      ]);

      if (sitesRes.ok) setSites(await sitesRes.json());
      else toast({ title: "Error", description: "Could not load sites.", variant: "destructive" });

      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      else toast({ title: "Error", description: "Could not load categories.", variant: "destructive" });
      
      if (usersRes.ok) {
        const fetchedUsers: User[] = await usersRes.json();
        setUsers(fetchedUsers);
        const defaultUser = fetchedUsers.find(u => u.id === MOCK_LOGGED_IN_USER_ID);
        if (defaultUser) {
            form.setValue('requestedByUserId', defaultUser.id);
            form.setValue('requestedByNameDisplay', defaultUser.name);
        } else if (fetchedUsers.length > 0) { 
            form.setValue('requestedByUserId', fetchedUsers[0].id);
            form.setValue('requestedByNameDisplay', fetchedUsers[0].name);
        }
      } else {
        toast({ title: "Error", description: "Could not load users.", variant: "destructive" });
      }

      if (approversRes.ok) setApprovers(await approversRes.json());
      else toast({ title: "Error", description: "Could not load approvers.", variant: "destructive" });
      
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

  const handleRequestorChange = (userId: string | null) => {
    const selectedUser = users.find(u => u.id === userId);
    form.setValue('requestedByNameDisplay', selectedUser ? selectedUser.name : 'N/A (User ID if not found)');
    form.setValue('requestedByUserId', userId);
  };

  const onSubmitAndPreview = async (formData: RequisitionFormValues) => {
    if (!formData.items || formData.items.length === 0) {
      toast({ title: "Validation Error", description: "Please add at least one item to the requisition.", variant: "destructive" });
      return;
    }
    if (!formData.requestedByUserId) {
      toast({ title: "Validation Error", description: "Please select a requestor.", variant: "destructive" });
      return;
    }
    // Header siteId is no longer in formData directly, so validation for it here is removed.
    // The Requisition.siteId in the DB is nullable.
    
    for (const item of formData.items) { 
        if (!item.siteId) {
            toast({ title: "Validation Error", description: `Please select a site for item: "${item.description || 'Unnamed Item'}".`, variant: "destructive" });
            return;
        }
    }

    setIsSubmitting(true);

    const payload: Omit<RequisitionPayload, 'totalEstimatedValue' | 'items' | 'status' | 'approverName' | 'approvalDate' | 'siteName' | 'siteCode' | 'requestorFullName'> & { items: (Omit<RequisitionItem, 'estimatedUnitPrice'> & {siteId?: number | null})[], status: RequisitionPayload['status'], approverId?: string | null, siteId: number | null } = {
      id: crypto.randomUUID(),
      requisitionNumber: formData.requisitionNumberDisplay,
      requisitionDate: new Date(formData.requisitionDate).toISOString(),
      requestedByUserId: formData.requestedByUserId,
      requestedByName: formData.requestedByNameDisplay,
      siteId: null, // Header siteId is now null as it's removed from the form. DB schema allows NULL.
      status: formData.approverId && formData.approverId !== NO_APPROVER_VALUE ? 'Pending Approval' : 'Draft',
      justification: formData.justification,
      approverId: (formData.approverId && formData.approverId !== NO_APPROVER_VALUE) ? formData.approverId : null,
      items: formData.items.map(item => ({
        id: item.id || crypto.randomUUID(),
        partNumber: item.partNumber,
        description: item.description,
        categoryId: item.categoryId ? Number(item.categoryId) : null,
        quantity: Number(item.quantity),
        notes: item.notes,
        siteId: item.siteId ? Number(item.siteId) : null,
      })),
    };

    try {
      const response = await fetch('/api/requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
            error: 'Failed to save requisition. Server error.', 
            details: 'Could not parse error response from server.' 
        }));
        
        let detailedMessage = errorData.error || `Server error: ${response.status}`;
        if (errorData.details) {
          detailedMessage += ` Details: ${errorData.details}`;
        }
        if (errorData.code) {
          detailedMessage += ` Code: ${errorData.code}`;
        }
        throw new Error(detailedMessage);
      }

      const result = await response.json();
      toast({ title: 'Requisition Saved', description: `Requisition ${result.requisitionNumber} (Status: ${result.status}) has been saved with ID ${result.requisitionId}.` });
      
      router.push(`/requisitions/${result.requisitionId}/print`);
      
    } catch (error: any) {
      toast({ 
        title: 'Error Saving Requisition', 
        description: error.message || 'An unexpected error occurred.', 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
              <FormField control={form.control} name="requisitionDate" rules={{ required: 'Date is required' }} render={({ field }) => ( <FormItem> <FormLabel>Requisition Date *</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField 
                control={form.control} name="requestedByUserId" rules={{ required: 'Requested By is required' }}
                render={({ field }) => ( 
                <FormItem> 
                  <FormLabel>Requested By *</FormLabel> 
                  <Select onValueChange={(value) => { field.onChange(value); handleRequestorChange(value); }} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select Requestor" /></SelectTrigger></FormControl>
                      <SelectContent>{users.map(u => (<SelectItem key={u.id} value={u.id}>{u.name} ({u.email || u.role})</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage /> 
                </FormItem> 
              )} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* REMOVED Header Site/Department Field */}
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
                <FormField
                  control={form.control} name="justification" rules={{ required: 'Justification is required' }}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2"> {/* Adjusted to col-span-2 to fill row if header site removed */}
                      <FormLabel>Justification *</FormLabel>
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
              return (
                <Card key={itemField.id} className="p-4 space-y-4 relative mb-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-end">
                    <FormField control={form.control} name={`items.${index}.partNumber`} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Part Number</FormLabel>
                        <FormControl><Input placeholder="Optional" {...field} value={field.value ?? ''} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.description`} rules={{ required: 'Description is required' }} render={({ field }) => (
                      <FormItem className="lg:col-span-3">
                        <FormLabel>Description *</FormLabel>
                        <FormControl><Input placeholder="Item or service description" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name={`items.${index}.categoryId`} rules={{ required: 'Category is required' }} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={(v) => field.onChange(v ? Number(v) : null)} value={field.value?.toString() || ''}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>{categories.map(cat => (<SelectItem key={cat.id} value={cat.id.toString()}>{cat.category}</SelectItem>))}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name={`items.${index}.siteId`} rules={{ required: 'Item Site is required' }} render={({ field }) => ( 
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Item Site *</FormLabel>
                        <Select onValueChange={(v) => field.onChange(v ? Number(v) : null)} value={field.value?.toString() || ''}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select Site for Item" /></SelectTrigger></FormControl>
                          <SelectContent>{sites.map(site => (<SelectItem key={site.id} value={site.id.toString()}>{site.siteCode || site.name}</SelectItem>))}</SelectContent>
                        </Select>
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
                     <FormField control={form.control} name={`items.${index}.notes`} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Item Notes</FormLabel>
                        <FormControl><Input placeholder="Optional notes" {...field} value={field.value ?? ''} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2" title="Remove Item"><Trash2 className="h-4 w-4" /></Button>
                </Card>
              );
            })}
            <Button type="button" variant="outline" onClick={() => append({...defaultItem, id: crypto.randomUUID(), siteId: null })} className="mt-0"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>

            <Separator className="my-6"/>

            <div className="flex justify-end items-start mt-8">
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
          This requisition will be saved. If an approver is selected, it will be submitted for approval. Otherwise, it will be saved as a Draft. Each item must have a site selected.
        </p>
      </CardFooter>
    </Card>
  );
}
    
    