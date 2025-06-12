
'use client';

import { FilterBar } from '@/components/shared/filter-bar';
import { SpendByVendorChart } from '@/components/analytics/spend-by-vendor-chart';
import { POCountByCategoryChart } from '@/components/analytics/po-count-by-category-chart';
import { spendByVendorData, poCountByCategoryData } from '@/lib/mock-data';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileSpreadsheet, ClipboardList, Fuel } from 'lucide-react'; // Changed BarChartHorizontalBig to ClipboardList

export default function AnalyticsPage() {
  const [filteredSpendData, setFilteredSpendData] = useState(spendByVendorData);
  const [filteredCategoryData, setFilteredCategoryData] = useState(poCountByCategoryData);

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to Analytics:', filters);
    setFilteredSpendData(spendByVendorData);
    setFilteredCategoryData(poCountByCategoryData);
  };

  return (
    <div className="space-y-6">
      <FilterBar onFilterApply={handleFilterApply} />

      <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
        <SpendByVendorChart data={filteredSpendData} />
        <POCountByCategoryChart data={filteredCategoryData} />
      </section>
      
      <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3"> {/* Changed to 3 columns for better layout */}
        <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-xl">Requisition Analysis</CardTitle> {/* New Card */}
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Analysis of internal purchase requisitions and trends.</CardDescription>
            <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
              <p className="text-muted-foreground">
                Charts and data related to requisition volume, processing times, and conversion to POs.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-xl">Quote Analysis</CardTitle>
            <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Detailed analysis of quotation conversion rates and trends.</CardDescription>
            <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
              <p className="text-muted-foreground">
                Charts and data related to quotation performance will be available here.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-xl">Fuel Usage Overview</CardTitle>
            <Fuel className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Insights into fuel consumption patterns and efficiency.</CardDescription>
            <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
              <p className="text-muted-foreground">
                Visualizations of fuel usage, costs, and vehicle performance metrics.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
