
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { mockClients } from '@/lib/mock-data'; // Using mock data for now
import type { Client } from '@/types';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setClients(mockClients);
  }, []);

  const handleAddNew = () => {
    toast({
      title: 'Add New Client',
      description: 'This functionality is not yet implemented.',
    });
  };

  const handleEdit = (client: Client) => {
    toast({
      title: 'Edit Client',
      description: `Editing client "${client.name}" is not yet implemented.`,
    });
  };

  const handleDelete = (client: Client) => {
    toast({
      title: 'Delete Client',
      description: `Deleting client "${client.name}" is not yet implemented.`,
      variant: 'destructive',
    });
  };

  const columns: ColumnDef<Client>[] = [
    { accessorKey: 'id', header: 'Client ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'contactPerson', header: 'Contact Person' },
    { accessorKey: 'contactNumber', header: 'Contact Number' },
    { accessorKey: 'address', header: 'Address' },
    { accessorKey: 'nuit', header: 'NUIT' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Clients</CardTitle>
            <CardDescription>View, add, edit, or delete client records.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Client
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={clients}
            renderRowActions={(client) => (
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(client)} title="Edit Client">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(client)} title="Delete Client">
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
