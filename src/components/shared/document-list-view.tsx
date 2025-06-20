
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2, AlertTriangle, UploadCloud, Edit2, Trash2 } from 'lucide-react';
import type { PurchaseOrderPayload, QuotePayload, RequisitionPayload, FuelRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


interface DocumentListViewProps {
  documentType: 'po' | 'grn' | 'quote' | 'requisition' | 'fuel';
}

type DocumentData = PurchaseOrderPayload | QuotePayload | RequisitionPayload | FuelRecord;

const poColumns: ColumnDef<PurchaseOrderPayload>[] = [
  { accessorKey: 'poNumber', header: 'PO Number' },
  {
    accessorKey: 'creationDate',
    header: 'Date',
    cell: (item) => format(new Date(item.creationDate), 'dd MMM yyyy')
  },
  {
    accessorKey: 'supplierName',
    header: 'Supplier',
    cell: (item) => item.supplierName || item.supplierId || 'N/A'
  },
  {
    accessorKey: 'grandTotal',
    header: 'Total',
    cell: (item) => `${item.currency} ${item.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'requestedByName',
    header: 'Requestor (Entered)' ,
    cell: (item) => item.requestedByName || 'N/A'
  },
  {
    accessorKey: 'creatorName',
    header: 'Creator (System User)',
    cell: (item) => item.creatorName || item.creatorUserId || 'N/A'
  },
  {
    accessorKey: 'approverName',
    header: 'Approver',
    cell: (item) => item.approverName || item.approverId || 'N/A'
  },
];

const quoteColumns: ColumnDef<QuotePayload>[] = [
  { accessorKey: 'quoteNumber', header: 'Quote Number' },
  {
    accessorKey: 'quoteDate',
    header: 'Date',
    cell: (item) => format(new Date(item.quoteDate), 'dd MMM yyyy')
  },
  {
    accessorKey: 'clientName',
    header: 'Client',
    cell: (item) => item.clientName || item.clientId || 'N/A'
  },
  {
    accessorKey: 'grandTotal',
    header: 'Total',
    cell: (item) => `${item.currency} ${item.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  },
  { accessorKey: 'status', header: 'Status' },
];

const requisitionColumns: ColumnDef<RequisitionPayload>[] = [
  { accessorKey: 'requisitionNumber', header: 'Requisition No.'},
  {
    accessorKey: 'requisitionDate',
    header: 'Date',
    cell: (item) => format(new Date(item.requisitionDate), 'dd MMM yyyy')
  },
  { accessorKey: 'requestedByName', header: 'Requested By' },
  {
    accessorKey: 'siteName',
    header: 'Site Code',
    cell: (item) => item.siteName || (item.siteId ? `Site ID: ${item.siteId}` : 'N/A')
  },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'totalEstimatedValue',
    header: 'Est. Value',
    cell: (item) => item.totalEstimatedValue ? `${item.totalEstimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MZN` : 'N/A'
  },
];

const fuelRecordColumns: ColumnDef<FuelRecord>[] = [
    { accessorKey: 'fuelDate', header: 'Date', cell: (item) => format(new Date(item.fuelDate), 'dd MMM yyyy') },
    { accessorKey: 'driver', header: 'Driver' },
    { accessorKey: 'tagName', header: 'Tag' },
    { accessorKey: 'siteName', header: 'Site Code' },
    { accessorKey: 'quantity', header: 'Qty', cell: (item) => `${item.quantity} ${item.uom || ''}` },
    { accessorKey: 'unitCost', header: 'Unit Cost (MZN)', cell: (item) => item.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { accessorKey: 'totalCost', header: 'Total Cost (MZN)', cell: (item) => (item.totalCost || (item.quantity * item.unitCost)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { accessorKey: 'odometer', header: 'Odometer (km)' },
    {
      accessorKey: 'distanceTravelled',
      header: 'Distance (km)',
      cell: (item) => item.distanceTravelled !== null && item.distanceTravelled !== undefined ? item.distanceTravelled.toLocaleString() : 'N/A'
    },
];


export function DocumentListView({ documentType }: DocumentListViewProps) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_BASE_URLS = {
    po: '/api/purchase-orders',
    quote: '/api/quotes',
    requisition: '/api/requisitions',
    fuel: '/api/fuel-records',
    grn: '/api/grn'
  };

  const fetchDocuments = useCallback(async (filters?: any) => {
    const apiUrlBase = API_BASE_URLS[documentType];
    if (!apiUrlBase || documentType === 'grn') { // GRN list view not implemented yet
      setError(`List view for ${documentType.toUpperCase()}s is not configured or available.`);
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    const queryParams = new URLSearchParams();
    const defaultMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const defaultYear = new Date().getFullYear().toString();

    queryParams.append('month', (filters?.month && filters.month !== 'all') ? filters.month : defaultMonth);
    queryParams.append('year', (filters?.year && filters.year !== 'all') ? filters.year : defaultYear);

    if (filters?.siteId && filters.siteId !== 'all') queryParams.append('siteId', filters.siteId);
    if (filters?.approverId && filters.approverId !== 'all') queryParams.append('approverId', filters.approverId);
    if (filters?.creatorUserId && filters.creatorUserId !== 'all') queryParams.append('creatorUserId', filters.creatorUserId); // Ensure this matches FilterBar's output for requestor
    if (filters?.tagId && filters.tagId !== 'all') queryParams.append('tagId', filters.tagId);
    if (filters?.driver && filters.driver.trim() !== '') queryParams.append('driver', filters.driver);
    if (documentType === 'requisition' && filters?.status && filters.status !== 'all') queryParams.append('status', filters.status);


    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrlBase}?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || errorData.error || `Failed to fetch ${documentType.toUpperCase()}s.`;
        throw new Error(errorMessage);
      }
      const data: DocumentData[] = await response.json();
      setDocuments(data);
    } catch (err: any) {
      console.error(`Error fetching ${documentType}s:`, err);
      setError(err.message || `An unexpected error occurred while fetching ${documentType.toUpperCase()}s.`);
      toast({ title: `Error Fetching ${documentType.toUpperCase()}s`, description: err.message, variant: "destructive"});
    } finally {
      setIsLoading(false);
    }
  }, [documentType, toast]);

  useEffect(() => {
    if (documentType !== 'grn') { // Don't fetch for GRN list view
        fetchDocuments();
    }
  }, [fetchDocuments, documentType]);

  const handleFilterApply = (filters: any) => {
     const apiFilters = {
        month: filters.month,
        year: filters.year,
        siteId: filters.site, // FilterBar uses 'site'
        approverId: filters.approver, // FilterBar uses 'approver'
        creatorUserId: filters.requestor, // FilterBar uses 'requestor'
        tagId: filters.tag, // FilterBar uses 'tag'
        driver: filters.driver,
        status: documentType === 'requisition' ? filters.status : undefined,
    };
    fetchDocuments(apiFilters);
  };

  const handleDownloadExcel = () => {
    toast({ title: "Feature Not Implemented", description: `Download to Excel for ${documentType.toUpperCase()} list is not yet available.`});
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

    const uploadUrl = API_BASE_URLS[documentType];
    if (!uploadUrl || documentType === 'grn' || documentType === 'fuel' || documentType === 'requisition') { // GRN, Fuel, Req CSV upload not supported here
        toast({ title: "Upload Error", description: `CSV Upload not supported for ${documentType.toUpperCase()}s via this interface.`, variant: "destructive"});
        setIsUploading(false);
        return;
    }

    try {
        const response = await fetch(uploadUrl, { method: 'POST', body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || result.message || 'File upload failed.');

        toast({ title: "Upload Processing", description: result.message || "File processed." });
        if (result.errors && result.errors.length > 0) {
            result.errors.forEach((errMsg: string) => {
                toast({ title: "Upload Warning", description: errMsg, variant: "destructive", duration: 7000 });
            });
        }
        fetchDocuments();
    } catch (error: any) {
        toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openDeleteDialog = (doc: DocumentData) => {
    setDocumentToDelete(doc);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete || !documentToDelete.id) return;
    setIsDeleting(true);

    const deleteUrl = `${API_BASE_URLS[documentType]}/${documentToDelete.id}`;

    try {
      const response = await fetch(deleteUrl, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete ${documentType}.`);
      }
      toast({ title: "Success", description: `${documentType.toUpperCase()} ${documentToDelete.id} deleted successfully.` });
      fetchDocuments();
    } catch (error: any) {
      toast({ title: `Error Deleting ${documentType.toUpperCase()}`, description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const renderRowActions = (doc: DocumentData) => {
    const docId = doc.id;
    let printPath = '';
    let editPath = '';
    let canDelete = false;
    let currentStatus: string | undefined = undefined;

    if (documentType === 'po' && docId) {
      currentStatus = (doc as PurchaseOrderPayload).status;
      printPath = `/purchase-orders/${docId}/print`;
      if (currentStatus === 'Draft' || currentStatus === 'Pending Approval' || currentStatus === 'Rejected') {
          editPath = `/create-document?editPoId=${docId}`;
      }
       if (currentStatus === 'Draft' || currentStatus === 'Rejected') {
          canDelete = true;
      }
    } else if (documentType === 'quote' && docId) {
      currentStatus = (doc as QuotePayload).status;
      printPath = `/quotes/${docId}/print`;
      if (currentStatus === 'Draft' || currentStatus === 'Pending Approval') {
        editPath = `/create-document?editQuoteId=${docId}`;
      }
      if (currentStatus === 'Draft' || currentStatus === 'Rejected') {
        canDelete = true;
      }
    } else if (documentType === 'requisition' && docId) {
      currentStatus = (doc as RequisitionPayload).status;
      printPath = `/requisitions/${docId}/print`;
      if (currentStatus === 'Draft' || currentStatus === 'Pending Approval' || currentStatus === 'Rejected') {
        editPath = `/create-document?editRequisitionId=${docId}`;
      }
      if (currentStatus === 'Draft' || currentStatus === 'Rejected') {
         canDelete = true;
      }
    }
    // No edit/delete for fuel records or GRN list view via this general component for now

    return (
      <div className="space-x-1 flex justify-end">
        {printPath && (
          <Link href={printPath} passHref legacyBehavior={false}>
            <Button variant="outline" size="sm" title={`View ${documentType.toUpperCase()} Details`}><Eye className="h-4 w-4" /></Button>
          </Link>
        )}
        {editPath && (
          <Link href={editPath} passHref legacyBehavior={false}>
            <Button variant="outline" size="sm" title={`Edit ${documentType.toUpperCase()}`}><Edit2 className="h-4 w-4" /></Button>
          </Link>
        )}
        {canDelete && (
            <Button variant="destructive" size="sm" title={`Delete ${documentType.toUpperCase()}`} onClick={() => openDeleteDialog(doc)} disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
            </Button>
        )}
      </div>
    );
  };


  let columnsToUse: ColumnDef<any>[] = [];
  let listTitle = '';
  let filterConfig = {
    showApproverFilter: false,
    showRequestorFilter: false,
    showSiteFilter: false,
    showTagFilter: false,
    showDriverFilter: false,
    showStatusFilter: false, // For Requisition status filter
  };
  let showUploadCsv = false;
  let csvTemplateLink = '';


  if (documentType === 'po') {
    columnsToUse = poColumns as ColumnDef<any>[];
    listTitle = 'Purchase Orders';
    filterConfig = { ...filterConfig, showApproverFilter: true, showRequestorFilter: true, showSiteFilter: true };
    showUploadCsv = true; csvTemplateLink = '/templates/purchase_orders_template.csv';
  } else if (documentType === 'quote') {
    columnsToUse = quoteColumns as ColumnDef<any>[];
    listTitle = 'Client Quotations';
    filterConfig = { ...filterConfig, showSiteFilter: false, showRequestorFilter: false };
    showUploadCsv = true; csvTemplateLink = '/templates/quotes_template.csv';
  } else if (documentType === 'requisition') {
    columnsToUse = requisitionColumns as ColumnDef<any>[];
    listTitle = 'Purchase Requisitions';
    filterConfig = { ...filterConfig, showRequestorFilter: true, showSiteFilter: true, showStatusFilter: true };
  } else if (documentType === 'fuel') {
    columnsToUse = fuelRecordColumns as ColumnDef<any>[];
    listTitle = 'Fuel Records';
    filterConfig = { ...filterConfig, showSiteFilter: true, showRequestorFilter: false, showTagFilter: true, showDriverFilter: true };
  } else if (documentType === 'grn') {
    // GRN list view is not implemented via this component yet
    listTitle = 'Goods Received Notes (List View Pending)';
    columnsToUse = [{ accessorKey: 'grnNumber', header: 'GRN Number'}, { accessorKey: 'poNumber', header: 'PO Number'}, {accessorKey: 'date', header: 'Date'}]; // Placeholder
  } else {
     columnsToUse = [{ accessorKey: 'name', header: 'Name (Placeholder)' }];
     listTitle = `${documentType.toUpperCase()}s`;
  }

  if (documentType === 'grn') {
    return (
        <Card className="shadow-lg mt-6">
            <CardHeader>
                <CardTitle className="font-headline text-xl capitalize">List of {listTitle}</CardTitle>
                <CardDescription>A dedicated list view for Goods Received Notes is planned for future implementation.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                    <Package className="mx-auto h-12 w-12 mb-4" />
                    <p>GRN list view is currently under development.</p>
                </div>
            </CardContent>
        </Card>
    );
  }


  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="font-headline text-xl capitalize">List of {listTitle}</CardTitle>
        <CardDescription>View, filter, and manage existing {listTitle.toLowerCase()} documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <FilterBar
          onFilterApply={handleFilterApply}
          showApproverFilter={filterConfig.showApproverFilter}
          showRequestorFilter={filterConfig.showRequestorFilter}
          showSiteFilter={filterConfig.showSiteFilter}
          showTagFilter={filterConfig.showTagFilter}
          showDriverFilter={filterConfig.showDriverFilter}
          showStatusFilter={filterConfig.showStatusFilter}
          statusOptions={documentType === 'requisition' ? [
            { value: 'Draft', label: 'Draft' },
            { value: 'Pending Approval', label: 'Pending Approval' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Rejected', label: 'Rejected' },
            { value: 'Closed', label: 'Closed' },
          ] : undefined}
        />
        <div className="mt-4 flex justify-end gap-2">
          {showUploadCsv && (
            <>
              <Button onClick={handleUploadCsvClick} variant="outline" disabled={isUploading}>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Upload CSV
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" style={{ display: 'none' }} />
              {csvTemplateLink && (
                <Button asChild variant="link" size="sm">
                  <a href={csvTemplateLink} download>Download Template</a>
                </Button>
              )}
            </>
          )}
        </div>
        <div className="mt-4">
          {isLoading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading documents...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="font-semibold">Error loading documents:</p>
                <p className="text-sm text-center">{error}</p>
                <Button onClick={() => fetchDocuments()} variant="outline" className="mt-4 border-destructive-foreground text-destructive-foreground hover:bg-destructive/20">
                    Retry
                </Button>
            </div>
          ) : (
            <DataTable
              columns={columnsToUse}
              data={documents}
              renderRowActions={renderRowActions}
            />
          )}
        </div>
      </CardContent>
       {documentToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {documentType.toUpperCase()} (ID: {documentToDelete.id})? This action cannot be undone.
                {(documentType === 'po' && ((documentToDelete as PurchaseOrderPayload).status !== 'Draft' && (documentToDelete as PurchaseOrderPayload).status !== 'Rejected')) ||
                 (documentType === 'quote' && ((documentToDelete as QuotePayload).status !== 'Draft' && (documentToDelete as QuotePayload).status !== 'Rejected')) ||
                 (documentType === 'requisition' && ((documentToDelete as RequisitionPayload).status !== 'Draft' && (documentToDelete as RequisitionPayload).status !== 'Rejected')) ?
                 <span className="font-bold text-destructive block mt-2">Warning: This document is not in 'Draft' or 'Rejected' status. Deleting it may have unintended consequences.</span>
                 : null
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting} onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
              <Button onClick={confirmDelete} variant="destructive" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}

    