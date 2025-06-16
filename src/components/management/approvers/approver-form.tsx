
'use client';

import { useForm, Controller } from 'react-hook-form';
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
  FormDescription, // Added FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { Approver } from '@/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const approverFormSchema = z.object({
  id: z.string().min(1, 'Approver ID is required').max(255),
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address').max(255).optional().nullable(),
  department: z.string().max(255).optional().nullable(),
  isActive: z.boolean().default(true),
  approvalLimit: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().positive('Approval limit must be positive').nullable().optional()
  ),
});

type ApproverFormValues = z.infer<typeof approverFormSchema>;

interface ApproverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approverToEdit?: Approver | null;
  onSuccess: () => void;
}

export function ApproverForm({ open, onOpenChange, approverToEdit, onSuccess }: ApproverFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApproverFormValues>({
    resolver: zodResolver(approverFormSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      department: '',
      isActive: true,
      approvalLimit: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (approverToEdit) {
        form.reset({
          id: approverToEdit.id,
          name: approverToEdit.name,
          email: approverToEdit.email || '',
          department: approverToEdit.department || '',
          isActive: typeof approverToEdit.isActive === 'boolean' ? approverToEdit.isActive : true,
          approvalLimit: approverToEdit.approvalLimit ? Number(approverToEdit.approvalLimit) : null,
        });
      } else {
        form.reset({
          id: crypto.randomUUID(),
          name: '',
          email: '',
          department: '',
          isActive: true,
          approvalLimit: null,
        });
      }
    }
  }, [approverToEdit, form, open]);

  const onSubmit = async (values: ApproverFormValues) => {
    setIsSubmitting(true);
    try {
      const url = approverToEdit ? `/api/approvers/${approverToEdit.id}` : '/api/approvers';
      const method = approverToEdit ? 'PUT' : 'POST';

      const payload = {
        ...values,
        approvalLimit: values.approvalLimit ? Number(values.approvalLimit) : null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Failed to ${approverToEdit ? 'update' : 'create'} approver.`);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving approver:', error);
      form.setError("root", { type: "manual", message: error.message || "Could not save approver." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{approverToEdit ? 'Edit Approver' : 'Add New Approver'}</DialogTitle>
          <DialogDescription>
            {approverToEdit ? 'Update the details for this approver.' : 'Enter the details for the new approver.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control} name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approver ID</FormLabel>
                  <FormControl><Input placeholder="e.g., CHERINNE_DK" {...field} readOnly={!!approverToEdit} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Cherinne de Klerk" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" placeholder="e.g., cherinne@example.com" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl><Input placeholder="e.g., Finance, All" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="approvalLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approval Limit (MZN)</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="e.g., 50000.00" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Inactive approvers cannot be assigned new POs.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
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
                {approverToEdit ? 'Save Changes' : 'Create Approver'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
