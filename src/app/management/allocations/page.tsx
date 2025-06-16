
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { mockAllocationsData } from '@/lib/mock-data';
import type { Allocation } from '@/types';
import { AlertTriangle } from 'lucide-react';


export default function ManageAllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    setAllocations(mockAllocationsData);
  }, []);

  const columns: ColumnDef<Allocation>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'description', header: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div>
            <CardTitle className="font-headline text-2xl">View Allocations (Legacy)</CardTitle>
            <CardDescription>
              This section displays legacy cost allocations/departments. This data is currently read-only from mock data.
              Please use the "Manage Sites" section for current site/location management.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 border-l-4 border-orange-500 bg-orange-50 text-orange-700 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Legacy Data</h4>
              <p className="text-sm">The "Allocations" entity is considered legacy. Full CRUD operations are not available. For managing operational locations, please use the "Manage Sites" feature.</p>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={allocations}
            // No renderRowActions as this is read-only
          />
        </CardContent>
      </Card>
    </div>
  );
}
