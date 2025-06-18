
'use client';

import { useEffect, useState, useCallback } from 'react';
import { GroupedStatCard } from '@/components/dashboard/grouped-stat-card';
import { FilterBar } from '@/components/shared/filter-bar';
import { MonthlyStatusChart } from '@/components/dashboard/monthly-status-chart';
import { SitePOValueStatusChart } from '@/components/dashboard/site-po-value-status-chart';
import { UsersByRoleChart } from '@/components/dashboard/users-by-role-chart'; // New Import
import { TagsByStatusChart } from '@/components/dashboard/tags-by-status-chart'; // New Import
import { ActivityLogTable } from '@/components/shared/activity-log-table';
import { activityLogData } from '@/lib/mock-data';
import type { GroupedStatCardItem, FetchedDashboardStats, SubStat } from '@/types';
import { Loader2, AlertTriangle, RefreshCw, Users, ShoppingCart, Truck, ClipboardList, Fuel, FileText as QuoteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const initialDashboardCardsConfig: GroupedStatCardItem[] = [
  {
    title: 'User Activity',
    icon: Users,
    subStats: [
      { label: 'Total Users', value: 'N/A' },
      { label: 'Active Users', value: 'N/A' },
      { label: 'Inactive Users', value: 'N/A' },
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
    viewMoreLink: '/create-document',
  },
  {
    title: 'Goods Received',
    icon: Truck,
    subStats: [
      { label: 'Approved POs (Open)', value: 'N/A' },
      { label: 'POs with GRN Activity', value: 'N/A' },
    ],
    viewMoreLink: '/create-document',
  },
  {
    title: 'Purchase Requisitions',
    icon: ClipboardList,
    subStats: [
      { label: 'Total Requisitions', value: 'N/A' },
    ],
    viewMoreLink: '/create-document',
  },
  {
    title: 'Fuel Management',
    icon: Fuel,
    subStats: [
      { label: 'Total Vehicles/Tags', value: 'N/A' },
      { label: 'Total Fuel Records', value: 'N/A' },
    ],
    viewMoreLink: '/create-document',
  },
  {
    title: 'Client Quotations',
    icon: QuoteIcon,
    subStats: [
      { label: 'Total Quotes', value: 'N/A' },
      { label: 'Approved', value: 'N/A' },
      { label: 'Pending Approval', value: 'N/A' },
      { label: 'Rejected Quotes', value: 'N/A' },
    ],
    viewMoreLink: '/create-document',
  },
];


export default function DashboardPage() {
  const [groupedDashboardStats, setGroupedDashboardStats] = useState<GroupedStatCardItem[]>(initialDashboardCardsConfig);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<{ month?: string; year?: string }>({
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    year: new Date().getFullYear().toString(),
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDashboardStats = useCallback(async (filters?: { month?: string; year?: string }) => {
    setIsLoadingStats(true);
    setStatsError(null);
    
    const queryParams = new URLSearchParams();
    if (filters?.month && filters.month !== 'all') queryParams.append('month', filters.month);
    if (filters?.year && filters.year !== 'all') queryParams.append('year', filters.year);

    try {
      const response = await fetch(`/api/dashboard-stats?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch dashboard stats');
      }
      const data: FetchedDashboardStats = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Fetched dashboard data is not a valid object.');
      }

      setGroupedDashboardStats(prevCards =>
        prevCards.map(card => {
          let newSubStats: SubStat[] = card.subStats.map(ss => ({ ...ss, value: 'N/A' })); 

          if (card.title === 'User Activity' && data.users) {
            newSubStats = [
              { label: 'Total Users', value: (data.users.total ?? 0).toString() },
              { label: 'Active Users', value: (data.users.active ?? 0).toString() },
              { label: 'Inactive Users', value: (data.users.inactive ?? 0).toString() },
            ];
          } else if (card.title === 'Purchase Orders' && data.purchaseOrders) {
            newSubStats = [
              { label: 'Total POs', value: (data.purchaseOrders.total ?? 0).toString() },
              { label: 'Approved', value: (data.purchaseOrders.approved ?? 0).toString() },
              { label: 'Pending Approval', value: (data.purchaseOrders.pending ?? 0).toString() },
              { label: 'Rejected', value: (data.purchaseOrders.rejected ?? 0).toString() },
            ];
          } else if (card.title === 'Goods Received' && data.goodsReceived) {
            newSubStats = [
              { label: 'Approved POs (Open)', value: (data.goodsReceived.totalApprovedPOs ?? 0).toString() },
              { label: 'POs with GRN Activity', value: (data.goodsReceived.totalPOsWithGRNActivity ?? 0).toString() },
            ];
          } else if (card.title === 'Purchase Requisitions' && data.requisitions) {
            newSubStats = [
              { label: 'Total Requisitions', value: (data.requisitions.total ?? 0).toString() },
            ];
          } else if (card.title === 'Fuel Management' && data.fuel) {
            newSubStats = [
              { label: 'Total Vehicles/Tags', value: (data.fuel.totalTags ?? 0).toString() },
              { label: 'Total Fuel Records', value: (data.fuel.totalRecords ?? 0).toString() },
            ];
          } else if (card.title === 'Client Quotations' && data.clientQuotes) {
            newSubStats = [
              { label: 'Total Quotes', value: (data.clientQuotes.total ?? 0).toString() },
              { label: 'Approved', value: (data.clientQuotes.approved ?? 0).toString() },
              { label: 'Pending Approval', value: (data.clientQuotes.pending ?? 0).toString() },
              { label: 'Rejected Quotes', value: (data.clientQuotes.rejected ?? 0).toString() },
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
    fetchDashboardStats(currentFilters);
  }, [fetchDashboardStats, currentFilters]);

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to dashboard:', filters);
    setCurrentFilters({ month: filters.month, year: filters.year });
    setRefreshKey(prevKey => prevKey + 1); 
  };
  
  const handleRefreshAllData = () => {
    fetchDashboardStats(currentFilters);
    setRefreshKey(prevKey => prevKey + 1);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <FilterBar
          onFilterApply={handleFilterApply}
          showApproverFilter={false} 
          showRequestorFilter={false} 
          showSiteFilter={false} 
        />
        <Button onClick={handleRefreshAllData} variant="outline" size="sm" className="ml-4">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoadingStats ? (
          initialDashboardCardsConfig.map((cardConfig, index) => (
            <Card key={index} className="shadow-lg flex flex-col h-[190px]">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-1 pt-3 px-3">
                <Skeleton className="h-4 w-3/5" /> 
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent className="pt-1 px-3 flex-grow">
                <Skeleton className="h-6 w-1/2 mb-2" /> 
                <div className="space-y-1.5"> 
                  <Skeleton className="h-3 w-full" /> 
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
               <CardFooter className="pt-2 pb-3 px-3"> 
                  <Skeleton className="h-7 w-full" /> 
               </CardFooter>
            </Card>
          ))
        ) : statsError ? (
          <div className="col-span-full p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive-foreground">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Error loading statistics</h3>
            </div>
            <p className="text-sm mb-3">{statsError}</p>
            <Button onClick={() => fetchDashboardStats(currentFilters)} variant="outline" size="sm" className="border-destructive text-destructive-foreground hover:bg-destructive/20">
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
        <MonthlyStatusChart key={`monthly-${refreshKey}`} filters={currentFilters} />
        <SitePOValueStatusChart key={`site-po-${refreshKey}`} filters={currentFilters} />
        <UsersByRoleChart key={`users-role-${refreshKey}`} /> {/* Added User Roles Chart */}
        <TagsByStatusChart key={`tags-status-${refreshKey}`} /> {/* Added Tags Status Chart */}
      </section>

      <section>
        <ActivityLogTable activities={activityLogData.slice(0, 5)} maxHeight="300px" />
      </section>
    </div>
  );
}
