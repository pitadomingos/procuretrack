
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Save, Eye, Loader2, Edit } from 'lucide-react';
import type { Site, Category as CategoryType, RequisitionItem, RequisitionPayload, User, Approver } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation'; // Added useSearchParams
import { format, parseISO } from 'date-fns';
import { randomUUID } from 'crypto';

const defaultItem: Omit<RequisitionItem, 'requisitionId' | 'categoryName'> = { 
  id: '', 
  partNumber: '', 
  description: '', 
  categoryId: null, 
  quantity: 1, 
  justification: '',
};

interface RequisitionFormValues {
  requestedByUserId: string | null;
  requestedByNameDisplay: string;
  siteId: string | null; 
  requisitionDate: string;
  requisitionNumberDisplay: string;
  items: Omit<RequisitionItem, 'requisitionId' | 'categoryName'>[];
  approverId: string | null; 
}

const MOCK_LOGGED_IN_USER_ID = 'user_005'; 
const MOCK_LOGGED_IN_USER_NAME = 'Gil Lunguze';
const NO_APPROVER_VALUE = "__none__";

interface RequisitionFormProps {
  requisitionIdToEditProp?: string | null;
}

export function RequisitionForm({ requisitionIdToEditProp }: RequisitionFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams(); // For reading query params

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isLoadingRequisitionForEdit, setIsLoadingRequisitionForEdit] = useState(false);
  const [isEditingLoadedRequisition, setIsEditingLoadedRequisition] = useState(false);
  const [loadedRequisitionId, setLoadedRequisitionId] = useState<string | null>(null);


  const [sites, setSites] = useState<Site[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);

  const form = useForm<RequisitionFormValues>({
    defaultValues: {
      requestedByUserId: MOCK_LOGGED_IN_USER_ID,
      requestedByNameDisplay: MOCK_LOGGED_IN_USER_NAME,
      siteId: null, 
      requisitionDate: format(new Date(), 'yyyy-MM-dd'),
      requisitionNumberDisplay: 'Loading REQ...',
      items: [{...defaultItem, id: crypto.randomUUID()}],
      approverId: null,
    },
    mode: 'onBlur',
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const loadRequisitionDataIntoForm = useCallback((data: RequisitionPayload) => {
    form.reset({
      requestedByUserId: data.requestedByUserId || null,
      requestedByNameDisplay: data.requestedByName || data.requestorFullName || '',
      siteId: data.siteId ? data.siteId.toString() : null,
      requisitionDate: data.requisitionDate ? format(parseISO(data.requisitionDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      requisitionNumberDisplay: data.requisitionNumber,
      items: (data.items || []).map(item => ({
        id: item.id || crypto.randomUUID(),
        partNumber: item.partNumber || '',
        description: item.description,
        categoryId: item.categoryId,
        quantity: item.quantity,
        justification: item.justification || '',
      })),
      approverId: data.approverId || null,
    });
    setIsEditingLoadedRequisition(true);
    setLoadedRequisitionId(data.id || null);
  }, [form]);

  const resetFormForNew = useCallback(async (fetchNextNumber = true) => {
    form.reset({
      requestedByUserId: MOCK_LOGGED_IN_USER_ID,
      requestedByNameDisplay: MOCK_LOGGED_IN_USER_NAME,
      siteId: null,
      requisitionDate: format(new Date(), 'yyyy-MM-dd'),
      requisitionNumberDisplay: fetchNextNumber ? 'Fetching...' : form.getValues('requisitionNumberDisplay'),
      items: [{...defaultItem, id: crypto.randomUUID()}],
      approverId: null,
    });
    setIsEditingLoadedRequisition(false);
    setLoadedRequisitionId(null);
    if (fetchNextNumber) {
      try {
        const response = await fetch('/api/requisitions/next-requisition-number');
        if (!response.ok) throw new Error('Failed to fetch next requisition number');
        const data = await response.json();
        form.setValue('requisitionNumberDisplay', data.nextRequisitionNumber || 'REQ-ERROR');
      } catch (error) {
        form.setValue('requisitionNumberDisplay', 'REQ-ERROR');
        toast({ title: "Error", description: "Could not load next requisition number.", variant: "destructive" });
      }
    }
  }, [form, toast]);

  useEffect(() => {
    const reqIdFromUrl = searchParams.get('editRequisitionId') || requisitionIdToEditProp;

    const fetchCoreDataAndInitializeForm = async () => {
      setIsLoadingInitialData(true);
      try {
        const [sitesRes, categoriesRes, usersRes, approversRes] = await Promise.all([
          fetch('/api/sites'),
          fetch('/api/categories'),
          fetch('/api/users'),
          fetch('/api/approvers'),
        ]);

        if (sitesRes.ok) setSites(await sitesRes.json());
        else toast({ title: "Error", description: "Could not load sites.", variant: "destructive" });
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
        else toast({ title: "Error", description: "Could not load categories.", variant: "destructive" });
        if (usersRes.ok) {
          const fetchedUsers: User[] = await usersRes.json();
          setUsers(fetchedUsers);
          if (!reqIdFromUrl) { // Only set default user if not editing
            const defaultUser = fetchedUsers.find(u => u.id === MOCK_LOGGED_IN_USER_ID);
            if (defaultUser) {
                form.setValue('requestedByUserId', defaultUser.id);
                form.setValue('requestedByNameDisplay', defaultUser.name);
            } else if (fetchedUsers.length > 0) { 
                form.setValue('requestedByUserId', fetchedUsers[0].id);
                form.setValue('requestedByNameDisplay', fetchedUsers[0].name);
            }
          }
        } else toast({ title: "Error", description: "Could not load users.", variant: "destructive" });
        if (approversRes.ok) setApprovers(await approversRes.json());
        else toast({ title: "Error", description: "Could not load approvers.", variant: "destructive" });

        if (reqIdFromUrl) {
          setIsLoadingRequisitionForEdit(true);
          const requisitionRes = await fetch(`/api/requisitions/${reqIdFromUrl}`);
          if (!requisitionRes.ok) {
            const errorData = await requisitionRes.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to fetch Requisition ${reqIdFromUrl}`);
          }
          const requisitionDataToEdit: RequisitionPayload = await requisitionRes.json();
          loadRequisitionDataIntoForm(requisitionDataToEdit);
          setIsLoadingRequisitionForEdit(false);
        } else {
          await resetFormForNew();
        }

      } catch (error) {
        toast({ title: "Error Loading Data", description: `Failed to load initial form data: ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
        if (!reqIdFromUrl) form.setValue('requisitionNumberDisplay', 'REQ-ERROR');
      } finally {
        setIsLoadingInitialData(false);
      }
    };
    fetchCoreDataAndInitializeForm();
  }, [requisitionIdToEditProp, searchParams, toast, loadRequisitionDataIntoForm, resetFormForNew, form]);


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
    if (!formData.siteId) { 
        toast({ title: "Validation Error", description: "Please select a Site/Department for the requisition.", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);

    const currentStatus = isEditingLoadedRequisition 
      ? (await (await fetch(`/api/requisitions/${loadedRequisitionId}`)).json() as RequisitionPayload).status // Fetch current status if editing
      : 'Draft';

    let newStatusForPayload: RequisitionPayload['status'];
    if (isEditingLoadedRequisition && currentStatus === 'Rejected') {
      // If editing a rejected requisition and an approver is selected, move to Pending Approval
      newStatusForPayload = (formData.approverId && formData.approverId !== NO_APPROVER_VALUE) ? 'Pending Approval' : 'Draft';
    } else {
      newStatusForPayload = (formData.approverId && formData.approverId !== NO_APPROVER_VALUE) ? 'Pending Approval' : 'Draft';
    }
    
    const payloadId = isEditingLoadedRequisition && loadedRequisitionId ? loadedRequisitionId : crypto.randomUUID();

    const payload: Partial<RequisitionPayload> & { items: RequisitionItem[] } = {
      id: payloadId,
      requisitionNumber: formData.requisitionNumberDisplay,
      requisitionDate: new Date(formData.requisitionDate).toISOString(),
      requestedByUserId: formData.requestedByUserId,
      requestedByName: formData.requestedByNameDisplay,
      siteId: Number(formData.siteId), 
      status: newStatusForPayload,
      approverId: (formData.approverId && formData.approverId !== NO_APPROVER_VALUE) ? formData.approverId : null,
      items: formData.items.map(item => ({
        id: item.id || crypto.randomUUID(),
        partNumber: item.partNumber,
        description: item.description,
        categoryId: item.categoryId ? Number(item.categoryId) : null,
        quantity: Number(item.quantity),
        justification: item.justification, 
      })),
    };
    
    const url = isEditingLoadedRequisition && loadedRequisitionId ? `/api/requisitions/${loadedRequisitionId}` : '/api/requisitions';
    const method = isEditingLoadedRequisition && loadedRequisitionId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
            error: `Failed to ${method === 'PUT' ? 'update' : 'save'} requisition. Server error.`, 
            details: 'Could not parse error response from server.' 
        }));
        
        let detailedMessage = errorData.error || `Server error: ${response.status}`;
        if (errorData.details) detailedMessage += ` Details: ${errorData.details}`;
        if (errorData.code) detailedMessage += ` Code: ${errorData.code}`;
        throw new Error(detailedMessage);
      }

      const result = await response.json();
      const successMessage = method === 'PUT' 
        ? `Requisition ${result.requisitionNumber || payload.requisitionNumber} updated to status: ${result.status || payload.status}.`
        : `Requisition ${result.requisitionNumber} (Status: ${result.status}) has been saved with ID ${result.requisitionId}.`;
      
      toast({ title: `Requisition ${method === 'PUT' ? 'Updated' : 'Saved'}`, description: successMessage });
      
      const finalRequisitionId = method === 'PUT' ? loadedRequisitionId : result.requisitionId;
      if (finalRequisitionId) {
        router.push(`/requisitions/${finalRequisitionId}/print`);
      } else {
        await resetFormForNew();
      }
      
    } catch (error: any) {
      toast({ 
        title: `Error ${method === 'PUT' ? 'Updating' : 'Saving'} Requisition`, 
        description: error.message || 'An unexpected error occurred.', 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingInitialData && !requisitionIdToEditProp && !searchParams.get('editRequisitionId')) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading form data...</div>;
  }
  if (isLoadingRequisitionForEdit && (requisitionIdToEditProp || searchParams.get('editRequisitionId'))) {
     return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading Requisition for editing...</div>;
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
         {isEditingLoadedRequisition ? `Edit Requisition: ${form.getValues('requisitionNumberDisplay')}` : 'Create New Purchase Requisition'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitAndPreview)} className="space-y-8">
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
              <FormField control={form.control} name="requisitionNumberDisplay" render={({ field }) => ( <FormItem className="lg:col-span-1"> <FormLabel>Requisition No.</FormLabel> <FormControl><Input {...field} readOnly /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="requisitionDate" rules={{ required: 'Date is required' }} render={({ field }) => ( <FormItem className="lg:col-span-1"> <FormLabel>Date *</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField 
                control={form.control} name="requestedByUserId" rules={{ required: 'Requested By is required' }}
                render={({ field }) => ( 
                <FormItem className="lg:col-span-1"> 
                  <FormLabel>Requested By *</FormLabel> 
                  <Select onValueChange={(value) => { field.onChange(value); handleRequestorChange(value); }} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select Requestor" /></SelectTrigger></FormControl>
                      <SelectContent>{users.map(u => (<SelectItem key={u.id} value={u.id}>{u.name} ({u.email || u.role})</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage /> 
                </FormItem> 
              )} />
              <FormField 
                control={form.control} name="siteId" rules={{ required: 'Site/Department is required' }}
                render={({ field }) => ( 
                <FormItem className="lg:col-span-1"> 
                  <FormLabel>Site/Department *</FormLabel> 
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select Site" /></SelectTrigger></FormControl>
                      <SelectContent>{sites.map(s => (<SelectItem key={s.id} value={s.id.toString()}>{s.siteCode || s.name}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage /> 
                </FormItem> 
              )} />
              <FormField
                  control={form.control} name="approverId"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Assign Approver</FormLabel>
                      <Select
                        onValueChange={(selectedValue) => {
                          field.onChange(selectedValue === NO_APPROVER_VALUE ? null : selectedValue);
                        }}
                        value={field.value || NO_APPROVER_VALUE}
                      >
                        <FormControl><SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger></FormControl>
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
                      <FormItem className="lg:col-span-4">
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
                    <FormField control={form.control} name={`items.${index}.quantity`} rules={{ required: 'Quantity is required', min: { value: 1, message: 'Must be at least 1' } }} render={({ field }) => (
                      <FormItem className="lg:col-span-1">
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name={`items.${index}.justification`} render={({ field }) => ( 
                      <FormItem className="lg:col-span-3"> 
                        <FormLabel>Justification (Item Specific)</FormLabel>
                        <FormControl><Input placeholder="Reason for this item" {...field} value={field.value ?? ''} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2" title="Remove Item"><Trash2 className="h-4 w-4" /></Button>
                </Card>
              );
            })}
            <Button type="button" variant="outline" onClick={() => append({...defaultItem, id: crypto.randomUUID() })} className="mt-0"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>

            <Separator className="my-6"/>

            <div className="flex justify-end items-start mt-8">
              <div className="flex flex-col gap-3 w-auto md:w-1/3">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !form.formState.isValid || isLoadingInitialData || isLoadingRequisitionForEdit}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditingLoadedRequisition ? <Edit className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />)}
                  {isSubmitting ? (isEditingLoadedRequisition ? 'Updating...' : 'Saving...') : (isEditingLoadedRequisition ? 'Update & Preview Requisition' : 'Save & Preview Requisition')}
                </Button>
                {!isEditingLoadedRequisition && (
                  <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => resetFormForNew(true)} disabled={isSubmitting || isLoadingInitialData || isLoadingRequisitionForEdit}>
                    Clear / New Requisition
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {isEditingLoadedRequisition 
            ? `Editing Requisition: ${form.getValues('requisitionNumberDisplay')}. Requisition Number is read-only.`
            : "This requisition will be saved. If an approver is selected, it will be submitted for approval. Otherwise, it will be saved as a Draft."}
          Site/Department is required for the overall requisition.
        </p>
      </CardFooter>
    </Card>
  );
}
