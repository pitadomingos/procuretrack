
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import type { PurchaseOrderPayload, POItemPayload, Supplier } from '@/types'; 
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';


interface FullPOData extends PurchaseOrderPayload {
  supplierDetails?: Supplier;
  // Add any other resolved data like approverName, creatorName if needed
}

export default function PrintPOPage() {
  const router = useRouter();
  const params = useParams();
  const poId = params.id as string;
  const { toast } = useToast();

  const [poData, setPoData] = useState<FullPOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!poId) return;

    const fetchPOData = async () => {
      setLoading(true);
      setError(null);
      try {
        const poHeaderRes = await fetch(`/api/purchase-orders/${poId}`);
        if (!poHeaderRes.ok) throw new Error(`Failed to fetch PO Header: ${poHeaderRes.statusText}`);
        const headerData: PurchaseOrderPayload = await poHeaderRes.json();

        const poItemsRes = await fetch(`/api/purchase-orders/${poId}/items`);
        if (!poItemsRes.ok) throw new Error(`Failed to fetch PO Items: ${poItemsRes.statusText}`);
        const itemsData: POItemPayload[] = await poItemsRes.json();
        
        let supplierDetails: Supplier | undefined = undefined;
        if (headerData.supplierId) {
          const suppliersRes = await fetch('/api/suppliers'); 
          if (suppliersRes.ok) {
            const allSuppliers: Supplier[] = await suppliersRes.json();
            supplierDetails = allSuppliers.find(s => s.supplierCode === headerData.supplierId);
          } else {
            console.warn("Could not fetch supplier details");
          }
        }
        
        setPoData({
          ...headerData,
          items: itemsData,
          supplierDetails: supplierDetails,
          poNumber: headerData.poNumber || `PO-${poId}`,
          status: headerData.status || 'Pending Approval',
        });

      } catch (err: any) {
        console.error('Error fetching PO data for printing:', err);
        setError(err.message || 'Failed to load purchase order data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPOData();
  }, [poId]);

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

      // If the API route directly returns the PDF blob:
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `PO-${poData.poNumber}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      // window.URL.revokeObjectURL(url);
      // toast({ title: 'Success', description: 'PDF downloaded successfully.' });

      // For now, the API returns JSON, so we'll just show a message from it
      const result = await response.json();
       toast({
        title: 'PDF Generation (Placeholder)',
        description: result.message || 'PDF generation initiated.',
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
      <div className="flex justify-center items-center h-screen">
        <p>Loading Purchase Order for printing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600">
        <p>Error: {error}</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
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
    <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="container mx-auto max-w-4xl">
        <Card className="mb-6 print:hidden shadow-lg">
          <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-xl font-semibold text-center sm:text-left">Print/Download PO: {poData.poNumber}</h1>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Close
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print PO
              </Button>
              <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                <Download className="mr-2 h-4 w-4" /> 
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <PrintablePO poData={poData} />
      </div>
    </div>
  );
}
