
import type { StatCardItem, ActivityLogEntry, ChartDataPoint, Supplier, Approver, User, Site, Allocation, Category } from '@/types';
import { Archive, BadgeCheck, Loader, FolderOpen, Users, FileText, GanttChartSquare, Layers, Building, Briefcase, Tag, ClipboardList, Fuel, Truck } from 'lucide-react';

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
  {
    title: 'Total Requisitions',
    value: 'N/A',
    icon: ClipboardList,
    description: 'Overview of internal purchase requisitions.',
  },
  {
    title: 'Client Quotes',
    value: 'N/A',
    icon: FileText, 
    description: 'Overview of quotes issued to Jachris Mining Services clients.',
  },
  {
    title: 'Fuel Records',
    value: 'N/A',
    icon: Fuel,
    description: 'Summary of logged fuel consumption entries.',
  },
  {
    title: 'Goods Received Notes',
    value: 'N/A',
    icon: Truck,
    description: 'Overview of recent GRNs processed.',
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
  { id: '6', user: 'Eve Green', action: 'Added new supplier: MozTech Solutions', timestamp: '2024-07-29 11:00 AM' },
  { id: '7', user: 'System', action: 'User Frank Black logged in', timestamp: '2024-07-29 11:05 AM' },
  { id: '8', user: 'Grace Hall', action: 'Modified PO #PO12340 quantities', timestamp: '2024-07-29 11:15 AM', details: 'Item ID 2, new quantity 15' },
];

