
'use client';

import { useEffect, useState, useCallback } from 'react';
import { GroupedStatCard } from '@/components/dashboard/grouped-stat-card';
import { FilterBar } from '@/components/shared/filter-bar';
import { MonthlyStatusChart } from '@/components/dashboard/monthly-status-chart';
import { SitePOValueStatusChart } from '@/components/dashboard/site-po-value-status-chart';
import { ActivityLogTable } from '@/components/shared/activity-log-table';
import { activityLogData } from '@/lib/mock-data'; // Still using mock for activity log for now
import type { GroupedStatCardItem, FetchedDashboardStats, SubStat } from '@/types';
import { Loader2, AlertTriangle, RefreshCw, Users, ShoppingCart, Truck, ClipboardList, Fuel, FileText as QuoteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Added Card imports
import { Skeleton } from "@/components/ui/skeleton"; // Added Skeleton import

const initialDashboardCardsConfig: GroupedStatCardItem[] = [
  {
    title: 'User Activity',
    icon: Users,
    subStats: [
      { label: 'Total Users', value: 'N/A' },
      { label: 'Active Now', value: 'N/A' },
      { label: 'Inactive', value: 'N/A' },
    ],
    viewMoreLink: '/management/users',
  },
  {
    title: 'Purchase Orders',
    icon: ShoppingCart,
    subStats: [
      { label: 'Total POs', value: 'N/A' },
      { label: 'Approved', value: 'N/A' },
      { label: 'Pending Approval', value: 'N/A' },
      { label: 'Rejected', value: 'N/A' },
    ],
    viewMoreLink: '/create-document', // Links to page with PO list
  },
  {
    title: 'Goods Received',
    icon: Truck,
    subStats: [
      { label: 'Approved POs (Open)', value: 'N/A' },
      { label: 'POs with GRN Activity', value: 'N/A' },
      // { label: 'Fully Received POs', value: 'N/A' }, // Future
      // { label: 'Partially Received POs', value: 'N/A' }, // Future
    ],
    viewMoreLink: '/create-document', // Links to page with GRN interface
  },
  {
    title: 'Purchase Requisitions',
    icon: ClipboardList,
    subStats: [
      { label: 'Total Requisitions', value: 'N/A' },
      // { label: 'Attended', value: 'N/A' }, // Future
      // { label: 'Pending', value: 'N/A' }, // Future
    ],
    viewMoreLink: '/create-document',
  },
  {
    title: 'Fuel Management',
    icon: Fuel,
    subStats: [
      { label: 'Total Vehicles/Tags', value: 'N/A' },
      { label: 'Total Fuel Records', value: 'N/A' },
      // { label: 'Vehicles Pending Refuel', value: 'N/A' }, // Future concept
    ],
    viewMoreLink: '/create-document', // Links to page with Fuel Records list
  },
  {
    title: 'Client Quotations',
    icon: QuoteIcon,
    subStats: [
      { label: 'Total Quotes', value: 'N/A' },
      { label: 'Approved Quotes', value: 'N/A' },
      { label: 'Pending Approval', value: 'N/A' },
      { label: 'Rejected Quotes', value: 'N/A' },
    ],
    viewMoreLink: '/create-document', // Links to page with Quote list
  },
];


export default function DashboardPage() {
  const [groupedDashboardStats, setGroupedDashboardStats] = useState<GroupedStatCardItem[]>(initialDashboardCardsConfig);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); 

  const fetchDashboardStats = useCallback(async () => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const response = await fetch('/api/dashboard-stats');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch dashboard stats');
      }
      const data: FetchedDashboardStats = await response.json();
      
      setGroupedDashboardStats(prevCards =>
        prevCards.map(card => {
          let newSubStats: SubStat[] = card.subStats.map(ss => ({ ...ss, value: 'N/A' })); // Default to N/A

          if (card.title === 'User Activity' && data.users) {
            newSubStats = [
              { label: 'Total Users', value: data.users.total.toString() },
              { label: 'Active Users', value: data.users.active.toString() },
              { label: 'Inactive Users', value: data.users.inactive.toString() },
            ];
          } else if (card.title === 'Purchase Orders' && data.purchaseOrders) {
            newSubStats = [
              { label: 'Total POs', value: data.purchaseOrders.total.toString() },
              { label: 'Approved', value: data.purchaseOrders.approved.toString() },
              { label: 'Pending Approval', value: data.purchaseOrders.pending.toString() },
              { label: 'Rejected', value: data.purchaseOrders.rejected.toString() },
            ];
          } else if (card.title === 'Goods Received' && data.goodsReceived) {
            newSubStats = [
              { label: 'Approved POs (Open)', value: data.goodsReceived.totalApprovedPOs.toString() },
              { label: 'POs with GRN Activity', value: data.goodsReceived.totalPOsWithGRNActivity.toString() },
            ];
          } else if (card.title === 'Purchase Requisitions' && data.requisitions) {
            newSubStats = [
              { label: 'Total Requisitions', value: data.requisitions.total.toString() },
            ];
          } else if (card.title === 'Fuel Management' && data.fuel) {
            newSubStats = [
              { label: 'Total Vehicles/Tags', value: data.fuel.totalTags.toString() },
              { label: 'Total Fuel Records', value: data.fuel.totalRecords.toString() },
            ];
          } else if (card.title === 'Client Quotations' && data.clientQuotes) {
            newSubStats = [
              { label: 'Total Quotes', value: data.clientQuotes.total.toString() },
              { label: 'Approved', value: data.clientQuotes.approved.toString() },
              { label: 'Pending Approval', value: data.clientQuotes.pending.toString() },
              { label: 'Rejected', value: data.clientQuotes.rejected.toString() },
            ];
          }
          return { ...card, subStats: newSubStats };
        })
      );
    } catch (err: any) {
      setStatsError(err.message || 'An unexpected error occurred while fetching stats.');
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleRefreshAllData = () => {
    fetchDashboardStats();
    setRefreshKey(prevKey => prevKey + 1); 
  };

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to dashboard:', filters);
    // For now, filters re-trigger chart refreshes.
    // Stats API doesn't currently use these filters, but could be extended.
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <FilterBar 
          onFilterApply={handleFilterApply} 
          showApproverFilter={false} // Adjust as needed if stats should be filterable
          showRequestorFilter={false}
          showSiteFilter={false} // For main dashboard, maybe not needed for global stats
        />
        <Button onClick={handleRefreshAllData} variant="outline" size="sm" className="ml-4">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoadingStats ? (
          initialDashboardCardsConfig.map((cardConfig, index) => (
            <Card key={index} className="shadow-lg flex flex-col h-[220px] sm:h-[240px]">
              <CardHeader className="flex flex-row items-start sm:items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-3/5" /> 
                <Skeleton className="h-6 w-6 rounded-full" />
              </CardHeader>
              <CardContent className="pt-2 flex-grow">
                <Skeleton className="h-8 w-1/2 mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
               <CardFooter className="pt-3 sm:pt-4">
                  <Skeleton className="h-8 w-full" />
               </CardFooter>
            </Card>
          ))
        ) : statsError ? (
          <div className="md:col-span-2 lg:col-span-3 p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive-foreground">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Error loading statistics</h3>
            </div>
            <p className="text-sm mb-3">{statsError}</p>
            <Button onClick={fetchDashboardStats} variant="outline" size="sm" className="border-destructive text-destructive-foreground hover:bg-destructive/20">
              Try Again
            </Button>
          </div>
        ) : (
          groupedDashboardStats.map((statGroup) => (
            <GroupedStatCard key={statGroup.title} {...statGroup} />
          ))
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <MonthlyStatusChart key={`monthly-${refreshKey}`} /> 
        <SitePOValueStatusChart key={`site-po-${refreshKey}`} />
      </section>

      <section>
        {/* ActivityLogTable will be updated in a subsequent step to fetch live data */}
        <ActivityLogTable activities={activityLogData.slice(0, 5)} maxHeight="300px" />
      </section>
    </div>
  );
}

    