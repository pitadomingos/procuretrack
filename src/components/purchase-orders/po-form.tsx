
'use client';

// import { zodResolver } from '@hookform/resolvers/zod'; // Zod still commented
import { useForm, useFieldArray } from 'react-hook-form'; // useFieldArray will be effectively unused for now
// import type * as z from 'zod'; // Zod still commented
// import type { ChangeEvent } from 'react'; // Not used
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  // FormDescription, // Not used
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
import { PlusCircle, Trash2, Send } from 'lucide-react';
import type { Supplier, Site, Category as CategoryType, Approver, User } from '@/types'; // Re-import types
import { useState, useEffect, useCallback } from 'react'; // Re-import useEffect, useState

// Zod Schemas remain commented out
/*
const poItemSchema = z.object({
  partNumber: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  allocation: z.string().min(1, 'Allocation is required'),
  uom: z.string().min(1, 'UOM is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0.01, 'Unit price must be positive'),
});
*/
// export type POItemSchemaType = z.infer<typeof poItemSchema>;


/*
const poFormSchema = z.object({
  vendorName: z.string().min(1, 'Supplier name is required'),
  vendorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  // ... other fields ...
  items: z.array(poItemSchema).min(1, 'At least one item is required'),
});
*/

// type POFormValues = z.infer<typeof poFormSchema>; // Zod-inferred type commented
type POFormValues = any; // Simplified to any for now

// const defaultItem: POItemSchemaType = { partNumber: '', description: '', category: '', allocation: '', uom: '', quantity: 1, unitPrice: 0 }; // Zod-inferred defaultItem commented
const defaultItem: any = { partNumber: '', description: '', category: '', allocation: '', uom: '', quantity: 1, unitPrice: 0.00 };


