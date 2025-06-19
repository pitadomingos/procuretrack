
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
import type { Category } from '@/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const categoryFormSchema = z.object({
  category: z.string().min(1, 'Category name is required').max(255),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToEdit?: Category | null;
  onSuccess: () => void;
}

export function CategoryForm({ open, onOpenChange, categoryToEdit, onSuccess }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (categoryToEdit) {
        form.reset({
          category: categoryToEdit.category,
        });
      } else {
        form.reset({
          category: '',
        });
      }
    }
  }, [categoryToEdit, form, open]);

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const url = categoryToEdit ? `/api/categories/${categoryToEdit.id}` : '/api/categories';
      const method = categoryToEdit ? 'PUT' : 'POST';

      console.log(`[CategoryForm] Submitting to URL: ${url} with method: ${method}`);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        let serverMessage = `Failed to ${categoryToEdit ? 'update' : 'create'} category. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          serverMessage = errorData.error || errorData.details || errorData.message || serverMessage;
        } catch (e) {
          // If JSON parsing fails, use statusText or a generic message
          serverMessage = response.statusText || `Server error: ${response.status}`;
        }
        console.error(`[CategoryForm] API Error: ${serverMessage}`, response);
        throw new Error(serverMessage);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('[CategoryForm] Error saving category:', error);
      form.setError("root", { type: "manual", message: error.message || "Could not save category." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{categoryToEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {categoryToEdit ? 'Update the name of this category.' : 'Enter the name for the new category.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control} name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Safety Consumables" {...field} /></FormControl>
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
                {categoryToEdit ? 'Save Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
