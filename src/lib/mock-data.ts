
import type { StatCardItem, ActivityLogEntry, ChartDataPoint } from '@/types';
import { Archive, BadgeCheck, Loader, FolderOpen, Users, FileText, GanttChartSquare, Layers } from 'lucide-react';

export const dashboardStats: StatCardItem[] = [
  {
    title: 'Total POs',
    value: '1,234',
    icon: Archive,
    description: 'All purchase orders created.',
  },
  {
    title: 'Completed POs',
    value: '987',
    icon: BadgeCheck,
    description: 'POs fully received and closed.',
  },
  {
    title: 'Partially Completed',
    value: '150',
    icon: Loader, // Using Loader as a placeholder for partially complete
    description: 'POs with some items received.',
  },
  {
    title: 'Open POs',
    value: '97',
    icon: FolderOpen,
    description: 'POs awaiting approval or items.',
  },
];

export const monthlyStatusData: ChartDataPoint[] = [
  { name: 'Jan', Completed: 400, Open: 240, PartiallyCompleted: 100 },
  { name: 'Feb', Completed: 300, Open: 139, PartiallyCompleted: 90 },
  { name: 'Mar', Completed: 200, Open: 480, PartiallyCompleted: 120 },
  { name: 'Apr', Completed: 278, Open: 390, PartiallyCompleted: 80 },
  { name: 'May', Completed: 189, Open: 480, PartiallyCompleted: 70 },
  { name: 'Jun', Completed: 239, Open: 380, PartiallyCompleted: 110 },
];

export const allocationsData: ChartDataPoint[] = [
  { name: 'Site A', Completed: 120, PartiallyCompleted: 60, Closed: 200 },
  { name: 'Site B', Completed: 90, PartiallyCompleted: 40, Closed: 150 },
  { name: 'Site C', Completed: 150, PartiallyCompleted: 80, Closed: 220 },
  { name: 'Site D', Completed: 70, PartiallyCompleted: 30, Closed: 100 },
];

export const activityLogData: ActivityLogEntry[] = [
  { id: '1', user: 'Alice Smith', action: 'Created PO #PO12345', timestamp: '2024-07-28 10:30 AM', details: 'Vendor: Acme Corp, Total: $1500' },
  { id: '2', user: 'Bob Johnson', action: 'Approved PO #PO12344', timestamp: '2024-07-28 09:15 AM' },
  { id: '3', user: 'System', action: 'GRN #GRN007 received for PO #PO12300', timestamp: '2024-07-27 03:45 PM', details: 'Items: 5/10 received' },
  { id: '4', user: 'Carol White', action: 'Updated user permissions for David Lee', timestamp: '2024-07-27 01:20 PM' },
  { id: '5', user: 'Alice Smith', action: 'Generated Back Order Report', timestamp: '2024-07-27 11:00 AM', details: 'Date Range: 2024-07-01 to 2024-07-27' },
];

export const managementTables = [
  { name: 'Approvers', icon: Users, count: 15, description: "Manage PO approvers" },
  { name: 'Users', icon: Users, count: 53, description: "Manage system users and roles" },
  { name: 'Sites', icon: GanttChartSquare, count: 7, description: "Manage company sites/locations" },
  { name: 'Allocations', icon: FileText, count: 30, description: "Manage cost allocations" },
  { name: 'Categories', icon: Layers, count: 22, description: "Manage item and service categories" },
];

export const months = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
  { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
  { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

export const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 5 }, (_, i) => ({
  value: (currentYear - i).toString(),
  label: (currentYear - i).toString(),
}));

export const sites = [
  { value: 'site_a', label: 'Site A' },
  { value: 'site_b', label: 'Site B' },
  { value: 'site_c', label: 'Site C' },
  { value: 'all', label: 'All Sites' },
];

// Mock data for Analytics Page
export const spendByVendorData: ChartDataPoint[] = [
  { name: 'Lebreya Lda', Spend: 125000 },
  { name: 'Global Office Solutions', Spend: 85000 },
  { name: 'Tete Hardware Store', Spend: 62000 },
  { name: 'Moz Safety Gear', Spend: 45000 },
  { name: 'InfoTech Mozambique', Spend: 98000 },
];

export const poCountByCategoryData: ChartDataPoint[] = [
  { name: 'Stationery', Count: 150 },
  { name: 'IT Equipment', Count: 75 },
  { name: 'Safety Gear (PPE)', Count: 120 },
  { name: 'Tools & Hardware', Count: 95 },
  { name: 'Consultancy Services', Count: 30 },
  { name: 'Vehicle Maintenance', Count: 60 },
];
