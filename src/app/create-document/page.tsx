
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { POForm } from '@/components/purchase-orders/po-form';
import { GRNInterface } from '@/components/receiving/grn-interface';
import { QuoteForm } from '@/components/quotes/quote-form';
import { RequisitionForm } from '@/components/requisitions/requisition-form';
import { FuelRecordForm } from '@/components/fuel/fuel-record-form';
import { DocumentListView } from '@/components/shared/document-list-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function CreateDocumentContent() {
  const searchParams = useSearchParams();
  const poIdToEditFromUrl = searchParams.get('editPoId');
  const quoteIdToEditFromUrl = searchParams.get('editQuoteId');
  const requisitionIdToEditFromUrl = searchParams.get('editRequisitionId'); // New

  const determineDefaultMainTab = () => {
    if (poIdToEditFromUrl) return "create-po";
    if (quoteIdToEditFromUrl) return "create-quote";
    if (requisitionIdToEditFromUrl) return "create-requisition"; // New
    return "create-po";
  };

  const defaultMainTab = determineDefaultMainTab();
  const defaultPOTab = poIdToEditFromUrl ? "create-po-form" : "create-po-form";
  const defaultQuoteTab = quoteIdToEditFromUrl ? "create-quote-form" : "create-quote-form";
  const defaultRequisitionTab = requisitionIdToEditFromUrl ? "create-requisition-form" : "create-requisition-form"; // Updated
  const defaultFuelTab = "create-fuel-form";


  return (
    <Tabs defaultValue={defaultMainTab} className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <TabsTrigger value="create-po">Purchase Orders</TabsTrigger>
        <TabsTrigger value="create-grn">GRNs</TabsTrigger>
        <TabsTrigger value="create-quote">Client Quotes</TabsTrigger>
        <TabsTrigger value="create-requisition">Requisitions</TabsTrigger>
        <TabsTrigger value="record-fuel">Fuel Records</TabsTrigger>
      </TabsList>

      <TabsContent value="create-po">
        <Tabs defaultValue={defaultPOTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 mb-4">
            <TabsTrigger value="create-po-form">
              {poIdToEditFromUrl ? 'Edit PO' : 'Create New PO'}
            </TabsTrigger>
            <TabsTrigger value="list-pos">List of POs</TabsTrigger>
          </TabsList>
          <TabsContent value="create-po-form">
            <POForm poIdToEditProp={poIdToEditFromUrl} />
          </TabsContent>
          <TabsContent value="list-pos">
            <DocumentListView documentType="po" />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="create-grn">
        <GRNInterface />
      </TabsContent>

      <TabsContent value="create-quote">
        <Tabs defaultValue={defaultQuoteTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 mb-4">
            <TabsTrigger value="create-quote-form">
              {quoteIdToEditFromUrl ? 'Edit Quote' : 'Create New Quote'}
            </TabsTrigger>
            <TabsTrigger value="list-quotes">List of Quotes</TabsTrigger>
          </TabsList>
          <TabsContent value="create-quote-form">
            <QuoteForm quoteIdToEditProp={quoteIdToEditFromUrl} />
          </TabsContent>
          <TabsContent value="list-quotes">
            <DocumentListView documentType="quote" />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="create-requisition">
        <Tabs defaultValue={defaultRequisitionTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 mb-4">
            <TabsTrigger value="create-requisition-form">
              {requisitionIdToEditFromUrl ? 'Edit Requisition' : 'Create New Requisition'}
            </TabsTrigger>
            <TabsTrigger value="list-requisitions">List of Requisitions</TabsTrigger>
          </TabsList>
          <TabsContent value="create-requisition-form">
             <RequisitionForm requisitionIdToEditProp={requisitionIdToEditFromUrl} />
          </TabsContent>
          <TabsContent value="list-requisitions">
            <DocumentListView documentType="requisition" />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="record-fuel">
        <Tabs defaultValue={defaultFuelTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 mb-4">
            <TabsTrigger value="create-fuel-form">Record New Fuel Entry</TabsTrigger>
            <TabsTrigger value="list-fuel-records">List of Fuel Records</TabsTrigger>
          </TabsList>
          <TabsContent value="create-fuel-form">
             <FuelRecordForm />
          </TabsContent>
          <TabsContent value="list-fuel-records">
            <DocumentListView documentType="fuel" />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}

export default function CreateDocumentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading...</div>}>
      <CreateDocumentContent />
    </Suspense>
  );
}
