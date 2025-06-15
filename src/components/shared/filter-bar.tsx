
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { monthsWithAll, yearsWithAll, sitesWithAll, mockApproversFilter, mockRequestorsFilter } from '@/lib/mock-data';
import type { FilterOption } from '@/types';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  onFilterApply?: (filters: {
    month?: string;
    year?: string;
    site?: string;
    approver?: string;
    requestor?: string;
  }) => void;
  showApproverFilter?: boolean;
  showRequestorFilter?: boolean;
}

export function FilterBar({ onFilterApply, showApproverFilter = false, showRequestorFilter = false }: FilterBarProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>('all');
  const [selectedYear, setSelectedYear] = useState<string | undefined>('all');
  const [selectedSite, setSelectedSite] = useState<string | undefined>('all');
  const [selectedApprover, setSelectedApprover] = useState<string | undefined>('all');
  const [selectedRequestor, setSelectedRequestor] = useState<string | undefined>('all');

  const handleApplyFilters = () => {
    onFilterApply?.({
      month: selectedMonth,
      year: selectedYear,
      site: selectedSite,
      approver: showApproverFilter ? selectedApprover : undefined,
      requestor: showRequestorFilter ? selectedRequestor : undefined,
    });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-end sm:flex-wrap">
      <div className="grid flex-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div>
          <label htmlFor="month-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Month</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger id="month-filter">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthsWithAll.map((month: FilterOption) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="year-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Year</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year-filter">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {yearsWithAll.map((year: FilterOption) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="site-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Site</label>
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger id="site-filter">
              <SelectValue placeholder="Select Site" />
            </SelectTrigger>
            <SelectContent>
              {sitesWithAll.map((site: FilterOption) => (
                <SelectItem key={site.value} value={site.value}>
                  {site.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {showApproverFilter && (
          <div>
            <label htmlFor="approver-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Approver</label>
            <Select value={selectedApprover} onValueChange={setSelectedApprover}>
              <SelectTrigger id="approver-filter">
                <SelectValue placeholder="Select Approver" />
              </SelectTrigger>
              <SelectContent>
                {mockApproversFilter.map((approver: FilterOption) => (
                  <SelectItem key={approver.value} value={approver.value}>
                    {approver.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {showRequestorFilter && (
          <div>
            <label htmlFor="requestor-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Requestor</label>
            <Select value={selectedRequestor} onValueChange={setSelectedRequestor}>
              <SelectTrigger id="requestor-filter">
                <SelectValue placeholder="Select Requestor" />
              </SelectTrigger>
              <SelectContent>
                {mockRequestorsFilter.map((requestor: FilterOption) => (
                  <SelectItem key={requestor.value} value={requestor.value}>
                    {requestor.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <Button onClick={handleApplyFilters} className="mt-4 sm:mt-0 sm:self-end">
        <Filter className="mr-2 h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
}
