
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
import type { Client } from '@/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { randomUUID } from 'crypto'; // For generating IDs if needed

const clientFormSchema = z.object({
  id: z.string().min(1, 'Client ID is required').max(255),
  name: z.string().min(1, 'Client name is required').max(255),
  address: z.string().optional().nullable(),
  city: z.string().max(255).optional().nullable(),
  country: z.string().max(255).optional().nullable(),
  contactPerson: z.string().max(255).optional().nullable(), // Mapped from "Contact"
  email: z.string().email('Invalid email address').max(255).optional().nullable(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientToEdit?: Client | null;
  onSuccess: () => void;
}

export function ClientForm({ open, onOpenChange, clientToEdit, onSuccess }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      id: '',
      name: '',
      address: '',
      city: '',
      country: '',
      contactPerson: '',
      email: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (clientToEdit) {
        form.reset({
          id: clientToEdit.id,
          name: clientToEdit.name,
          address: clientToEdit.address || '',
          city: clientToEdit.city || '',
          country: clientToEdit.country || '',
          contactPerson: clientToEdit.contactPerson || '',
          email: clientToEdit.email || '',
        });
      } else {
        form.reset({
          id: randomUUID(), // Generate new ID for creation
          name: '',
          address: '',
          city: '',
          country: '',
          contactPerson: '',
          email: '',
        });
      }
    }
  }, [clientToEdit, form, open]);

  const onSubmit = async (values: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      const url = clientToEdit ? `/api/clients/${clientToEdit.id}` : '/api/clients';
      const method = clientToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Failed to ${clientToEdit ? 'update' : 'create'} client.`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving client:', error);
      form.setError("root", { type: "manual", message: error.message || "Could not save client." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{clientToEdit ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {clientToEdit ? 'Update the details of this client.' : 'Enter the details for the new client.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-2 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CLIENT-001 or auto-generated" {...field} readOnly={!!clientToEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Vale Mozambique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Client's physical address" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tete" {...field} value={field.value ?? ''}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mozambique" {...field} value={field.value ?? ''}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mr. John Doe" {...field} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., contact@client.com" {...field} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {clientToEdit ? 'Save Changes' : 'Create Client'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
