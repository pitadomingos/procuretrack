
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import type { PurchaseOrderPayload, POItemPayload, Supplier, Site, Category, POItemForPrint } from '@/types';
import { ArrowLeft, Printer, Download, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Interface for the fully resolved data passed to PrintablePO
interface FullPODataForPrint extends Omit<PurchaseOrderPayload, 'items'> {
  items: POItemForPrint[];
  supplierDetails?: Supplier;
  // Add resolved names if needed, e.g., approverName
}

export default function PrintPOPage() {
  const router = useRouter();
  const params = useParams();
  const poId = params.id as string;
  const { toast } = useToast();

  const [poData, setPoData] = useState<FullPODataForPrint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!poId) return;

    const fetchPODataForPrint = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all necessary data in parallel
        const [poHeaderRes, poItemsRes, suppliersRes, sitesRes, categoriesRes, approversRes] = await Promise.all([
          fetch(`/api/purchase-orders/${poId}`),
          fetch(`/api/purchase-orders/${poId}/items`),
          fetch('/api/suppliers'),
          fetch('/api/sites'),
          fetch('/api/categories'),
          fetch('/api/approvers'), // Fetch approvers to potentially resolve approver name
        ]);

        if (!poHeaderRes.ok) throw new Error(`Failed to fetch PO Header: ${poHeaderRes.statusText}`);
        const headerData: PurchaseOrderPayload = await poHeaderRes.json();

        if (!poItemsRes.ok) throw new Error(`Failed to fetch PO Items: ${poItemsRes.statusText}`);
        const itemsDataRaw: POItemPayload[] = await poItemsRes.json();
        
        const allSuppliers: Supplier[] = suppliersRes.ok ? await suppliersRes.json() : [];
        const allSites: Site[] = sitesRes.ok ? await sitesRes.json() : [];
        const allCategories: Category[] = categoriesRes.ok ? await categoriesRes.json() : [];
        const allApprovers: Approver[] = approversRes.ok ? await approversRes.json() : [];

        const supplierDetails = allSuppliers.find(s => s.supplierCode === headerData.supplierId);
        const approverDetails = allApprovers.find(a => a.id === headerData.approverId);

        const itemsForPrint: POItemForPrint[] = itemsDataRaw.map(item => {
          const site = allSites.find(s => s.id === item.siteId);
          const category = allCategories.find(c => c.id === item.categoryId);
          return {
            ...item,
            siteDisplay: site?.siteCode || site?.name || (item.siteId ? `Site ID ${item.siteId}` : 'N/A'),
            categoryDisplay: category?.category || (item.categoryId ? `Category ID ${item.categoryId}` : 'N/A'),
          };
        });
        
        setPoData({
          ...headerData,
          items: itemsForPrint,
          supplierDetails: supplierDetails,
          approverName: approverDetails?.name, // Add resolved approver name
          // Ensure poNumber and status are present, possibly falling back
          poNumber: headerData.poNumber || `PO-${poId}`,
          status: headerData.status || 'Pending Approval',
          // quoteNo might come from headerData if added to DB, or manually set if not
          // For template matching, if not in DB, you might need a way to input/store it
        });

      } catch (err: any) {
        console.error('Error fetching PO data for printing:', err);
        setError(err.message || 'Failed to load purchase order data.');
        toast({ title: "Error", description: `Failed to load PO data: ${err.message}`, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchPODataForPrint();
  }, [poId, toast]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!poData) return;
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/purchase-orders/${poId}/generate-pdf`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'PDF generation failed. Server returned an unreadable error.' }));
        throw new Error(errorData.message || `PDF generation failed: ${response.statusText}`);
      }
      const result = await response.json();
       toast({
        title: 'PDF Generation (Placeholder)',
        description: result.message || 'PDF generation initiated. Actual PDF download is not yet implemented.',
      });
    } catch (err: any) {
      console.error('Error downloading PDF:', err);
      toast({
        title: 'Error Downloading PDF',
        description: err.message || 'Could not download the PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Purchase Order for printing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-destructive p-4">
        <p className="font-semibold">Error loading Purchase Order:</p>
        <p className="text-sm mb-4 text-center">{error}</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  if (!poData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p>Purchase Order not found.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-2 print:bg-white print:py-0">
      <div className="container mx-auto max-w-4xl print:max-w-full print:p-0">
        <Card className="mb-6 print:hidden shadow-lg">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">Print/Download PO: {poData.poNumber}</h1>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <Button onClick={() => router.back()} variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Close
              </Button>
              <Button onClick={handlePrint} size="sm">
                <Printer className="mr-2 h-4 w-4" /> Print PO
              </Button>
              <Button onClick={handleDownloadPdf} disabled={isDownloading} size="sm">
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-white p-2 sm:p-4 print:p-0">
         <PrintablePO poData={poData} />
        </div>
      </div>
    </div>
  );
}
