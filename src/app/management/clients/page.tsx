
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import type { Client } from '@/types';
import { PlusCircle, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch clients');
      }
      const data: Client[] = await response.json();
      setClients(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: `Could not load clients: ${err.message}`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAddNew = () => {
    toast({
      title: 'Add New Client',
      description: 'This functionality is not yet implemented. Full CRUD operations will be added soon.',
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
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading clients...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="font-semibold">Error loading clients:</p>
                <p className="text-sm text-center">{error}</p>
                <Button onClick={fetchClients} variant="outline" className="mt-4 border-destructive-foreground text-destructive-foreground hover:bg-destructive/20">
                    Retry
                </Button>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
