
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';
import { mockTagsData, mockSitesData } from '@/lib/mock-data';
import type { Tag } from '@/types';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data and denormalizing siteName
    const enrichedTags = mockTagsData.map(tag => {
      const site = mockSitesData.find(s => s.id === tag.siteId);
      return { ...tag, siteName: site?.name || `Site ID: ${tag.siteId}` };
    });
    setTags(enrichedTags);
  }, []);

  const handleAddNew = () => {
    toast({
      title: 'Add New Tag',
      description: 'This functionality is not yet implemented.',
    });
  };

  const handleEdit = (tag: Tag) => {
    toast({
      title: 'Edit Tag',
      description: `Editing tag "${tag.tagNumber}" is not yet implemented.`,
    });
  };

  const handleDelete = (tag: Tag) => {
    toast({
      title: 'Delete Tag',
      description: `Deleting tag "${tag.tagNumber}" is not yet implemented.`,
      variant: 'destructive',
    });
  };

  const columns: ColumnDef<Tag>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'tagNumber', header: 'Tag Number' },
    { accessorKey: 'registration', header: 'Registration' },
    { accessorKey: 'make', header: 'Make' },
    { accessorKey: 'model', header: 'Model' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'tankCapacity', header: 'Tank Cap. (L)' },
    { accessorKey: 'year', header: 'Year' },
    { accessorKey: 'chassisNo', header: 'Chassis No.' },
    { accessorKey: 'siteName', header: 'Site' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Manage Tags (Vehicles/Equipment)</CardTitle>
            <CardDescription>View, add, edit, or delete tagged vehicles and equipment.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Tag
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={tags}
            renderRowActions={(tag) => (
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(tag)} title="Edit Tag">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(tag)} title="Delete Tag">
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

    