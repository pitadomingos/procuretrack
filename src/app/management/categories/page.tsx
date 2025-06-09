
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { mockCategoriesData } from '@/lib/mock-data';
import type { Category } from '@/types';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setCategories(mockCategoriesData);
  }, []);

  const handleAddNew = () => {
    toast({
      title: 'Add New Category',
      description: 'This functionality is not yet implemented.',
    });
  };

  const handleEdit = (category: Category) => {
    toast({
      title: 'Edit Category',
      description: `Editing category "${category.name}" is not yet implemented.`,
    });
  };

  const handleDelete = (category: Category) => {
    toast({
      title: 'Delete Category',
      description: `Deleting category "${category.name}" is not yet implemented.`,
      variant: 'destructive',
    });
  };

  const columns: ColumnDef<Category>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
    { 
      accessorKey: 'parentCategory', 
      header: 'Parent Category ID',
      cell: (row) => row.parentCategory || 'N/A'
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Categories</CardTitle>
            <CardDescription>View, add, edit, or delete item and service categories.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categories}
            renderRowActions={(category) => (
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(category)} title="Edit Category">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(category)} title="Delete Category">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
