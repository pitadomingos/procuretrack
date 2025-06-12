
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import type { PurchaseOrderPayload, POItemPayload, Supplier } from '@/types'; // Assuming these types can represent fetched data
import { ArrowLeft, Printer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Mock data structure - replace with actual fetching
interface FullPOData extends PurchaseOrderPayload {
  supplierDetails?: Supplier;
  // Add any other resolved data like approverName, creatorName if needed
}

export default function PrintPOPage() {
  const router = useRouter();
  const params = useParams();
  const poId = params.id as string;

  const [poData, setPoData] = useState<FullPOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poId) return;

    const fetchPOData = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- Simplified fetching ---
        // In a real scenario, you'd fetch PO header, items, supplier, approver, etc.
        const poHeaderRes = await fetch(`/api/purchase-orders/${poId}`);
        if (!poHeaderRes.ok) throw new Error(`Failed to fetch PO Header: ${poHeaderRes.statusText}`);
        const headerData: PurchaseOrderPayload = await poHeaderRes.json();

        const poItemsRes = await fetch(`/api/purchase-orders/${poId}/items`);
        if (!poItemsRes.ok) throw new Error(`Failed to fetch PO Items: ${poItemsRes.statusText}`);
        const itemsData: POItemPayload[] = await poItemsRes.json();
        
        let supplierDetails: Supplier | undefined = undefined;
        if (headerData.supplierId) {
          const suppliersRes = await fetch('/api/suppliers'); // Fetch all and filter, or use a specific endpoint
          if (suppliersRes.ok) {
            const allSuppliers: Supplier[] = await suppliersRes.json();
            supplierDetails = allSuppliers.find(s => s.supplierCode === headerData.supplierId);
          } else {
            console.warn("Could not fetch supplier details");
          }
        }
        
        // For now, categoryId and siteId on items are just IDs.
        // A real implementation might resolve these to names.

        setPoData({
          ...headerData,
          items: itemsData,
          supplierDetails: supplierDetails,
          // Mocking some fields that might not be in the basic payload
          poNumber: headerData.poNumber || `PO-${poId}`,
          status: headerData.status || 'Pending Approval',
          // requestedByName: headerData.requestedByName || 'N/A',
          // approverId is an ID, you might fetch approver name separately
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
          <CardContent className="p-6 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Print Purchase Order: {poData.poNumber}</h1>
            <div className="flex gap-2">
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Close
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print PO
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <PrintablePO poData={poData} />
      </div>
    </div>
  );
}
