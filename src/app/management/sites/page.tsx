
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SiteForm } from '@/components/management/sites/site-form'; // New form component
import type { Site } from '@/types';
import { PlusCircle, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSiteForEdit, setSelectedSiteForEdit] = useState<Site | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/sites');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch sites');
      }
      const data: Site[] = await response.json();
      setSites(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: `Could not load sites: ${err.message}`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const handleAddNew = () => {
    setSelectedSiteForEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (site: Site) => {
    setSelectedSiteForEdit(site);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (site: Site) => {
    setSiteToDelete(site);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSite = async () => {
    if (!siteToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/sites/${siteToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete site.');
      }
      toast({ title: 'Success', description: `Site "${siteToDelete.name}" deleted successfully.` });
      fetchSites(); // Refresh list
    } catch (error: any) {
      toast({ title: 'Error Deleting Site', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSiteToDelete(null);
    }
  };

  const columns: ColumnDef<Site>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'siteCode', header: 'Site Code' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Sites</CardTitle>
            <CardDescription>View, add, edit, or delete company sites.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Site
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading sites...</p>
            </div>
          ) : error ? (
             <div className="flex flex-col items-center justify-center py-10 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="font-semibold">Error loading sites:</p>
                <p className="text-sm text-center">{error}</p>
                <Button onClick={fetchSites} variant="outline" className="mt-4 border-destructive-foreground text-destructive-foreground hover:bg-destructive/20">
                    Retry
                </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={sites}
              renderRowActions={(site) => (
                <div className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(site)} title="Edit Site">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => openDeleteConfirmation(site)} title="Delete Site">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>

      <SiteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        siteToEdit={selectedSiteForEdit}
        onSuccess={() => {
          fetchSites();
          toast({ title: 'Success', description: `Site ${selectedSiteForEdit ? 'updated' : 'created'} successfully.` });
        }}
      />

      {siteToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this site?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Deleting "{siteToDelete.name}" will permanently remove it from the system. 
                Make sure this site is not referenced by any existing records (e.g., Purchase Orders, Users).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <Button onClick={handleDeleteSite} variant="destructive" disabled={isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Site
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
