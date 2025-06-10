
'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form'; // useFieldArray will be effectively unused
// import type * as z from 'zod';
// import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  // FormDescription,
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
// import type { Supplier, Site, Category as CategoryType, Approver, User } from '@/types';
import { useState, useEffect, useCallback } from 'react'; // useEffect & useCallback will be unused


/* // Zod Schemas remain commented out
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


/* // Zod Schemas remain commented out
const poFormSchema = z.object({
  vendorName: z.string().min(1, 'Supplier name is required'),
  vendorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  // ... other fields ...
  items: z.array(poItemSchema).min(1, 'At least one item is required'),
});
*/

type POFormValues = any; // Simplified to any


// const defaultItem: any = { partNumber: '', description: '', category: '', allocation: '', uom: '', quantity: 1, unitPrice: 0 };


export function POForm() {
  const [subTotal, setSubTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Data states are commented out as fetching is disabled
  // const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  // const [sites, setSites] = useState<Site[]>([]);
  // const [categories, setCategories] = useState<CategoryType[]>([]);
  // const [approversData, setApproversData] = useState<Approver[]>([]);
  // const [users, setUsers] = useState<User[]>([]);

  const form = useForm<POFormValues>({
    // resolver: zodResolver(poFormSchema),
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
      poNumberDisplay: 'PO_INIT_001', // Static placeholder
      currency: 'MZN',
      requestedBy: '',
      approver: '',
      expectedDeliveryDate: '',
      pricesIncludeVat: false,
      items: [], // Items array is empty, useFieldArray commented
    },
  });

  // useFieldArray is commented out
  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: 'items',
  // });


  // All useEffect hooks are commented out
  /*
  useEffect(() => { // PO Number Generation
    // ...
  }, [form]);
  */

  /*
  useEffect(() => { // Data Fetching
    // const fetchAllData = async () => { // ... };
    // fetchAllData();
  }, []);
  */

  // Watch calls are commented out
  // const watchedItems = form.watch('items');
  // const watchedCurrency = form.watch('currency');
  // const watchedPricesIncludeVat = form.watch('pricesIncludeVat');

  /*
  useEffect(() => { // Totals Calculation
    // ...
  }, [form]); // Simplified dependency
  */

  const onSubmit = (data: POFormValues) => {
    console.log('PO Submitted (simplified):', { ...data, subTotal, vatAmount, grandTotal });
    alert('PO Submitted! Functionality limited for diagnostics.');
  };

  // Handler functions are simplified or commented out
  // const handleSupplierChange = (selectedSupplierCode: string) => {
  //   form.setValue('vendorName', selectedSupplierCode); // Minimal
  // };

  // const handleRequestedByChange = (selectedUserId: string) => {
  //   form.setValue('requestedBy', selectedUserId); // Minimal
  // };

  // const handleApproverChange = (selectedApproverId: string) => {
  //   form.setValue('approver', selectedApproverId); // Minimal
  // };

  // const handleShippingAddressChange = (selectedSiteId: string) => {
  //   form.setValue('shippingAddress', selectedSiteId); // Minimal
  // };

  // const handleItemCategoryChange = (index: number, selectedCategoryId: string) => {
  //   // form.setValue(`items.${index}.category`, selectedCategoryId); // Minimal
  // };

  // const handleItemAllocationChange = (index: number, selectedSiteId: string) => {
  //   // form.setValue(`items.${index}.allocation`, selectedSiteId); // Minimal
  // };

  const currencySymbol = form.getValues('currency') === 'MZN' ? 'MZN' : '$';


  // ========= THE ERROR OCCURS BEFORE THIS LINE ACCORDING TO NEXT.JS =========

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
                      <Select onValueChange={field.onChange /* simplified */} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supplier (disabled)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Suppliers array is empty */}
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
                    value={form.watch('poNumberDisplay') || 'PO_STATIC_001'}
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
                  <Select onValueChange={field.onChange /* simplified */} value={field.value || ''}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select a shipping site (disabled)" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {/* Sites array is empty */}
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
                       <Select onValueChange={field.onChange /* simplified */} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select requester (disabled)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* Users array is empty */}
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
                      <Select onValueChange={field.onChange /* simplified */} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an approver (disabled)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* ApproversData array is empty */}
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

            {/* fields.map block is commented out as useFieldArray is disabled */}
            {/*
            {fields.map((field, index) => (
              // ... item rendering logic ...
            ))}
            */}

            <Button
              type="button"
              variant="outline"
              onClick={() => console.log("Add Item clicked (append disabled)")}
              className="mt-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item (Disabled)
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
          Upon submission, an email will be sent to the approver. Once approved, a PDF copy will be sent to the creator and approver. (Simulated for MVP)
        </p>
      </CardFooter>
    </Card>
  );
}
    