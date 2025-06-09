
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { mockAllocationsData } from '@/lib/mock-data';
import type { Allocation } from '@/types';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageAllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setAllocations(mockAllocationsData);
  }, []);

  const handleAddNew = () => {
    toast({
      title: 'Add New Allocation',
      description: 'This functionality is not yet implemented.',
    });
  };

  const handleEdit = (allocation: Allocation) => {
    toast({
      title: 'Edit Allocation',
      description: `Editing allocation "${allocation.name}" is not yet implemented.`,
    });
  };

  const handleDelete = (allocation: Allocation) => {
    toast({
      title: 'Delete Allocation',
      description: `Deleting allocation "${allocation.name}" is not yet implemented.`,
      variant: 'destructive',
    });
  };

  const columns: ColumnDef<Allocation>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'description', header: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Allocations</CardTitle>
            <CardDescription>View, add, edit, or delete cost allocations/departments.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Allocation
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={allocations}
            renderRowActions={(allocation) => (
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(allocation)} title="Edit Allocation">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(allocation)} title="Delete Allocation">
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
