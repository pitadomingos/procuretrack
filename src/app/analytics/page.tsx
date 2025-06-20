
'use client';

import { FilterBar } from '@/components/shared/filter-bar';
import { SpendByVendorChart } from '@/components/analytics/spend-by-vendor-chart';
import { POCountByCategoryChart } from '@/components/analytics/po-count-by-category-chart';
import { POCycleTimeChart } from '@/components/analytics/po-cycle-time-chart'; // New import
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Truck, FileText as QuoteIcon, ClipboardList as RequisitionIcon, Fuel as FuelIcon, Brain, LineChart, CircleDollarSign, AlertOctagon, Users, TrendingUp, BarChartHorizontalBig, PackageCheck, PackageX, Percent, Hourglass } from 'lucide-react';

export default function AnalyticsPage() {
  const [currentFilters, setCurrentFilters] = useState<{ month?: string; year?: string }>({
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    year: new Date().getFullYear().toString(),
  });
  const [refreshKey, setRefreshKey] = useState(0); // To force re-render charts on filter change

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to Analytics:', filters);
    setCurrentFilters({ month: filters.month, year: filters.year });
    setRefreshKey(prevKey => prevKey + 1); 
  };

  // Mock data, will be replaced by API calls or removed if charts fetch their own data
  const [filteredSpendData, setFilteredSpendData] = useState([]); // Placeholder for now
  const [filteredCategoryData, setFilteredCategoryData] = useState([]); // Placeholder for now

  return (
    <div className="space-y-6">
      <FilterBar 
        onFilterApply={handleFilterApply}
        showApproverFilter={false} // Example: Not showing certain filters by default for analytics page
        showRequestorFilter={false}
        showSiteFilter={true} // Example: Show site filter
      />

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
            {/* SpendByVendorChart and POCountByCategoryChart will need API integration or removal if mock data is not used */}
            <SpendByVendorChart key={`spend-vendor-${refreshKey}`} data={filteredSpendData} /> 
            <POCountByCategoryChart key={`po-cat-${refreshKey}`} data={filteredCategoryData} />
            
            <POCycleTimeChart key={`po-cycle-${refreshKey}`} filters={currentFilters} />

            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Maverick Spend Identification</CardTitle>
                <AlertOctagon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Identify POs not linked to requisitions or with 'emergency' justifications. (Chart: Bar chart of count/value)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Show all POs from last quarter with 'emergency' in their notes, or not linked to a requisition. What's their total value and which suppliers are most common? Highlight any over $500.</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">PO Value Distribution</CardTitle>
                <CircleDollarSign className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Distribution of Purchase Order values (e.g., number of POs in ranges $0-100, $101-500). (Chart: Histogram)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Generate a histogram of PO grand total values for the current fiscal year, grouped into these buckets: 0-500, 501-2000, 2001-10000, 10001+. What percentage of POs fall into each bucket?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">PO Status Trends Over Time</CardTitle>
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Trends of POs in different statuses (Draft, Pending, Approved, Completed) over months/quarters. (Chart: Stacked Area/Multi-line)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Implemented as Monthly PO Status Chart!</h3>
                  <p className="text-xs text-muted-foreground mb-2">This is covered by the "Monthly PO Status" chart on the main dashboard, showing 'Approved' and 'Pending Approval' trends.</p>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Show the trend of POs in 'Pending Approval' vs 'Approved' status over the last 6 months. Is there an increasing backlog of pending approvals? Correlate with any changes in the number of active approvers if possible.</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="grn-analytics">
           <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Supplier On-Time Delivery</CardTitle>
                <PackageCheck className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Percentage of PO items delivered on or before the promised/expected date by supplier. (Chart: Bar chart per supplier)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">For supplier [Supplier Name] over the last quarter, calculate their on-time delivery percentage based on [PO Item Expected Delivery Date] vs [GRN Item Receipt Date]. List top 3 suppliers by on-time delivery rate.</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Receipt Discrepancy Rate</CardTitle>
                <PackageX className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Percentage of items received with quantity mismatches (short/over) or quality issues. (Chart: Pie/Bar chart by discrepancy type)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze GRNs for item [Item SKU] from last month. What's the discrepancy rate (ordered vs. received quantity)? What are the most common reasons if items were rejected or partially received?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
             <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Average GRN Processing Time</CardTitle>
                <Hourglass className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Time from physical receipt of goods to system entry/update of the GRN. (Chart: Line chart trend by week/month)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">What's the average GRN processing time (physical receipt to system entry) for the receiving team at [Site Name] over the past month? Identify any GRNs that took significantly longer.</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Value of Goods Received Over Time</CardTitle>
                <BarChartHorizontalBig className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Trend of the total value of goods received and accepted (daily, weekly, monthly). (Chart: Line/Bar chart)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Plot the total value of goods successfully received and recorded in the system per week for the last two months. Are there any weeks with exceptionally high or low receipt values?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="quote-analytics">
          <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Quote Conversion Rate</CardTitle>
                <Percent className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Percentage of quotes approved/won vs. total quotes issued, by salesperson/client segment. (Chart: Grouped Bar chart)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">What is our overall quote conversion rate (status 'Approved' / total 'Sent' or 'Approved' or 'Rejected') for last month? Break this down by client [Client Name] and by creator [Creator Email].</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Average Quote Value Trend</CardTitle>
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Track average quote value (for 'Approved' or 'Sent' quotes) over time, filterable by product/service category. (Chart: Line chart)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Show the monthly trend of average quote value for quotes in 'Approved' status over the last 6 months. Is the average deal size increasing or decreasing?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Sales Pipeline Value</CardTitle>
                <CircleDollarSign className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Total value of quotes currently in 'Pending Approval' or 'Sent to Client' status. (Chart: Bar chart by status)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">What is the total value of our current sales pipeline (sum of 'Pending Approval' and 'Sent to Client' quotes)? Show breakdown by quote status.</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Quote Rejection Reasons</CardTitle>
                <AlertOctagon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Analysis of common reasons for 'Rejected' quotes (if rejection reasons are captured). (Chart: Pie/Bar chart for reasons)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">For all quotes marked 'Rejected' in the last year, what are the top 3 reasons for rejection? (Assuming rejection reason is stored in notes or a dedicated field)</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="requisition-analytics">
          <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Requisition Processing Time</CardTitle>
                <Hourglass className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Average time from requisition submission to approval, and from approval to PO creation. (Chart: Histogram/Box Plot)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Calculate the average cycle time for requisitions: 1. Submission to Approval. 2. Approval to PO Creation (if PO exists). Identify requisitions that took more than 7 days for approval.</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Spend by Site/Department (Requisitions)</CardTitle>
                <Users className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Track estimated spend from approved requisitions by originating site/department. (Chart: Bar chart/Treemap)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Show the total estimated value of approved requisitions for each site in the last month. Which site has the highest requested spend?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Requisition to PO Conversion Rate</CardTitle>
                <Percent className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Percentage of approved requisitions that resulted in a Purchase Order. (Chart: Percentage Gauge/Bar)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">What percentage of 'Approved' requisitions created last quarter were converted to a PO (status 'Closed')? What percentage were 'Cancelled' after approval?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Frequently Requested Items/Categories</CardTitle>
                <BarChartHorizontalBig className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Identify items or categories most commonly requested via requisitions. (Chart: Bar chart by count or value)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">List the top 10 most frequently requested item categories from requisitions this year. Are there any items that are frequently requested across multiple sites?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>
        
        <TabsContent value="fuel-analytics">
          <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Fuel Consumption Efficiency</CardTitle>
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Liters/100km for vehicles, Liters/hour for equipment (if hour meter data available). (Chart: Line chart per asset/Bar chart comparison)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">For vehicle [Tag Number], calculate its average fuel efficiency (L/100km) for the last month based on fuel records and odometer readings. Compare this to its average from the previous month.</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Total Fuel Cost per Tag/Site</CardTitle>
                <CircleDollarSign className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Track fuel expenditure for each vehicle/equipment or site over time. (Chart: Bar chart or line chart)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">List the top 5 tags with the highest total fuel cost this month. Also, show total fuel cost per site for the same period.</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Fuel Price Trend Analysis</CardTitle>
                <LineChart className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Track average fuel price (Unit Cost) paid over time, potentially filterable by site or fuel type. (Chart: Line chart)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Plot the average unit cost of diesel purchased across all sites for each month of the last year. Are there any significant price fluctuations?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Anomalous Fuel Consumption</CardTitle>
                <AlertTriangle className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Identify tags with sudden significant increases in fuel consumption or unusually high consumption compared to similar tags. (Requires historical data and comparison logic)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Compare the fuel efficiency of all 'LDV' type tags for the last month. Flag any tags whose efficiency is more than 20% worse than the average for LDVs or significantly worse than their own historical average.</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
