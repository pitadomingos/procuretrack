
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { managementTables as initialManagementTablesConfig } from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import type { LucideIcon, TagStatus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface ManagementTableItem {
  name: string;
  href: string;
  icon: LucideIcon;
  count: number | string; 
  description: string;
  apiKey?: keyof ManagementStatsCounts; 
  statusSummary?: Record<TagStatus, number>; 
}

interface ManagementStatsCounts {
  suppliersCount: number;
  approversCount: number;
  usersCount: number;
  sitesCount: number;
  categoriesCount: number;
  tagsCount: number;
  tagStatusSummary?: Record<TagStatus, number>; // For specific tag status counts
  clientsCount: number;
}

export default function ManagementPage() {
  const [managementTables, setManagementTables] = useState<ManagementTableItem[]>(initialManagementTablesConfig.map(table => ({
    ...table,
    apiKey: table.apiKey as keyof ManagementStatsCounts | undefined 
  })));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchManagementStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/management-stats');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch management stats');
      }
      const data: ManagementStatsCounts = await response.json();
      
      setManagementTables(prevTables =>
        prevTables.map(table => {
          let newCount: number | string = table.count;
          let newStatusSummary: Record<TagStatus, number> | undefined = undefined;

          if (table.apiKey && data.hasOwnProperty(table.apiKey)) {
            newCount = data[table.apiKey];
          }

          if (table.name === 'Tags' && data.tagStatusSummary) {
            newStatusSummary = data.tagStatusSummary;
            newCount = data.tagsCount; // Ensure total count is also updated for Tags
          }
          
          if (table.name === 'Allocations') {
            return { ...table, description: "Manage cost allocations (Legacy - Use Sites for current locations). Count is mock." };
          }

          return { ...table, count: newCount, statusSummary: newStatusSummary };
        })
      );
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({ title: 'Error Loading Stats', description: `Could not load management counts: ${err.message}`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchManagementStats();
  }, [fetchManagementStats]);

  const renderStatusSummary = (summary: Record<string, number> | undefined) => {
    if (!summary || Object.keys(summary).length === 0) return null;
    return (
      <p className="text-xs text-muted-foreground pt-1">
        {Object.entries(summary)
          .map(([status, count]) => `${status}: ${count}`)
          .join(', ')}
      </p>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl">Table Management</CardTitle>
           <Button onClick={fetchManagementStats} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Counts'}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-3 text-lg text-muted-foreground">Loading entity counts...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-destructive-foreground bg-destructive/10 p-6 rounded-md">
                <AlertTriangle className="h-10 w-10 mb-3" />
                <p className="text-lg font-semibold">Error loading management stats:</p>
                <p className="text-md text-center mt-1 mb-4">{error}</p>
                <Button onClick={fetchManagementStats} variant="outline" className="border-destructive-foreground text-destructive-foreground hover:bg-destructive/20">
                    Retry
                </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {managementTables.map((table) => (
                <Card key={table.name} className="shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{table.name}</CardTitle>
                    <table.icon className="h-6 w-6 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-2xl font-bold">{table.count}</div>
                    <p className="text-xs text-muted-foreground pt-1">{table.description}</p>
                    {table.name === 'Tags' && table.statusSummary && renderStatusSummary(table.statusSummary as Record<string, number>)}
                  </CardContent>
                  <CardFooter>
                    {table.href ? (
                       <Link href={table.href} passHref legacyBehavior={false} className="w-full">
                         <Button variant="outline" size="sm" className="w-full">
                           Manage {table.name} <ArrowRight className="ml-2 h-4 w-4" />
                         </Button>
                       </Link>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Manage {table.name} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

