
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { mockApproversData } from '@/lib/mock-data';
import type { Approver } from '@/types';
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ManageApproversPage() {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setApprovers(mockApproversData);
  }, []);

  const handleAddNew = () => {
    toast({
      title: 'Add New Approver',
      description: 'This functionality is not yet implemented.',
    });
  };

  const handleEdit = (approver: Approver) => {
    toast({
      title: 'Edit Approver',
      description: `Editing approver "${approver.name}" is not yet implemented.`,
    });
  };

  const handleDelete = (approver: Approver) => {
    toast({
      title: 'Delete Approver',
      description: `Deleting approver "${approver.name}" is not yet implemented.`,
      variant: 'destructive',
    });
  };

  const columns: ColumnDef<Approver>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'department', header: 'Department' },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (row) =>
        row.isActive ? (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Active
          </Badge>
        ) : (
          <Badge variant="secondary">
            <XCircle className="mr-1 h-3 w-3" /> Inactive
          </Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Approvers</CardTitle>
            <CardDescription>View, add, edit, or delete approvers.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Approver
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={approvers}
            renderRowActions={(approver) => (
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(approver)} title="Edit Approver">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(approver)} title="Delete Approver">
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
