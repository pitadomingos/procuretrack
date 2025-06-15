
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2, AlertTriangle } from 'lucide-react';
import type { PurchaseOrderPayload, QuotePayload } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';

interface DocumentListViewProps {
  documentType: 'po' | 'grn' | 'quote' | 'requisition' | 'fuel';
}

type DocumentData = PurchaseOrderPayload | QuotePayload; // Add other types as needed

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


export function DocumentListView({ documentType }: DocumentListViewProps) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async (filters?: any) => {
    let apiUrl = '';
    const queryParams = new URLSearchParams();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentYear = new Date().getFullYear().toString();

    queryParams.append('month', filters?.month || currentMonth);
    queryParams.append('year', filters?.year || currentYear);

    if (documentType === 'po') {
      apiUrl = '/api/purchase-orders';
      if (filters?.siteId && filters.siteId !== 'all') queryParams.append('siteId', filters.siteId);
      if (filters?.approverId && filters.approverId !== 'all') queryParams.append('approverId', filters.approverId);
      if (filters?.creatorUserId && filters.creatorUserId !== 'all') queryParams.append('creatorUserId', filters.creatorUserId);
    } else if (documentType === 'quote') {
      apiUrl = '/api/quotes'; // Mocked API, doesn't use date filters yet
    } else {
      setDocuments([]);
      setError(`List view for ${documentType.toUpperCase()}s is not yet implemented.`);
      toast({
        title: "List View Not Implemented",
        description: `The list view for ${documentType.toUpperCase()}s is not yet available.`,
      });
      return;
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
      toast({
        title: `Error Fetching ${documentType.toUpperCase()}s`,
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [documentType, toast]);

  useEffect(() => {
    const defaultFilters = {
      month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      year: new Date().getFullYear().toString(),
      siteId: 'all',
      approverId: 'all',
      creatorUserId: 'all',
    };
    fetchDocuments(defaultFilters);
  }, [fetchDocuments]);

  const handleFilterApply = (filters: any) => {
    const apiFilters = {
        ...filters,
        creatorUserId: filters.requestor,
        approverId: filters.approver,
        siteId: filters.site,
    };
    delete apiFilters.requestor;
    delete apiFilters.approver; 
    delete apiFilters.site; 
    fetchDocuments(apiFilters);
  };

  const handleDownloadExcel = () => {
    toast({
        title: "Feature Not Implemented",
        description: `Download to Excel for ${documentType.toUpperCase()} list is not yet available.`,
    });
  };
  
  const renderRowActions = (doc: DocumentData) => {
    if (documentType === 'po' && doc.id) {
      return (
        <Link href={`/purchase-orders/${doc.id}/print`} passHref legacyBehavior={false}>
          <Button variant="outline" size="sm" title="View PO Details">
            <Eye className="mr-1 h-4 w-4" /> View
          </Button>
        </Link>
      );
    }
    if (documentType === 'quote' && doc.id) {
      return (
        <Link href={`/quotes/${doc.id}/print`} passHref legacyBehavior={false}>
          <Button variant="outline" size="sm" title="View Quote Details">
            <Eye className="mr-1 h-4 w-4" /> View
          </Button>
        </Link>
      );
    }
    return null;
  };

  const columnsToUse = documentType === 'po' ? poColumns : (documentType === 'quote' ? quoteColumns : [{ accessorKey: 'name', header: 'Name (Placeholder)' }]) as ColumnDef<DocumentData>[];
  const listTitle = documentType === 'po' ? 'Purchase Orders' : 
                    documentType === 'quote' ? 'Client Quotations' : 
                    documentType.toUpperCase() + 's';


  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="font-headline text-xl capitalize">List of {listTitle}</CardTitle>
        <CardDescription>View, filter, and manage existing {listTitle.toLowerCase()} documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <FilterBar
          onFilterApply={handleFilterApply}
          showApproverFilter={documentType === 'po'}
          showRequestorFilter={documentType === 'po'}
          showSiteFilter={documentType === 'po'}
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={handleDownloadExcel} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download to Excel
          </Button>
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
