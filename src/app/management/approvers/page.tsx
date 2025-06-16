
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ApproverForm } from '@/components/management/approvers/approver-form';
import type { Approver } from '@/types';
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ManageApproversPage() {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApproverForEdit, setSelectedApproverForEdit] = useState<Approver | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [approverToDelete, setApproverToDelete] = useState<Approver | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApprovers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/approvers');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch approvers');
      }
      const data: Approver[] = await response.json();
      setApprovers(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: `Could not load approvers: ${err.message}`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApprovers();
  }, [fetchApprovers]);

  const handleAddNew = () => {
    setSelectedApproverForEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (approver: Approver) => {
    setSelectedApproverForEdit(approver);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (approver: Approver) => {
    setApproverToDelete(approver);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteApprover = async () => {
    if (!approverToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/approvers/${approverToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete approver.');
      }
      toast({ title: 'Success', description: `Approver "${approverToDelete.name}" deleted successfully.` });
      fetchApprovers(); 
    } catch (error: any) {
      toast({ title: 'Error Deleting Approver', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setApproverToDelete(null);
    }
  };

  const columns: ColumnDef<Approver>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'department', header: 'Department' },
    { 
      accessorKey: 'approvalLimit', 
      header: 'Limit (MZN)', 
      cell: (approver) => approver.approvalLimit ? Number(approver.approvalLimit).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 'N/A'
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (approver) => // Corrected: access isActive directly from the approver object
        approver.isActive ? (
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
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading approvers...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="font-semibold">Error loading approvers:</p>
                <p className="text-sm text-center">{error}</p>
                <Button onClick={fetchApprovers} variant="outline" className="mt-4 border-destructive-foreground text-destructive-foreground hover:bg-destructive/20">
                    Retry
                </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={approvers}
              renderRowActions={(approver) => (
                <div className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(approver)} title="Edit Approver">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => openDeleteConfirmation(approver)} title="Delete Approver">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>

      <ApproverForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        approverToEdit={selectedApproverForEdit}
        onSuccess={() => {
          fetchApprovers();
          toast({ title: 'Success', description: `Approver ${selectedApproverForEdit ? 'updated' : 'created'} successfully.` });
        }}
      />

      {approverToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this approver?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Deleting "{approverToDelete.name}" will permanently remove them.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <Button onClick={handleDeleteApprover} variant="destructive" disabled={isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Approver
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
