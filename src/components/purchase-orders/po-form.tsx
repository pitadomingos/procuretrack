
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
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Send } from 'lucide-react';
import type { POItem } from '@/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';

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
  billingAddress: z.string().min(1, 'Supplier address is required'), // Used for SUPPLIER ADDRESS in header
  
  poDate: z.string().min(1, "PO Date is required"),
  poNumberDisplay: z.string().optional(), // For PO number in header, e.g., "3566"

  expectedDeliveryDate: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(poItemSchema).min(1, 'At least one item is required'),
  approver: z.string().min(1, 'Approver is required'),
});

type POFormValues = z.infer<typeof poFormSchema>;

const defaultItem: Omit<POItem, 'id' | 'total'> = { description: '', quantity: 1, unitPrice: 0 };

const mockApprovers = [
  { id: 'approver1', name: 'Alice Wonderland' },
  { id: 'approver2', name: 'Bob The Builder' },
  { id: 'approver3', name: 'Charlie Brown' },
];


export function POForm() {
  const [totalAmount, setTotalAmount] = useState(0);

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
      poNumberDisplay: '3566', // Default from image
      expectedDeliveryDate: '',
      paymentTerms: 'Net 30',
      notes: '',
      items: [defaultItem],
      approver: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchedItems = form.watch('items');

  useEffect(() => {
    const currentTotal = watchedItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);
    setTotalAmount(currentTotal);
  }, [watchedItems]);


  function onSubmit(data: POFormValues) {
    console.log('PO Submitted:', data);
    alert('PO Submitted! Check console for data. Email/PDF functionality not implemented in MVP.');
    // form.reset(); // Comment out reset for easier testing of header display
  }

  const watchedPoDate = form.watch('poDate');
  const watchedPoNumberDisplay = form.watch('poNumberDisplay');
  const watchedVendorName = form.watch('vendorName');
  const watchedNuit = form.watch('nuit');
  const watchedBillingAddress = form.watch('billingAddress');
  const watchedSalesPerson = form.watch('salesPerson');
  const watchedQuoteNo = form.watch('quoteNo');
  const watchedSupplierContactNumber = form.watch('supplierContactNumber');
  const watchedVendorEmail = form.watch('vendorEmail');
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'DD/MM/YYYY';
    try {
      const date = new Date(dateString + 'T00:00:00'); // Ensure local timezone interpretation for date-only string
      if (isNaN(date.getTime())) return 'DD/MM/YYYY';
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    } catch (e) {
      return 'DD/MM/YYYY';
    }
  };


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardContent className="pt-6">
        {/* New PO Header Section */}
        <div className="mb-6 text-foreground">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-red-600">JACHRIS MOZAMBIQUE (LTD)</h3>
              <p className="text-xs">M: +258 85 545 8462 | +27 (0)11 813 4009</p>
              <p className="text-xs">Quinta do Bom Sol, Bairro Chithatha, Moatize, Mozambique</p>
              <p className="text-xs text-red-600 font-medium">www.jachris.com</p>
            </div>
            <div>
              <Image src="https://placehold.co/150x60.png" alt="JACHRIS Logo" data-ai-hint="company logo" width={150} height={60} className="h-12 w-auto"/>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-bold">Purchase Order</h2>
              <p className="text-md font-semibold text-red-600">PO{watchedPoNumberDisplay || 'XXXX'}</p>
            </div>
            <div>
              <p className="text-sm"><span className="font-semibold">Date :</span> {formatDate(watchedPoDate)}</p>
            </div>
          </div>

          <hr className="border-black border-t my-3" />

          <div>
            <p className="font-semibold text-sm mb-1">TO:</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <div><span className="font-semibold">SUPPLIER NAME</span>: {watchedVendorName}</div>
              <div><span className="font-semibold">NUIT</span>: {watchedNuit}</div>
              <div className="col-span-2"><span className="font-semibold">SUPPLIER ADDRESS</span>: {watchedBillingAddress}</div>
              <div><span className="font-semibold">SALES PERSON</span>: {watchedSalesPerson}</div>
              <div><span className="font-semibold">QUOTE No.</span>: {watchedQuoteNo}</div>
              <div><span className="font-semibold">CONTACT NUMBER</span>: {watchedSupplierContactNumber}</div>
              <div className="col-span-2"><span className="font-semibold">EMAIL ADDRESS</span>: {watchedVendorEmail}</div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <h3 className="text-lg font-medium font-headline">Vendor & PO Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="vendorName" render={({ field }) => ( <FormItem> <FormLabel>Supplier Name (for PO Header)</FormLabel> <FormControl><Input placeholder="e.g. Lebreya Limitada" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="vendorEmail" render={({ field }) => ( <FormItem> <FormLabel>Supplier Email (for PO Header)</FormLabel> <FormControl><Input type="email" placeholder="e.g. lebreya@fulaho.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="salesPerson" render={({ field }) => ( <FormItem> <FormLabel>Sales Person (for PO Header)</FormLabel> <FormControl><Input placeholder="e.g. Mr Eugenio" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="supplierContactNumber" render={({ field }) => ( <FormItem> <FormLabel>Supplier Contact (for PO Header)</FormLabel> <FormControl><Input placeholder="e.g. 258 84 784 3306" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="nuit" render={({ field }) => ( <FormItem> <FormLabel>NUIT (for PO Header)</FormLabel> <FormControl><Input placeholder="e.g. 401034676" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="quoteNo" render={({ field }) => ( <FormItem> <FormLabel>Quote No. (for PO Header)</FormLabel> <FormControl><Input placeholder="e.g. EST741" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            </div>
            
            <FormField control={form.control} name="billingAddress" render={({ field }) => ( <FormItem> <FormLabel>Supplier Address (for PO Header)</FormLabel> <FormControl><Textarea placeholder="Enter supplier's address e.g. En7, Matema Loja 3, Tete" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="shippingAddress" render={({ field }) => ( <FormItem> <FormLabel>Shipping Address (Delivery)</FormLabel> <FormControl><Textarea placeholder="Enter shipping address" {...field} /></FormControl> <FormMessage /> </FormItem> )} />

            <h3 className="text-lg font-medium font-headline">PO Configuration</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="poNumberDisplay" render={({ field }) => ( <FormItem> <FormLabel>PO Number Suffix (Header)</FormLabel> <FormControl><Input placeholder="e.g. 3566" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="poDate" render={({ field }) => ( <FormItem> <FormLabel>PO Date (Header)</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="expectedDeliveryDate" render={({ field }) => ( <FormItem> <FormLabel>Expected Delivery Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="approver" render={({ field }) => ( <FormItem> <FormLabel>Approver</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select an approver" /></SelectTrigger></FormControl> <SelectContent>{mockApprovers.map(approver => (<SelectItem key={approver.id} value={approver.id}>{approver.name}</SelectItem>))}</SelectContent> </Select> <FormMessage /> </FormItem> )} />
            </div>
            
            <Separator />
            <h3 className="text-lg font-medium font-headline">Items</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
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
                <div className="grid sm:grid-cols-2 gap-4">
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
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...itemField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="text-right font-medium">
                  Item Total: $
                  {( (Number(form.watch(`items.${index}.quantity`)) || 0) * (Number(form.watch(`items.${index}.unitPrice`)) || 0) ).toFixed(2)}
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

            <div className="grid md:grid-cols-2 gap-6 items-end">
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
               <div className="text-right text-xl font-bold font-headline">
                  Total Amount: ${totalAmount.toFixed(2)}
                </div>
            </div>
            
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

