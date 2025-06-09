
'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChartDataPoint } from '@/types';

interface SpendByVendorChartProps {
  data: ChartDataPoint[];
}

export function SpendByVendorChart({ data }: SpendByVendorChartProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline">Total Spend by Vendor</CardTitle>
        <CardDescription>Visual representation of total purchase order value per vendor.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--foreground))" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" fontSize={12} width={150} interval={0} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--chart-1))' }}
              formatter={(value: number) => [`${value.toLocaleString()} MZN`, 'Spend']}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="Spend" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
