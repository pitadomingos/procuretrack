
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Added import
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Send } from 'lucide-react';
import type { POItem, Supplier } from '@/types';
import { useState, useEffect } from 'react';
import { mockSuppliers, mockApprovers } from '@/lib/mock-data';

const poItemSchema = z.object({
  partNumber: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  allocation: z.string().min(1, 'Allocation is required'),
  uom: z.string().min(1, 'UOM is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0.01, 'Unit price must be positive'),
});

const poFormSchema = z.object({
  vendorName: z.string().min(1, 'Supplier name is required'),
  vendorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  salesPerson: z.string().optional(),
  supplierContactNumber: z.string().optional(),
  nuit: z.string().optional(),
  quoteNo: z.string().optional(),
  
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  billingAddress: z.string().min(1, 'Supplier address is required (for PO PDF header)'), 
  
  poDate: z.string().min(1, "PO Date is required (for PO PDF header)"),
  poNumberDisplay: z.string().optional(), // This will store the auto-generated PO number

  currency: z.enum(['MZN', 'USD'], { required_error: "Currency is required" }),
  requestedBy: z.string().min(1, 'Requested By is required'),
  approver: z.string().min(1, 'Approver is required'),
  expectedDeliveryDate: z.string().optional(),
  pricesIncludeVat: z.boolean().default(false),

  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(poItemSchema).min(1, 'At least one item is required'),
});

type POFormValues = z.infer<typeof poFormSchema>;

const defaultItem: Omit<z.infer<typeof poItemSchema>, 'id' | 'total'> = { 
  partNumber: '', 
  description: '', 
  category: '', 
  allocation: '', 
  uom: '', 
  quantity: 1, 
  unitPrice: 0 
};

export function POForm() {
  const [subTotal, setSubTotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const form = useForm<POFormValues>({
    resolver: zodResolver(poFormSchema),
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
      poNumberDisplay: '', 
      
      currency: 'MZN',
      requestedBy: '',
      approver: '',
      expectedDeliveryDate: '',
      pricesIncludeVat: false,

      paymentTerms: 'Net 30',
      notes: '',
      items: [defaultItem],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  useEffect(() => {
    const currentPoNumber = form.getValues('poNumberDisplay');
    if (!currentPoNumber) {
      const year = new Date().getFullYear().toString().slice(-2);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString(); 
      const newPoNumber = `PO${year}${randomSuffix}`;
      form.setValue('poNumberDisplay', newPoNumber, { shouldValidate: false });
    }
  }, [form]);

  const watchedItems = form.watch('items');
  const watchedCurrency = form.watch('currency');
  const watchedPricesIncludeVat = form.watch('pricesIncludeVat');

  useEffect(() => {
    const items = watchedItems || [];
    const currentCurrency = watchedCurrency;
    const pricesAreVatInclusive = watchedPricesIncludeVat;

    let calculatedSubTotalExVat = 0;
    let calculatedVatAmount = 0;
    let calculatedGrandTotal = 0;

    const rawItemSum = items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);

    if (currentCurrency === 'MZN') {
      if (pricesAreVatInclusive) {
        calculatedSubTotalExVat = rawItemSum / 1.16;
        calculatedVatAmount = rawItemSum - calculatedSubTotalExVat;
        calculatedGrandTotal = rawItemSum;
      } else {
        calculatedSubTotalExVat = rawItemSum;
        calculatedVatAmount = calculatedSubTotalExVat * 0.16;
        calculatedGrandTotal = calculatedSubTotalExVat + calculatedVatAmount;
      }
    } else { 
      calculatedSubTotalExVat = rawItemSum;
      calculatedVatAmount = 0;
      calculatedGrandTotal = rawItemSum;
    }

    setSubTotal(calculatedSubTotalExVat);
    setVatAmount(calculatedVatAmount);
    setGrandTotal(calculatedGrandTotal);

  }, [watchedItems, watchedCurrency, watchedPricesIncludeVat]);

  const currencySymbol = watchedCurrency === 'MZN' ? 'MZN' : '$';

  function onSubmit(data: POFormValues) {
    console.log('PO Submitted:', { ...data, subTotal, vatAmount, grandTotal });
    alert('PO Submitted! Check console for data. PDF generation/emailing not implemented in MVP.');
  }

  const handleSupplierChange = (selectedSupplierName: string) => {
    form.setValue('vendorName', selectedSupplierName, { shouldValidate: true });
    const supplier = mockSuppliers.find(s => s.name === selectedSupplierName);
    if (supplier) {
      form.setValue('vendorEmail', supplier.email, { shouldValidate: true });
      form.setValue('salesPerson', supplier.salesPerson, { shouldValidate: true });
      form.setValue('supplierContactNumber', supplier.contactNumber, { shouldValidate: true });
      form.setValue('nuit', supplier.nuit, { shouldValidate: true });
      form.setValue('billingAddress', supplier.address, { shouldValidate: true });
    } else {
      form.setValue('vendorEmail', '', { shouldValidate: true });
      form.setValue('salesPerson', '', { shouldValidate: true });
      form.setValue('supplierContactNumber', '', { shouldValidate: true });
      form.setValue('nuit', '', { shouldValidate: true });
      form.setValue('billingAddress', '', { shouldValidate: true });
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-xl">
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
                      <Select onValueChange={handleSupplierChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockSuppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.name}>
                              {supplier.name}
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
                    value={form.watch('poNumberDisplay') || 'Generating...'}
                    readOnly
                    className="font-medium bg-muted/30 border-muted cursor-default" 
                  />
                  <p className="text-sm text-muted-foreground">Auto-generated PO number.</p> 
                </div>

              </div>
            </div>
            
            <FormField control={form.control} name="billingAddress" render={({ field }) => ( <FormItem> <FormLabel>Supplier Address (for PDF)</FormLabel> <FormControl><Textarea placeholder="Enter supplier's address e.g. En7, Matema Loja 3, Tete" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="shippingAddress" render={({ field }) => ( <FormItem> <FormLabel>Shipping Address (Delivery)</FormLabel> <FormControl><Textarea placeholder="Enter shipping address for delivery" {...field} /></FormControl> <FormMessage /> </FormItem> )} />

            <div>
              <h3 className="text-lg font-medium font-headline mb-2">PO Configuration</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <FormField control={form.control} name="currency" render={({ field }) => ( <FormItem> <FormLabel>Currency</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="MZN">MZN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="requestedBy" render={({ field }) => ( <FormItem> <FormLabel>Requested By</FormLabel> <FormControl><Input placeholder="Enter requester name" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="approver" render={({ field }) => ( <FormItem> <FormLabel>Approver</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value || ''}> <FormControl><SelectTrigger><SelectValue placeholder="Select an approver" /></SelectTrigger></FormControl> <SelectContent>{mockApprovers.map(approver => (<SelectItem key={approver.id} value={approver.id}>{approver.name}</SelectItem>))}</SelectContent> </Select> <FormMessage /> </FormItem> )} />
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
                      <FormDescription>
                        Check this if item prices already include 16% VAT (for MZN currency).
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            <h3 className="text-lg font-medium font-headline">Items</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 p-4 border rounded-md relative">
                <div className="flex justify-between items-center mb-2">
                  <FormLabel className="text-md font-semibold">Item #{index + 1}</FormLabel>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-x-3 gap-y-4 items-end">
                  <FormField
                    control={form.control}
                    name={`items.${index}.partNumber`}
                    render={({ field: itemField }) => (
                      <FormItem className="xl:col-span-1 md:col-span-1 sm:col-span-1">
                        <FormLabel>Part Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Part #" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field: itemField }) => (
                      <FormItem className="xl:col-span-2 md:col-span-3 sm:col-span-2 col-span-1">
                        <FormLabel>Item Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Full description" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.category`}
                    render={({ field: itemField }) => (
                      <FormItem className="xl:col-span-1 md:col-span-1 sm:col-span-1">
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Stationery" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.allocation`}
                    render={({ field: itemField }) => (
                      <FormItem className="xl:col-span-1 md:col-span-1 sm:col-span-1">
                        <FormLabel>Allocation</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Admin" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.uom`}
                    render={({ field: itemField }) => (
                      <FormItem className="xl:col-span-1 md:col-span-1 sm:col-span-1">
                        <FormLabel>UOM</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Each" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field: itemField }) => (
                      <FormItem className="xl:col-span-1 md:col-span-1 sm:col-span-1">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field: itemField }) => (
                      <FormItem className="xl:col-span-1 md:col-span-1 sm:col-span-1">
                        <FormLabel>Unit Cost ({currencySymbol})</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <div className="text-right font-medium xl:col-span-1 md:col-span-1 sm:col-span-1 self-end pb-2">
                     <FormLabel className="hidden sm:invisible sm:block">Total</FormLabel>
                     <p>
                     {currencySymbol}
                     {( (Number(form.watch(`items.${index}.quantity`)) || 0) * (Number(form.watch(`items.${index}.unitPrice`)) || 0) ).toFixed(2)}
                     </p>
                   </div>
                </div>
              </div>
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
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Net 30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional notes for this PO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