export function POForm() {
  const [subTotal, setSubTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Re-enable state for fetched data
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [approvers, setApproversData] = useState<Approver[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<POFormValues>({
    // resolver: zodResolver(poFormSchema), // Still commented
    defaultValues: {
      vendorName: '',
      vendorEmail: '',
      salesPerson: '',
      supplierContactNumber: '',
      nuit: '',
      quoteNo: '',
      shippingAddress: '',
      billingAddress: '',
      poDate: new Date().toISOString().split('T')[0],
      poNumberDisplay: 'PO_FROM_FORM_001', // Static placeholder
      currency: 'MZN',
      requestedBy: '',
      approver: '',
      expectedDeliveryDate: '',
      pricesIncludeVat: false,
      items: [defaultItem], // Initialize with one default item
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // useEffect for PO Number Generation remains commented out
  /*
  useEffect(() => {
    // ...
  }, []);
  */

  // Re-enable useEffect for data fetching (sequential version)
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers');
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        const data: Supplier[] = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    const fetchSites = async () => {
      try {
        const response = await fetch('/api/sites');
        if (!response.ok) throw new Error('Failed to fetch sites');
        const data: Site[] = await response.json();
        setSites(data);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: CategoryType[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchApprovers = async () => {
      try {
        const response = await fetch('/api/approvers');
        if (!response.ok) throw new Error('Failed to fetch approvers');
        const data: Approver[] = await response.json();
        setApproversData(data);
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchSuppliers();
    fetchSites();
    fetchCategories();
    fetchApprovers();
    fetchUsers();
  }, []);


  // Watch calls remain commented out for now
  // const watchedItems = form.watch('items');
  // const watchedCurrency = form.watch('currency');
  // const watchedPricesIncludeVat = form.watch('pricesIncludeVat');

  // useEffect for Totals Calculation remains commented out
  /*
  useEffect(() => {
    let currentSubTotal = 0;
    const items = form.getValues('items') || []; // Use getValues as watch is commented
    const pricesIncludeVat = form.getValues('pricesIncludeVat'); // Use getValues

    items.forEach((item: any) => { // Assuming item is 'any' since schema is commented
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        currentSubTotal += quantity * unitPrice;
    });

    let currentVatAmount = 0;
    const currency = form.getValues('currency'); // Use getValues

    if (currency === 'MZN') {
        if (pricesIncludeVat) {
            // Price includes VAT, so extract VAT from subtotal
            // Subtotal = PriceWithVAT / 1.16
            // VAT = PriceWithVAT - (PriceWithVAT / 1.16)
            const subTotalExcludingVat = currentSubTotal / 1.16;
            currentVatAmount = currentSubTotal - subTotalExcludingVat;
            currentSubTotal = subTotalExcludingVat; // Update subTotal to be ex-VAT
        } else {
            // Price does not include VAT, so calculate VAT on subtotal
            currentVatAmount = currentSubTotal * 0.16;
        }
    }
    // For USD or other currencies, VAT is assumed to be 0 or handled differently
    // based on requirements not specified for this scenario.

    setSubTotal(currentSubTotal);
    setVatAmount(currentVatAmount);
    setGrandTotal(currentSubTotal + currentVatAmount);

  // }, [watchedItems, watchedCurrency, watchedPricesIncludeVat, form]); // Dependencies commented as watches are
  }, [form]); // Simplified dependency for now
  */


  // onSubmit remains simplified
  const onSubmit = (data: POFormValues) => {
    console.log('PO Submitted (simplified):', { ...data, subTotal, vatAmount, grandTotal });
    alert('PO Submitted! Functionality limited.');
  };


  // Restore handlers for dropdowns
  const handleSupplierChange = (selectedSupplierCode: string) => {
    const selectedSupplier = suppliers.find(s => s.supplierCode === selectedSupplierCode);
    if (selectedSupplier) {
      form.setValue('vendorName', selectedSupplier.supplierCode); // Store code or name as needed
      form.setValue('vendorEmail', selectedSupplier.emailAddress || '');
      form.setValue('salesPerson', selectedSupplier.salesPerson || '');
      form.setValue('supplierContactNumber', selectedSupplier.cellNumber || '');
      form.setValue('nuit', selectedSupplier.nuitNumber || '');
      form.setValue('billingAddress', selectedSupplier.physicalAddress || ''); // Or another specific billing field
    }
  };

  const handleRequestedByChange = (selectedUserId: string) => {
    form.setValue('requestedBy', selectedUserId);
  };

  const handleApproverChange = (selectedApproverId: string) => {
    form.setValue('approver', selectedApproverId);
  };

  const handleShippingAddressChange = (selectedSiteId: string) => {
    const selectedSite = sites.find(s => s.id.toString() === selectedSiteId);
    if (selectedSite) {
        form.setValue('shippingAddress', selectedSite.name); // Set full site name or specific address field
    }
  };

  // Item-specific handlers (will be used when items are re-enabled)
  const handleItemCategoryChange = (index: number, selectedCategoryId: string) => {
    form.setValue(`items.${index}.category`, selectedCategoryId, { shouldValidate: true });
  };

  const handleItemAllocationChange = (index: number, selectedSiteId: string) => {
    form.setValue(`items.${index}.allocation`, selectedSiteId, { shouldValidate: true });
  };

  // Using getValues as watch is commented
  const currencySymbol = form.getValues('currency') === 'MZN' ? 'MZN' : '$';


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
                <FormField control={form.control} name="vendorEmail" render={({ field }) => ( <FormItem> <FormLabel>Supplier Email</FormLabel> <FormControl><Input type="email" placeholder="e.g. lebreya@fulaho.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="salesPerson" render={({ field }) => ( <FormItem> <FormLabel>Sales Person</FormLabel> <FormControl><Input placeholder="e.g. Mr Eugenio" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="supplierContactNumber" render={({ field }) => ( <FormItem> <FormLabel>Supplier Contact</FormLabel> <FormControl><Input placeholder="e.g. 258 84 784 3306" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="nuit" render={({ field }) => ( <FormItem> <FormLabel>NUIT</FormLabel> <FormControl><Input placeholder="e.g. 401034676" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="quoteNo" render={({ field }) => ( <FormItem> <FormLabel>Quote No.</FormLabel> <FormControl><Input placeholder="e.g. EST741" {...field} /></FormControl> <FormMessage /> </FormItem> )} />

                <FormField control={form.control} name="poDate" render={({ field }) => ( <FormItem> <FormLabel>PO Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />

                <div className="space-y-1">
                  <Label htmlFor="poNumberDisplayGenerated">PO Number</Label>
                  <Input
                    id="poNumberDisplayGenerated"
                    value={form.watch('poNumberDisplay') || 'PO_STATIC_001'} // form.watch is fine here for display
                    readOnly
                    className="font-medium bg-muted/30 border-muted cursor-default"
                  />
                </div>
              </div>
            </div>

             <FormField control={form.control} name="billingAddress" render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Address (for PDF)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter supplier's address e.g. En7, Matema Loja 3, Tete" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address (Delivery)</FormLabel>
                  <Select onValueChange={(value) => { field.onChange(value); handleShippingAddressChange(value); }} value={field.value || ''}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select a shipping site" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {sites.map(site => (
                         <SelectItem key={site.id} value={site.id.toString()}>
                           {site.name} ({site.siteCode})
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div>
              <h3 className="text-lg font-medium font-headline mb-2">PO Configuration</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <FormField control={form.control} name="currency" render={({ field }) => ( <FormItem> <FormLabel>Currency</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="MZN">MZN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )} />

                 <FormField
                   control={form.control}
                   name="requestedBy"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Requested By</FormLabel>
                       <Select onValueChange={(value) => { field.onChange(value); handleRequestedByChange(value); }} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select requester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
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
                  name="approver"
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
                <FormField control={form.control} name="expectedDeliveryDate" render={({ field }) => ( <FormItem> <FormLabel>Expected Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
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

            {fields.map((itemField, index) => (
              <Card key={itemField.id} className="p-4 space-y-4 relative mb-4 shadow-md">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField control={form.control} name={`items.${index}.partNumber`} render={({ field }) => ( <FormItem> <FormLabel>Part Number</FormLabel> <FormControl><Input placeholder="Optional part no." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => ( <FormItem className="md:col-span-2 lg:col-span-3"> <FormLabel>Description</FormLabel> <FormControl><Input placeholder="Item description" {...field} /></FormControl> <FormMessage /> </FormItem> )} />

                  <FormField
                    control={form.control}
                    name={`items.${index}.category`}
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allocation (Site)</FormLabel>
                         <Select onValueChange={(value) => { field.onChange(value); handleItemAllocationChange(index, value); }} value={field.value || ''}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select allocation" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {sites.map(site => (
                              <SelectItem key={site.id} value={site.id.toString()}>
                                {site.name} ({site.siteCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name={`items.${index}.uom`} render={({ field }) => ( <FormItem> <FormLabel>UOM</FormLabel> <FormControl><Input placeholder="e.g., EA, KG, M" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => ( <FormItem> <FormLabel>Quantity</FormLabel> <FormControl><Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => ( <FormItem> <FormLabel>Unit Price ({currencySymbol})</FormLabel> <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0.00)} /></FormControl> <FormMessage /> </FormItem> )} />
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
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append(defaultItem)}
              className="mt-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <div className="space-y-1">
                  <Label>Creator Name</Label>
                  <div className="h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground flex items-center">
                     System User (Placeholder)
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-right border p-4 rounded-md bg-muted/20">
                <div className="text-md">
                  Subtotal ({currencySymbol}): <span className="font-semibold">{subTotal.toFixed(2)}</span>
                </div>
                {form.getValues('currency') === 'MZN' && (
                  <div className="text-md">
                    VAT (16%) ({currencySymbol}): <span className="font-semibold">{vatAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="text-xl font-bold font-headline">
                  Grand Total ({currencySymbol}): <span className="font-semibold">{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto" size="lg">
              <Send className="mr-2 h-4 w-4" /> Submit PO
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Upon submission, an email will be sent to the approver. Once approved, a PDF copy will be sent to the creator and approver. (Functionality limited)
        </p>
      </CardFooter>
    </Card>
  );
}

