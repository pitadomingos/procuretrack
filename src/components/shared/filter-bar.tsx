'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { months, years, sites } from '@/lib/mock-data';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  onFilterApply?: (filters: { month?: string; year?: string; site?: string }) => void;
}

export function FilterBar({ onFilterApply }: FilterBarProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [selectedSite, setSelectedSite] = useState<string | undefined>();

  const handleApplyFilters = () => {
    onFilterApply?.({
      month: selectedMonth,
      year: selectedYear,
      site: selectedSite,
    });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-end">
      <div className="grid flex-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div>
          <label htmlFor="month-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Month</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger id="month-filter">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
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
              {years.map((year) => (
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
              {sites.map((site) => (
                <SelectItem key={site.value} value={site.value}>
                  {site.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleApplyFilters} className="mt-2 sm:mt-0 sm:self-end">
        <Filter className="mr-2 h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
}
