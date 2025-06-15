
import type { StatCardItem, ActivityLogEntry, ChartDataPoint, Supplier, Approver, User, Site, Allocation, Category, Client, PurchaseOrderPayload, FilterOption } from '@/types';
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
  { name: 'TMW', Completed: 120, PartiallyCompleted: 60, Closed: 200 },
  { name: 'MEM', Completed: 90, PartiallyCompleted: 40, Closed: 150 },
  { name: 'FMS', Completed: 150, PartiallyCompleted: 80, Closed: 220 },
  { name: 'CHW', Completed: 70, PartiallyCompleted: 30, Closed: 100 },
];

export const activityLogData: ActivityLogEntry[] = [
  { id: '1', user: 'Gil Lunguze', action: 'Created PO #PO12345', timestamp: '2025-06-11 10:30 AM', details: 'Vendor: Acme Corp, Total: $1500' },
  { id: '2', user: 'Cherinne de Klerk', action: 'Approved PO #PO12344', timestamp: '2025-06-11 09:15 AM' },
  { id: '3', user: 'System', action: 'GRN #GRN007 received for PO #PO12300', timestamp: '2025-06-11 03:45 PM', details: 'Items: 5/10 received' },
  { id: '4', user: 'Pita Domingos', action: 'Updated user permissions for Portia Mbuva', timestamp: '2024-07-27 01:20 PM' },
  { id: '5', user: 'Tamara Moore', action: 'Generated Back Order Report', timestamp: '2025-06-11 11:00 AM', details: 'Date Range: 2025-05-01 to 2025-06-10' },
  { id: '6', user: 'Portia Mbuva', action: 'Added new supplier: MozTech Solutions', timestamp: '2025-06-10 11:00 AM' },
  { id: '7', user: 'System', action: 'User Cobus de Klerk logged in', timestamp: '2025-06-10 11:05 AM' },
  { id: '8', user: 'Portia Mbuva', action: 'Modified PO #PO12340 quantities', timestamp: '2025-06-10 11:15 AM', details: 'Item ID 2, new quantity 15' },
];

export const managementTables = [
  { name: 'Approvers', href: '/management/approvers', icon: Users, count: 5, description: "Manage PO approvers" },
  { name: 'Users', href: '/management/users', icon: Users, count: 8, description: "Manage system users and roles" },
  { name: 'Sites', href: '/management/sites', icon: Building, count: 4, description: "Manage company sites/locations" },
  { name: 'Allocations', href: '/management/allocations', icon: Briefcase, count: 10, description: "Manage cost allocations/departments" },
  { name: 'Categories', href: '/management/categories', icon: Tag, count: 12, description: "Manage item and service categories" },
];

