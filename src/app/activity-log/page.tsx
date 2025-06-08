'use client';

import { ActivityLogTable } from '@/components/shared/activity-log-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { activityLogData } from '@/lib/mock-data'; // Using all mock data for this page

export default function ActivityLogPage() {
  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to Activity Log:', filters);
    // In a real app, you would fetch new data based on these filters
  };

  return (
    <div className="space-y-6">
      <FilterBar onFilterApply={handleFilterApply} />
      <ActivityLogTable
        title="Detailed Activity Log"
        description="Comprehensive log of all system and user activities."
        activities={activityLogData}
        maxHeight="calc(100vh - 280px)" // Adjust height for full page view
      />
    </div>
  );
}
