
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Tag, Site } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const tagFormSchema = z.object({
  id: z.string().min(1, 'Tag ID is required').max(255),
  tagNumber: z.string().min(1, 'Tag Number is required').max(255),
  registration: z.string().max(100).optional().nullable(),
  make: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  tankCapacity: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().int().positive('Tank capacity must be a positive integer').nullable().optional()
  ),
  year: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().int().min(1900, 'Year seems too old').max(new Date().getFullYear() + 5, 'Year seems too far in future').nullable().optional()
  ),
  chassisNo: z.string().max(100).optional().nullable(),
  type: z.string().max(100).optional().nullable(),
  siteId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable() // Site ID is required by schema, but can be null if no site is selected initially
  ).refine(val => val !== null, { message: "Site assignment is required." }),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

interface TagFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagToEdit?: Tag | null;
  onSuccess: () => void;
}

export function TagForm({ open, onOpenChange, tagToEdit, onSuccess }: TagFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const { toast } = useToast();

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      id: '',
      tagNumber: '',
      registration: '',
      make: '',
      model: '',
      tankCapacity: null,
      year: null,
      chassisNo: '',
      type: '',
      siteId: null,
    },
  });

  const fetchSites = useCallback(async () => {
    try {
      const response = await fetch('/api/sites');
      if (!response.ok) throw new Error('Failed to fetch sites');
      const data: Site[] = await response.json();
      setSites(data);
    } catch (error: any) {
      toast({ title: 'Error fetching sites', description: error.message, variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    if (open) {
      fetchSites();
      if (tagToEdit) {
        form.reset({
          id: tagToEdit.id,
          tagNumber: tagToEdit.tagNumber,
          registration: tagToEdit.registration || '',
          make: tagToEdit.make || '',
          model: tagToEdit.model || '',
          tankCapacity: tagToEdit.tankCapacity ? Number(tagToEdit.tankCapacity) : null,
          year: tagToEdit.year ? Number(tagToEdit.year) : null,
          chassisNo: tagToEdit.chassisNo || '',
          type: tagToEdit.type || '',
          siteId: tagToEdit.siteId ? Number(tagToEdit.siteId) : null,
        });
      } else {
        form.reset({
          id: crypto.randomUUID(),
          tagNumber: '',
          registration: '',
          make: '',
          model: '',
          tankCapacity: null,
          year: null,
          chassisNo: '',
          type: '',
          siteId: null,
        });
      }
    }
  }, [tagToEdit, form, open, fetchSites]);

  const onSubmit = async (values: TagFormValues) => {
    setIsSubmitting(true);
    try {
      const url = tagToEdit ? `/api/tags/${tagToEdit.id}` : '/api/tags';
      const method = tagToEdit ? 'PUT' : 'POST';
      
      const payload = {
        ...values,
        siteId: values.siteId ? Number(values.siteId) : null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Failed to ${tagToEdit ? 'update' : 'create'} tag.`);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving tag:', error);
      form.setError("root", { type: "manual", message: error.message || "Could not save tag." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{tagToEdit ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
          <DialogDescription>
            {tagToEdit ? 'Update details for this vehicle/equipment tag.' : 'Enter details for the new tag.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-2 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField control={form.control} name="id" render={({ field }) => ( <FormItem><FormLabel>Tag ID</FormLabel><FormControl><Input placeholder="Unique ID" {...field} readOnly={!!tagToEdit} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tagNumber" render={({ field }) => ( <FormItem><FormLabel>Tag Number *</FormLabel><FormControl><Input placeholder="e.g., LDV001" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="type" render={({ field }) => ( <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., LDV, Truck, Generator" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField control={form.control} name="make" render={({ field }) => ( <FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="e.g., Toyota" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="model" render={({ field }) => ( <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., Hilux D4D" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField control={form.control} name="registration" render={({ field }) => ( <FormItem><FormLabel>Registration No.</FormLabel><FormControl><Input placeholder="e.g., ALL-001-MP" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="chassisNo" render={({ field }) => ( <FormItem><FormLabel>Chassis No.</FormLabel><FormControl><Input placeholder="Chassis/VIN" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField control={form.control} name="year" render={({ field }) => ( <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2022" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tankCapacity" render={({ field }) => ( <FormItem><FormLabel>Tank Capacity (Liters)</FormLabel><FormControl><Input type="number" placeholder="e.g., 80" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField
              control={form.control} name="siteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Site *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString() || ''}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a site" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {sites.map(site => (<SelectItem key={site.id} value={site.id.toString()}>{site.name} ({site.siteCode})</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && ( <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p> )}
            <DialogFooter className="pt-4">
              <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tagToEdit ? 'Save Changes' : 'Create Tag'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
