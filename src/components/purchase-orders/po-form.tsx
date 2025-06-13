
'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Send, Printer, Loader2, Edit } from 'lucide-react';
import type { Supplier, Site, Category as CategoryType, Approver, POItem as POFormItemStructure, PurchaseOrderPayload, POItemPayload } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface POFormProps {
  poIdToEdit?: string | null;
  initialData?: PurchaseOrderPayload | null; // If data is pre-fetched by parent
}

// This is the structure for items within the form's field array
const defaultItem: POFormItemStructure = { id: crypto.randomUUID(), partNumber: '', description: '', categoryId: null, siteId: null, uom: '', quantity: 1, unitPrice: 0.00 };

// Define the shape of your form values
interface POFormValues {
  vendorName: string | null; // supplierId
  vendorEmail: string;
  salesPerson: string;
  supplierContactNumber: string;
  nuit: string;
  quoteNo: string;
  billingAddress: string;
  poDate: string;
  poNumberDisplay: string;
  currency: string;
  requestedByName: string; // Renamed from requestedBy for clarity
  approverId: string | null; // Renamed from approver
  pricesIncludeVat: boolean;
  notes: string;
  items: POFormItemStructure[];
}


export function POForm({ poIdToEdit, initialData }: POFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [subTotal, setSubTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrintingLoading, setIsPrintingLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const editMode = !!poIdToEdit || !!initialData;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [approvers, setApproversData] = useState<Approver[]>([]);

  const form = useForm<POFormValues>({
    defaultValues: {
      vendorName: null,
      vendorEmail: '',
      salesPerson: '',
      supplierContactNumber: '',
      nuit: '',
      quoteNo: '',
      billingAddress: '',
      poDate: format(new Date(), 'yyyy-MM-dd'),
      poNumberDisplay: 'Loading PO...',
      currency: 'MZN',
      requestedByName: '',
      approverId: null,
      pricesIncludeVat: false,
      notes: '',
      items: [defaultItem],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const fetchNextPONumber = useCallback(async () => {
    if (editMode) return; // Don't fetch for edit mode
    try {
      const response = await fetch('/api/purchase-orders/next-po-number');
      if (!response.ok) throw new Error(`Failed to fetch next PO number: ${response.statusText}`);
      const data = await response.json();
      form.setValue('poNumberDisplay', data.nextPoNumber || 'PO-ERROR');
    } catch (error) {
      console.error("Error fetching next PO number:", error);
      form.setValue('poNumberDisplay', 'PO-ERROR');
      toast({ title: "Error", description: "Could not load next PO number.", variant: "destructive" });
    }
  }, [form, toast, editMode]);

  const loadPODataForEdit = useCallback(async (data: PurchaseOrderPayload) => {
    form.reset({
      vendorName: data.supplierId,
      vendorEmail: data.supplierDetails?.emailAddress || '',
      salesPerson: data.supplierDetails?.salesPerson || '',
      supplierContactNumber: data.supplierDetails?.cellNumber || '',
      nuit: data.supplierDetails?.nuitNumber || '',
      billingAddress: data.supplierDetails?.physicalAddress || '',
      quoteNo: data.quoteNo || '',
      poDate: format(new Date(data.creationDate), 'yyyy-MM-dd'),
      poNumberDisplay: data.poNumber,
      currency: data.currency,
      requestedByName: data.requestedByName || '',
      approverId: data.approverId,
      pricesIncludeVat: data.pricesIncludeVat,
      notes: data.notes || '',
      items: (data.items || []).map(item => ({ // Ensure data.items is an array
        id: crypto.randomUUID(), // For field array key
        partNumber: item.partNumber || '',
        description: item.description,
        categoryId: item.categoryId,
        siteId: item.siteId,
        uom: item.uom,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
    // Trigger supplier fields population if a supplier is selected
    if (data.supplierId) {
        const selectedSupplier = suppliers.find(s => s.supplierCode === data.supplierId);
        if (selectedSupplier) {
            form.setValue('vendorEmail', selectedSupplier.emailAddress || '');
            form.setValue('salesPerson', selectedSupplier.salesPerson || '');
            form.setValue('supplierContactNumber', selectedSupplier.cellNumber || '');
            form.setValue('nuit', selectedSupplier.nuitNumber || '');
            form.setValue('billingAddress', selectedSupplier.physicalAddress || '');
        }
    }
  }, [form, suppliers]);


  useEffect(() => {
    const fetchInitialAndDropdownData = async () => {
      setIsLoadingData(true);
      try {
        const [suppliersRes, sitesRes, categoriesRes, approversRes] = await Promise.all([
          fetch('/api/suppliers'), fetch('/api/sites'), fetch('/api/categories'), fetch('/api/approvers'),
        ]);

        if (!suppliersRes.ok) throw new Error('Failed to fetch suppliers');
        const fetchedSuppliers = await suppliersRes.json();
        setSuppliers(fetchedSuppliers);

        if (!sitesRes.ok) throw new Error('Failed to fetch sites');
        setSites(await sitesRes.json());
        
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        setCategories(await categoriesRes.json());

        if (!approversRes.ok) throw new Error('Failed to fetch approvers');
        setApproversData(await approversRes.json());

        if (poIdToEdit && !initialData) { // Fetch PO data if ID provided and no initialData
          const poRes = await fetch(`/api/purchase-orders/${poIdToEdit}`);
          if (!poRes.ok) throw new Error(`Failed to fetch PO ${poIdToEdit}`);
          const poData: PurchaseOrderPayload = await poRes.json();
          
          // Fetch supplier details separately if not included in main PO fetch
          if (poData.supplierId && !poData.supplierDetails) {
            const supRes = await fetch(`/api/suppliers`); // Assuming you have an endpoint for single supplier
            if (supRes.ok) {
                 const allSuppliersList: Supplier[] = await supRes.json();
                 poData.supplierDetails = allSuppliersList.find(s => s.supplierCode === poData.supplierId);
            }
          }
          await loadPODataForEdit(poData);
        } else if (initialData) { // Use pre-fetched initialData
          await loadPODataForEdit(initialData);
        } else { // New PO
          await fetchNextPONumber();
        }

      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({ title: "Error", description: `Failed to load initial data: ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchInitialAndDropdownData();
  }, [poIdToEdit, initialData, fetchNextPONumber, loadPODataForEdit, toast]);


  const watchedItems = form.watch('items');
  const watchedCurrency = form.watch('currency');
  const watchedPricesIncludeVat = form.watch('pricesIncludeVat');

  useEffect(() => {
    const items = watchedItems || [];
    let calculatedInputSum = 0;
    items.forEach((item: POFormItemStructure) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        calculatedInputSum += quantity * unitPrice;
    });

    let newDisplaySubTotal = calculatedInputSum;
    let newDisplayVatAmount = 0;

    if (watchedCurrency === 'MZN' && !watchedPricesIncludeVat) {
        newDisplayVatAmount = newDisplaySubTotal * 0.16;
    }
    
    setSubTotal(parseFloat(newDisplaySubTotal.toFixed(2)));
    setVatAmount(parseFloat(newDisplayVatAmount.toFixed(2)));
    setGrandTotal(parseFloat((newDisplaySubTotal + newDisplayVatAmount).toFixed(2)));

  }, [watchedItems, watchedCurrency, watchedPricesIncludeVat]);


  const onSubmit = async (formData: POFormValues) => {
    if (!formData.items || formData.items.length === 0) {
      toast({ title: "Validation Error", description: "Please add at least one item.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    // For edit mode, the poNumber is taken from the read-only display field which was populated from initial data.
    // For new mode, it's taken from what the user might have typed or the suggested value.
    const poNumberToSubmit = formData.poNumberDisplay;


    const payload: Omit<PurchaseOrderPayload, 'id' | 'status' | 'creatorUserId' | 'approvalDate' | 'supplierDetails' | 'creatorName' | 'approverName' | 'approverSignatureUrl'> & { items: POItemPayload[] } = {
      poNumber: poNumberToSubmit,
      creationDate: new Date(formData.poDate).toISOString(),
      requestedByName: formData.requestedByName,
      supplierId: formData.vendorName,
      approverId: formData.approverId,
      subTotal: subTotal,
      vatAmount: vatAmount,
      grandTotal: grandTotal,
      currency: formData.currency,
      pricesIncludeVat: formData.pricesIncludeVat,
      notes: formData.notes,
      items: formData.items.map(item => ({
        partNumber: item.partNumber,
        description: item.description,
        categoryId: item.categoryId ? Number(item.categoryId) : null,
        siteId: item.siteId ? Number(item.siteId) : null,
        uom: item.uom,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      quoteNo: formData.quoteNo,
    };

    try {
      let response;
      let successMessage = '';

      if (editMode && poIdToEdit) { // Ensure poIdToEdit is present for PUT
        response = await fetch(`/api/purchase-orders/${poIdToEdit}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        successMessage = `Purchase Order ${payload.poNumber} updated successfully.`;
      } else {
        response = await fetch('/api/purchase-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, status: 'Pending Approval', creatorUserId: null }), // Add creation specific fields
        });
        successMessage = `Purchase Order ${payload.poNumber} created successfully.`;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Failed to ${editMode ? 'update' : 'submit'} PO. Server returned an unreadable error.` }));
        throw new Error(errorData.error || `Server error: ${response.status} - ${errorData.details || response.statusText}`);
      }

      const result = await response.json();
      toast({ title: 'Success!', description: successMessage });
      
      if (!editMode) {
        form.reset(); // Reset form only on create
        await fetchNextPONumber();
      } else if (result.poId) { // Ensure result.poId is available before redirecting
        router.push(`/purchase-orders/${result.poId}/print`);
      } else {
        // Fallback or error handling if poId isn't returned on update
        router.push(`/`); // Or some other sensible default
      }

    } catch (error: any) {
      toast({ title: `Error ${editMode ? 'Updating' : 'Submitting'} PO`, description: error.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPrintPO = async () => {
    setIsPrintingLoading(true);
    try {
      let targetPoId = poIdToEdit; // Prioritize poIdToEdit if in edit mode

      if (!targetPoId) { // If not in edit mode (new PO), try to get ID from the current PO number in the form
        const currentPoNumberInForm = form.getValues('poNumberDisplay');
        if (!currentPoNumberInForm || currentPoNumberInForm === 'Loading PO...' || currentPoNumberInForm === 'PO-ERROR') {
          toast({ title: 'PO Number Required', description: 'PO Number must be loaded or entered to view/print.', variant: 'destructive' });
          setIsPrintingLoading(false);
          return;
        }
        const res = await fetch(`/api/purchase-orders/get-by-po-number/${encodeURIComponent(currentPoNumberInForm)}`);
        if (res.ok) {
          const poDetails = await res.json();
          targetPoId = poDetails.id;
        } else {
          toast({ title: 'PO Not Found', description: `PO ${currentPoNumberInForm} not found. Save it first if it's a new PO.`, variant: 'destructive' });
          setIsPrintingLoading(false);
          return;
        }
      }

      if (targetPoId) {
        window.open(`/purchase-orders/${targetPoId}/print`, '_blank');
      } else {
        // This case should ideally not be hit if the logic above is sound
        toast({ title: 'Error', description: 'Could not determine PO to view/print.', variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: `Could not prepare PO for printing: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsPrintingLoading(false);
    }
  };

  const handleSupplierChange = (selectedSupplierCode: string | null) => {
    const selectedSupplier = suppliers.find(s => s.supplierCode === selectedSupplierCode);
    if (selectedSupplier) {
      form.setValue('vendorName', selectedSupplier.supplierCode); // This is the supplierId
      form.setValue('vendorEmail', selectedSupplier.emailAddress || '');
      form.setValue('salesPerson', selectedSupplier.salesPerson || '');
      form.setValue('supplierContactNumber', selectedSupplier.cellNumber || '');
      form.setValue('nuit', selectedSupplier.nuitNumber || '');
      form.setValue('billingAddress', selectedSupplier.physicalAddress || '');
    } else { // Clear fields if no supplier selected or found
      form.setValue('vendorEmail', '');
      form.setValue('salesPerson', '');
      form.setValue('supplierContactNumber', '');
      form.setValue('nuit', '');
      form.setValue('billingAddress', '');
    }
  };
  
  const currencySymbol = watchedCurrency === 'MZN' ? 'MZN' : '$'; 

  if (isLoadingData && editMode) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading PO data...</div>;
  }

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{editMode ? 'Edit Purchase Order' : 'Create New Purchase Order'}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div>
              <h3 className="text-lg font-medium font-headline mb-2">Supplier & PO Information</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="vendorName" // This stores supplierId
                  rules={{ required: 'Supplier is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); handleSupplierChange(value); }} value={field.value || ''}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a supplier" /></SelectTrigger></FormControl>
                        <SelectContent>{suppliers.map(s => (<SelectItem key={s.supplierCode} value={s.supplierCode}>{s.supplierName} ({s.supplierCode})</SelectItem>))}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="vendorEmail" render={({ field }) => ( <FormItem> <FormLabel>Supplier Email</FormLabel> <FormControl><Input type="email" placeholder="e.g. supplier@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="salesPerson" render={({ field }) => ( <FormItem> <FormLabel>Sales Person</FormLabel> <FormControl><Input placeholder="e.g. Mr. Sales" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="supplierContactNumber" render={({ field }) => ( <FormItem> <FormLabel>Supplier Contact</FormLabel> <FormControl><Input placeholder="e.g. +258 123 4567" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="nuit" render={({ field }) => ( <FormItem> <FormLabel>NUIT</FormLabel> <FormControl><Input placeholder="e.g. 123456789" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="quoteNo" render={({ field }) => ( <FormItem> <FormLabel>Quote No.</FormLabel> <FormControl><Input placeholder="e.g. QT-001" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="poDate" rules={{ required: 'PO Date is required' }} render={({ field }) => ( <FormItem> <FormLabel>PO Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField
                  control={form.control}
                  name="poNumberDisplay"
                  rules={{ required: 'PO Number is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PO Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="PO Number"
                          {...field}
                          readOnly={editMode} // PO Number is read-only in edit mode
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField control={form.control} name="billingAddress" render={({ field }) => ( <FormItem> <FormLabel>Supplier Address (for PDF)</FormLabel> <FormControl><Textarea placeholder="Enter supplier's billing address..." {...field} /></FormControl> <FormMessage /> </FormItem> )} />

            <div>
              <h3 className="text-lg font-medium font-headline mb-2">PO Configuration</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <FormField control={form.control} name="currency" render={({ field }) => ( <FormItem> <FormLabel>Currency</FormLabel> <Select onValueChange={field.onChange} value={field.value || 'MZN'}> <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="MZN">MZN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="requestedByName" rules={{ required: 'Requested By is required' }} render={({ field }) => ( <FormItem> <FormLabel>Requested By</FormLabel> <FormControl><Input placeholder="Enter requester's name" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="approverId" rules={{ required: 'Approver is required' }} render={({ field }) => ( <FormItem> <FormLabel>Approver</FormLabel> <Select onValueChange={field.onChange} value={field.value || ''}> <FormControl><SelectTrigger><SelectValue placeholder="Select an approver" /></SelectTrigger></FormControl> <SelectContent>{approvers.map(appr => (<SelectItem key={appr.id} value={appr.id}>{appr.name}</SelectItem>))}</SelectContent> </Select> <FormMessage /> </FormItem> )} />
             </div>
              <FormField control={form.control} name="pricesIncludeVat" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"> <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl> <div className="space-y-1 leading-none"><FormLabel>Prices are VAT inclusive</FormLabel></div> </FormItem> )} />
            </div>

            <Separator />
            <h3 className="text-lg font-medium font-headline">Items</h3>
            {fields.map((itemField, index) => {
              const itemQuantity = form.watch(`items.${index}.quantity`) || 0;
              const itemUnitPrice = form.watch(`items.${index}.unitPrice`) || 0;
              const itemTotal = (Number(itemQuantity) * Number(itemUnitPrice)).toFixed(2);
              return (
                <Card key={itemField.id} className="p-4 space-y-4 relative mb-4 shadow-md">
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <FormField control={form.control} name={`items.${index}.partNumber`} render={({ field }) => ( <FormItem> <FormLabel>Part Number</FormLabel> <FormControl><Input placeholder="Optional part no." {...field} /></FormControl> </FormItem> )} />
                    <FormField control={form.control} name={`items.${index}.description`} rules={{ required: 'Description is required' }} render={({ field }) => ( <FormItem className="lg:col-span-2"> <FormLabel>Description</FormLabel> <FormControl><Input placeholder="Item description" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name={`items.${index}.categoryId`} rules={{ required: 'Category is required' }} render={({ field }) => ( <FormItem> <FormLabel>Category</FormLabel> <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() || ''}> <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl> <SelectContent>{categories.map(cat => (<SelectItem key={cat.id} value={cat.id.toString()}>{cat.category}</SelectItem>))}</SelectContent> </Select> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name={`items.${index}.siteId`} rules={{ required: 'Allocation (Site) is required' }} render={({ field }) => ( <FormItem> <FormLabel>Allocation (Site)</FormLabel> <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() || ''}> <FormControl><SelectTrigger><SelectValue placeholder="Select allocation site" /></SelectTrigger></FormControl> <SelectContent>{sites.map(site => (<SelectItem key={site.id} value={site.id.toString()}>{site.siteCode || site.name}</SelectItem>))}</SelectContent> </Select> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name={`items.${index}.uom`} rules={{ required: 'UOM is required' }} render={({ field }) => ( <FormItem> <FormLabel>UOM</FormLabel> <FormControl><Input placeholder="e.g., EA, KG, M" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name={`items.${index}.quantity`} rules={{ required: 'Quantity is required', min: { value: 1, message: 'Must be at least 1' } }} render={({ field }) => ( <FormItem> <FormLabel>Quantity</FormLabel> <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name={`items.${index}.unitPrice`} rules={{ required: 'Unit Price is required', min: { value: 0.01, message: 'Must be positive' } }} render={({ field }) => ( <FormItem> <FormLabel>Unit Price ({currencySymbol})</FormLabel> <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0.00)} /></FormControl> <FormMessage /> </FormItem> )} />
                    <div className="flex items-end"> <FormItem className="w-full"> <FormLabel>Item Total ({currencySymbol})</FormLabel> <div className="h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground flex items-center">{itemTotal}</div> </FormItem> </div>
                  </div>
                  {fields.length > 1 && (<Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2" title="Remove Item"><Trash2 className="h-4 w-4" /></Button>)}
                </Card>
              );
            })}
            <Button type="button" variant="outline" onClick={() => append({...defaultItem, id: crypto.randomUUID() })} className="mt-0"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
            <Separator />
            <FormField control={form.control} name="notes" render={({ field }) => ( <FormItem> <FormLabel>Notes</FormLabel> <FormControl><Textarea placeholder="Add any relevant notes..." className="resize-none" {...field} /></FormControl> </FormItem> )} />

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div> {/* Placeholder for creator, can be removed or adapted if needed */} </div>
              <div className="space-y-2 text-right border p-4 rounded-md bg-muted/20">
                <div className="text-md">Subtotal ({currencySymbol}): <span className="font-semibold">{subTotal.toFixed(2)}</span></div>
                {watchedCurrency === 'MZN' && (<div className="text-md">VAT (16%) ({currencySymbol}): <span className="font-semibold">{vatAmount.toFixed(2)}</span></div>)}
                <div className="text-xl font-bold font-headline">Grand Total ({currencySymbol}): <span className="font-semibold">{grandTotal.toFixed(2)}</span></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button type="submit" className="w-full sm:w-auto" size="lg" disabled={isSubmitting || (!form.formState.isValid && form.formState.isSubmitted)}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editMode ? <Edit className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />)}
                {isSubmitting ? (editMode ? 'Updating...' : 'Submitting...') : (editMode ? 'Update PO' : 'Submit PO')}
              </Button>
              <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto" onClick={handleViewPrintPO} disabled={isPrintingLoading}>
                {isPrintingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" /> }
                {isPrintingLoading ? 'Loading...' : 'View/Print PO'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {editMode ? "You are editing an existing Purchase Order. PO Number is not editable here." : "PO Number can be edited. If viewing an existing PO, ensure the number is correct."}
        </p>
      </CardFooter>
    </Card>
  );
}

    