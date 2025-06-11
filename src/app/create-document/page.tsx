
'use client';

import { POForm } from '@/components/purchase-orders/po-form';
import { GRNInterface } from '@/components/receiving/grn-interface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CreateDocumentPage() {
  return (
    <Tabs defaultValue="create-po" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <TabsTrigger value="create-po">Create PO</TabsTrigger>
        <TabsTrigger value="create-grn">Create GRN</TabsTrigger>
        <TabsTrigger value="create-quote">Create Quote</TabsTrigger>
        <TabsTrigger value="create-requisition">Create Requisition</TabsTrigger>
        <TabsTrigger value="record-fuel">Record Fuel</TabsTrigger>
      </TabsList>

      <TabsContent value="create-po">
        <POForm />
      </TabsContent>

      <TabsContent value="create-grn">
        {/* GRNInterface is already wrapped in a Card, so no extra Card needed here if GRNInterface handles its own layout well */}
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
              This section will allow you to create, send, and track quotations for services or products your company offers to its clients. 
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
