
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
    if (filters?.limit) {
      queryParams.append('limit', filters.limit);
    } else {
      queryParams.append('limit', '200'); 
    }

    try {
      const response = await fetch(`/api/activity-log?${queryParams.toString()}`);
      if (!response.ok) {
        let specificErrorMessage = `API request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.details) {
            specificErrorMessage = `${errorData.details} (Status: ${response.status})`;
          } else if (errorData.error) {
            specificErrorMessage = `${errorData.error} (Status: ${response.status})`;
          } else if (errorData.message) {
            specificErrorMessage = `${errorData.message} (Status: ${response.status})`;
          }
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

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters to Activity Log:', filters);
    fetchActivities({ limit: '200' }); 
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
        onRetry={() => fetchActivities({ limit: '200' })}
      />
    </div>
  );
}
