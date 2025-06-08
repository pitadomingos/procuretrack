'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { FilterBar } from '@/components/shared/filter-bar';
import { MonthlyStatusChart } from '@/components/dashboard/monthly-status-chart';
import { AllocationsChart } from '@/components/dashboard/allocations-chart';
import { ActivityLogTable } from '@/components/shared/activity-log-table';
import { dashboardStats, monthlyStatusData, allocationsData, activityLogData } from '@/lib/mock-data';

export default function DashboardPage() {
  const handleFilterApply = (filters: any) => {
    console.log('Applying filters:', filters);
    // In a real app, you would fetch new data based on these filters
  };

  return (
    <div className="space-y-6">
      <FilterBar onFilterApply={handleFilterApply} />

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
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
