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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  vendorName: z.string().min(1, 'Vendor name is required'),
  vendorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  billingAddress: z.string().min(1, 'Billing address is required'),
  poDate: z.string().min(1, "PO Date is required"), // Should be a date string
  expectedDeliveryDate: z.string().optional(), // Should be a date string
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
      shippingAddress: '',
      billingAddress: '',
      poDate: new Date().toISOString().split('T')[0], // Default to today
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
    // Here you would typically send data to a backend
    // For MVP, we just log to console
    alert('PO Submitted! Check console for data. Email/PDF functionality not implemented in MVP.');
    form.reset();
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Purchase Order</CardTitle>
        <CardDescription>Fill in the details below to create a new PO.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="vendorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g. sales@acme.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter shipping address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter billing address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="poDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PO Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedDeliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Delivery Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
                control={form.control}
                name="approver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approver</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an approver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockApprovers.map(approver => (
                           <SelectItem key={approver.id} value={approver.id}>{approver.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

            <div className="grid md:grid-cols-2 gap-6">
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
               <div className="text-right text-xl font-bold font-headline self-end">
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
