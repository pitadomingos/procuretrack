
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChartDataPoint } from '@/types';
import { Loader2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MaverickSpendChartProps {
  filters?: { month?: string; year?: string };
  refreshKey?: number;
}

const COLORS = ['hsl(var(--chart-3))', 'hsl(var(--chart-5))']; // Different colors for value and count

export function MaverickSpendChart({ filters, refreshKey }: MaverickSpendChartProps) {
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
      const response = await fetch(`/api/charts/maverick-spend?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch maverick spend data');
      }
      const fetchedData: ChartDataPoint[] = await response.json();
      setData(fetchedData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: 'Error Loading Chart Data',
        description: `Could not load maverick spend data: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchChartData(filters);
  }, [fetchChartData, filters, refreshKey]);

  const formatValue = (value: number, name: string) => {
    if (name.toLowerCase().includes('value')) {
      return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MZN`;
    }
    return value.toLocaleString();
  };

  return (
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-headline text-xl">Maverick Spend (Emergency POs)</CardTitle>
        <AlertOctagon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          Value and count of POs with 'emergency' in notes. Full analysis via AI prompt below.
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
        ) : data.length === 0 || data.every(d => d.value === 0) ? (
           <div className="flex flex-col justify-center items-center h-[300px]">
            <p className="text-muted-foreground">No emergency POs found for the selected period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--foreground))" fontSize={10} tickFormatter={(value) => value.toLocaleString()} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" fontSize={10} width={150} interval={0} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string, props: any) => [formatValue(value, props.payload.name), props.payload.name.includes('Value') ? 'Total Value' : 'Count']}
              />
              <Bar dataKey="value" name="Value/Count">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} radius={[0, 4, 4, 0]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <Card className="mt-4 text-left text-xs bg-background/50">
            <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
            <CardContent className="p-2"><code className="block whitespace-pre-wrap">Show all POs from last quarter with 'emergency' in their notes, OR not linked to a requisition. What's their total value and which suppliers are most common? Highlight any over $500.</code></CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
