
'use client';

import { FilterBar } from '@/components/shared/filter-bar';
import { SpendByVendorChart } from '@/components/analytics/spend-by-vendor-chart';
import { POCountByCategoryChart } from '@/components/analytics/po-count-by-category-chart';
import { spendByVendorData, poCountByCategoryData } from '@/lib/mock-data';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Truck, FileText as QuoteIcon, ClipboardList as RequisitionIcon, Fuel as FuelIcon } from 'lucide-react';

export default function AnalyticsPage() {
  const [filteredSpendData, setFilteredSpendData] = useState(spendByVendorData);
  const [filteredCategoryData, setFilteredCategoryData] = useState(poCountByCategoryData);

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to Analytics:', filters);
    // In a real app, you would fetch new data based on these filters
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
              <CardTitle className="font-headline text-xl">GRN & Receiving Analytics</CardTitle>
              <Truck className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Gain insights into supplier delivery performance, item receipt accuracy, and receiving cycle times.
              </CardDescription>
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground mb-3">Potential analytics to develop:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 text-left inline-block text-sm">
                  <li>Average delivery lead time per supplier/item category.</li>
                  <li>Discrepancy rates (quantity ordered vs. received).</li>
                  <li>Value of goods received over time (daily, weekly, monthly).</li>
                  <li>Partial vs. complete delivery analysis.</li>
                  <li>Top suppliers by on-time delivery performance.</li>
                  <li>GRN processing time (from receipt to system update).</li>
                </ul>
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
              <CardDescription className="mb-4">
                Track quotation performance, conversion funnels, and revenue opportunities from client engagements.
              </CardDescription>
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
                 <p className="text-muted-foreground mb-3">Potential analytics to develop:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 text-left inline-block text-sm">
                  <li>Quote conversion rate (approved/won vs. total quoted).</li>
                  <li>Average quote value by client segment or period.</li>
                  <li>Sales pipeline value (sum of pending/approved quotes).</li>
                  <li>Time-to-decision for quotes (from submission to client response).</li>
                  <li>Quote win/loss analysis by value, product/service, or reason.</li>
                  <li>Revenue forecasting based on quote status and probability.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requisition-analytics">
          <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-xl">Purchase Requisition Insights</CardTitle>
              <RequisitionIcon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Analyze internal demand, requisition lifecycle efficiency, and departmental spending patterns.
              </CardDescription>
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground mb-3">Potential analytics to develop:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 text-left inline-block text-sm">
                  <li>Average requisition processing time (submission to PO creation).</li>
                  <li>Spend per department/site based on approved requisitions.</li>
                  <li>Requisition to PO conversion rate and reasons for non-conversion.</li>
                  <li>Frequency of requisitions by item category or specific items.</li>
                  <li>Analysis of urgent vs. standard requisitions.</li>
                  <li>Budget vs. actual spend tracking initiated from requisitions.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fuel-analytics">
          <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-xl">Fuel Usage & Efficiency</CardTitle>
              <FuelIcon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Monitor fuel consumption, costs, and identify opportunities for operational efficiency and savings.
              </CardDescription>
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground mb-3">Potential analytics to develop:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 text-left inline-block text-sm">
                  <li>Fuel consumption per vehicle/equipment (e.g., Liters/100km, Liters/hour).</li>
                  <li>Total fuel cost per vehicle/equipment over time.</li>
                  <li>Average fuel price trends from supplier invoices.</li>
                  <li>Odometer readings vs. fuel consumption for efficiency anomaly detection.</li>
                  <li>Fuel usage breakdown by site or project.</li>
                  <li>Alerts for unusual consumption patterns.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
