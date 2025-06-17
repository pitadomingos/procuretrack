
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2, AlertTriangle, UploadCloud } from 'lucide-react';
import type { PurchaseOrderPayload, QuotePayload, RequisitionPayload, FuelRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = useCallback(async (filters?: any) => {
    let apiUrl = '';
    const queryParams = new URLSearchParams();

    const defaultMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const defaultYear = new Date().getFullYear().toString();

    queryParams.append('month', (filters?.month && filters.month !== 'all') ? filters.month : defaultMonth);
    queryParams.append('year', (filters?.year && filters.year !== 'all') ? filters.year : defaultYear);

    if (filters?.siteId && filters.siteId !== 'all') queryParams.append('siteId', filters.siteId);
    if (filters?.approverId && filters.approverId !== 'all') queryParams.append('approverId', filters.approverId);
    if (filters?.creatorUserId && filters.creatorUserId !== 'all') queryParams.append('creatorUserId', filters.creatorUserId);
    if (filters?.tagId && filters.tagId !== 'all') queryParams.append('tagId', filters.tagId);
    if (filters?.driver && filters.driver.trim() !== '') queryParams.append('driver', filters.driver);

    if (documentType === 'po') apiUrl = '/api/purchase-orders';
    else if (documentType === 'quote') apiUrl = '/api/quotes';
    else if (documentType === 'requisition') apiUrl = '/api/requisitions'; // Still mock
    else if (documentType === 'fuel') apiUrl = '/api/fuel-records'; // Still mock
    else {
      setDocuments([]);
      setError(`List view for ${documentType.toUpperCase()}s is not yet implemented or uses mock data.`);
      toast({ title: "List View Information", description: `The list view for ${documentType.toUpperCase()}s may be using mock data or is not fully implemented.`});
      if (documentType === 'requisition' || documentType === 'fuel') {
        // Load mock data for these types if API isn't ready
        // Example: setDocuments(documentType === 'requisition' ? mockRequisitionsData : mockFuelRecordsData);
        // For now, we will assume API routes might exist but could be mock.
        // If API returns empty or error, it will be handled by the try-catch block.
      } else {
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch ${documentType.toUpperCase()}s.`);
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
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFilterApply = (filters: any) => {
    const apiFilters = {
        ...filters,
        creatorUserId: filters.requestor, // Map UI filter name to API param name
        approverId: filters.approver,
        siteId: filters.site,
        tagId: filters.tag,
    };
    delete apiFilters.requestor;
    delete apiFilters.approver;
    delete apiFilters.site;
    delete apiFilters.tag;
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

    let uploadUrl = '';
    if (documentType === 'fuel') uploadUrl = '/api/fuel-records';
    else if (documentType === 'quote') uploadUrl = '/api/quotes';
    else if (documentType === 'po') uploadUrl = '/api/purchase-orders';
    // Add other types like Requisition if they support CSV upload later

    if (!uploadUrl) {
        toast({ title: "Upload Error", description: `CSV Upload not configured for ${documentType}.`, variant: "destructive"});
        setIsUploading(false);
        return;
    }

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json(); // Try to parse JSON regardless of status
        if (!response.ok) {
             throw new Error(result.error || result.message || 'File upload failed. Server error.');
        }
        
        toast({ title: "Upload Processing", description: result.message || "File processed." });
        if (result.errors && result.errors.length > 0) {
            result.errors.forEach((errMsg: string) => {
                toast({ title: "Upload Warning", description: errMsg, variant: "destructive", duration: 7000 });
            });
        }
        fetchDocuments(); // Refresh list after upload
    } catch (error: any) {
        toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    }
  };


  const renderRowActions = (doc: DocumentData) => {
    if (documentType === 'po' && doc.id) {
      return (
        <Link href={`/purchase-orders/${doc.id}/print`} passHref legacyBehavior={false}>
          <Button variant="outline" size="sm" title="View PO Details"><Eye className="mr-1 h-4 w-4" /> View</Button>
        </Link>
      );
    }
    if (documentType === 'quote' && doc.id) {
      return (
        <Link href={`/quotes/${doc.id}/print`} passHref legacyBehavior={false}>
          <Button variant="outline" size="sm" title="View Quote Details"><Eye className="mr-1 h-4 w-4" /> View</Button>
        </Link>
      );
    }
    if (documentType === 'requisition' && doc.id) {
      return (
        <Link href={`/requisitions/${doc.id}/print`} passHref legacyBehavior={false}>
          <Button variant="outline" size="sm" title="View Requisition Details"><Eye className="mr-1 h-4 w-4" /> View</Button>
        </Link>
      );
    }
    if (documentType === 'fuel' && doc.id) {
        // No print preview for fuel records, so maybe an edit/view modal in future
        return (
            <Button variant="outline" size="sm" title="View Fuel Record Details (Not Implemented)" disabled><Eye className="mr-1 h-4 w-4" /> View</Button>
        );
    }
    return null;
  };

  let columnsToUse: ColumnDef<any>[] = [];
  let listTitle = '';
  let showApproverFilter = false;
  let showRequestorFilter = true;
  let showSiteFilter = true;
  let showTagFilter = false;
  let showDriverFilter = false;
  let showUploadCsv = false;
  let csvTemplateLink = '';


  if (documentType === 'po') {
    columnsToUse = poColumns as ColumnDef<any>[];
    listTitle = 'Purchase Orders';
    showApproverFilter = true;
    // showUploadCsv = true; // PO Header upload can be complex, usually items are separate
    // csvTemplateLink = '/templates/purchase_orders_template.csv'; 
  } else if (documentType === 'quote') {
    columnsToUse = quoteColumns as ColumnDef<any>[];
    listTitle = 'Client Quotations';
    showSiteFilter = false; // Quotes are client-based, not site-based for Jachris
    showRequestorFilter = false; // Quotes might have a creatorEmail, not a standard requestor user
    showUploadCsv = true;
    csvTemplateLink = '/templates/quotes_template.csv';
  } else if (documentType === 'requisition') {
    columnsToUse = requisitionColumns as ColumnDef<any>[];
    listTitle = 'Purchase Requisitions';
    // Requisitions are internal, might not need approver filter here directly, but requestor and site are key
  } else if (documentType === 'fuel') {
    columnsToUse = fuelRecordColumns as ColumnDef<any>[];
    listTitle = 'Fuel Records';
    showRequestorFilter = false; // Fuel records have a recorder, not a requestor in the same sense
    showTagFilter = true;
    showDriverFilter = true;
    // showUploadCsv = true; // CSV upload for fuel records can be enabled
    // csvTemplateLink = '/templates/fuel_records_template.csv';
  } else {
     // Default or GRN (which is not a primary list view yet)
     columnsToUse = [{ accessorKey: 'name', header: 'Name (Placeholder)' }];
     listTitle = `${documentType.toUpperCase()}s`;
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
          showApproverFilter={showApproverFilter}
          showRequestorFilter={showRequestorFilter}
          showSiteFilter={showSiteFilter}
          showTagFilter={showTagFilter}
          showDriverFilter={showDriverFilter}
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
          {/* Excel download can be re-enabled when reporting is more mature */}
          {/* <Button onClick={handleDownloadExcel} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download to Excel
          </Button> */}
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
    </Card>
  );
}
    