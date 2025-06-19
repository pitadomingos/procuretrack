
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FilterOption, Site, Approver, User, Tag } from '@/types';
import { Filter, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const months: FilterOption[] = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
  { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
  { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
];
const monthsWithAll: FilterOption[] = [{ value: 'all', label: 'All Months' }, ...months];

const currentYear = new Date().getFullYear();
const years: FilterOption[] = Array.from({ length: 10 }, (_, i) => ({
  value: (currentYear - i).toString(),
  label: (currentYear - i).toString(),
}));
const yearsWithAll: FilterOption[] = [{ value: 'all', label: 'All Years' }, ...years];

interface FilterBarProps {
  onFilterApply?: (filters: {
    month?: string;
    year?: string;
    siteId?: string;
    approverId?: string;
    creatorUserId?: string;
    tagId?: string;
    driver?: string;
    user?: string; // For generic user name filter (e.g., Activity Log)
    action?: string; // For generic action type filter (e.g., Activity Log)
    status?: string; // For status filter, e.g., Requisitions
  }) => void;
  showApproverFilter?: boolean;
  showRequestorFilter?: boolean;
  showSiteFilter?: boolean;
  showTagFilter?: boolean;
  showDriverFilter?: boolean;
  showUserFilter?: boolean;
  showActionTypeFilter?: boolean;
  showStatusFilter?: boolean; // Added for Requisition status
  statusOptions?: FilterOption[]; // Options for the status dropdown
}

export function FilterBar({
  onFilterApply,
  showApproverFilter = false,
  showRequestorFilter = false,
  showSiteFilter = false,
  showTagFilter = false,
  showDriverFilter = false,
  showUserFilter = false,
  showActionTypeFilter = false,
  showStatusFilter = false,
  statusOptions = [],
}: FilterBarProps) {
  const { toast } = useToast();
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  const [sites, setSites] = useState<FilterOption[]>([{ value: 'all', label: 'All Sites' }]);
  const [selectedSite, setSelectedSite] = useState<string>('all');

  const [approvers, setApprovers] = useState<FilterOption[]>([{ value: 'all', label: 'All Approvers' }]);
  const [selectedApprover, setSelectedApprover] = useState<string>('all');

  const [requestors, setRequestors] = useState<FilterOption[]>([{ value: 'all', label: 'All Requestors' }]);
  const [selectedRequestor, setSelectedRequestor] = useState<string>('all');
  
  const [tags, setTags] = useState<FilterOption[]>([{ value: 'all', label: 'All Tags' }]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  const [driverName, setDriverName] = useState<string>('');
  const [userNameFilter, setUserNameFilter] = useState<string>('');
  const [actionTypeFilterText, setActionTypeFilterText] = useState<string>(''); // Renamed from actionTypeFilter to avoid conflict with prop
  const [selectedStatus, setSelectedStatus] = useState<string>('all');


  const fetchFilterData = useCallback(async () => {
    setIsLoadingFilters(true);
    try {
      const promises = [];
      if (showSiteFilter) promises.push(fetch('/api/sites'));
      else promises.push(Promise.resolve(null)); 

      if (showApproverFilter) promises.push(fetch('/api/approvers'));
      else promises.push(Promise.resolve(null));

      if (showRequestorFilter) promises.push(fetch('/api/users'));
      else promises.push(Promise.resolve(null));

      if (showTagFilter) promises.push(fetch('/api/tags'));
      else promises.push(Promise.resolve(null));


      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map(res => res && res.ok ? res.json() : Promise.resolve([])));

      if (showSiteFilter && data[0]) {
        const siteData: Site[] = data[0];
        setSites([{ value: 'all', label: 'All Sites' }, ...siteData.map(s => ({ value: s.id.toString(), label: `${s.siteCode || s.name} (${s.name})` }))]);
      }
      if (showApproverFilter && data[1]) {
        const approverData: Approver[] = data[1];
        setApprovers([{ value: 'all', label: 'All Approvers' }, ...approverData.map(a => ({ value: a.id, label: a.name }))]);
      }
      if (showRequestorFilter && data[2]) {
        const userData: User[] = data[2];
        setRequestors([{ value: 'all', label: 'All Requestors' }, ...userData.map(u => ({ value: u.id, label: u.name }))]);
      }
      if (showTagFilter && data[3]) {
        const tagData: Tag[] = data[3];
        setTags([{ value: 'all', label: 'All Tags' }, ...tagData.map(t => ({ value: t.id, label: `${t.tagNumber} (${t.make || ''} ${t.model || t.type || ''})`}))]);
      }

    } catch (error) {
      toast({ title: 'Error', description: 'Could not load some filter options from server.', variant: 'destructive' });
      console.error("Error fetching filter data:", error);
    } finally {
      setIsLoadingFilters(false);
    }
  }, [toast, showSiteFilter, showApproverFilter, showRequestorFilter, showTagFilter]);

  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);

  const handleApplyFilters = () => {
    onFilterApply?.({
      month: selectedMonth,
      year: selectedYear,
      siteId: showSiteFilter ? selectedSite : undefined,
      approverId: showApproverFilter ? selectedApprover : undefined,
      creatorUserId: showRequestorFilter ? selectedRequestor : undefined,
      tagId: showTagFilter ? selectedTag : undefined,
      driver: showDriverFilter ? driverName : undefined,
      user: showUserFilter ? userNameFilter : undefined,
      action: showActionTypeFilter ? actionTypeFilterText : undefined,
      status: showStatusFilter ? selectedStatus : undefined,
    });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-end sm:flex-wrap">
      <div className="grid flex-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div>
          <label htmlFor="month-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Month</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger id="month-filter"><SelectValue placeholder="Select Month" /></SelectTrigger>
            <SelectContent>{monthsWithAll.map((month: FilterOption) => (<SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="year-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Year</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year-filter"><SelectValue placeholder="Select Year" /></SelectTrigger>
            <SelectContent>{yearsWithAll.map((year: FilterOption) => (<SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        {showSiteFilter && (
          <div>
            <label htmlFor="site-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Site</label>
            <Select value={selectedSite} onValueChange={setSelectedSite} disabled={isLoadingFilters}>
              <SelectTrigger id="site-filter"><SelectValue placeholder={isLoadingFilters ? "Loading sites..." : "Select Site"} /></SelectTrigger>
              <SelectContent>{sites.map((site: FilterOption) => (<SelectItem key={site.value} value={site.value}>{site.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        )}
        {showApproverFilter && (
          <div>
            <label htmlFor="approver-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Approver</label>
            <Select value={selectedApprover} onValueChange={setSelectedApprover} disabled={isLoadingFilters}>
              <SelectTrigger id="approver-filter"><SelectValue placeholder={isLoadingFilters ? "Loading approvers..." : "Select Approver"} /></SelectTrigger>
              <SelectContent>{approvers.map((approver: FilterOption) => (<SelectItem key={approver.value} value={approver.value}>{approver.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        )}
        {showRequestorFilter && (
          <div>
            <label htmlFor="requestor-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Requestor</label>
            <Select value={selectedRequestor} onValueChange={setSelectedRequestor} disabled={isLoadingFilters}>
              <SelectTrigger id="requestor-filter"><SelectValue placeholder={isLoadingFilters ? "Loading requestors..." : "Select Requestor"} /></SelectTrigger>
              <SelectContent>{requestors.map((requestor: FilterOption) => (<SelectItem key={requestor.value} value={requestor.value}>{requestor.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        )}
        {showTagFilter && (
            <div>
                <label htmlFor="tag-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Tag</label>
                <Select value={selectedTag} onValueChange={setSelectedTag} disabled={isLoadingFilters}>
                    <SelectTrigger id="tag-filter"><SelectValue placeholder={isLoadingFilters ? "Loading tags..." : "Select Tag"} /></SelectTrigger>
                    <SelectContent>{tags.map((tag: FilterOption) => (<SelectItem key={tag.value} value={tag.value}>{tag.label}</SelectItem>))}</SelectContent>
                </Select>
            </div>
        )}
        {showDriverFilter && (
            <div>
                <label htmlFor="driver-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Driver Name</label>
                <Input
                    id="driver-filter"
                    placeholder="Enter driver name"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    disabled={isLoadingFilters}
                />
            </div>
        )}
        {showUserFilter && (
          <div>
            <label htmlFor="user-name-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Filter by User</label>
            <Input
                id="user-name-filter"
                placeholder="Enter user name..."
                value={userNameFilter}
                onChange={(e) => setUserNameFilter(e.target.value)}
                disabled={isLoadingFilters}
            />
          </div>
        )}
        {showActionTypeFilter && (
          <div>
            <label htmlFor="action-type-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Filter by Action</label>
            <Input
                id="action-type-filter"
                placeholder="e.g., Created, Approved..."
                value={actionTypeFilterText}
                onChange={(e) => setActionTypeFilterText(e.target.value)}
                disabled={isLoadingFilters}
            />
          </div>
        )}
        {showStatusFilter && statusOptions.length > 0 && (
          <div>
            <label htmlFor="status-filter" className="mb-1 block text-sm font-medium text-card-foreground/80">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus} disabled={isLoadingFilters}>
              <SelectTrigger id="status-filter"><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((option: FilterOption) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <Button onClick={handleApplyFilters} className="mt-4 sm:mt-0 sm:self-end" disabled={isLoadingFilters}>
        {isLoadingFilters ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Filter className="mr-2 h-4 w-4" />}
        Apply Filters
      </Button>
    </div>
  );
}

