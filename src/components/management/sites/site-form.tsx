
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
import type { Site } from '@/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const siteFormSchema = z.object({
  name: z.string().min(1, { message: 'Site name is required.' }).max(255),
  location: z.string().max(255).optional().nullable(),
  siteCode: z.string().max(255).optional().nullable(),
});

type SiteFormValues = z.infer<typeof siteFormSchema>;

interface SiteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteToEdit?: Site | null;
  onSuccess: () => void; // Callback to refresh the list
}

export function SiteForm({ open, onOpenChange, siteToEdit, onSuccess }: SiteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: '',
      location: '',
      siteCode: '',
    },
  });

  useEffect(() => {
    if (siteToEdit) {
      form.reset({
        name: siteToEdit.name,
        location: siteToEdit.location || '',
        siteCode: siteToEdit.siteCode || '',
      });
    } else {
      form.reset({
        name: '',
        location: '',
        siteCode: '',
      });
    }
  }, [siteToEdit, form, open]); // re-run if `open` changes to reset form when re-opened for create

  const onSubmit = async (values: SiteFormValues) => {
    setIsSubmitting(true);
    try {
      const url = siteToEdit ? `/api/sites/${siteToEdit.id}` : '/api/sites';
      const method = siteToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Failed to ${siteToEdit ? 'update' : 'create'} site.`);
      }

      onSuccess(); // Refresh list in parent component
      onOpenChange(false); // Close dialog
    } catch (error: any) {
      // Consider using toast for error messages
      console.error('Error saving site:', error);
      form.setError("root", { type: "manual", message: error.message || "Could not save site." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{siteToEdit ? 'Edit Site' : 'Add New Site'}</DialogTitle>
          <DialogDescription>
            {siteToEdit ? 'Update the details of this site.' : 'Enter the details for the new site.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tete Main Warehouse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Moatize" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="siteCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., TMW" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {siteToEdit ? 'Save Changes' : 'Create Site'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
