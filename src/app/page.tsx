
'use client';

import { useEffect, useState, useCallback } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { FilterBar } from '@/components/shared/filter-bar';
import { MonthlyStatusChart } from '@/components/dashboard/monthly-status-chart';
import { SitePOValueStatusChart } from '@/components/dashboard/site-po-value-status-chart';
import { ActivityLogTable } from '@/components/shared/activity-log-table';
import { dashboardStats as initialDashboardStatsConfig, activityLogData } from '@/lib/mock-data';
import type { StatCardItem } from '@/types';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FetchedStats {
  totalPOs: number;
  pendingApprovalPOs: number;
  openPOs: number; // Represents 'Approved' POs
  totalRequisitions: number;
  clientQuotesCount: string | number;
  fuelRecordsCount: string | number;
  grnCount: string | number;
}

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<StatCardItem[]>(initialDashboardStatsConfig);
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
      const data: FetchedStats = await response.json();
      
      setDashboardStats(prevStats =>
        prevStats.map(stat => {
          switch (stat.title) {
            case 'Total POs': return { ...stat, value: data.totalPOs.toString() };
            case 'Pending Approval POs': return { ...stat, value: data.pendingApprovalPOs.toString() };
            case 'Open POs (Approved)': return { ...stat, value: data.openPOs.toString() };
            case 'Total Requisitions': return { ...stat, value: data.totalRequisitions.toString() };
            case 'Client Quotes': return { ...stat, value: data.clientQuotesCount.toString() };
            case 'Fuel Records': return { ...stat, value: data.fuelRecordsCount.toString() };
            case 'Goods Received Notes': return { ...stat, value: data.grnCount.toString() };
            default: return stat;
          }
        }).filter(stat => stat.title !== 'Completed POs' && stat.title !== 'Partially Completed POs') // Remove old stats
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
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <FilterBar onFilterApply={handleFilterApply} />
        <Button onClick={handleRefreshAllData} variant="outline" size="sm" className="ml-4">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoadingStats ? (
          Array.from({ length: dashboardStats.length }).map((_, index) => ( // Use current dashboardStats length for skeletons
            <div key={index} className="p-6 rounded-lg border bg-card shadow-sm flex flex-col justify-between h-[140px] items-center text-center">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2 w-full">
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div> 
                <div className="h-5 w-5 bg-muted rounded-full"></div> 
              </div>
              <div className="w-full flex flex-col items-center">
                <div className="h-8 bg-muted rounded w-1/2 mb-1"></div> 
                <div className="h-3 bg-muted rounded w-full mt-1"></div> 
              </div>
            </div>
          ))
        ) : statsError ? (
          <div className="md:col-span-2 lg:col-span-4 p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive-foreground">
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
          dashboardStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <MonthlyStatusChart key={`monthly-${refreshKey}`} /> 
        <SitePOValueStatusChart key={`site-po-${refreshKey}`} />
      </section>

      <section>
        <ActivityLogTable activities={activityLogData.slice(0, 5)} maxHeight="300px" />
      </section>
    </div>
  );
}
