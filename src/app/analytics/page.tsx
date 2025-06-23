
'use client';

import { FilterBar } from '@/components/shared/filter-bar';
import { POCycleTimeChart } from '@/components/analytics/po-cycle-time-chart';
import { MaverickSpendChart } from '@/components/analytics/maverick-spend-chart';
import { POValueDistributionChart } from '@/components/analytics/po-value-distribution-chart';
import { GrnValueChart } from '@/components/analytics/grn-value-chart';
import { FuelCostByTagChart } from '@/components/analytics/fuel-cost-by-tag-chart'; // New import
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    ShoppingCart, Truck, FileText as QuoteIcon, ClipboardList as RequisitionIcon, Fuel as FuelIcon, 
    Brain, LineChart, CircleDollarSign, AlertOctagon, Users, TrendingUp, 
    BarChartHorizontalBig, PackageCheck, PackageX, Percent, Hourglass, AlertTriangle as AlertTriangleIcon,
    MessageSquare, Sparkles, Send, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { POAnalysisOutput } from '@/ai/flows/po-analysis-flow';
import { useToast } from '@/hooks/use-toast';

export default function AnalyticsPage() {
  const [currentFilters, setCurrentFilters] = useState<{ month?: string; year?: string; siteId?: string; }>({
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    year: new Date().getFullYear().toString(),
    siteId: 'all',
  });
  const [refreshKey, setRefreshKey] = useState(0); 

  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<POAnalysisOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();


  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to Analytics:', filters);
    setCurrentFilters({ month: filters.month, year: filters.year, siteId: filters.siteId });
    setRefreshKey(prevKey => prevKey + 1); 
  };

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim()) {
      toast({title: "Prompt Required", description: "Please enter a question or request for the AI.", variant: "default"});
      return;
    }
    setIsAiLoading(true);
    setAiResponse(null);
    setAiError(null);
    try {
      const response = await fetch('/api/ai/analyze-po', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API Error Response Text:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          const specificError = errorData.details || errorData.error || `AI analysis failed with status: ${response.status}`;
          throw new Error(specificError);
        } catch (e) {
           throw new Error(`AI analysis failed: ${response.statusText}. The server returned a non-JSON response, which may indicate a server crash.`);
        }
      }
      const data: POAnalysisOutput = await response.json();
      setAiResponse(data);
    } catch (error: any) {
      setAiError(error.message || 'Failed to get response from AI.');
      toast({title: "AI Analysis Error", description: error.message, variant: "destructive"});
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FilterBar 
        onFilterApply={handleFilterApply}
        showApproverFilter={false}
        showRequestorFilter={false}
        showSiteFilter={true} 
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
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">AI-Powered PO Analysis</CardTitle>
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">
                  Ask the AI for specific insights into your Purchase Order data. The AI can generate summaries, identify trends, and even create charts based on your questions.
                </CardDescription>
                <div className="p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10 mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-1">Example Prompt:</h4>
                  <code className="block whitespace-pre-wrap text-xs bg-background/50 p-2 rounded">
                    {`What was the total value of approved POs last month? Show me a breakdown by supplier.`}
                  </code>
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter your question, e.g., 'Top 5 suppliers by PO value this year?' or 'How many POs are pending approval?'"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[100px]"
                    disabled={isAiLoading}
                  />
                  <Button onClick={handleAiSubmit} disabled={isAiLoading || !aiPrompt.trim()} className="w-full">
                    {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    {isAiLoading ? 'Analyzing...' : 'Ask AI'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">AI Response</CardTitle>
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                {isAiLoading ? (
                  <div className="flex-grow flex flex-col justify-center items-center text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                    <p>AI is thinking...</p>
                  </div>
                ) : aiError ? (
                  <div className="flex-grow flex flex-col justify-center items-center text-destructive p-4 border border-destructive/50 rounded-md">
                    <AlertTriangleIcon className="h-10 w-10 mb-3" />
                    <p className="font-semibold">Error:</p>
                    <p className="text-sm text-center">{aiError}</p>
                  </div>
                ) : aiResponse ? (
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md bg-background/50">
                      <h4 className="font-semibold mb-1 text-primary">Summary:</h4>
                      <p className="text-sm whitespace-pre-wrap">{aiResponse.responseText}</p>
                    </div>
                    {aiResponse.chartData && aiResponse.chartData.length > 0 && (
                      <div className="p-3 border rounded-md bg-background/50">
                        <h4 className="font-semibold mb-2 text-primary">{aiResponse.chartTitle || 'Chart'}</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={aiResponse.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={10} interval={0} angle={-30} textAnchor="end" height={50}/>
                            <YAxis stroke="hsl(var(--foreground))" fontSize={10} />
                            <Tooltip
                              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)'}}
                              labelStyle={{ color: 'hsl(var(--foreground))' }}
                              itemStyle={{ color: 'hsl(var(--chart-1))' }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {aiResponse.debugInfo && (
                        <div className="mt-2 p-2 border border-dashed border-muted-foreground/30 rounded-md text-xs text-muted-foreground">
                            <p className="font-semibold">Debug Info:</p>
                            <pre className="whitespace-pre-wrap text-xs">{aiResponse.debugInfo}</pre>
                        </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-center items-center text-muted-foreground">
                    <Brain className="h-10 w-10 mb-3" />
                    <p>AI's response will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <POCycleTimeChart key={`po-cycle-${refreshKey}`} filters={currentFilters} />
            <MaverickSpendChart key={`maverick-spend-${refreshKey}`} filters={currentFilters} /> 
            <POValueDistributionChart key={`po-value-dist-${refreshKey}`} filters={currentFilters} />

            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">PO Status Trends Over Time</CardTitle>
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  The "Monthly PO Status" chart on the main Dashboard page shows trends for 'Approved' and 'Pending Approval' POs. For more detailed status trends (e.g., including Draft, Completed, Rejected), use the AI analysis tool.
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Detailed Analysis via AI</h3>
                  <p className="text-xs text-muted-foreground mb-2">Use the AI prompt to explore trends across all PO statuses or correlate with other factors.</p>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`Show the monthly trend of all PO statuses (Draft, Pending Approval, Approved, Rejected, Completed) for the last 6 months. Is there an increasing backlog of pending approvals?`}</code></CardContent>
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
                  Percentage of PO items delivered on or before the promised date by supplier.
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Analysis Requires More Data</h3>
                  <p className="text-xs text-muted-foreground mb-2">This analysis requires `Expected Delivery Date` on PO items and `Actual Receipt Date` on GRNs, which are not yet in the database schema.</p>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`For supplier [Supplier Name] over the last quarter, calculate their on-time delivery percentage. List top 3 suppliers by on-time delivery rate.`}</code></CardContent>
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
                  Percentage of items received with quantity mismatches (short/over) or quality issues.
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                   <h3 className="text-md font-semibold text-foreground mb-1">Analysis Requires More Data</h3>
                   <p className="text-xs text-muted-foreground mb-2">Requires structured data for rejection reasons on GRNs (e.g., 'Damaged', 'Wrong Item'), which is not yet in the database schema.</p>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`Analyze GRNs for item [Item SKU] from last month. What's the discrepancy rate (ordered vs. received quantity)? What are the most common reasons if items were rejected?`}</code></CardContent>
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
                  Time from physical receipt of goods to system entry/update of the GRN.
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                   <h3 className="text-md font-semibold text-foreground mb-1">Analysis Requires More Data</h3>
                   <p className="text-xs text-muted-foreground mb-2">Requires capturing 'Physical Receipt Date' on GRNs, which is not yet in the database schema. The system entry date can be derived from the Activity Log.</p>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                    <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                    <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`What's the average GRN processing time (physical receipt to system entry) for the receiving team at [Site Name] over the past month? Identify any GRNs that took significantly longer.`}</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <GrnValueChart key={`grn-value-${refreshKey}`} filters={currentFilters} />
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
                  Percentage of quotes approved vs. total quotes issued. (Chart: Grouped Bar chart)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Analysis Requires More Data</h3>
                  <p className="text-xs text-muted-foreground mb-2">This analysis requires `Quote` status data and potentially a link between Quotes and final Purchase Orders to determine a "win". The AI would need a new tool to access Quote data.</p>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`What is our overall quote conversion rate (status 'Approved' / total 'Sent' or 'Approved' or 'Rejected') for last month? Break this down by client [Client Name] and by creator [Creator Email].`}</code></CardContent>
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
                  Track average quote value (for 'Approved' or 'Sent' quotes) over time. (Chart: Line chart)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Analysis Requires New Endpoint</h3>
                   <p className="text-xs text-muted-foreground mb-2">Requires a new API endpoint to aggregate quote `grandTotal` by `quoteDate`. The AI would need a tool to access this data.</p>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`Show the monthly trend of average quote value for quotes in 'Approved' status over the last 6 months. Is the average deal size increasing or decreasing?`}</code></CardContent>
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
                  Total value of quotes currently in 'Pending Approval' or 'Sent' status. (Chart: Bar chart by status)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Analysis Requires New Endpoint</h3>
                  <p className="text-xs text-muted-foreground mb-2">Requires a new API endpoint to sum `grandTotal` grouped by `status`. The AI would need a new tool to access this data.</p>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`What is the total value of our current sales pipeline (sum of 'Pending Approval' and 'Sent to Client' quotes)? Show breakdown by quote status.`}</code></CardContent>
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
                  Analysis of common reasons for 'Rejected' quotes. (Chart: Pie/Bar chart for reasons)
                </CardDescription>
                <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Analysis Requires More Data</h3>
                  <p className="text-xs text-muted-foreground mb-2">Requires a dedicated `rejectionReason` field in the database or advanced AI text analysis on the quote `notes` field.</p>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`For all quotes marked 'Rejected' in the last year, what are the top 3 reasons for rejection? (Assuming rejection reason is stored in notes or a dedicated field)`}</code></CardContent>
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
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`Calculate the average cycle time for requisitions: 1. Submission to Approval. 2. Approval to PO Creation (if PO exists). Identify requisitions that took more than 7 days for approval.`}</code></CardContent>
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
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`Show the total estimated value of approved requisitions for each site in the last month. Which site has the highest requested spend?`}</code></CardContent>
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
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`What percentage of 'Approved' requisitions created last quarter were converted to a PO (status 'Closed')? What percentage were 'Cancelled' after approval?`}</code></CardContent>
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
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`List the top 10 most frequently requested item categories from requisitions this year. Are there any items that are frequently requested across multiple sites?`}</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>
        
        <TabsContent value="fuel-analytics">
          <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
            <FuelCostByTagChart key={`fuel-cost-by-tag-${refreshKey}`} filters={currentFilters} />
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
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`For vehicle [Tag Number], calculate its average fuel efficiency (L/100km) for the last month based on fuel records and odometer readings. Compare this to its average from the previous month.`}</code></CardContent>
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
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`Plot the average unit cost of diesel purchased across all sites for each month of the last year. Are there any significant price fluctuations?`}</code></CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-xl">Anomalous Fuel Consumption</CardTitle>
                <AlertTriangleIcon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Identify tags with sudden significant increases in fuel consumption or unusually high consumption compared to similar tags. (Requires historical data and comparison logic)
                </CardDescription>
                 <div className="p-4 text-center border-2 border-dashed border-muted-foreground/50 rounded-lg bg-muted/20">
                  <h3 className="text-md font-semibold text-foreground mb-1">Coming Soon!</h3>
                  <Card className="mt-1 text-left text-xs bg-background/50">
                      <CardHeader className="p-2"><CardTitle className="text-xs font-semibold flex items-center"><Brain className="h-3 w-3 mr-1 text-primary" /> AI Prompt Example</CardTitle></CardHeader>
                      <CardContent className="p-2"><code className="block whitespace-pre-wrap">{`Compare the fuel efficiency of all 'LDV' type tags for the last month. Flag any tags whose efficiency is more than 20% worse than the average for LDVs or significantly worse than their own historical average.`}</code></CardContent>
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
