
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChartDataPoint } from '@/types';
import { Loader2, AlertTriangle, CircleDollarSign, Brain } from 'lucide-react'; // Added Brain
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface POValueDistributionChartProps {
  filters?: { month?: string; year?: string };
  refreshKey?: number; // Added refreshKey
}

export function POValueDistributionChart({ filters, refreshKey }: POValueDistributionChartProps) { // Added refreshKey
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchChartData = useCallback(async (currentFilters?: { month?: string; year?: string }) => {
    setIsLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();
    if (currentFilters?.month && currentFilters.month !== 'all') queryParams.append('month', currentFilters.month);
    if (currentFilters?.year && currentFilters.year !== 'all') queryParams.append('year', currentFilters.year);
    
    try {
      const response = await fetch(`/api/charts/po-value-distribution?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch PO value distribution data');
      }
      const fetchedData: ChartDataPoint[] = await response.json();
      setData(fetchedData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: 'Error Loading Chart Data',
        description: `Could not load PO value distribution: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchChartData(filters);
  }, [fetchChartData, filters, refreshKey]); // Added refreshKey to dependencies

  return (
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-headline text-xl">PO Value Distribution</CardTitle>
        <CircleDollarSign className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          Number of Purchase Orders in different value ranges (MZN).
        </CardDescription>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[300px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-[300px] text-destructive p-4 border border-destructive/50 bg-destructive/10 rounded-md">
            <AlertTriangle className="h-10 w-10 mb-3" />
            <p className="font-semibold text-center mb-2">Error loading chart data:</p>
            <p className="text-sm text-center mb-4">{error}</p>
            <Button onClick={() => fetchChartData(filters)} variant="outline" size="sm" className="border-destructive text-destructive-foreground hover:bg-destructive/20">
              Try Again
            </Button>
          </div>
        ) : data.length === 0 || data.every(d => d.Count === 0) ? (
           <div className="flex flex-col justify-center items-center h-[300px]">
            <p className="text-muted-foreground">No PO data available for distribution in the selected period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={10} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} allowDecimals={false} label={{ value: 'Number of POs', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: 'hsl(var(--muted-foreground))' } }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--chart-3))' }} // Using chart-3 color
                formatter={(value: number) => [value, 'PO Count']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Count" name="POs in Bucket" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
         <Card className="mt-4 text-left text-xs bg-background/50">
            <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
            <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`Generate a histogram of PO grand total values for the current fiscal year, grouped into these buckets: 0-500, 501-2000, 2001-10000, 10001-50000, 50001+. What percentage of POs fall into each bucket?`}</code></CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
