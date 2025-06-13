
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { POForm } from '@/components/purchase-orders/po-form';
import { GRNInterface } from '@/components/receiving/grn-interface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { PurchaseOrderPayload } from '@/types';

function CreateDocumentContent() {
  const searchParams = useSearchParams();
  const poIdToEdit = searchParams.get('editPoId');
  const [initialPOData, setInitialPOData] = useState<PurchaseOrderPayload | null>(null);
  const [loadingPO, setLoadingPO] = useState(false);
  const [errorPO, setErrorPO] = useState<string | null>(null);

  useEffect(() => {
    if (poIdToEdit) {
      setLoadingPO(true);
      setErrorPO(null);
      fetch(`/api/purchase-orders/${poIdToEdit}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch PO ${poIdToEdit} for editing. Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data: PurchaseOrderPayload) => {
          // Additional fetch for supplier details if not included
          if (data.supplierId && !data.supplierDetails) {
            return fetch(`/api/suppliers`) // Assuming GET /api/suppliers returns all, then find
              .then(supRes => supRes.json())
              .then(allSuppliers => {
                const supplier = allSuppliers.find((s: any) => s.supplierCode === data.supplierId);
                setInitialPOData({ ...data, supplierDetails: supplier });
              });
          } else {
            setInitialPOData(data);
          }
        })
        .catch(err => {
          console.error("Error fetching PO for edit:", err);
          setErrorPO(err.message || "Could not load PO data for editing.");
        })
        .finally(() => setLoadingPO(false));
    }
  }, [poIdToEdit]);

  if (poIdToEdit && loadingPO) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
        <p className="text-muted-foreground">Loading Purchase Order for editing...</p>
      </div>
    );
  }

  if (poIdToEdit && errorPO) {
    return (
      <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-md">
        <p className="text-destructive-foreground font-semibold">Error Loading PO</p>
        <p className="text-destructive-foreground/80 text-sm">{errorPO}</p>
      </div>
    );
  }
  
  const defaultTab = poIdToEdit ? "create-po" : "create-po";

  return (
    <Tabs defaultValue={defaultTab} className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <TabsTrigger value="create-po">
          {poIdToEdit ? 'Edit PO' : 'Create PO'}
        </TabsTrigger>
        <TabsTrigger value="create-grn">Create GRN</TabsTrigger>
        <TabsTrigger value="create-quote">Create Quote</TabsTrigger>
        <TabsTrigger value="create-requisition">Create Requisition</TabsTrigger>
        <TabsTrigger value="record-fuel">Record Fuel</TabsTrigger>
      </TabsList>

      <TabsContent value="create-po">
        <POForm poIdToEdit={poIdToEdit} initialData={initialPOData} />
      </TabsContent>

      <TabsContent value="create-grn">
        <GRNInterface />
      </TabsContent>

      <TabsContent value="create-quote">
        <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Create Quotation for Clients</CardTitle>
            <CardDescription>Generate and manage quotations for your clients.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will allow you to create, send, and track quotations for services or products Jachris Mining Services offers to its clients. 
              This is separate from managing quotations received from your suppliers. This feature is planned for a future update.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="create-requisition">
        <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Create Purchase Requisition</CardTitle>
            <CardDescription>Submit internal requests for goods or services to initiate the procurement process.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will allow users to submit internal purchase requisitions. 
              These requisitions can then be reviewed, used to obtain supplier quotations, and subsequently converted into Purchase Orders.
              This feature is planned for a future update.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="record-fuel">
        <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Record Fuel Consumption</CardTitle>
            <CardDescription>This functionality will be implemented in an upcoming version.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will allow you to record fuel dispensed, track vehicle mileage,
              and manage fuel inventory for your fleet or equipment.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Wrap with Suspense because useSearchParams() needs it
export default function CreateDocumentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading...</div>}>
      <CreateDocumentContent />
    </Suspense>
  );
}
