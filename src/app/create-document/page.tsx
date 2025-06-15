
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { POForm } from '@/components/purchase-orders/po-form';
import { GRNInterface } from '@/components/receiving/grn-interface';
import { QuoteForm } from '@/components/quotes/quote-form'; // Import QuoteForm
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function CreateDocumentContent() {
  const searchParams = useSearchParams();
  const poIdToEditFromUrl = searchParams.get('editPoId');
  
  const defaultTab = poIdToEditFromUrl ? "create-po" : "create-po";

  return (
    <Tabs defaultValue={defaultTab} className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <TabsTrigger value="create-po">
          {poIdToEditFromUrl ? 'Edit PO' : 'Create PO'}
        </TabsTrigger>
        <TabsTrigger value="create-grn">Create GRN</TabsTrigger>
        <TabsTrigger value="create-quote">Create Quote</TabsTrigger>
        <TabsTrigger value="create-requisition">Create Requisition</TabsTrigger>
        <TabsTrigger value="record-fuel">Record Fuel</TabsTrigger>
      </TabsList>

      <TabsContent value="create-po">
        <POForm poIdToEditProp={poIdToEditFromUrl} />
      </TabsContent>

      <TabsContent value="create-grn">
        <GRNInterface />
      </TabsContent>

      <TabsContent value="create-quote">
        <QuoteForm />
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

export default function CreateDocumentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> Loading...</div>}>
      <CreateDocumentContent />
    </Suspense>
  );
}
