
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChartDataPoint } from '@/types';
import { Loader2, AlertTriangle, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FuelCostByTagChartProps {
  filters?: { month?: string; year?: string; siteId?: string; };
  refreshKey?: number;
}

export function FuelCostByTagChart({ filters, refreshKey }: FuelCostByTagChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchChartData = useCallback(async (currentFilters?: { month?: string; year?: string; siteId?: string; }) => {
    setIsLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();
    if (currentFilters?.month && currentFilters.month !== 'all') queryParams.append('month', currentFilters.month);
    if (currentFilters?.year && currentFilters.year !== 'all') queryParams.append('year', currentFilters.year);
    if (currentFilters?.siteId && currentFilters.siteId !== 'all') queryParams.append('siteId', currentFilters.siteId);
    
    try {
      const response = await fetch(`/api/charts/fuel-cost-by-tag?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch fuel cost data');
      }
      const fetchedData: ChartDataPoint[] = await response.json();
      setData(fetchedData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: 'Error Loading Chart Data',
        description: `Could not load fuel cost data: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchChartData(filters);
  }, [fetchChartData, filters, refreshKey]);

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return 'MZN 0';
    return value.toLocaleString('en-US', { style: 'currency', currency: 'MZN', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-headline text-xl">Total Fuel Cost per Tag/Site</CardTitle>
        <CircleDollarSign className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          Fuel expenditure for each vehicle/equipment over time.
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
        ) : data.length === 0 ? (
           <div className="flex flex-col justify-center items-center h-[300px]">
            <p className="text-muted-foreground">No fuel cost data found for the selected period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--foreground))" fontSize={10} tickFormatter={formatCurrency} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" fontSize={10} width={80} interval={0} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)'}}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--chart-4))' }}
                formatter={(value: number) => [formatCurrency(value), 'Total Cost']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="value" name="Total Cost" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
