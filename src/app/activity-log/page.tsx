
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ActivityLogTable } from '@/components/shared/activity-log-table';
import { FilterBar } from '@/components/shared/filter-bar';
import type { ActivityLogEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActivities = useCallback(async (filters?: any) => {
    setIsLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();
    // For now, the API only supports 'limit'. If filters are passed, they are logged.
    // A more advanced API would handle date ranges, user filters, etc.
    if (filters?.limit) {
      queryParams.append('limit', filters.limit);
    } else {
      queryParams.append('limit', '200'); // Default limit for full page view, adjust as needed
    }
    // console.log("Fetching activities with params:", queryParams.toString());

    try {
      const response = await fetch(`/api/activity-log?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        const errorMessage = errorData.error || errorData.details || errorData.message || 'Failed to fetch activity log.';
        throw new Error(errorMessage);
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

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to Activity Log:', filters);
    // Currently, the API primarily supports 'limit'.
    // For a real implementation, you'd pass filters to fetchActivities.
    // For now, we'll just re-fetch with default full page limit.
    fetchActivities({ limit: '200' }); // Or pass actual filters if API supported them
  };

  return (
    <div className="space-y-6">
      <FilterBar onFilterApply={handleFilterApply} />
      <ActivityLogTable
        title="Detailed Activity Log"
        description="Comprehensive log of all system and user activities."
        activities={activities}
        maxHeight="calc(100vh - 280px)"
        isLoading={isLoading}
        error={error}
        onRetry={() => fetchActivities({ limit: '200' })} // Retry with default full page limit
      />
    </div>
  );
}

