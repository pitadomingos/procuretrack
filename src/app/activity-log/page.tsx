
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ActivityLogTable } from '@/components/shared/activity-log-table';
import { FilterBar } from '@/components/shared/filter-bar';
import type { ActivityLogEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ActivityLogFilters {
  limit?: string;
  month?: string;
  year?: string;
  user?: string;
  action?: string; // Changed from actionType to action to match FilterBar
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActivities = useCallback(async (filters?: ActivityLogFilters) => {
    setIsLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();

    if (filters?.limit) queryParams.append('limit', filters.limit);
    else queryParams.append('limit', '200'); 

    if (filters?.month && filters.month !== 'all') queryParams.append('month', filters.month);
    if (filters?.year && filters.year !== 'all') queryParams.append('year', filters.year);
    // Use 'userFilter' and 'actionTypeFilter' for query params to match backend expectations
    if (filters?.user && filters.user.trim() !== '') queryParams.append('userFilter', filters.user.trim());
    if (filters?.action && filters.action.trim() !== '') queryParams.append('actionTypeFilter', filters.action.trim());

    console.log('[ActivityLogPage] Fetching activities with query params:', queryParams.toString());

    try {
      const response = await fetch(`/api/activity-log?${queryParams.toString()}`);
      if (!response.ok) {
        let specificErrorMessage = `API request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.details) specificErrorMessage = `${errorData.details} (Status: ${response.status})`;
          else if (errorData.error) specificErrorMessage = `${errorData.error} (Status: ${response.status})`;
          else if (errorData.message) specificErrorMessage = `${errorData.message} (Status: ${response.status})`;
        } catch (jsonError) {
          specificErrorMessage = `${response.statusText || 'Failed to fetch activity log.'} (Status: ${response.status})`;
        }
        throw new Error(specificErrorMessage);
      }
      const data: ActivityLogEntry[] = await response.json();
      setActivities(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: "Error Loading Activity Log",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchActivities(); 
  }, [fetchActivities]);

  const handleFilterApply = (filtersFromBar: any) => {
    console.log('[ActivityLogPage] Applying filters from FilterBar:', filtersFromBar);
    const activityFilters: ActivityLogFilters = {
        limit: '200',
        month: filtersFromBar.month,
        year: filtersFromBar.year,
        user: filtersFromBar.user, 
        action: filtersFromBar.action, // Changed from actionType to action
    };
    fetchActivities(activityFilters);
  };

  return (
    <div className="space-y-6">
      <FilterBar 
        onFilterApply={handleFilterApply}
        showUserFilter={true} 
        showActionTypeFilter={true}
      />
      <ActivityLogTable
        title="Detailed Activity Log"
        description="Comprehensive log of all system and user activities."
        activities={activities}
        maxHeight="calc(100vh - 280px)"
        isLoading={isLoading}
        error={error}
        onRetry={() => fetchActivities({ limit: '200' })}
      />
    </div>
  );
}
