
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SupplierForm } from '@/components/management/suppliers/supplier-form';
import type { Supplier } from '@/types';
import { PlusCircle, Pencil, Trash2, Loader2, AlertTriangle, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupplierForEdit, setSelectedSupplierForEdit] = useState<Supplier | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/suppliers');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch suppliers');
      }
      const data: Supplier[] = await response.json();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: `Could not load suppliers: ${err.message}`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleAddNew = () => {
    setSelectedSupplierForEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplierForEdit(supplier);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/suppliers/${supplierToDelete.supplierCode}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete supplier.');
      }
      toast({ title: 'Success', description: `Supplier "${supplierToDelete.supplierName}" deleted successfully.` });
      fetchSuppliers(); 
    } catch (error: any) {
      toast({ title: 'Error Deleting Supplier', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSupplierToDelete(null);
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
        const response = await fetch('/api/suppliers', { // Target the main POST route for suppliers
            method: 'POST',
            body: formData,
            // Headers are automatically set by FormData for multipart
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'File upload failed.' }));
            throw new Error(errorData.message || 'Server error during file upload.');
        }

        const result = await response.json();
        toast({ title: "Upload Successful", description: result.message || "File processed." });
        fetchSuppliers(); // Refresh list after upload
    } catch (error: any) {
        toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    }
  };


  const columns: ColumnDef<Supplier>[] = [
    { accessorKey: 'supplierCode', header: 'Code' },
    { accessorKey: 'supplierName', header: 'Name' },
    { accessorKey: 'emailAddress', header: 'Email' },
    { accessorKey: 'salesPerson', header: 'Sales Person' },
    { accessorKey: 'cellNumber', header: 'Contact No.' },
    { accessorKey: 'nuitNumber', header: 'NUIT' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Suppliers</CardTitle>
            <CardDescription>View, add, edit, or delete suppliers and vendors.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
            <Button onClick={handleUploadCsvClick} variant="outline" disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
              Upload CSV
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" style={{ display: 'none' }} />
            <Button asChild variant="link" size="sm" className="p-0 h-auto sm:ml-2">
                <a href="/templates/suppliers_template.csv" download>Download Template</a>
            </Button>
            <Button onClick={handleAddNew} className="mt-2 sm:mt-0 sm:ml-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Supplier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading suppliers...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="font-semibold">Error loading suppliers:</p>
                <p className="text-sm text-center">{error}</p>
                <Button onClick={fetchSuppliers} variant="outline" className="mt-4 border-destructive-foreground text-destructive-foreground hover:bg-destructive/20">
                    Retry
                </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={suppliers}
              renderRowActions={(supplier) => (
                <div className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(supplier)} title="Edit Supplier">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => openDeleteConfirmation(supplier)} title="Delete Supplier">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>

      <SupplierForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        supplierToEdit={selectedSupplierForEdit}
        onSuccess={() => {
          fetchSuppliers();
          toast({ title: 'Success', description: `Supplier ${selectedSupplierForEdit ? 'updated' : 'created'} successfully.` });
        }}
      />

      {supplierToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this supplier?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Deleting "{supplierToDelete.supplierName}" will permanently remove them.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <Button onClick={handleDeleteSupplier} variant="destructive" disabled={isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Supplier
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
