
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Supplier } from '@/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const supplierFormSchema = z.object({
  supplierCode: z.string().min(1, 'Supplier Code is required').max(255),
  supplierName: z.string().min(1, 'Supplier Name is required').max(255),
  salesPerson: z.string().max(255).optional().nullable(),
  cellNumber: z.string().max(255).optional().nullable(),
  physicalAddress: z.string().optional().nullable(),
  nuitNumber: z.string().max(255).optional().nullable(),
  emailAddress: z.string().email('Invalid email address').max(255).optional().nullable(),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

interface SupplierFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierToEdit?: Supplier | null;
  onSuccess: () => void;
}

export function SupplierForm({ open, onOpenChange, supplierToEdit, onSuccess }: SupplierFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      supplierCode: '',
      supplierName: '',
      salesPerson: '',
      cellNumber: '',
      physicalAddress: '',
      nuitNumber: '',
      emailAddress: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (supplierToEdit) {
        form.reset({
          supplierCode: supplierToEdit.supplierCode,
          supplierName: supplierToEdit.supplierName,
          salesPerson: supplierToEdit.salesPerson || '',
          cellNumber: supplierToEdit.cellNumber || '',
          physicalAddress: supplierToEdit.physicalAddress || '',
          nuitNumber: supplierToEdit.nuitNumber || '',
          emailAddress: supplierToEdit.emailAddress || '',
        });
      } else {
        form.reset({ // Consider generating a unique code suggestion if needed
          supplierCode: '', 
          supplierName: '',
          salesPerson: '',
          cellNumber: '',
          physicalAddress: '',
          nuitNumber: '',
          emailAddress: '',
        });
      }
    }
  }, [supplierToEdit, form, open]);

  const onSubmit = async (values: SupplierFormValues) => {
    setIsSubmitting(true);
    try {
      const url = supplierToEdit ? `/api/suppliers/${supplierToEdit.supplierCode}` : '/api/suppliers';
      const method = supplierToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Failed to ${supplierToEdit ? 'update' : 'create'} supplier.`);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving supplier:', error);
      form.setError("root", { type: "manual", message: error.message || "Could not save supplier." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{supplierToEdit ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          <DialogDescription>
            {supplierToEdit ? 'Update the details for this supplier.' : 'Enter the details for the new supplier.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-2 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control} name="supplierCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Code *</FormLabel>
                  <FormControl><Input placeholder="e.g., SUP001" {...field} readOnly={!!supplierToEdit} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="supplierName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name *</FormLabel>
                  <FormControl><Input placeholder="e.g., ACME Corp" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" placeholder="e.g., sales@acme.com" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="salesPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Person</FormLabel>
                  <FormControl><Input placeholder="e.g., John Doe" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="cellNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl><Input placeholder="e.g., +258 123 4567" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="nuitNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NUIT</FormLabel>
                  <FormControl><Input placeholder="Supplier NUIT number" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="physicalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Address</FormLabel>
                  <FormControl><Textarea placeholder="Supplier's physical address" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {supplierToEdit ? 'Save Changes' : 'Create Supplier'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
