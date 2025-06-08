import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { managementTables } from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ManagementPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Table Management</CardTitle>
          <CardDescription>
            Manage various lookup tables and entities within the ProcureTrack system.
            Full table management functionality will be available in a future version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {managementTables.map((table) => (
              <Card key={table.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">{table.name}</CardTitle>
                  <table.icon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{table.count}</div>
                  <p className="text-xs text-muted-foreground pt-1">{table.description}</p>
                </CardContent>
                <CardFooter>
                   <Button variant="outline" size="sm" className="w-full" disabled>
                     Manage {table.name} <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Currently, these are display-only. CRUD operations for these tables are not implemented in the MVP.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
