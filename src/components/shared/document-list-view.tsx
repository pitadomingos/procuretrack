
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { Button } from '@/components/ui/button';
import { Download, ListFilter, Eye } from 'lucide-react';
import { mockPurchaseOrders } from '@/lib/mock-data';
import type { PurchaseOrderPayload } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface DocumentListViewProps {
  documentType: 'po' | 'grn' | 'quote' | 'requisition' | 'fuel';
}

const poColumns: ColumnDef<PurchaseOrderPayload>[] = [
  { accessorKey: 'poNumber', header: 'PO Number' },
  {
    accessorKey: 'creationDate',
    header: 'Date',
    cell: (item) => new Date(item.creationDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
  },
  {
    accessorKey: 'supplierDetails.supplierName',
    header: 'Supplier',
    cell: (item) => item.supplierDetails?.supplierName || 'N/A'
  },
  {
    accessorKey: 'grandTotal',
    header: 'Total',
    cell: (item) => `${item.currency} ${item.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'requestedByName', header: 'Requestor' },
  { accessorKey: 'approverName', header: 'Approver' },
];


export function DocumentListView({ documentType }: DocumentListViewProps) {
  const [documents, setDocuments] = useState<PurchaseOrderPayload[]>([]); // Typed to PurchaseOrderPayload for POs
  const [filteredDocuments, setFilteredDocuments] = useState<PurchaseOrderPayload[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const { toast } = useToast();

  const fetchAndSetDocuments = useCallback(() => {
    // Simulate fetching data based on documentType
    if (documentType === 'po') {
      // Using mockPurchaseOrders directly as they now include approverName and supplierDetails
      setDocuments(mockPurchaseOrders);
      setFilteredDocuments(mockPurchaseOrders);
      setColumns(poColumns);
    } else {
      // Placeholder for other document types
      setDocuments([]);
      setFilteredDocuments([]);
      setColumns([{ accessorKey: 'name', header: 'Name (Placeholder)' }]);
      toast({
        title: "List View Not Implemented",
        description: `The list view for ${documentType.toUpperCase()}s is not yet available.`,
        variant: "default"
      });
    }
  }, [documentType, toast]);

  useEffect(() => {
    fetchAndSetDocuments();
  }, [fetchAndSetDocuments]);

  const handleFilterApply = (filters: any) => {
    console.log(`Applying filters to ${documentType} list:`, filters);
    let tempFiltered = [...documents];

    if (filters.month && filters.month !== 'all') {
      tempFiltered = tempFiltered.filter(doc => (new Date(doc.creationDate).getMonth() + 1).toString().padStart(2, '0') === filters.month);
    }
    if (filters.year && filters.year !== 'all') {
      tempFiltered = tempFiltered.filter(doc => new Date(doc.creationDate).getFullYear().toString() === filters.year);
    }
    if (filters.site && filters.site !== 'all') {
      // Assuming doc.siteId exists and needs to match. This needs alignment with how site filter values are structured.
      // For now, mockSiteData has values like 'site_a', 'site_b'. If doc.siteId is numeric, this won't work directly.
      // tempFiltered = tempFiltered.filter(doc => doc.site?.value === filters.site); // Example if site was an object
      console.warn("Site filtering logic needs to be aligned with actual data structure for POs.");
    }
    if (filters.approver && filters.approver !== 'all') {
       tempFiltered = tempFiltered.filter(doc => doc.approverId === filters.approver);
    }
    if (filters.requestor && filters.requestor !== 'all') {
      // Assuming requestedByName for POs. If requestor filter value is an ID, this needs adjustment.
      tempFiltered = tempFiltered.filter(doc => {
        // This is a simple string match; for IDs, it would be doc.creatorUserId === filters.requestor
        return doc.requestedByName?.toLowerCase().includes(filters.requestor.toLowerCase()) || doc.creatorUserId === filters.requestor;
      });
    }
    setFilteredDocuments(tempFiltered);
  };

  const handleDownloadExcel = () => {
    toast({
        title: "Feature Not Implemented",
        description: `Download to Excel for ${documentType} list is not yet available.`,
        variant: "default"
      });
  };
  
  const renderPOActions = (po: PurchaseOrderPayload) => (
    <Link href={`/purchase-orders/${po.id}/print`} passHref legacyBehavior={false}>
      <Button variant="outline" size="sm" title="View PO Details">
        <Eye className="mr-1 h-4 w-4" /> View
      </Button>
    </Link>
  );


  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="font-headline text-xl capitalize">List of Purchase Orders</CardTitle>
        <CardDescription>View, filter, and manage existing purchase order documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <FilterBar
          onFilterApply={handleFilterApply}
          showApproverFilter={documentType === 'po'}
          showRequestorFilter={documentType === 'po'}
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={handleDownloadExcel} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download to Excel
          </Button>
        </div>
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredDocuments}
            renderRowActions={documentType === 'po' ? renderPOActions : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
}
