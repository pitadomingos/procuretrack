
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
import { PlusCircle, Trash2, Send, Printer, Loader2, Edit, Search, DownloadCloud } from 'lucide-react';
import type { Supplier, Site, Category as CategoryType, Approver, POItem as POFormItemStructure, PurchaseOrderPayload, POItemPayload, RequisitionPayload, RequisitionItem } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

interface POFormProps {
  poIdToEditProp?: string | null;
}

const defaultItem: POFormItemStructure = {
  id: crypto.randomUUID(),
  partNumber: '',
  description: '',
  categoryId: null,
  siteId: null,    
  uom: '',
  quantity: 1,
  unitPrice: 0.00,
  quantityReceived: 0,
  itemStatus: 'Pending',
};

interface POFormValues {
  vendorName: string | null;
  vendorEmail: string;
  salesPerson: string;
  supplierContactNumber: string;
  nuit: string;
  quoteNo: string;
  billingAddress: string;
  poDate: string;
  poNumberDisplay: string;
  currency: string;
  requestedByName: string;
  approverId: string | null;
  overallSiteId: string | null; 
  pricesIncludeVat: boolean;
  notes: string;
  items: POFormItemStructure[];
  selectedRequisitionId?: string | null; // For loading from requisition
}

interface ApprovedRequisitionOption {
    id: string;
    requisitionNumber: string;
    requisitionDate: string;
    requestedByName: string;
    siteName: string;
    itemCount: number;
}


