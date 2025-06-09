
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookUser } from "lucide-react";

export default function UserManualPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BookUser className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">ProcureTrack User Manual</CardTitle>
              <CardDescription>
                A comprehensive guide to using the ProcureTrack application.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to the ProcureTrack User Manual. This document will guide you through understanding and utilizing all the features of the ProcureTrack application to manage your procurement processes efficiently.
              Content will be updated progressively as new features are developed and existing ones are refined.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Getting Started</h2>
            <p className="text-muted-foreground">
              (Details about account creation, login procedures, and initial setup will be added here once user authentication is implemented.)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Dashboard Overview</h2>
            <p className="text-muted-foreground">
              The dashboard provides a quick overview of key procurement metrics, recent activities, and important alerts.
              (Detailed explanation of dashboard widgets and their functionalities will be added here.)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Creating Documents</h2>
            <div className="ml-4 space-y-2">
              <h3 className="text-lg font-medium">4.1 Purchase Orders (PO)</h3>
              <p className="text-muted-foreground">(Step-by-step guide on how to create, submit, and manage Purchase Orders.)</p>
              <h3 className="text-lg font-medium">4.2 Goods Received Notes (GRN)</h3>
              <p className="text-muted-foreground">(Instructions on how to receive items against a Purchase Order and generate GRNs.)</p>
              <h3 className="text-lg font-medium">4.3 Quotations (Future)</h3>
              <p className="text-muted-foreground">(This section will cover creating and managing supplier quotations.)</p>
              <h3 className="text-lg font-medium">4.4 Fuel Records (Future)</h3>
              <p className="text-muted-foreground">(This section will detail how to record and track fuel consumption.)</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Management Section</h2>
            <p className="text-muted-foreground">
              The management section allows administrators to configure and maintain core data entities.
              (Details on managing Approvers, Users, Sites, Allocations, and Categories.)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Analytics</h2>
            <p className="text-muted-foreground">
              Visualize your procurement data with various charts and graphs.
              (Explanation of available analytics, how to interpret charts, and filter data.)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Reports (Future)</h2>
            <p className="text-muted-foreground">
              Generate detailed reports for in-depth analysis and record-keeping.
              (List of available reports and how to generate them.)
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">8. Activity Log</h2>
            <p className="text-muted-foreground">
             Track all system and user activities for auditing and monitoring purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Troubleshooting / FAQ</h2>
            <p className="text-muted-foreground">
              (Common issues and their solutions, frequently asked questions.)
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
