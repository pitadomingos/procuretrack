
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
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
          <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
            <h3 className="text-xl font-semibold text-foreground mb-2">Coming Soon!</h3>
            <p className="text-muted-foreground">
              This section will provide access to a variety of detailed reports, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 text-left inline-block">
              <li>Purchase Order Status Reports</li>
              <li>Vendor Performance Analysis</li>
              <li>Spend by Category/Department</li>
              <li>GRN Summaries and Discrepancies</li>
              <li>Fuel Consumption Logs</li>
              <li>And more...</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Check back for future updates as we roll out these powerful reporting tools.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
