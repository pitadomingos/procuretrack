
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { POForm } from '@/components/purchase-orders/po-form';
import { GRNInterface } from '@/components/receiving/grn-interface';
import { QuoteForm } from '@/components/quotes/quote-form';
import { DocumentListView } from '@/components/shared/document-list-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function CreateDocumentContent() {
  const searchParams = useSearchParams();
  const poIdToEditFromUrl = searchParams.get('editPoId');
  
  // If editing a PO, default to the "Create PO" main tab,
  // which internally will handle the edit mode in POForm.
  // The nested tabs for "List POs" won't be automatically selected.
  const defaultMainTab = "create-po";
  const defaultPOTab = poIdToEditFromUrl ? "create-po-form" : "create-po-form";


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
        {/* Future: Implement nested tabs for GRN create/list */}
        <GRNInterface />
         {/* <Tabs defaultValue="create-grn-form" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 mb-4">
            <TabsTrigger value="create-grn-form">Create New GRN</TabsTrigger>
            <TabsTrigger value="list-grns">List of GRNs</TabsTrigger>
          </TabsList>
          <TabsContent value="create-grn-form">
             <GRNInterface />
          </TabsContent>
          <TabsContent value="list-grns">
            <DocumentListView documentType="grn" />
          </TabsContent>
        </Tabs> */}
      </TabsContent>

      <TabsContent value="create-quote">
        {/* Future: Implement nested tabs for Quote create/list */}
        <QuoteForm />
      </TabsContent>
      
      <TabsContent value="create-requisition">
        {/* Future: Implement nested tabs for Requisition create/list */}
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
        {/* Future: Implement nested tabs for Fuel Record create/list */}
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

export default function CreateDocumentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading...</div>}>
      <CreateDocumentContent />
    </Suspense>
  );
}
