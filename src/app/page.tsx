
'use client';

import { useEffect, useState, useCallback } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { FilterBar } from '@/components/shared/filter-bar';
import { MonthlyStatusChart } from '@/components/dashboard/monthly-status-chart';
import { AllocationsChart } from '@/components/dashboard/allocations-chart';
import { ActivityLogTable } from '@/components/shared/activity-log-table';
import { dashboardStats as initialDashboardStatsConfig, monthlyStatusData, allocationsData, activityLogData } from '@/lib/mock-data';
import type { StatCardItem } from '@/types';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FetchedStats {
  totalPOs: number;
  completedPOs: number;
  pendingApprovalPOs: number;
  openPOs: number;
  totalRequisitions: number;
  clientQuotesCount: string | number;
  fuelRecordsCount: string | number;
  grnCount: string | number;
}

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<StatCardItem[]>(initialDashboardStatsConfig);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

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
            case 'Completed POs': return { ...stat, value: data.completedPOs.toString() };
            case 'Pending Approval': return { ...stat, value: data.pendingApprovalPOs.toString() };
            case 'Open POs': return { ...stat, value: data.openPOs.toString() };
            case 'Total Requisitions': return { ...stat, value: data.totalRequisitions.toString() };
            case 'Client Quotes': return { ...stat, value: data.clientQuotesCount.toString() };
            case 'Fuel Records': return { ...stat, value: data.fuelRecordsCount.toString() };
            case 'Goods Received Notes': return { ...stat, value: data.grnCount.toString() };
            default: return stat;
          }
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

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to dashboard (stats will not refetch based on these filters yet):', filters);
    // Future: Potentially refetch stats based on filters if API supports it
  };

  return (
    <div className="space-y-6">
      <FilterBar onFilterApply={handleFilterApply} />

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingStats ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="p-6 rounded-lg border bg-card shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div> {/* Skeleton for title */}
                <div className="h-5 w-5 bg-muted rounded-full"></div> {/* Skeleton for icon */}
              </div>
              <div>
                <div className="h-7 bg-muted rounded w-1/2 mb-1"></div> {/* Skeleton for value */}
                <div className="h-3 bg-muted rounded w-full"></div> {/* Skeleton for description */}
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
        <MonthlyStatusChart data={monthlyStatusData} />
        <AllocationsChart data={allocationsData} />
      </section>

      <section>
        <ActivityLogTable activities={activityLogData.slice(0, 5)} maxHeight="300px" />
      </section>
    </div>
  );
}
