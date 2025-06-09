
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Send } from 'lucide-react';
import type { POItem } from '@/types';
import { useState, useEffect } from 'react';

const poItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
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
  poNumberDisplay: z.string().optional(),

  expectedDeliveryDate: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(poItemSchema).min(1, 'At least one item is required'),
  approver: z.string().min(1, 'Approver is required'),
  currency: z.enum(['MZN', 'USD'], { required_error: "Currency is required" }),
  pricesIncludeVat: z.boolean().default(false),
});

type POFormValues = z.infer<typeof poFormSchema>;

const defaultItem: Omit<POItem, 'id' | 'total'> = { description: '', quantity: 1, unitPrice: 0 };

const mockApprovers = [
  { id: 'approver1', name: 'Alice Wonderland' },
  { id: 'approver2', name: 'Bob The Builder' },
  { id: 'approver3', name: 'Charlie Brown' },
];


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
      expectedDeliveryDate: '',
      paymentTerms: 'Net 30',
      notes: '',
      items: [defaultItem],
      approver: '',
      currency: 'MZN',
      pricesIncludeVat: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

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

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create New Purchase Order</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <h3 className="text-lg font-medium font-headline">Supplier & PO Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="vendorName" render={({ field }) => ( <FormItem> <FormLabel>Supplier Name</FormLabel> <FormControl><Input placeholder="e.g. Lebreya Limitada" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="vendorEmail" render={({ field }) => ( <FormItem> <FormLabel>Supplier Email</FormLabel> <FormControl><Input type="email" placeholder="e.g. lebreya@fulaho.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="salesPerson" render={({ field }) => ( <FormItem> <FormLabel>Sales Person</FormLabel> <FormControl><Input placeholder="e.g. Mr Eugenio" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="supplierContactNumber" render={({ field }) => ( <FormItem> <FormLabel>Supplier Contact</FormLabel> <FormControl><Input placeholder="e.g. 258 84 784 3306" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="nuit" render={({ field }) => ( <FormItem> <FormLabel>NUIT</FormLabel> <FormControl><Input placeholder="e.g. 401034676" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="quoteNo" render={({ field }) => ( <FormItem> <FormLabel>Quote No.</FormLabel> <FormControl><Input placeholder="e.g. EST741" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="poNumberDisplay" render={({ field }) => ( <FormItem> <FormLabel>PO Number Suffix</FormLabel> <FormControl><Input placeholder="e.g. 3566 (suffix for POXXXX)" {...field} /></FormControl><FormDescription>This will be part of PO number in the PDF.</FormDescription> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="poDate" render={({ field }) => ( <FormItem> <FormLabel>PO Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            </div>
            
            <FormField control={form.control} name="billingAddress" render={({ field }) => ( <FormItem> <FormLabel>Supplier Address (for PDF)</FormLabel> <FormControl><Textarea placeholder="Enter supplier's address e.g. En7, Matema Loja 3, Tete" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="shippingAddress" render={({ field }) => ( <FormItem> <FormLabel>Shipping Address (Delivery)</FormLabel> <FormControl><Textarea placeholder="Enter shipping address for delivery" {...field} /></FormControl> <FormMessage /> </FormItem> )} />

            <h3 className="text-lg font-medium font-headline">PO Configuration</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="currency" render={({ field }) => ( <FormItem> <FormLabel>Currency</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="MZN">MZN</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="approver" render={({ field }) => ( <FormItem> <FormLabel>Approver</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select an approver" /></SelectTrigger></FormControl> <SelectContent>{mockApprovers.map(approver => (<SelectItem key={approver.id} value={approver.id}>{approver.name}</SelectItem>))}</SelectContent> </Select> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="expectedDeliveryDate" render={({ field }) => ( <FormItem> <FormLabel>Expected Delivery Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField
                control={form.control}
                name="pricesIncludeVat"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
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
              <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                 <FormLabel>Item #{index +1}</FormLabel>
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Item description" {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field: itemField }) => (
                      <FormItem>
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
                      <FormItem>
                        <FormLabel>Unit Price ({currencySymbol})</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <div className="text-right font-medium sm:col-span-1 sm:pt-8"> {/* Adjusted for alignment */}
                     Item Total: {currencySymbol}
                     {( (Number(form.watch(`items.${index}.quantity`)) || 0) * (Number(form.watch(`items.${index}.unitPrice`)) || 0) ).toFixed(2)}
                   </div>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append(defaultItem)}
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

    