
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { mockSitesData } from '@/lib/mock-data';
import type { Site } from '@/types';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setSites(mockSitesData);
  }, []);

  const handleAddNew = () => {
    toast({
      title: 'Add New Site',
      description: 'This functionality is not yet implemented.',
    });
  };

  const handleEdit = (site: Site) => {
    toast({
      title: 'Edit Site',
      description: `Editing site "${site.name}" is not yet implemented.`,
    });
  };

  const handleDelete = (site: Site) => {
    toast({
      title: 'Delete Site',
      description: `Deleting site "${site.name}" is not yet implemented.`,
      variant: 'destructive',
    });
  };

  const columns: ColumnDef<Site>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'siteCode', header: 'Site Code' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Sites</CardTitle>
            <CardDescription>View, add, edit, or delete company sites.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Site
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={sites}
            renderRowActions={(site) => (
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(site)} title="Edit Site">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(site)} title="Delete Site">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
