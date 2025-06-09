
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { mockUsersData } from '@/lib/mock-data';
import type { User } from '@/types';
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setUsers(mockUsersData);
  }, []);

  const handleAddNew = () => {
    toast({
      title: 'Add New User',
      description: 'This functionality is not yet implemented.',
    });
  };

  const handleEdit = (user: User) => {
    toast({
      title: 'Edit User',
      description: `Editing user "${user.name}" is not yet implemented.`,
    });
  };

  const handleDelete = (user: User) => {
    toast({
      title: 'Delete User',
      description: `Deleting user "${user.name}" is not yet implemented.`,
      variant: 'destructive',
    });
  };

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
    {
      accessorKey: 'siteAccess',
      header: 'Site Access',
      cell: (row) => (row.siteAccess.includes('all') ? 'All Sites' : row.siteAccess.join(', ')),
    },
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
            <CardTitle className="font-headline text-2xl">Manage Users</CardTitle>
            <CardDescription>View, add, edit, or delete system users.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            renderRowActions={(user) => (
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(user)} title="Edit User">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(user)} title="Delete User">
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
