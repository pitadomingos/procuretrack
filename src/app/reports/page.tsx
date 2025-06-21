'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterBar } from '@/components/shared/filter-bar';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Printer, FileText, ShoppingCart, ClipboardList, Package, Fuel } from 'lucide-react';
import type { PurchaseOrderPayload, FilterOption } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const poReportColumns: ColumnDef<PurchaseOrderPayload>[] = [
  { accessorKey: 'poNumber', header: 'PO Number' },
  {
    accessorKey: 'creationDate',
    header: 'Date',
    cell: (item) => format(new Date(item.creationDate), 'dd MMM yyyy'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'supplierName',
    header: 'Supplier',
    cell: (item) => item.supplierName || item.supplierId || 'N/A',
  },
  {
    accessorKey: 'grandTotal',
    header: 'Total',
    cell: (item) => `${item.currency} ${item.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    accessorKey: 'requestedByName',
    header: 'Requestor',
    cell: (item) => item.requestedByName || item.creatorName || 'N/A',
  },
  {
    accessorKey: 'approverName',
    header: 'Approver',
    cell: (item) => item.approverName || item.approverId || 'N/A',
  },
  {
    accessorKey: 'overallSiteName',
    header: 'Site',
    cell: (item) => item.overallSiteName || 'N/A'
  },
];

const poStatusOptions: FilterOption[] = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Pending Approval', label: 'Pending Approval' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Partially Received', label: 'Partially Received' },
];

function PurchaseOrderReport() {
  const [reportData, setReportData] = useState<PurchaseOrderPayload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [currentFilters, setCurrentFilters] = useState<any>({});


  const fetchReportData = useCallback(async (filters?: any) => {
    setIsLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();
    
    const effectiveFilters = filters && Object.keys(filters).length > 0 ? filters : currentFilters;

    if (effectiveFilters?.month && effectiveFilters.month !== 'all') queryParams.append('month', effectiveFilters.month);
    if (effectiveFilters?.year && effectiveFilters.year !== 'all') queryParams.append('year', effectiveFilters.year);
    if (effectiveFilters?.siteId && effectiveFilters.siteId !== 'all') queryParams.append('siteId', effectiveFilters.siteId);
    if (effectiveFilters?.approverId && effectiveFilters.approverId !== 'all') queryParams.append('approverId', effectiveFilters.approverId);
    if (effectiveFilters?.creatorUserId && effectiveFilters.creatorUserId !== 'all') queryParams.append('creatorUserId', effectiveFilters.creatorUserId);
    if (effectiveFilters?.status && effectiveFilters.status !== 'all') queryParams.append('status', effectiveFilters.status);

    try {
      const response = await fetch(`/api/purchase-orders?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch PO report data.`);
      }
      const data = await response.json();
      setReportData(data);
      if (data.length === 0) {
        toast({ title: 'No Results', description: 'No purchase orders found matching the selected criteria.' });
      }
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast, currentFilters]);

  const handleFilterApply = (filters: any) => {
    const apiFilters = {
        month: filters.month,
        year: filters.year,
        siteId: filters.site,
        approverId: filters.approver,
        creatorUserId: filters.requestor,
        status: filters.status,
    };
    setCurrentFilters(apiFilters);
    fetchReportData(apiFilters);
  };

  const handlePrint = () => {
    window.print();
  };
  
  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="print-hidden">
        <FilterBar 
          onFilterApply={handleFilterApply}
          showApproverFilter
          showRequestorFilter
          showSiteFilter
          showStatusFilter
          statusOptions={poStatusOptions}
        />
      </div>
      <div ref={reportContentRef} className="report-content">
        <div className="flex justify-between items-center mb-4">
          <div className="print-header">
            <h2 className="text-xl font-bold">Purchase Order Report</h2>
            <p className="text-sm text-muted-foreground">Generated on: {format(new Date(), 'dd MMM yyyy, HH:mm')}</p>
          </div>
          <Button onClick={handlePrint} variant="outline" className="print-hidden">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : error ? (
          <div className="text-destructive bg-destructive/10 p-4 rounded-md text-center">{error}</div>
        ) : (
          <DataTable columns={poReportColumns} data={reportData} />
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          .print-hidden { display: none !important; }
          .report-content { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; background-color: #ffffff !important; }
          .print-header { display: block !important; }
        }
        .print-header { display: none; }
      `}</style>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">System Reports</CardTitle>
              <CardDescription>Generate and view various system reports for insights and analysis.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="po-report" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print-hidden">
              <TabsTrigger value="po-report"><ShoppingCart className="mr-2"/>PO Report</TabsTrigger>
              <TabsTrigger value="requisition-report" disabled><ClipboardList className="mr-2"/>Requisitions (Soon)</TabsTrigger>
              <TabsTrigger value="quote-report" disabled><Package className="mr-2"/>Quotes (Soon)</TabsTrigger>
              <TabsTrigger value="fuel-report" disabled><Fuel className="mr-2"/>Fuel (Soon)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="po-report" className="mt-4">
              <PurchaseOrderReport />
            </TabsContent>
            
            <TabsContent value="requisition-report">
              <div className="text-center py-10 text-muted-foreground">Requisition reporting is coming soon.</div>
            </TabsContent>
            <TabsContent value="quote-report">
              <div className="text-center py-10 text-muted-foreground">Quote reporting is coming soon.</div>
            </TabsContent>
            <TabsContent value="fuel-report">
              <div className="text-center py-10 text-muted-foreground">Fuel reporting is coming soon.</div>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