export const months: FilterOption[] = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
  { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
  { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

export const currentYear = new Date().getFullYear();
export const years: FilterOption[] = Array.from({ length: 5 }, (_, i) => ({
  value: (currentYear - i).toString(),
  label: (currentYear - i).toString(),
}));

export const sites: Site[] = [ // Now conforms to Site type
  { id: 1, name: 'TMW', location: 'Tete Main Warehouse', value: 'site_a', label: 'TMW' },
  { id: 2, name: 'MEM', location: 'Mota Engil Mozambique', value: 'site_b', label: 'MEM' },
  { id: 3, name: 'FMS', location: 'Fuel Management System', value: 'site_c', label: 'FMS' },
  { id: 4, name: 'CHW', location: 'Container Hose Warehouse', value: 'site_d', label: 'CHW' },
];

export const monthsWithAll: FilterOption[] = [{ value: 'all', label: 'All Months' }, ...months];
export const yearsWithAll: FilterOption[] = [{ value: 'all', label: 'All Years' }, ...years];
export const sitesWithAll: FilterOption[] = [{ value: 'all', label: 'All Sites' }, ...sites.map(s => ({value: s.value as string, label: s.label as string}))];


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
  { id: 'APP001', name: 'Cherinne de Klerk', email: 'cherinne.deklerk@jachris.com', department: 'Administration', isActive: true },
  { id: 'APP002', name: 'Cobus de Klerk', email: 'cobus.deklerk.jachris.com', department: 'Operations', isActive: true },
  { id: 'APP003', name: 'Pita Domingos', email: 'pita.domingos@jachris.com', department: 'Management', isActive: false },
  { id: 'APP004', name: 'John Enem', email: 'john.enem@jachris.com', department: 'HR', isActive: true },
];

export const mockUsersData: User[] = [
  { id: 'USR001', name: 'Cobus de Klerk', email: 'cobus.deklerk@jachris.com', role: 'Admin', siteAccess: ['SITE001', 'SITE002'], isActive: true },
  { id: 'USR002', name: 'Cherinne de Klerk', email: 'cherinne.deklerk@jachris.com', role: 'Manager', siteAccess: ['SITE001'], isActive: true },
  { id: 'USR003', name: 'Pita Domingos', email: 'pita.domingos@jachris.com', role: 'User', siteAccess: ['SITE002'], isActive: false },
  { id: 'USR004', name: 'John Enem', email: 'john.enem@jachris.com', role: 'Viewer', siteAccess: ['all'], isActive: true },
  { id: 'USR005', name: 'Gil Lunguzi', email: 'gil.lunguze@jachris.com', role: 'Manager', siteAccess: ['SITE003'], isActive: true },
  { id: 'USR006', name: 'Portia Mbuva', email: 'portia.mbuva@jachris.com', role: 'User', siteAccess: ['SITE001'], isActive: true },
  { id: 'USR007', name: 'Tamara Moore', email: 'tamara.moore@jachris.com', role: 'Admin', siteAccess: ['all'], isActive: false },
  { id: 'USR008', name: 'Donvale de Rita', email: 'donvale.derita@jachris.com', role: 'User', siteAccess: ['SITE003', 'SITE004'], isActive: true },
];

export const mockSitesData: Site[] = [
  { id: 1, name: 'Tete Main Warehouse', location: 'Moatize - DC, Mozambique', siteCode: 'TMW-TET' },
  { id: 2, name: 'Mota Engil Mozambique', location: 'Moatize - Vulcan, Mozambique', siteCode: 'MEM-TET' },
  { id: 3, name: 'Fuel Management System', location: 'Moatize - Vulcan, Mozambique', siteCode: 'FMS-TET' },
  { id: 4, name: 'Container Hose Warehouse', location: 'Moatize - Vulcan, Mozambique', siteCode: 'CHW-TET' },
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

// MOCK CLIENT DATA
export const mockClients: Client[] = [
  { id: 'client-001', name: 'Vale Mozambique', email: 'procurement@vale.co.mz', contactPerson: 'Mr. Silva', address: 'Vale Office Park, Moatize' },
  { id: 'client-002', name: 'Mota-Engil', email: 'compras@mota-engil.mz', contactPerson: 'Ms. Ferreira', address: 'Mota-Engil Site, Tete' },
  { id: 'client-003', name: 'WBHO', email: 'tenders.mz@wbho.co.za', contactPerson: 'Mr. Botha', address: 'WBHO Camp, Nacala Corridor' },
  { id: 'client-004', name: 'Local Mining Co-op', email: 'info@localminingcoop.org', contactPerson: 'Sra. Tembe', address: 'Rua da Cooperativa, Tete City' },
];

// For PO List View
export const mockPurchaseOrders: PurchaseOrderPayload[] = [
  {
    id: 101, poNumber: 'PO-00101', creationDate: '2024-07-01T10:00:00Z', status: 'Approved',
    supplierId: 'supplier1', grandTotal: 1500, currency: 'MZN', requestedByName: 'Alice Smith', approverId: 'APP001',
    items: [{id:1, description: 'Item A', quantity:10, unitPrice:100, categoryId:1, uom:'EA'}], subTotal: 1293.10, vatAmount: 206.90, pricesIncludeVat: false, creatorUserId: 'USR002',
    approverName: 'Cherinne de Klerk', supplierDetails: { supplierCode: 'supplier1', supplierName: 'Lebreya Limitada' }
  },
  {
    id: 102, poNumber: 'PO-00102', creationDate: '2024-06-15T14:30:00Z', status: 'Pending Approval',
    supplierId: 'supplier2', grandTotal: 800, currency: 'USD', requestedByName: 'Bob Johnson', approverId: 'APP002',
    items: [{id:2, description: 'Service B', quantity:1, unitPrice:800, categoryId:5, uom:'SVC'}], subTotal: 800, vatAmount: 0, pricesIncludeVat: false, creatorUserId: 'USR005',
    approverName: 'Cobus de Klerk', supplierDetails: { supplierCode: 'supplier2', supplierName: 'Global Office Solutions' }
  },
   {
    id: 103, poNumber: 'PO-00103', creationDate: '2023-12-05T11:20:00Z', status: 'Completed',
    supplierId: 'supplier3', grandTotal: 25000, currency: 'MZN', requestedByName: 'Carol White', approverId: 'APP001',
    items: [{id:3, description: 'Hardware C', quantity:50, unitPrice:431.03, categoryId:4, uom:'BOX'}], subTotal: 21551.72, vatAmount: 3448.28, pricesIncludeVat: false, creatorUserId: 'USR002',
    approverName: 'Cherinne de Klerk', supplierDetails: { supplierCode: 'supplier3', supplierName: 'Tete Hardware Store' }
  },
];

// For FilterBar
export const mockApproversFilter: FilterOption[] = [
  { value: 'all', label: 'All Approvers' },
  ...mockApproversData.map(app => ({ value: app.id, label: app.name })),
];

export const mockRequestorsFilter: FilterOption[] = [
  { value: 'all', label: 'All Requestors' },
  // Populate from actual users or a distinct list of requestor names if available
  // For now, using some from mock POs:
  { value: 'alice_smith', label: 'Alice Smith' },
  { value: 'bob_johnson', label: 'Bob Johnson' },
  { value: 'carol_white', label: 'Carol White' },
  // Add more or generate from User table if applicable
  ...mockUsersData.filter(u => u.role === 'User' || u.role === 'Manager').map(u => ({ value: u.id, label: u.name })),
].filter((value, index, self) => index === self.findIndex((t) => (t.label === value.label))); // Deduplicate by label

