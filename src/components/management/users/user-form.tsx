
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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User } from '@/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const userFormSchema = z.object({
  id: z.string().min(1, 'User ID is required').max(255),
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address').max(255).optional().nullable(),
  role: z.string().max(255).optional().nullable(),
  isActive: z.boolean().default(true),
  // siteAccess is not directly editable in this form for simplicity
});

type UserFormValues = z.infer<typeof userFormSchema>;

const userRoles = ["Admin", "Creator", "Approver", "Manager", "Viewer", "User"]; // Example roles

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit?: User | null;
  onSuccess: () => void;
}

export function UserForm({ open, onOpenChange, userToEdit, onSuccess }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      role: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (userToEdit) {
        form.reset({
          id: userToEdit.id,
          name: userToEdit.name,
          email: userToEdit.email || '',
          role: userToEdit.role || '',
          isActive: typeof userToEdit.isActive === 'boolean' ? userToEdit.isActive : true,
        });
      } else {
        form.reset({
          id: crypto.randomUUID(),
          name: '',
          email: '',
          role: 'User', // Default role for new users
          isActive: true,
        });
      }
    }
  }, [userToEdit, form, open]);

  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const url = userToEdit ? `/api/users/${userToEdit.id}` : '/api/users';
      const method = userToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values), // siteAccess is not sent as it's not editable here
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Failed to ${userToEdit ? 'update' : 'create'} user.`);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving user:', error);
      form.setError("root", { type: "manual", message: error.message || "Could not save user." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{userToEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {userToEdit ? 'Update the details for this user.' : 'Enter the details for the new user.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control} name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl><Input placeholder="e.g., PITA_D" {...field} readOnly={!!userToEdit} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Pita Domingos" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" placeholder="e.g., pita.domingos@example.com" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ''} value={field.value || ''}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {userRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
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
                      Inactive users cannot log in.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Site Access</FormLabel>
                <div className="p-2 border rounded-md bg-muted text-sm text-muted-foreground">
                    {userToEdit?.siteAccess && userToEdit.siteAccess.length > 0 && userToEdit.siteAccess[0] !== 'N/A (Manage separately)'
                    ? userToEdit.siteAccess.join(', ')
                    : 'N/A. Site access management is handled separately.'}
                </div>
                <FormDescription>Site access is displayed for reference and managed via a dedicated interface (feature pending).</FormDescription>
            </FormItem>

            {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {userToEdit ? 'Save Changes' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
