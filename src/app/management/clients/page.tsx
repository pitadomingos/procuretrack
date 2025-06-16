
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ClientForm } from '@/components/management/clients/client-form';
import type { Client } from '@/types';
import { PlusCircle, Pencil, Trash2, Loader2, AlertTriangle, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClientForEdit, setSelectedClientForEdit] = useState<Client | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    setSelectedClientForEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClientForEdit(client);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/clients/${clientToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete client.');
      }
      toast({ title: 'Success', description: `Client "${clientToDelete.name}" deleted successfully.` });
      fetchClients(); 
    } catch (error: any) {
      toast({ title: 'Error Deleting Client', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleUploadCsvClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/clients', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'File upload failed.' }));
            throw new Error(errorData.message || 'Server error during file upload.');
        }

        const result = await response.json();
        toast({ title: "Upload Successful", description: result.message || "File processed." });
        fetchClients(); 
    } catch (error: any) {
        toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; 
        }
    }
  };

  const columns: ColumnDef<Client>[] = [
    { accessorKey: 'id', header: 'Client ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'contactPerson', header: 'Contact Person' },
    { accessorKey: 'contactNumber', header: 'Contact Number' },
    { accessorKey: 'nuit', header: 'NUIT' },
    { accessorKey: 'address', header: 'Address', cell: (row) => <span className="truncate block max-w-xs">{row.address || 'N/A'}</span> },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Clients</CardTitle>
            <CardDescription>View, add, edit, or delete client records.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
            <Button onClick={handleUploadCsvClick} variant="outline" disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
              Upload CSV
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" style={{ display: 'none' }} />
             <Button asChild variant="link" size="sm" className="p-0 h-auto sm:ml-2">
                <a href="/templates/clients_template.csv" download>Download Template</a>
            </Button>
            <Button onClick={handleAddNew} className="mt-2 sm:mt-0 sm:ml-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Client
            </Button>
          </div>
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
                  <Button variant="destructive" size="icon" onClick={() => openDeleteConfirmation(client)} title="Delete Client">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>

      <ClientForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        clientToEdit={selectedClientForEdit}
        onSuccess={() => {
          fetchClients();
          toast({ title: 'Success', description: `Client ${selectedClientForEdit ? 'updated' : 'created'} successfully.` });
        }}
      />

      {clientToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this client?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Deleting "{clientToDelete.name}" will permanently remove it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <Button onClick={handleDeleteClient} variant="destructive" disabled={isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Client
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
