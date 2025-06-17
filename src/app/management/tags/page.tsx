
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TagForm } from '@/components/management/tags/tag-form';
import type { Tag, TagStatus } from '@/types';
import { PlusCircle, Pencil, Trash2, Loader2, AlertTriangle, UploadCloud, CheckCircle, XCircle, Construction, Car, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const getStatusBadge = (status: TagStatus | string) => {
  switch (status) {
    case 'Active':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" /> Active</Badge>;
    case 'Inactive':
      return <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" /> Inactive</Badge>;
    case 'Under Maintenance':
      return <Badge variant="outline" className="text-orange-600 border-orange-600"><Construction className="mr-1 h-3 w-3" /> Maintenance</Badge>;
    case 'Sold':
      return <Badge variant="outline" className="text-blue-600 border-blue-600"><Car className="mr-1 h-3 w-3" /> Sold</Badge>;
    case 'Decommissioned':
      return <Badge variant="destructive"><Ban className="mr-1 h-3 w-3" /> Decommissioned</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};


export default function ManageTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTagForEdit, setSelectedTagForEdit] = useState<Tag | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch tags');
      }
      const data: Tag[] = await response.json();
      setTags(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: `Could not load tags: ${err.message}`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleAddNew = () => {
    setSelectedTagForEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTagForEdit(tag);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (tag: Tag) => {
    setTagToDelete(tag);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTag = async () => {
    if (!tagToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tags/${tagToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete tag.');
      }
      toast({ title: 'Success', description: `Tag "${tagToDelete.tagNumber}" deleted successfully.` });
      fetchTags(); 
    } catch (error: any) {
      toast({ title: 'Error Deleting Tag', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setTagToDelete(null);
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
        const response = await fetch('/api/tags', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'File upload failed.' }));
            throw new Error(errorData.message || 'Server error during file upload.');
        }

        const result = await response.json();
        toast({ title: "Upload Successful", description: result.message || "File processed." });
        fetchTags(); 
    } catch (error: any) {
        toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; 
        }
    }
  };

  const columns: ColumnDef<Tag>[] = [
    { accessorKey: 'tagNumber', header: 'Tag Number' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'make', header: 'Make' },
    { accessorKey: 'model', header: 'Model' },
    { accessorKey: 'registration', header: 'Registration' },
    { accessorKey: 'year', header: 'Year' },
    { accessorKey: 'siteName', header: 'Assigned Site' }, 
    { accessorKey: 'status', header: 'Status', cell: (tag) => getStatusBadge(tag.status) },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Tags (Vehicles/Equipment)</CardTitle>
            <CardDescription>View, add, edit, or delete tagged vehicles and equipment.</CardDescription>
          </div>
           <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
            <Button onClick={handleUploadCsvClick} variant="outline" disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
              Upload CSV
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" style={{ display: 'none' }} />
            <Button asChild variant="link" size="sm" className="p-0 h-auto sm:ml-2">
                <a href="/templates/tags_template.csv" download>Download Template</a>
            </Button>
            <Button onClick={handleAddNew} className="mt-2 sm:mt-0 sm:ml-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Tag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading tags...</p>
            </div>
          ) : error ? (
             <div className="flex flex-col items-center justify-center py-10 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="font-semibold">Error loading tags:</p>
                <p className="text-sm text-center">{error}</p>
                <Button onClick={fetchTags} variant="outline" className="mt-4 border-destructive-foreground text-destructive-foreground hover:bg-destructive/20">
                    Retry
                </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={tags}
              renderRowActions={(tag) => (
                <div className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(tag)} title="Edit Tag">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => openDeleteConfirmation(tag)} title="Delete Tag">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>

      <TagForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        tagToEdit={selectedTagForEdit}
        onSuccess={() => {
          fetchTags();
          toast({ title: 'Success', description: `Tag ${selectedTagForEdit ? 'updated' : 'created'} successfully.` });
        }}
      />

      {tagToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this tag?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Deleting tag "{tagToDelete.tagNumber}" will permanently remove it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <Button onClick={handleDeleteTag} variant="destructive" disabled={isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Tag
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
