
'use client';

import { FilterBar } from '@/components/shared/filter-bar';
import { SpendByVendorChart } from '@/components/analytics/spend-by-vendor-chart';
import { POCountByCategoryChart } from '@/components/analytics/po-count-by-category-chart';
import { spendByVendorData, poCountByCategoryData } from '@/lib/mock-data'; // Mock data, will be replaced by API calls
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Truck, FileText as QuoteIcon, ClipboardList as RequisitionIcon, Fuel as FuelIcon, Brain, LineChart, CircleDollarSign, AlertOctagon } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock state for potential future dynamic data loading based on filters
  const [filteredSpendData, setFilteredSpendData] = useState(spendByVendorData);
  const [filteredCategoryData, setFilteredCategoryData] = useState(poCountByCategoryData);

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to Analytics:', filters);
    // In a real app, you would fetch new data based on these filters
    // For now, mock data remains unchanged.
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
          <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2 mt-6">
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">PO Cycle Time Analysis</CardTitle>
                <LineChart className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Analyze time taken from PO creation to approval, and approval to completion. (Chart: Histogram/Box Plot)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze POs created in Q2. What is the average cycle time from creation to approval? Identify bottlenecks. Which approvers or PO types have significantly longer/shorter cycle times?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Maverick Spend Identification</CardTitle>
                <AlertOctagon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Identify off-contract or emergency POs not linked to pre-approved requisitions. (Chart: Bar chart of count/value)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Identify all POs created last month not linked to an approved requisition. What is their total value and what are the common categories? Flag any POs with 'emergency' justification that exceed $1000.</code></CardContent>
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
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">What is the distribution of PO values for the current year? What percentage of POs are below $500? Are there any unusually high-value POs that deviate from the norm?</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">PO Status Trends Over Time</CardTitle>
                <LineChart className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Trends of POs in different statuses (Draft, Pending, Approved, Completed) over months/quarters. (Chart: Stacked Area/Multi-line)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
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
          <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-xl">GRN & Receiving Analytics</CardTitle>
              <Truck className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Gain insights into supplier delivery performance, item receipt accuracy, and receiving cycle times.
              </CardDescription>
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20 space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon! Potential Analyses:</h3>
                
                <div>
                  <h4 className="text-md font-semibold text-left">1. Supplier On-Time Delivery Performance</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Percentage of POs/items delivered on time by each supplier. (Chart: Bar chart)</p>
                  <Card className="text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze the following GRN data for supplier [Supplier Name]: [GRN Data - PO Due Date, Actual Receipt Date]. Calculate their on-time delivery percentage and identify any trends in early or late deliveries. Suggest reasons for consistent delays if observed.</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">2. Item Receipt Discrepancy Rate</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Percentage of items received with quantity or quality discrepancies. (Chart: Pie/Bar chart for reasons)</p>
                  <Card className="text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Given this set of GRN entries for item [Item Name/SKU]: [GRN Data - Ordered Qty, Received Qty, Rejected Qty, Reasons for Rejection]. What is the overall discrepancy rate for this item? What are the most common reasons for discrepancies?</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">3. Average GRN Processing Time</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Time from physical receipt of goods to system entry/update. (Chart: Line chart trend)</p>
                  <Card className="text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">The following data points represent GRN processing times (in hours) for the last month: [List of processing times]. Calculate the average processing time. Identify outliers and suggest potential bottlenecks in the receiving process if the average is high.</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">4. Value of Goods Received Over Time</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Trend of the total value of goods received (daily, weekly, monthly). (Chart: Line/Bar chart)</p>
                  <Card className="text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">Based on this GRN data (Date, Value Received): [Data]. Describe the trend in the value of goods received over the past [Period]. Are there any notable peaks or troughs? What might they indicate?</code></CardContent>
                  </Card>
                </div>
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
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20 space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon! Potential Analyses:</h3>
                
                <div>
                  <h4 className="text-md font-semibold text-left">1. Quote Conversion Rate</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Percentage of quotes approved/won vs. total quotes issued, by salesperson/client segment. (Chart: Grouped Bar chart)</p>
                  <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Given the following quote data ([Quote ID, Status, Quoted Value, Salesperson, Client Segment]): [Data]. Calculate the overall quote conversion rate (Approved/Total Sent). Break down by Salesperson and Client Segment. Identify high/low performers.</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">2. Average Quote Value Trend</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Track average quote value over time, filterable by product/service category. (Chart: Line chart)</p>
                  <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze this list of approved quotes ([Quote Value, Quote Date, Product Category]): [Data]. What is the trend in average quote value over the last 6 months? Which product categories have the highest average quote values?</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">3. Sales Pipeline Value</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Unweighted and weighted sum of values for 'Pending' or 'Sent' quotes. (Chart: Bar chart)</p>
                  <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Here's a list of current outstanding quotes ([Quote ID, Status, Quoted Value, Est. Close Probability]): [Data]. Calculate total sales pipeline value and weighted pipeline value. Summarize.</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">4. Win/Loss Analysis</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Common reasons for winning or losing quotes (if data captured). (Chart: Pie/Bar chart for reasons)</p>
                  <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze these lost quotes ([Quote Value, Client Segment, Reason for Loss (Price, Competition, etc.)]): [Data]. What are the top 3 reasons for losing quotes? Are there patterns specific to client segments or quote values?</code></CardContent>
                  </Card>
                </div>
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
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20 space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon! Potential Analyses:</h3>
                
                <div>
                  <h4 className="text-md font-semibold text-left">1. Requisition Processing Time</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Average time from requisition submission to PO creation or closure. (Chart: Histogram/Box Plot)</p>
                   <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Given these requisition lifecycle dates ([Submission Date, Approval Date, PO Creation Date/Closure Date]): [Data]. Calculate the average processing time for requisitions from submission to PO creation. Identify stages with the longest delays.</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">2. Spend per Department/Site</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Track requested spend by originating department or site. (Chart: Bar chart/Treemap)</p>
                   <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze this set of approved requisitions ([Department/Site, Estimated Item Value]): [Data]. Which department/site has the highest requested spend for the last month? Display the top 5.</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">3. Requisition to PO Conversion Rate</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Percentage of approved requisitions resulting in a Purchase Order. (Chart: Percentage Gauge/Bar)</p>
                   <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">From this data ([Requisition ID, Status (Approved, Closed-PO Created, Closed-Cancelled)]): [Data]. What is the conversion rate of approved requisitions to purchase orders? What are common reasons for approved requisitions not converting to POs (if available)?</code></CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-left">4. Frequently Requested Items/Categories</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Identify items or categories most commonly requisitioned. (Chart: Bar chart)</p>
                   <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">This dataset contains requisition items ([Item Description/Category, Quantity Requested]): [Data]. List the top 10 most frequently requisitioned items or categories. Suggest potential bulk purchasing opportunities.</code></CardContent>
                  </Card>
                </div>
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
              <div className="p-6 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20 space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon! Potential Analyses:</h3>
                
                <div>
                  <h4 className="text-md font-semibold text-left">1. Fuel Consumption Efficiency</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Liters/100km for vehicles, Liters/hour for equipment. (Chart: Line chart per asset/Bar chart comparison)</p>
                  <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Given fuel records for vehicle [Vehicle ID] ([Date, Fuel Added (Liters), Odometer Reading (km)]): [Data]. Calculate fuel efficiency (L/100km). Identify significant changes over time.</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">2. Total Fuel Cost per Asset/Site</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Track fuel expenditure for each vehicle/equipment or site over time. (Chart: Bar chart)</p>
                  <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">This data shows fuel costs ([Asset ID/Site ID, Date, Total Fuel Cost]): [Data]. Which asset/site incurred the highest fuel cost last month? Show trend for asset/site [ID] over 6 months.</code></CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-left">3. Fuel Price Trend Analysis</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Track average fuel price paid over time. (Chart: Line chart)</p>
                   <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Using these fuel purchase records ([Date, Unit Cost per Liter]): [Data]. Plot the trend of average fuel unit cost over the last year. Identify periods of significant price changes.</code></CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-left">4. Fuel Usage by Tag Type/Site</h4>
                  <p className="text-xs text-muted-foreground text-left pl-4 mb-1">Breakdown of fuel consumption by asset type (LDV, Truck) or operational site. (Chart: Pie chart)</p>
                   <Card className="text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze fuel consumption data ([Tag Type, Site, Fuel Consumed (Liters), Date]): [Data]. What's the percentage breakdown of fuel usage by tag type last month? Which site consumed the most fuel?</code></CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
