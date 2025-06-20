
'use client';

import { FilterBar } from '@/components/shared/filter-bar';
import { SpendByVendorChart } from '@/components/analytics/spend-by-vendor-chart';
import { POCountByCategoryChart } from '@/components/analytics/po-count-by-category-chart';
import { spendByVendorData, poCountByCategoryData } from '@/lib/mock-data';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Truck, FileText as QuoteIcon, ClipboardList as RequisitionIcon, Fuel as FuelIcon, Brain } from 'lucide-react';

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
                <ul className="list-disc list-inside text-muted-foreground mt-2 text-left space-y-4 text-sm">
                  <li>
                    <strong>Supplier On-Time Delivery Performance:</strong>
                    <p className="text-xs pl-4">Percentage of POs/items delivered on time by each supplier.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2">
                        <CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <code className="block whitespace-pre-wrap">
                          Analyze the following GRN data for supplier [Supplier Name]: [GRN Data - PO Due Date, Actual Receipt Date]. Calculate their on-time delivery percentage and identify any trends in early or late deliveries. Suggest reasons for consistent delays if observed.
                        </code>
                      </CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Item Receipt Discrepancy Rate:</strong>
                    <p className="text-xs pl-4">Percentage of items received with quantity or quality discrepancies.</p>
                     <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2">
                        <CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <code className="block whitespace-pre-wrap">
                          Given this set of GRN entries for item [Item Name/SKU]: [GRN Data - Ordered Qty, Received Qty, Rejected Qty, Reasons for Rejection]. What is the overall discrepancy rate for this item? What are the most common reasons for discrepancies?
                        </code>
                      </CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Average GRN Processing Time:</strong>
                    <p className="text-xs pl-4">Time from physical receipt of goods to system entry/update.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2">
                        <CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <code className="block whitespace-pre-wrap">
                          The following data points represent GRN processing times (in hours) for the last month: [List of processing times]. Calculate the average processing time. Identify outliers and suggest potential bottlenecks in the receiving process if the average is high.
                        </code>
                      </CardContent>
                    </Card>
                  </li>
                   <li>
                    <strong>Value of Goods Received Over Time:</strong>
                    <p className="text-xs pl-4">Trend of the total value of goods received (daily, weekly, monthly).</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2">
                        <CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <code className="block whitespace-pre-wrap">
                          Based on this GRN data (Date, Value Received): [Data]. Describe the trend in the value of goods received over the past [Period]. Are there any notable peaks or troughs? What might they indicate?
                        </code>
                      </CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Top Suppliers by Received Value/Volume:</strong>
                    <p className="text-xs pl-4">Identify key suppliers based on the value or volume of goods successfully received.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2">
                        <CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <code className="block whitespace-pre-wrap">
                          Analyze this GRN dataset ([Supplier Name, Item Value, Item Quantity] per GRN). List the top 5 suppliers by total value of goods received and by total quantity of items received in the last quarter. Provide a brief comment on any supplier appearing in both lists.
                        </code>
                      </CardContent>
                    </Card>
                  </li>
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
                <ul className="list-disc list-inside text-muted-foreground mt-2 text-left space-y-4 text-sm">
                  <li>
                    <strong>Quote Conversion Rate:</strong>
                    <p className="text-xs pl-4">Percentage of quotes approved/won vs. total quotes issued.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Given the following quote data ([Quote ID, Status (Draft, Pending, Approved, Rejected, Sent), Quoted Value, Salesperson, Client Segment]): [Data]. Calculate the overall quote conversion rate (Approved/Total Sent or Approved). Break down the conversion rate by Salesperson and Client Segment. Identify high and low performers.</code></CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Average Quote Value Trend:</strong>
                    <p className="text-xs pl-4">Track average quote value over time or by product/service category.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze this list of approved quotes ([Quote Value, Quote Date, Product Category]): [Data]. What is the trend in average quote value over the last 6 months? Which product categories have the highest average quote values?</code></CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Sales Pipeline Value:</strong>
                    <p className="text-xs pl-4">Sum of values for quotes in 'Pending Approval' or 'Sent to Client' status.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Here's a list of current outstanding quotes ([Quote ID, Status (Pending Approval, Sent to Client), Quoted Value, Estimated Close Probability (e.g., 70%)]): [Data]. Calculate the total sales pipeline value and the weighted pipeline value. Provide a brief summary.</code></CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Time-to-Decision for Quotes:</strong>
                    <p className="text-xs pl-4">Average time from quote submission to client approval/rejection.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">For these quotes ([Submission Date, Decision Date (Approved/Rejected)]): [Data]. Calculate the average time-to-decision. Are there significant variations based on quote value or client type (if provided)?</code></CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Win/Loss Analysis:</strong>
                    <p className="text-xs pl-4">Reasons for winning or losing quotes (if data is captured).</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze these lost quotes ([Quote Value, Client Segment, Reason for Loss (e.g., Price, Timeline, Competition)]): [Data]. What are the top 3 reasons for losing quotes? Are there patterns specific to client segments or quote values?</code></CardContent>
                    </Card>
                  </li>
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
                <ul className="list-disc list-inside text-muted-foreground mt-2 text-left space-y-4 text-sm">
                  <li>
                    <strong>Requisition Processing Time:</strong>
                    <p className="text-xs pl-4">Average time from requisition submission to PO creation or closure.</p>
                     <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Given these requisition lifecycle dates ([Submission Date, Approval Date, PO Creation Date/Closure Date]): [Data]. Calculate the average processing time for requisitions from submission to PO creation. Identify stages with the longest delays.</code></CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Spend per Department/Site (from Requisitions):</strong>
                    <p className="text-xs pl-4">Track requested spend by originating department or site.</p>
                     <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Analyze this set of approved requisitions ([Department/Site, Estimated Item Value]): [Data]. Which department/site has the highest requested spend for the last month? Display the top 5.</code></CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Requisition to PO Conversion Rate:</strong>
                    <p className="text-xs pl-4">Percentage of approved requisitions that result in a Purchase Order.</p>
                     <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">From this data ([Requisition ID, Status (Approved, Closed-PO Created, Closed-Cancelled)]): [Data]. What is the conversion rate of approved requisitions to purchase orders? What are common reasons for approved requisitions not converting to POs (if available)?</code></CardContent>
                    </Card>
                  </li>
                   <li>
                    <strong>Frequently Requested Items/Categories:</strong>
                    <p className="text-xs pl-4">Identify items or categories most commonly requisitioned.</p>
                     <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">This dataset contains requisition items ([Item Description/Category, Quantity Requested]): [Data]. List the top 10 most frequently requisitioned items or categories. Suggest potential bulk purchasing opportunities.</code></CardContent>
                    </Card>
                  </li>
                   <li>
                    <strong>Urgent vs. Standard Requisitions Analysis:</strong>
                    <p className="text-xs pl-4">Analysis of requisitions marked as urgent, their frequency, and reasons.</p>
                     <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Review these requisitions ([Urgency (Urgent/Standard), Department, Justification for Urgency]): [Data]. What percentage of requisitions are marked urgent? Which departments submit the most urgent requests? What are the common justifications?</code></CardContent>
                    </Card>
                  </li>
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
                <ul className="list-disc list-inside text-muted-foreground mt-2 text-left space-y-4 text-sm">
                  <li>
                    <strong>Fuel Consumption Efficiency:</strong>
                    <p className="text-xs pl-4">Liters/100km for vehicles, Liters/hour for equipment.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Given fuel records for vehicle [Vehicle ID] ([Date, Fuel Added (Liters), Odometer Reading (km)]): [Data]. Calculate the fuel efficiency in L/100km between fill-ups. Identify any significant changes in efficiency over time. (Similar prompt for L/hour for equipment using Hours Operated).</code></CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Total Fuel Cost per Asset:</strong>
                    <p className="text-xs pl-4">Track fuel expenditure for each vehicle/equipment over time.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">This data shows fuel costs for assets ([Asset ID, Date, Total Fuel Cost]): [Data]. Which asset incurred the highest fuel cost last month? Show the trend of total fuel cost for asset [Asset ID] over the past 6 months.</code></CardContent>
                    </Card>
                  </li>
                   <li>
                    <strong>Fuel Price Trend Analysis:</strong>
                    <p className="text-xs pl-4">Track average fuel price paid over time from supplier invoices/unit costs.</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Using these fuel purchase records ([Date, Unit Cost per Liter]): [Data]. Plot the trend of average fuel unit cost over the last year. Identify periods of significant price increases or decreases.</code></CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Anomaly Detection (Odometer vs. Fuel):</strong>
                    <p className="text-xs pl-4">Identify unusual patterns (e.g., high fuel for low distance).</p>
                    <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">Review these fuel logs ([Vehicle ID, Date, Fuel Added, Odometer Change Since Last Fill-up]): [Data]. Are there any records showing exceptionally high fuel added for a very small odometer change, or vice-versa, that might warrant investigation for vehicle [Vehicle ID]?</code></CardContent>
                    </Card>
                  </li>
                  <li>
                    <strong>Fuel Usage by Site/Project:</strong>
                    <p className="text-xs pl-4">Breakdown of fuel consumption by operational site or project.</p>
                     <Card className="mt-1 text-left text-xs bg-background/50">
                        <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                        <CardContent className="p-2"><code className="block whitespace-pre-wrap">This dataset attributes fuel usage to sites ([Site ID, Date, Fuel Consumed (Liters)]): [Data]. Which site had the highest fuel consumption last quarter? Compare the fuel usage trends of Site A vs. Site B.</code></CardContent>
                    </Card>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    