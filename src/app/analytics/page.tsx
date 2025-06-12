
'use client';

import { FilterBar } from '@/components/shared/filter-bar';
import { SpendByVendorChart } from '@/components/analytics/spend-by-vendor-chart';
import { POCountByCategoryChart } from '@/components/analytics/po-count-by-category-chart';
import { spendByVendorData, poCountByCategoryData } from '@/lib/mock-data';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Truck, FileText as QuoteIcon, ClipboardList as RequisitionIcon, Fuel as FuelIcon } from 'lucide-react'; // Renamed icons for clarity

export default function AnalyticsPage() {
  const [filteredSpendData, setFilteredSpendData] = useState(spendByVendorData);
  const [filteredCategoryData, setFilteredCategoryData] = useState(poCountByCategoryData);

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to Analytics:', filters);
    // In a real app, you would fetch new data based on these filters
    // For now, resetting to mock data for PO charts as an example
    setFilteredSpendData(spendByVendorData);
    setFilteredCategoryData(poCountByCategoryData);
  };

  return (
    <div className="space-y-6">
      <FilterBar onFilterApply={handleFilterApply} />

      <Tabs defaultValue="po-analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
          <TabsTrigger value="po-analytics" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" /> PO Analytics
          </TabsTrigger>
          <TabsTrigger value="grn-analytics" className="flex items-center gap-2">
            <Truck className="h-4 w-4" /> GRN Analytics
          </TabsTrigger>
          <TabsTrigger value="quote-analytics" className="flex items-center gap-2">
            <QuoteIcon className="h-4 w-4" /> Client Quotes
          </TabsTrigger>
          <TabsTrigger value="requisition-analytics" className="flex items-center gap-2">
            <RequisitionIcon className="h-4 w-4" /> Requisitions
          </TabsTrigger>
          <TabsTrigger value="fuel-analytics" className="flex items-center gap-2">
            <FuelIcon className="h-4 w-4" /> Fuel Usage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="po-analytics">
          <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
            <SpendByVendorChart data={filteredSpendData} />
            <POCountByCategoryChart data={filteredCategoryData} />
          </section>
        </TabsContent>

        <TabsContent value="grn-analytics">
          <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-xl">GRN Analytics</CardTitle>
              <Truck className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Analysis of Goods Received Notes, supplier delivery performance, and discrepancies.</CardDescription>
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground">
                  Detailed GRN analytics, including receipt timelines, quantity matching, and quality control summaries.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quote-analytics">
          <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-xl">Client Quotation Analysis</CardTitle>
              <QuoteIcon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Insights into client quotations, conversion rates, and revenue projections.</CardDescription>
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground">
                  Charts and data related to your company's quotations to clients, win/loss rates, and quoted values.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requisition-analytics">
          <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-xl">Purchase Requisition Analysis</CardTitle>
              <RequisitionIcon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Analysis of internal purchase requisitions, processing times, and departmental spend.</CardDescription>
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground">
                  Visualizations of requisition volume, approval cycles, and conversion rates to POs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fuel-analytics">
          <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-xl">Fuel Usage Overview</CardTitle>
              <FuelIcon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Insights into fuel consumption patterns, costs, and efficiency.</CardDescription>
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground">
                  Visualizations of fuel usage, costs per vehicle/equipment, and efficiency metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