export function POForm({ poIdToEditProp }: POFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [subTotal, setSubTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrintingLoading, setIsPrintingLoading] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true); 
  const [isLoadingPOForEdit, setIsLoadingPOForEdit] = useState(false);
  const [isLoadingRequisitionItems, setIsLoadingRequisitionItems] = useState(false);


  const [isEditingLoadedPO, setIsEditingLoadedPO] = useState(false);
  const [loadedPOId, setLoadedPOId] = useState<string | null>(null);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sites, setSitesData] = useState<Site[]>([]); 
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [approvers, setApproversData] = useState<Approver[]>([]);
  const [approvedRequisitions, setApprovedRequisitions] = useState<ApprovedRequisitionOption[]>([]);


  const form = useForm<POFormValues>({
    defaultValues: {
      vendorName: null, vendorEmail: '', salesPerson: '', supplierContactNumber: '', nuit: '',
      quoteNo: '', billingAddress: '', poDate: format(new Date(), 'yyyy-MM-dd'),
      poNumberDisplay: 'Loading PO...', currency: 'MZN', requestedByName: '',
      approverId: null, overallSiteId: null, pricesIncludeVat: false, notes: '', items: [{...defaultItem}],
      selectedRequisitionId: null,
    },
    mode: 'onBlur',
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const loadPODataIntoForm = useCallback((data: PurchaseOrderPayload, currentSuppliers: Supplier[]) => {
    form.reset({
      vendorName: data.supplierId,
      vendorEmail: data.supplierDetails?.emailAddress || '',
      salesPerson: data.supplierDetails?.salesPerson || '',
      supplierContactNumber: data.supplierDetails?.cellNumber || '',
      nuit: data.supplierDetails?.nuitNumber || '',
      billingAddress: data.supplierDetails?.physicalAddress || '',
      quoteNo: data.quoteNo || '',
      poDate: data.creationDate ? format(parseISO(data.creationDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      poNumberDisplay: data.poNumber,
      currency: data.currency,
      requestedByName: data.requestedByName || '',
      approverId: data.approverId,
      overallSiteId: data.siteId ? data.siteId.toString() : null, 
      pricesIncludeVat: data.pricesIncludeVat,
      notes: data.notes || '',
      items: (data.items || []).map(item => ({
        id: crypto.randomUUID(),
        partNumber: item.partNumber || '',
        description: item.description,
        categoryId: item.categoryId,
        siteId: item.siteId, 
        uom: item.uom,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        quantityReceived: item.quantityReceived || 0,
        itemStatus: item.itemStatus || 'Pending',
      })),
      selectedRequisitionId: null, // Reset this when loading a PO directly
    });

    if (data.supplierId) {
      const selectedSupplier = currentSuppliers.find(s => s.supplierCode === data.supplierId);
      if (selectedSupplier) {
        form.setValue('vendorEmail', selectedSupplier.emailAddress || '');
        form.setValue('salesPerson', selectedSupplier.salesPerson || '');
        form.setValue('supplierContactNumber', selectedSupplier.cellNumber || '');
        form.setValue('nuit', selectedSupplier.nuitNumber || '');
        form.setValue('billingAddress', selectedSupplier.physicalAddress || '');
      }
    }
    setIsEditingLoadedPO(true);
    setLoadedPOId(String(data.id));
  }, [form]);

  const resetFormForNew = useCallback(async (fetchNextNumber = true) => {
    form.reset({
      vendorName: null, vendorEmail: '', salesPerson: '', supplierContactNumber: '', nuit: '',
      quoteNo: '', billingAddress: '', poDate: format(new Date(), 'yyyy-MM-dd'),
      poNumberDisplay: fetchNextNumber ? 'Fetching...' : form.getValues('poNumberDisplay'), 
      currency: 'MZN', requestedByName: '',
      approverId: null, overallSiteId: null, pricesIncludeVat: false, notes: '', items: [{...defaultItem}],
      selectedRequisitionId: null,
    });
    setIsEditingLoadedPO(false);
    setLoadedPOId(null);
    if (fetchNextNumber) {
      try {
        const response = await fetch('/api/purchase-orders/next-po-number');
        if (!response.ok) throw new Error('Failed to fetch next PO number');
        const data = await response.json();
        form.setValue('poNumberDisplay', data.nextPoNumber || 'PO-ERROR');
      } catch (error) {
        form.setValue('poNumberDisplay', 'PO-ERROR');
        toast({ title: "Error", description: "Could not load next PO number.", variant: "destructive" });
      }
    }
  }, [form, toast]);


  useEffect(() => {
    const fetchCoreDataAndInitializeForm = async () => {
      setIsLoadingInitialData(true);
      let fetchedSuppliers: Supplier[] = [];

      try {
        const [suppliersRes, sitesRes, categoriesRes, approversRes, approvedReqsRes] = await Promise.all([
          fetch('/api/suppliers'), fetch('/api/sites'), fetch('/api/categories'), fetch('/api/approvers'),
          fetch('/api/requisitions/for-po-creation'), // Fetch approved requisitions
        ]);

        fetchedSuppliers = suppliersRes.ok ? await suppliersRes.json() : [];
        const fetchedSites: Site[] = sitesRes.ok ? await sitesRes.json() : [];
        const fetchedCategories: CategoryType[] = categoriesRes.ok ? await categoriesRes.json() : [];
        const fetchedApprovers: Approver[] = approversRes.ok ? await approversRes.json() : [];
        const fetchedApprovedReqs: ApprovedRequisitionOption[] = approvedReqsRes.ok ? await approvedReqsRes.json() : [];


        setSuppliers(fetchedSuppliers);
        setSitesData(fetchedSites);
        setCategories(fetchedCategories);
        setApproversData(fetchedApprovers);
        setApprovedRequisitions(fetchedApprovedReqs);


        if (poIdToEditProp) {
          setIsLoadingPOForEdit(true);
          const poHeaderRes = await fetch(`/api/purchase-orders/${poIdToEditProp}`);
          if (!poHeaderRes.ok) throw new Error(`Failed to fetch PO Header ${poIdToEditProp}`);
          const poDataToEdit: PurchaseOrderPayload = await poHeaderRes.json();

          const poItemsRes = await fetch(`/api/purchase-orders/${poIdToEditProp}/items`);
          if (!poItemsRes.ok) throw new Error(`Failed to fetch PO Items for ${poIdToEditProp}`);
          const poItemsData: POItemPayload[] = await poItemsRes.json();
          poDataToEdit.items = poItemsData;

          if (poDataToEdit.supplierId && !poDataToEdit.supplierDetails) {
             poDataToEdit.supplierDetails = fetchedSuppliers.find(s => s.supplierCode === poDataToEdit.supplierId);
          }
          loadPODataIntoForm(poDataToEdit, fetchedSuppliers);
          setIsLoadingPOForEdit(false);
        } else {
          await resetFormForNew();
        }
      } catch (error) {
        toast({ title: "Error Loading Data", description: `Failed to load initial form data: ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
        if (!poIdToEditProp) form.setValue('poNumberDisplay', 'PO-ERROR');
      } finally {
        setIsLoadingInitialData(false);
      }
    };
    fetchCoreDataAndInitializeForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poIdToEditProp, toast]); 


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

  const handleLoadPOForEditing = async () => {
    const poNumberToLoad = form.getValues('poNumberDisplay');
    if (!poNumberToLoad || poNumberToLoad === 'Loading PO...' || poNumberToLoad === 'Fetching...' || poNumberToLoad === 'PO-ERROR') {
      toast({ title: "PO Number Required", description: "Please enter a PO number to load.", variant: "destructive"});
      return;
    }
    setIsLoadingPOForEdit(true);
    try {
      const idRes = await fetch(`/api/purchase-orders/get-by-po-number/${encodeURIComponent(poNumberToLoad)}`);
      if (!idRes.ok) {
         const errorData = await idRes.json().catch(() => ({}));
        throw new Error(errorData.error || `PO Number ${poNumberToLoad} not found.`);
      }
      const { id: foundPoId } = await idRes.json();

      if (!foundPoId) throw new Error(`PO Number ${poNumberToLoad} not found.`);

      const poHeaderRes = await fetch(`/api/purchase-orders/${foundPoId}`);
      if (!poHeaderRes.ok) throw new Error(`Failed to fetch PO Header for PO ID ${foundPoId}.`);
      const poDataToLoad: PurchaseOrderPayload = await poHeaderRes.json();

      const poItemsRes = await fetch(`/api/purchase-orders/${foundPoId}/items`);
      if (!poItemsRes.ok) throw new Error(`Failed to fetch PO Items for ID ${foundPoId}`);
      const poItemsData: POItemPayload[] = await poItemsRes.json();
      poDataToLoad.items = poItemsData;

      if (poDataToLoad.status !== 'Pending Approval' && poDataToLoad.status !== 'Draft' && poDataToLoad.status !== 'Rejected') { // Allow editing rejected
        toast({ title: "Cannot Edit", description: `PO ${poNumberToLoad} is in '${poDataToLoad.status}' status and cannot be edited.`, variant: "destructive"});
        setIsLoadingPOForEdit(false);
        return;
      }

       if (poDataToLoad.supplierId && !poDataToLoad.supplierDetails) {
         poDataToLoad.supplierDetails = suppliers.find(s => s.supplierCode === poDataToLoad.supplierId);
       }
      loadPODataIntoForm(poDataToLoad, suppliers);
      toast({title: "PO Loaded", description: `PO ${poNumberToLoad} loaded for editing.`});
    } catch (error) {
      toast({ title: "Error Loading PO", description: `${error instanceof Error ? error.message : String(error)}`, variant: "destructive"});
    } finally {
      setIsLoadingPOForEdit(false);
    }
  };

   const handleLoadRequisitionItems = async () => {
    const requisitionId = form.getValues('selectedRequisitionId');
    if (!requisitionId) {
      toast({ title: 'No Requisition Selected', description: 'Please select an approved requisition to load items.', variant: 'info' });
      return;
    }
    setIsLoadingRequisitionItems(true);
    try {
      const response = await fetch(`/api/requisitions/${requisitionId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch requisition details for ID ${requisitionId}.`);
      }
      const requisitionData: RequisitionPayload = await response.json();

      // Pre-fill PO header info from requisition
      form.setValue('requestedByName', requisitionData.requestedByName || requisitionData.requestorFullName || '');
      // DO NOT set form.setValue('overallSiteId', requisitionData.siteId.toString());
      // The PO's overallSiteId is independent.

      // Add a note indicating source
      const currentNotes = form.getValues('notes') || '';
      form.setValue('notes', `${currentNotes}\nItems loaded from Requisition: ${requisitionData.requisitionNumber}`.trim());


      // Map requisition items to PO items
      const newPOItems = requisitionData.items.map(reqItem => ({
        ...defaultItem, // Start with default PO item structure
        id: crypto.randomUUID(), // New ID for PO item
        partNumber: reqItem.partNumber || '',
        description: reqItem.description,
        categoryId: reqItem.categoryId,
        siteId: requisitionData.siteId, // Each PO item's siteId comes from the Requisition's header siteId
        uom: (reqItem as any).uom || 'EA', // Assuming RequisitionItem might have uom, fallback to EA
        quantity: reqItem.quantity,
        unitPrice: 0.00, // Price to be filled by PO creator
        quantityReceived: 0, // Initialize received quantity
        itemStatus: 'Pending', // Initialize item status
      }));

      replace(newPOItems); // Replace existing items with new ones
      toast({ title: 'Items Loaded', description: `Items from Requisition ${requisitionData.requisitionNumber} loaded. Each item's site set to Req Header Site ID: ${requisitionData.siteId}.` });
    } catch (error: any) {
      toast({ title: 'Error Loading Requisition Items', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoadingRequisitionItems(false);
    }
  };


  const onSubmit = async (formData: POFormValues) => {
    if (!formData.items || formData.items.length === 0) {
      toast({ title: "Validation Error", description: "Please add at least one item.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const payload = {
      poNumber: formData.poNumberDisplay,
      creationDate: new Date(formData.poDate).toISOString(),
      requestedByName: formData.requestedByName,
      supplierId: formData.vendorName,
      approverId: formData.approverId,
      siteId: formData.overallSiteId ? Number(formData.overallSiteId) : null, 
      subTotal: subTotal, vatAmount: vatAmount, grandTotal: grandTotal, currency: formData.currency,
      pricesIncludeVat: formData.pricesIncludeVat, notes: formData.notes,
      items: formData.items.map(item => ({
        partNumber: item.partNumber, description: item.description, categoryId: item.categoryId ? Number(item.categoryId) : null,
        siteId: item.siteId ? Number(item.siteId) : null, uom: item.uom, quantity: Number(item.quantity), unitPrice: Number(item.unitPrice),
        quantityReceived: item.quantityReceived || 0,
        itemStatus: item.itemStatus || 'Pending',
      })),
      quoteNo: formData.quoteNo,
      status: isEditingLoadedPO && loadedPOId && form.getValues('status' as any) === 'Rejected' ? 'Pending Approval' : 'Pending Approval', // If editing a rejected PO, resubmit as Pending. Else, always Pending.
      creatorUserId: null 
    };

    try {
      let response;
      let successMessage = '';

      if (isEditingLoadedPO && loadedPOId) {
        response = await fetch(`/api/purchase-orders/${loadedPOId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        successMessage = `Purchase Order ${payload.poNumber} updated successfully.`;
      } else {
        response = await fetch('/api/purchase-orders', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), // status is set above
        });
        successMessage = `Purchase Order ${payload.poNumber} created successfully.`;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Failed to ${isEditingLoadedPO ? 'update' : 'submit'} PO. Server error.` }));
        throw new Error(errorData.error || `Server error: ${response.status} - ${errorData.details || response.statusText}`);
      }
      const result = await response.json();
      toast({ title: 'Success!', description: successMessage });

      if (result.poId) {
        const contextParam = (isEditingLoadedPO || loadedPOId) ? '' : '?context=creator';
        router.push(`/purchase-orders/${result.poId}/print${contextParam}`);
      } else if (!isEditingLoadedPO) {
        await resetFormForNew();
      }

    } catch (error: any) {
      toast({ title: `Error ${isEditingLoadedPO ? 'Updating' : 'Submitting'} PO`, description: error.message || 'An unexpected error occurred.', variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPrintPO = async () => {
    setIsPrintingLoading(true);
    try {
      let targetPoId = loadedPOId;
      if (!targetPoId) {
        const poNumberInForm = form.getValues('poNumberDisplay');
        if (!poNumberInForm || ['Loading PO...', 'Fetching...', 'PO-ERROR'].includes(poNumberInForm)) {
          toast({ title: 'PO Number Required', description: 'PO Number must be available to view/print.', variant: 'destructive' }); return;
        }
        const res = await fetch(`/api/purchase-orders/get-by-po-number/${encodeURIComponent(poNumberInForm)}`);
        if (res.ok) { const poDetails = await res.json(); targetPoId = poDetails.id; }
        else { toast({ title: 'PO Not Found', description: `PO ${poNumberInForm} not found. Save it first.`, variant: 'destructive' }); return; }
      }
      if (targetPoId) {
        const contextParam = (isEditingLoadedPO || loadedPOId) ? '' : '?context=creator';
        window.open(`/purchase-orders/${targetPoId}/print${contextParam}`, '_blank');
      } else {
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
      form.setValue('vendorName', selectedSupplier.supplierCode);
      form.setValue('vendorEmail', selectedSupplier.emailAddress || '');
      form.setValue('salesPerson', selectedSupplier.salesPerson || '');
      form.setValue('supplierContactNumber', selectedSupplier.cellNumber || '');
      form.setValue('nuit', selectedSupplier.nuitNumber || '');
      form.setValue('billingAddress', selectedSupplier.physicalAddress || '');
    } else {
      form.setValue('vendorEmail', ''); form.setValue('salesPerson', ''); form.setValue('supplierContactNumber', '');
      form.setValue('nuit', ''); form.setValue('billingAddress', '');
    }
  };

  const currencySymbol = watchedCurrency === 'MZN' ? 'MZN' : '$';
  const formatValue = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (isLoadingInitialData && !poIdToEditProp) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading form data...</div>;
  }
  if (isLoadingPOForEdit && poIdToEditProp) {
     return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading PO for editing...</div>;
  }

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{isEditingLoadedPO ? `Editing PO: ${form.getValues('poNumberDisplay')}` : 'Create New Purchase Order'}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Load from Requisition Section */}
            {!isEditingLoadedPO && (
              <div className="p-4 border rounded-md bg-muted/30 space-y-3 mb-6">
                <h3 className="text-md font-medium text-primary">Load from Approved Requisition</h3>
                <div className="grid md:grid-cols-3 gap-4 items-end">
                    <FormField
                    control={form.control}
                    name="selectedRequisitionId"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                        <FormLabel>Select Requisition</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''} disabled={isLoadingRequisitionItems}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Choose an approved requisition..." /></SelectTrigger></FormControl>
                            <SelectContent>
                              {approvedRequisitions.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground">No approved requisitions found</div>
                              ) : (
                                approvedRequisitions.map(req => (
                                    <SelectItem key={req.id} value={req.id}>
                                    {req.requisitionNumber} ({req.siteName}) - {req.itemCount} items - Req by: {req.requestedByName} on {req.requisitionDate}
                                    </SelectItem>
                                ))
                              )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button 
                        type="button" 
                        onClick={handleLoadRequisitionItems} 
                        disabled={!form.watch('selectedRequisitionId') || isLoadingRequisitionItems}
                        variant="outline"
                    >
                        {isLoadingRequisitionItems ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DownloadCloud className="mr-2 h-4 w-4" />}
                        Load Items
                    </Button>
                </div>
              </div>
            )}


            <div>
              <h3 className="text-lg font-medium font-headline mb-2">Supplier & PO Information</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control} name="poNumberDisplay" rules={{ required: 'PO Number is required' }}
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>PO Number</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="PO Number or type to load" {...field} readOnly={isEditingLoadedPO} />
                        </FormControl>
                        {!isEditingLoadedPO && (
                           <Button type="button" variant="outline" onClick={handleLoadPOForEditing} disabled={isLoadingPOForEdit} className="shrink-0">
                            {isLoadingPOForEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Load
                           </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="quoteNo" render={({ field }) => ( <FormItem> <FormLabel>Quote No.</FormLabel> <FormControl><Input placeholder="e.g. QT-001" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="poDate" rules={{ required: 'PO Date is required' }} render={({ field }) => ( <FormItem> <FormLabel>PO Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <FormField
                  control={form.control} name="vendorName" rules={{ required: 'Supplier is required' }}
                  render={({ field }) => (
                    <FormItem> <FormLabel>Supplier Name</FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); handleSupplierChange(value); }} value={field.value || ''}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a supplier" /></SelectTrigger></FormControl>
                        <SelectContent>{suppliers.map(s => (<SelectItem key={s.supplierCode} value={s.supplierCode}>{s.supplierName} ({s.supplierCode})</SelectItem>))}</SelectContent>
                      </Select> <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="vendorEmail" render={({ field }) => ( <FormItem> <FormLabel>Supplier Email</FormLabel> <FormControl><Input type="email" placeholder="e.g. supplier@example.com" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="salesPerson" render={({ field }) => ( <FormItem> <FormLabel>Sales Person</FormLabel> <FormControl><Input placeholder="e.g. Mr. Sales" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                <FormField control={form.control} name="supplierContactNumber" render={({ field }) => ( <FormItem className="md:col-span-1"> <FormLabel>Supplier Contact</FormLabel> <FormControl><Input placeholder="e.g. +258 123 4567" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="nuit" render={({ field }) => ( <FormItem className="md:col-span-1"> <FormLabel>NUIT</FormLabel> <FormControl><Input placeholder="e.g. 123456789" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="billingAddress" render={({ field }) => ( <FormItem className="md:col-span-3"> <FormLabel>Supplier Address (for PDF)</FormLabel> <FormControl><Textarea placeholder="Enter supplier's billing address..." {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium font-headline mb-2 mt-4">PO Configuration</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 items-center"> 
                <FormField
                  control={form.control} name="overallSiteId" // This field is optional at PO header level
                  render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Overall PO Site (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Site" /></SelectTrigger></FormControl>
                        <SelectContent>{sites.map(site => (<SelectItem key={site.id} value={site.id.toString()}>{site.siteCode || site.name}</SelectItem>))}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="currency" render={({ field }) => ( <FormItem className="lg:col-span-1"> <FormLabel>Currency</FormLabel> <Select onValueChange={field.onChange} value={field.value || 'MZN'}> <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="MZN">MZN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="requestedByName" rules={{ required: 'Requested By is required' }} render={({ field }) => ( <FormItem className="lg:col-span-1"> <FormLabel>Requested By</FormLabel> <FormControl><Input placeholder="Enter requester's name" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="approverId" rules={{ required: 'Approver is required' }} render={({ field }) => ( <FormItem className="lg:col-span-1"> <FormLabel>Approver</FormLabel> <Select onValueChange={field.onChange} value={field.value || ''}> <FormControl><SelectTrigger><SelectValue placeholder="Select an approver" /></SelectTrigger></FormControl> <SelectContent>{approvers.map(appr => (<SelectItem key={appr.id} value={appr.id}>{appr.name}</SelectItem>))}</SelectContent> </Select> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="pricesIncludeVat" render={({ field }) => ( <FormItem className="lg:col-span-1 flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 h-10 mt-auto"> <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl> <div className="space-y-1 leading-none"><FormLabel>Prices VAT inclusive</FormLabel></div> </FormItem> )} />
             </div>
            </div>

            <Separator />
            <h3 className="text-lg font-medium font-headline">Items</h3>
            {fields.map((itemField, index) => {
              const itemQuantity = form.watch(`items.${index}.quantity`) || 0;
              const itemUnitPrice = form.watch(`items.${index}.unitPrice`) || 0;
              const itemTotal = (Number(itemQuantity) * Number(itemUnitPrice));
              return (
                <Card key={itemField.id} className="p-4 space-y-4 relative mb-4 shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-x-4 gap-y-2 items-end">
                    <FormField control={form.control} name={`items.${index}.partNumber`} render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Part Number</FormLabel>
                        <FormControl><Input placeholder="Optional" {...field} value={field.value ?? ''} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.description`} rules={{ required: 'Description is required' }} render={({ field }) => (
                      <FormItem className="lg:col-span-3">
                        <FormLabel>Description</FormLabel>
                        <FormControl><Input placeholder="Item description" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.categoryId`} rules={{ required: 'Category is required' }} render={({ field }) => (
                      <FormItem className="lg:col-span-1">
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={(v) => field.onChange(v ? Number(v) : null)} value={field.value?.toString() || ''}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>{categories.map(cat => (<SelectItem key={cat.id} value={cat.id.toString()}>{cat.category}</SelectItem>))}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.siteId`} rules={{ required: 'Item Site is required' }} render={({ field }) => ( 
                      <FormItem className="lg:col-span-1">
                        <FormLabel>Item Site</FormLabel>
                        <Select onValueChange={(v) => field.onChange(v ? Number(v) : null)} value={field.value?.toString() || ''}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>{sites.map(site => (<SelectItem key={site.id} value={site.id.toString()}>{site.siteCode || site.name}</SelectItem>))}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.uom`} rules={{ required: 'UOM is required' }} render={({ field }) => (
                      <FormItem className="lg:col-span-1">
                        <FormLabel>UOM</FormLabel>
                        <FormControl><Input placeholder="e.g., EA" {...field} /></FormControl>
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
                    <FormField control={form.control} name={`items.${index}.unitPrice`} rules={{ required: 'Unit Price is required', min: { value: 0, message: 'Cannot be negative' } }} render={({ field }) => (
                      <FormItem className="lg:col-span-1">
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
                  {fields.length > 1 && (<Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2" title="Remove Item"><Trash2 className="h-4 w-4" /></Button>)}
                </Card>
              );
            })}
            <Button type="button" variant="outline" onClick={() => append({...defaultItem, id: crypto.randomUUID() })} className="mt-0"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>

            <Separator className="my-6"/>

            <div className="grid md:grid-cols-3 gap-6 mt-8 items-start">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any relevant notes..."
                          className="resize-none h-40"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

              <div className="md:col-span-1 space-y-2 text-left border p-4 rounded-md bg-muted/20">
                <div className="text-md">Subtotal ({currencySymbol}): <span className="font-semibold">{formatValue(subTotal)}</span></div>
                {(() => {
                  if (watchedCurrency === 'MZN' && !watchedPricesIncludeVat) {
                    return <div className="text-md">VAT (16%) ({currencySymbol}): <span className="font-semibold">{formatValue(vatAmount)}</span></div>;
                  }
                  if (watchedPricesIncludeVat) {
                    return <div className="text-sm text-muted-foreground">VAT is included in item prices.</div>;
                  }
                  return null;
                })()}
                <div className="text-xl font-bold font-headline">Grand Total ({currencySymbol}): <span className="font-semibold">{formatValue(grandTotal)}</span></div>
              </div>

              <div className="md:col-span-1 flex flex-col gap-3 w-full">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || isLoadingPOForEdit || isLoadingRequisitionItems || (!form.formState.isValid && form.formState.isSubmitted)}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditingLoadedPO ? <Edit className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />)}
                  {isSubmitting ? (isEditingLoadedPO ? 'Updating PO...' : 'Submitting PO...') : (isEditingLoadedPO ? 'Update PO' : 'Submit PO')}
                </Button>
                <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleViewPrintPO} disabled={isPrintingLoading || (!isEditingLoadedPO && !form.getValues('poNumberDisplay'))}>
                  {isPrintingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" /> }
                  {isPrintingLoading ? 'Loading Preview...' : 'View/Print PO'}
                </Button>
                 {!isEditingLoadedPO && (
                  <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => resetFormForNew()} disabled={isSubmitting || isLoadingPOForEdit || isLoadingRequisitionItems}>
                    Clear / New PO
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {isEditingLoadedPO ? `Editing PO: ${form.getValues('poNumberDisplay')}. PO Number is read-only.` : "Enter PO details. Use 'Load' for existing editable POs or create a new one."}
        </p>
      </CardFooter>
    </Card>
  );
}
    
