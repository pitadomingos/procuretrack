
'use client';

import { useEffect, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChartDataPoint } from '@/types';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const COLORS = [
  'hsl(var(--chart-5))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-1))',
  'hsl(var(--muted))',
];

interface QuotesByStatusChartProps {
  filters?: { month?: string; year?: string }; // Filters might be relevant later
}

export function QuotesByStatusChart({ filters }: QuotesByStatusChartProps) {
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
      const response = await fetch(`/api/charts/quotes-by-status?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch quote status data');
      }
      const fetchedData: ChartDataPoint[] = await response.json();
      setData(fetchedData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: 'Error Loading Chart Data',
        description: `Could not load quote status: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchChartData(filters);
  }, [fetchChartData, filters]);

  return (
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="font-headline">Client Quotes by Status</CardTitle>
        <CardDescription>Distribution of client quotations by their current status.</CardDescription>
      </CardHeader>
      <CardContent>
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
        ) : data.length === 0 ? (
           <div className="flex flex-col justify-center items-center h-[300px]">
            <p className="text-muted-foreground">No quote data available for the selected period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="hsl(var(--chart-1))"
                dataKey="Count"
                nameKey="name"
                label={({ name, percent, Count }) => `${name}: ${Count} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                formatter={(value: number, name: string) => [value, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
