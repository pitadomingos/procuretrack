
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Send, Printer, Loader2 } from 'lucide-react';
import type { Supplier, Site, Category as CategoryType, Approver, POItem as POItemType, PurchaseOrderPayload, POItemPayload } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Import useRouter

// Using 'any' for form values temporarily to simplify until Zod is fully integrated.
type POFormValues = any;

const defaultItem: POItemType = { id: crypto.randomUUID(), partNumber: '', description: '', category: '', allocation: '', uom: '', quantity: 1, unitPrice: 0.00 };


export function POForm() {
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter
  const [subTotal, setSubTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [lastSubmittedPoNumber, setLastSubmittedPoNumber] = useState<string | null>(null);
  const [isPrintingLoading, setIsPrintingLoading] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [approvers, setApproversData] = useState<Approver[]>([]);

  const form = useForm<POFormValues>({
    defaultValues: {
      vendorName: '', 
      vendorEmail: '',
      salesPerson: '',
      supplierContactNumber: '',
      nuit: '',
      quoteNo: '',
      billingAddress: '',
      poDate: new Date().toISOString().split('T')[0],
      poNumberDisplay: 'Loading PO...',
      currency: 'MZN',
      requestedBy: '', 
      approver: '', 
      pricesIncludeVat: false,
      notes: '',
      items: [defaultItem],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const fetchNextPONumber = useCallback(async () => {
    try {
      const response = await fetch('/api/purchase-orders/next-po-number');
      if (!response.ok) {
        throw new Error(`Failed to fetch next PO number: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.nextPoNumber) {
        form.setValue('poNumberDisplay', data.nextPoNumber);
      } else {
        form.setValue('poNumberDisplay', 'PO-ERROR');
      }
    } catch (error) {
      console.error("Error fetching next PO number:", error);
      form.setValue('poNumberDisplay', 'PO-ERROR');
      toast({
        title: "Error",
        description: "Could not load next PO number.",
        variant: "destructive",
      });
    }
  }, [form, toast]);

  useEffect(() => {
    fetchNextPONumber();
  }, [fetchNextPONumber]);


  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [suppliersRes, sitesRes, categoriesRes, approversRes] = await Promise.all([
          fetch('/api/suppliers'),
          fetch('/api/sites'),
          fetch('/api/categories'),
          fetch('/api/approvers'),
        ]);

        if (!suppliersRes.ok) throw new Error('Failed to fetch suppliers');
        setSuppliers(await suppliersRes.json());

        if (!sitesRes.ok) throw new Error('Failed to fetch sites');
        setSites(await sitesRes.json());

        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        setCategories(await categoriesRes.json());

        if (!approversRes.ok) throw new Error('Failed to fetch approvers');
        setApproversData(await approversRes.json());

      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast({
          title: "Error",
          description: "Failed to load data for dropdowns. Please try refreshing.",
          variant: "destructive",
        });
      }
    };
    fetchDropdownData();
  }, [toast]);


  const watchedItems = form.watch('items');
  const watchedCurrency = form.watch('currency');
  const watchedPricesIncludeVat = form.watch('pricesIncludeVat');

  useEffect(() => {
    const items = watchedItems || [];
    const pricesIncludeVat = watchedPricesIncludeVat;
    const currency = watchedCurrency;

    let calculatedInputSum = 0;
    items.forEach((item: any) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        calculatedInputSum += quantity * unitPrice;
    });

    let newDisplaySubTotal = calculatedInputSum;
    let newDisplayVatAmount = 0;

    if (currency === 'MZN') {
      if (pricesIncludeVat) {
          newDisplaySubTotal = calculatedInputSum; 
          newDisplayVatAmount = 0; 
      } else {
          newDisplaySubTotal = calculatedInputSum; 
          newDisplayVatAmount = newDisplaySubTotal * 0.16; 
      }
    } else {
        newDisplaySubTotal = calculatedInputSum;
        newDisplayVatAmount = 0;
    }
    
    setSubTotal(parseFloat(newDisplaySubTotal.toFixed(2)));
    setVatAmount(parseFloat(newDisplayVatAmount.toFixed(2)));
    setGrandTotal(parseFloat((newDisplaySubTotal + newDisplayVatAmount).toFixed(2)));

  }, [watchedItems, watchedCurrency, watchedPricesIncludeVat]);


  const onSubmit = async (formData: POFormValues) => {
    if (!formData.items || formData.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one item to the purchase order.",
        variant: "destructive",
      });
      return;
    }

    const poNumber = form.getValues('poNumberDisplay'); // Use the current value from the (now editable) field
    const poDate = form.getValues('poDate');

    const purchaseOrderPayload: PurchaseOrderPayload = {
      poNumber: poNumber,
      creationDate: new Date(poDate).toISOString(),
      creatorUserId: null, 
      requestedByName: formData.requestedBy, 
      supplierId: formData.vendorName, 
      approverId: formData.approver, 
      status: 'Pending Approval',
      subTotal: subTotal,
      vatAmount: vatAmount,
      grandTotal: grandTotal,
      currency: formData.currency,
      pricesIncludeVat: formData.pricesIncludeVat,
      notes: formData.notes,
      items: formData.items.map((item: POItemType): POItemPayload => ({
        partNumber: item.partNumber,
        description: item.description,
        categoryId: item.category ? Number(item.category) : null, 
        siteId: item.allocation ? Number(item.allocation) : null,
        uom: item.uom,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };

    try {
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseOrderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to submit PO. Server returned an unreadable error.' }));
        console.error('Server error details:', errorData.details);
        throw new Error(errorData.error || `Server error: ${response.status} - ${errorData.details || response.statusText}`);
      }

      const result = await response.json();
      toast({
        title: 'Success!',
        description: `Purchase Order ${result.poNumber} (ID: ${result.poId}) created successfully.`,
      });
      setLastSubmittedPoNumber(result.poNumber); // Store the PO number for potential immediate print
      form.reset(); 
      await fetchNextPONumber(); 

    } catch (error: any) {
      console.error('Error submitting PO:', error);
      setLastSubmittedPoNumber(null); 
      toast({
        title: 'Error Submitting PO',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleViewPrintPO = async () => {
    const currentPoNumber = form.getValues('poNumberDisplay');
    if (!currentPoNumber || currentPoNumber === 'Loading PO...' || currentPoNumber === 'PO-ERROR') {
      toast({
        title: 'PO Number Required',
        description: 'Please enter or load a valid PO Number to view/print.',
        variant: 'destructive',
      });
      return;
    }

    setIsPrintingLoading(true);
    try {
      const response = await fetch(`/api/purchase-orders/get-by-po-number/${encodeURIComponent(currentPoNumber)}`);
      if (response.ok) {
        const poDetails = await response.json();
        if (poDetails && poDetails.id) {
          window.open(`/purchase-orders/${poDetails.id}/print`, '_blank');
        } else {
          toast({
            title: 'PO Not Found',
            description: `Purchase Order ${currentPoNumber} could not be found.`,
            variant: 'destructive',
          });
        }
      } else if (response.status === 404) {
        toast({
          title: 'PO Not Found',
          description: `Purchase Order ${currentPoNumber} not found. It might not be submitted yet or the number is incorrect.`,
          variant: 'destructive',
        });
      } else {
        throw new Error(`Failed to fetch PO details: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error preparing PO for print:', error);
      toast({
        title: 'Error',
        description: `Could not prepare PO for printing: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsPrintingLoading(false);
    }
  };


  const handleSupplierChange = (selectedSupplierCode: string) => {
    const selectedSupplier = suppliers.find(s => s.supplierCode === selectedSupplierCode);
    if (selectedSupplier) {
      form.setValue('vendorName', selectedSupplier.supplierCode);
      form.setValue('vendorEmail', selectedSupplier.emailAddress || '');
      form.setValue('salesPerson', selectedSupplier.salesPerson || '');
      form.setValue('supplierContactNumber', selectedSupplier.cellNumber || '');
      form.setValue('nuit', selectedSupplier.nuitNumber || '');
      form.setValue('billingAddress', selectedSupplier.physicalAddress || '');
      form.clearErrors('vendorName'); 
    }
  };

  const handleApproverChange = (selectedApproverId: string) => {
    form.setValue('approver', selectedApproverId);
    form.clearErrors('approver'); 
  };

  const handleItemCategoryChange = (index: number, selectedCategoryId: string) => {
    form.setValue(`items.${index}.category`, selectedCategoryId, { shouldValidate: true });
    form.clearErrors(`items.${index}.category`);
  };

  const handleItemAllocationChange = (index: number, selectedSiteId: string) => {
    form.setValue(`items.${index}.allocation`, selectedSiteId, { shouldValidate: true });
    form.clearErrors(`items.${index}.allocation`);
  };
  
  const currencySymbol = watchedCurrency === 'MZN' ? 'MZN' : '$'; 


  return (
    <Card className="w-full max-w-6xl mx-auto shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create New Purchase Order</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div>
              <h3 className="text-lg font-medium font-headline mb-2">Supplier & PO Information</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="vendorName"
                  rules={{ required: 'Supplier is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); handleSupplierChange(value); }} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier.supplierCode} value={supplier.supplierCode}>
                              {supplier.supplierName} ({supplier.supplierCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
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

                <FormField 
                  control={form.control} 
                  name="poDate" 
                  rules={{ required: 'PO Date is required' }}
                  render={({ field }) => ( 
                    <FormItem> 
                      <FormLabel>PO Date</FormLabel> 
                      <FormControl><Input type="date" {...field} /></FormControl> 
                      <FormMessage /> 
                    </FormItem> 
                  )} 
                />
                
                <FormField
                  control={form.control}
                  name="poNumberDisplay"
                  rules={{ required: 'PO Number is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PO Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter PO Number or auto-generates"
                          {...field}
                          // Removed readOnly, it's now editable
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

             <FormField control={form.control} name="billingAddress" render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Address (for PDF)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter supplier's billing address..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div>
              <h3 className="text-lg font-medium font-headline mb-2">PO Configuration</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <FormField control={form.control} name="currency" render={({ field }) => ( <FormItem> <FormLabel>Currency</FormLabel> <Select onValueChange={field.onChange} value={field.value || 'MZN'}> <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="MZN">MZN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )} />
                
                <FormField
                  control={form.control}
                  name="requestedBy"
                  rules={{ required: 'Requested By is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested By</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter requester's name (e.g. Driver, Technician)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="approver" 
                  rules={{ required: 'Approver is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approver</FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); handleApproverChange(value); }} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an approver" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {approvers.map(appr => (
                            <SelectItem key={appr.id} value={appr.id}> 
                              {appr.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
              <FormField
                control={form.control}
                name="pricesIncludeVat"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Prices are VAT inclusive</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
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
                    <FormField control={form.control} name={`items.${index}.partNumber`} render={({ field }) => ( <FormItem> <FormLabel>Part Number</FormLabel> <FormControl><Input placeholder="Optional part no." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField 
                      control={form.control} 
                      name={`items.${index}.description`} 
                      rules={{ required: 'Description is required' }}
                      render={({ field }) => ( 
                        <FormItem className="lg:col-span-2"> 
                          <FormLabel>Description</FormLabel> 
                          <FormControl><Input placeholder="Item description" {...field} /></FormControl> 
                          <FormMessage /> 
                        </FormItem> 
                      )} 
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.category`}
                      rules={{ required: 'Category is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={(value) => { field.onChange(value); handleItemCategoryChange(index, value); }} value={field.value || ''}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.allocation`} 
                      rules={{ required: 'Allocation (Site) is required for each item' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allocation (Site)</FormLabel>
                           <Select onValueChange={(value) => { field.onChange(value); handleItemAllocationChange(index, value); }} value={field.value || ''}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select allocation site" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {sites.map(site => (
                                <SelectItem key={site.id} value={site.id.toString()}>
                                  {site.siteCode || site.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField 
                      control={form.control} 
                      name={`items.${index}.uom`} 
                      rules={{ required: 'UOM is required' }}
                      render={({ field }) => ( 
                        <FormItem> 
                          <FormLabel>UOM</FormLabel> 
                          <FormControl><Input placeholder="e.g., EA, KG, M" {...field} /></FormControl> 
                          <FormMessage /> 
                        </FormItem> 
                      )} 
                    />
                    <FormField 
                      control={form.control} 
                      name={`items.${index}.quantity`} 
                      rules={{ 
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Quantity must be at least 1' } 
                      }}
                      render={({ field }) => ( 
                        <FormItem> 
                          <FormLabel>Quantity</FormLabel> 
                          <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl> 
                          <FormMessage /> 
                        </FormItem> 
                      )} 
                    />
                    <FormField 
                      control={form.control} 
                      name={`items.${index}.unitPrice`} 
                      rules={{ 
                        required: 'Unit Price is required',
                        min: { value: 0.01, message: 'Unit price must be positive' }
                      }}
                      render={({ field }) => ( 
                        <FormItem> 
                          <FormLabel>Unit Price ({currencySymbol})</FormLabel> 
                          <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0.00)} /></FormControl> 
                          <FormMessage /> 
                        </FormItem> 
                      )} 
                    />

                    <div className="flex items-end">
                      <FormItem className="w-full">
                        <FormLabel>Item Total ({currencySymbol})</FormLabel>
                        <div className="h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground flex items-center">
                          {itemTotal}
                        </div>
                      </FormItem>
                    </div>
                  </div>
                  {fields.length > 1 && (
                      <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          className="absolute top-2 right-2"
                          title="Remove Item"
                          >
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  )}
                </Card>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                append({...defaultItem, id: crypto.randomUUID() }); 
                form.trigger(); 
              }}
              className="mt-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>

            <Separator />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any relevant notes for this purchase order..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                 <div className="space-y-1">
                  <Label>Requester</Label>
                  <div className="h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground flex items-center">
                     {form.watch('requestedBy') || 'Enter requester name above'}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Creator (System User)</Label>
                  <div className="h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground flex items-center">
                     System User (To be implemented with Firebase Auth)
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-right border p-4 rounded-md bg-muted/20">
                <div className="text-md">
                  Subtotal ({currencySymbol}): <span className="font-semibold">{subTotal.toFixed(2)}</span>
                </div>
                {watchedCurrency === 'MZN' && (
                  <div className="text-md">
                    VAT (16%) ({currencySymbol}): <span className="font-semibold">{vatAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="text-xl font-bold font-headline">
                  Grand Total ({currencySymbol}): <span className="font-semibold">{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button 
                type="submit" 
                className="w-full sm:w-auto" 
                size="lg" 
                disabled={form.formState.isSubmitting || (!form.formState.isValid && form.formState.isSubmitted)}
              >
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit PO'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={handleViewPrintPO}
                disabled={isPrintingLoading}
              >
                {isPrintingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" /> }
                {isPrintingLoading ? 'Loading...' : 'View/Print PO'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          PO Number can be edited. If viewing an existing PO, ensure the number is correct before clicking 'View/Print PO'.
        </p>
      </CardFooter>
    </Card>
  );
}