export const managementTables = [
  { name: 'Approvers', href: '/management/approvers', icon: Users, count: 5, description: "Manage PO approvers" },
  { name: 'Users', href: '/management/users', icon: Users, count: 8, description: "Manage system users and roles" },
  { name: 'Sites', href: '/management/sites', icon: Building, count: 4, description: "Manage company sites/locations" },
  { name: 'Allocations', href: '/management/allocations', icon: Briefcase, count: 10, description: "Manage cost allocations/departments" },
  { name: 'Categories', href: '/management/categories', icon: Tag, count: 12, description: "Manage item and service categories" },
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

export const mockSuppliers: Supplier[] = [
  { supplierCode: 'supplier1', supplierName: 'Lebreya Limitada', emailAddress: 'lebreya@fulaho.com', salesPerson: 'Mr Eugenio', cellNumber: '258 84 784 3306', nuitNumber: '401034676', physicalAddress: 'En7, Matema Loja 3, Tete' },
  { supplierCode: 'supplier2', supplierName: 'Global Office Solutions', emailAddress: 'sales@globaloffice.co.mz', salesPerson: 'Ana Pereira', cellNumber: '258 82 123 4567', nuitNumber: '400123456', physicalAddress: 'Av. 25 de Setembro, Maputo' },
  { supplierCode: 'supplier3', supplierName: 'Tete Hardware Store', emailAddress: 'info@tetehardware.com', salesPerson: 'John Banda', cellNumber: '258 87 987 6543', nuitNumber: '400654321', physicalAddress: 'Bairro Josina Machel, Tete' },
  { supplierCode: 'supplier4', supplierName: 'Moz Safety Gear', emailAddress: 'contact@mozsafety.co.mz', salesPerson: 'Sofia Charle', cellNumber: '258 86 111 2222', nuitNumber: '400987654', physicalAddress: 'Rua da Segurança, Beira' },
  { supplierCode: 'supplier5', supplierName: 'InfoTech Mozambique', emailAddress: 'support@infotech.co.mz', salesPerson: 'David Junior', cellNumber: '258 84 555 0000', nuitNumber: '400112233', physicalAddress: 'Av. Eduardo Mondlane, Maputo' },
];

export const mockApproversData: Approver[] = [
  { id: 'APP001', name: 'Alice Wonderland', email: 'alice.w@example.com', department: 'Finance', isActive: true },
  { id: 'APP002', name: 'Bob The Builder', email: 'bob.b@example.com', department: 'Operations', isActive: true },
  { id: 'APP003', name: 'Charles Xavier', email: 'charles.x@example.com', department: 'Management', isActive: false },
  { id: 'APP004', name: 'Diana Prince', email: 'diana.p@example.com', department: 'HR', isActive: true },
  { id: 'APP005', name: 'Edward Scissorhands', email: 'edward.s@example.com', department: 'Procurement', isActive: true },
];

export const mockUsersData: User[] = [
  { id: 'USR001', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', siteAccess: ['SITE001', 'SITE002'], isActive: true },
  { id: 'USR002', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Manager', siteAccess: ['SITE001'], isActive: true },
  { id: 'USR003', name: 'Peter Pan', email: 'peter.pan@example.com', role: 'User', siteAccess: ['SITE002'], isActive: false },
  { id: 'USR004', name: 'Clark Kent', email: 'clark.kent@example.com', role: 'Viewer', siteAccess: ['all'], isActive: true },
  { id: 'USR005', name: 'Bruce Wayne', email: 'bruce.wayne@example.com', role: 'Manager', siteAccess: ['SITE003'], isActive: true },
  { id: 'USR006', name: 'Selina Kyle', email: 'selina.kyle@example.com', role: 'User', siteAccess: ['SITE001'], isActive: true },
  { id: 'USR007', name: 'Tony Stark', email: 'tony.stark@example.com', role: 'Admin', siteAccess: ['all'], isActive: false },
  { id: 'USR008', name: 'Steve Rogers', email: 'steve.rogers@example.com', role: 'User', siteAccess: ['SITE003', 'SITE004'], isActive: true },
];

export const mockSitesData: Site[] = [
  { id: 1, name: 'Head Office - Maputo', location: 'Maputo, Mozambique', siteCode: 'HQ-MPM' },
  { id: 2, name: 'Tete Operations Base', location: 'Tete, Mozambique', siteCode: 'OPS-TET' },
  { id: 3, name: 'Beira Warehouse', location: 'Beira, Mozambique', siteCode: 'WH-BEW' },
  { id: 4, name: 'Nampula Branch', location: 'Nampula, Mozambique', siteCode: 'BR-NPL' },
];

export const mockAllocationsData: Allocation[] = [
  { id: 'ALLOC001', name: 'Administration', code: 'ADM001', description: 'General administrative costs' },
  { id: 'ALLOC002', name: 'Operations - Site A', code: 'OPS-A01', description: 'Operational costs for Site A' },
  { id: 'ALLOC003', name: 'IT Department', code: 'ITD001', description: 'Information Technology expenses' },
  { id: 'ALLOC004', name: 'Marketing & Sales', code: 'MKT001' },
  { id: 'ALLOC005', name: 'Logistics', code: 'LOG001', description: 'Transport and logistics costs' },
  { id: 'ALLOC006', name: 'Maintenance', code: 'MNT001' },
  { id: 'ALLOC007', name: 'HR Department', code: 'HRD001' },
  { id: 'ALLOC008', name: 'Project Alpha', code: 'PRJ-ALP' },
  { id: 'ALLOC009', name: 'Project Beta', code: 'PRJ-BET' },
  { id: 'ALLOC010', name: 'Capital Expenditure', code: 'CAPEX01' },
];

export const mockCategoriesData: Category[] = [
  { id: 1, category: 'Stationery' },
  { id: 2, category: 'IT Equipment' },
  { id: 3, category: 'Safety Gear (PPE)' },
  { id: 4, category: 'Tools & Hardware' },
  { id: 5, category: 'Consultancy Services' },
  { id: 6, category: 'Vehicle Maintenance' },
  { id: 7, category: 'Office Furniture' },
  { id: 8, category: 'Cleaning Supplies' },
  { id: 9, category: 'Safety Equipment' },
  { id: 10, category: 'Fleet Management' },
  { id: 11, category: 'Software Licenses' },
  { id: 12, category: 'Travel & Accommodation' },
];
