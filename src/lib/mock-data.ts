
import type { StatCardItem, ActivityLogEntry, ChartDataPoint, Supplier, Approver, User, Site, Allocation, Category, Client, PurchaseOrderPayload, FilterOption, QuotePayload, RequisitionPayload, Tag, FuelRecord } from '@/types';
import { Archive, BadgeCheck, Loader, FolderOpen, Users, FileText, GanttChartSquare, Layers, Building, Briefcase, Tag as TagIcon, ClipboardList, Fuel, Truck } from 'lucide-react';

export const dashboardStats: StatCardItem[] = [
  {
    title: 'Total POs',
    value: 'N/A', // Will be dynamic
    icon: Archive,
    description: 'All purchase orders created.',
  },
  {
    title: 'Completed POs',
    value: 'N/A', // Will be dynamic
    icon: BadgeCheck,
    description: 'POs fully received and closed.',
  },
  {
    title: 'Pending Approval', // Changed from Partially Completed for PO context
    value: 'N/A', // Will be dynamic
    icon: Loader,
    description: 'POs awaiting approval actions.',
  },
  {
    title: 'Open POs', // Approved but not yet fully received/closed
    value: 'N/A', // Will be dynamic
    icon: FolderOpen,
    description: 'POs approved, items pending receipt.',
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
  { id: '5', user: 'System User', action: 'Generated Back Order Report', timestamp: '2025-06-11 11:00 AM', details: 'Date Range: 2025-05-01 to 2025-06-10' },
  { id: '6', user: 'Portia Mbuva', action: 'Added new supplier: MozTech Solutions', timestamp: '2025-06-10 11:00 AM' },
  { id: '7', user: 'System', action: 'User Cobus de Klerk logged in', timestamp: '2025-06-10 11:05 AM' },
  { id: '8', user: 'Portia Mbuva', action: 'Modified PO #PO12340 quantities', timestamp: '2025-06-10 11:15 AM', details: 'Item ID 2, new quantity 15' },
];

export const managementTables = [
  { name: 'Approvers', href: '/management/approvers', icon: Users, count: 3, description: "Manage PO approvers" }, // Updated count
  { name: 'Users', href: '/management/users', icon: Users, count: 5, description: "Manage system users and roles" }, // Updated count
  { name: 'Sites', href: '/management/sites', icon: Building, count: 5, description: "Manage company sites/locations" }, // Updated count
  { name: 'Allocations', href: '/management/allocations', icon: Briefcase, count: 10, description: "Manage cost allocations/departments" },
  { name: 'Categories', href: '/management/categories', icon: TagIcon, count: 15, description: "Manage item and service categories" }, // Updated count
  { name: 'Tags', href: '/management/tags', icon: Fuel, count: 5, description: "Manage tagged vehicles & equipment" }, // Updated count
  { name: 'Clients', href: '/management/clients', icon: Briefcase, count: 4, description: "Manage client information"}, // Added Clients
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


export const mockSitesData: Site[] = [
  { id: 1, name: 'Tete Main Warehouse', location: 'Moatize', siteCode: 'TMW' },
  { id: 2, name: 'Tete Main Lubrication', location: 'Moatize', siteCode: 'TML' },
  { id: 3, name: 'Mota-Engil Mozambique', location: 'Moatize', siteCode: 'MEM' },
  { id: 4, name: 'Fuel Management System', location: 'Moatize', siteCode: 'FMS' },
  { id: 5, name: 'C. Hose Warehouse', location: 'Moatize', siteCode: 'CHW' },
];

export const monthsWithAll: FilterOption[] = [{ value: 'all', label: 'All Months' }, ...months];
export const yearsWithAll: FilterOption[] = [{ value: 'all', label: 'All Years' }, ...years];
export const sitesWithAll: FilterOption[] = [
    { value: 'all', label: 'All Sites' },
    ...mockSitesData.map(s => ({value: s.id.toString(), label: s.siteCode || s.name}))
];


export const spendByVendorData: ChartDataPoint[] = [
  { name: 'ACP01', Spend: 125000 },
  { name: 'ADV01', Spend: 85000 },
  { name: 'AMT01', Spend: 62000 },
  { name: 'AF001', Spend: 45000 },
  { name: 'AFR01', Spend: 98000 },
];

export const mockCategoriesData: Category[] = [
    { id: 1, category: 'Safety Consumables' },
    { id: 2, category: 'Fleet Maintenance' },
    { id: 3, category: 'Tools and Accessories' },
    { id: 4, category: 'Stationery' },
    { id: 5, category: 'Building Maintenance' },
    { id: 6, category: 'Uniforms' },
    { id: 7, category: 'Advertising/Marketing' },
    { id: 8, category: 'Gvt Taxes' },
    { id: 9, category: 'Communication' },
    { id: 10, category: 'Furniture' },
    { id: 11, category: 'Workshop Consumables' },
    { id: 12, category: 'Third-party Services' },
    { id: 13, category: 'IT Equipment' },
    { id: 14, category: 'IT Consumables' },
    { id: 15, category: 'Others (Specify)' },
];

export const poCountByCategoryData: ChartDataPoint[] = mockCategoriesData.slice(0,6).map(cat => ({
    name: cat.category,
    Count: Math.floor(Math.random() * 100) + 20 // Random count for example
}));


export const mockSuppliers: Supplier[] = [
  { supplierCode: 'ACP01', supplierName: 'AC PECAS ,LDA', emailAddress: 'okechukwuchigaemezu@gmail.com', salesPerson: 'Okechukwu', cellNumber: '258 87 588 8556', nuitNumber: '400 515 931', physicalAddress: 'Estrada Nacional 7, Bairro Chingodzi' },
  { supplierCode: 'ADV01', supplierName: 'ADVANCED CONSULTORIA E SERVICOS ,LDA', emailAddress: 'geral.advanced@outlook.pt', cellNumber: '258 84 045 9167', physicalAddress: 'Bairro Chingodzi , Tete' },
  { supplierCode: 'AMT01', supplierName: 'AMTECH ENGINEERING SOLUTIONS', emailAddress: 'sales@amtecheng-solutions.com', cellNumber: '848976253', nuitNumber: '401 266 402', physicalAddress: 'Bairro Chingodzi , Tete' },
];

export const mockApproversData: Approver[] = [
  { id: 'approver_001', name: 'Cherinne de Klerk', email: 'cherinne.deklerk@jachris.com', department: 'All', isActive: true, approvalLimit: 50000.00 },
  { id: 'approver_002', name: 'Cobus de Klerk', email: 'cobus.deklerk@jachris.com', department: 'All', isActive: true, approvalLimit: 50000.00 },
  { id: 'approver_003', name: 'Pita Domingos', email: 'pita.domingos@jachris.com', department: 'All', isActive: true, approvalLimit: 5000.00 },
];

export const mockUsersData: User[] = [
  { id: 'user_001', name: 'Pita Domingos', email: 'pita.domingos@jachris.com', role: 'Admin', siteAccess: ['all'], isActive: true },
  { id: 'user_002', name: 'Portia Mbuva', email: 'portia.mbuva@jachris.com', role: 'Creator', siteAccess: ['all'], isActive: true },
  { id: 'user_003', name: 'Cherinne de Klerk', email: 'cherinne.deklerk@jachris.com', role: 'Approver', siteAccess: ['all'], isActive: true },
  { id: 'user_004', name: 'Cobus de Klerk', email: 'cobus.klerk@jachris.com', role: 'Approver', siteAccess: ['all'], isActive: true },
  { id: 'user_005', name: 'Gil Lunguze', email: 'gil.lunguze@jachris.com', role: 'Creator', siteAccess: ['all'], isActive: true },
];


export const mockClients: Client[] = [
  { id: 'client-001', name: 'Vale Mozambique', email: 'procurement@vale.co.mz', contactPerson: 'Mr. Silva', address: 'Vale Office Park, Moatize', nuit: '400000001' },
  { id: 'client-002', name: 'Mota-Engil', email: 'compras@mota-engil.mz', contactPerson: 'Ms. Ferreira', address: 'Mota-Engil Site, Tete', nuit: '400000002' },
  { id: 'client-003', name: 'WBHO', email: 'tenders.mz@wbho.co.za', contactPerson: 'Mr. Botha', address: 'WBHO Camp, Nacala Corridor', nuit: '400000003' },
  { id: 'client-004', name: 'Local Mining Co-op', email: 'info@localminingcoop.org', contactPerson: 'Sra. Tembe', address: 'Rua da Cooperativa, Tete City', nuit: '400000004' },
];

export const mockPurchaseOrders: PurchaseOrderPayload[] = [
  {
    id: 1, poNumber: 'PO-00001', creationDate: '2024-07-01T10:00:00Z', status: 'Approved',
    supplierId: 'ACP01', grandTotal: 1500, currency: 'MZN', requestedByName: 'Alice Smith', approverId: 'approver_001',
    items: [{id:1, description: 'Item A', quantity:10, unitPrice:100, categoryId:1, uom:'EA'}], subTotal: 1293.10, vatAmount: 206.90, pricesIncludeVat: false, creatorUserId: 'user_002',
    approverName: 'Cherinne de Klerk', supplierName: 'AC PECAS ,LDA', creatorName: 'Portia Mbuva'
  },
  {
    id: 2, poNumber: 'PO-00002', creationDate: '2024-06-15T14:30:00Z', status: 'Pending Approval',
    supplierId: 'ADV01', grandTotal: 800, currency: 'USD', requestedByName: 'Bob Johnson', approverId: 'approver_002',
    items: [{id:2, description: 'Service B', quantity:1, unitPrice:800, categoryId:5, uom:'SVC'}], subTotal: 800, vatAmount: 0, pricesIncludeVat: false, creatorUserId: 'user_005',
    approverName: 'Cobus de Klerk', supplierName: 'ADVANCED CONSULTORIA E SERVICOS ,LDA', creatorName: 'Gil Lunguze'
  },
   {
    id: 3, poNumber: 'PO-00003', creationDate: '2023-12-05T11:20:00Z', status: 'Completed',
    supplierId: 'AMT01', grandTotal: 25000, currency: 'MZN', requestedByName: 'Carol White', approverId: 'approver_001',
    items: [{id:3, description: 'Hardware C', quantity:50, unitPrice:431.03, categoryId:4, uom:'BOX'}], subTotal: 21551.72, vatAmount: 3448.28, pricesIncludeVat: false, creatorUserId: 'user_002',
    approverName: 'Cherinne de Klerk', supplierName: 'AMTECH ENGINEERING SOLUTIONS', creatorName: 'Portia Mbuva'
  },
];

export const mockApproversFilter: FilterOption[] = [
  { value: 'all', label: 'All Approvers' },
  ...mockApproversData.map(app => ({ value: app.id, label: app.name })),
];

export const mockRequestorsFilter: FilterOption[] = [
  { value: 'all', label: 'All Requestors' },
  ...mockUsersData.filter(u => u.role === 'Creator' || u.role === 'Manager' || u.role === 'Admin' || u.role === 'User')
                 .map(u => ({ value: u.id, label: u.name })),
].filter((value, index, self) => index === self.findIndex((t) => (t.value === value.value)));


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

export const mockQuotesData: QuotePayload[] = [
  { id: 'Q-MOCK-001', quoteNumber: 'Q-2024-001', quoteDate: '2024-07-15T10:00:00Z', clientId: 'client-001', clientName: 'Vale Mozambique', subTotal: 150000, vatAmount: 24000, grandTotal: 174000, currency: 'MZN', status: 'Draft', items: [{id:'qi1', description:'Service A', quantity:1, unitPrice:150000, partNumber: 'SVC-A', customerRef: 'CR-VALE-001'}] },
  { id: 'Q-MOCK-002', quoteNumber: 'Q-2024-002', quoteDate: '2024-07-18T14:30:00Z', clientId: 'client-002', clientName: 'Mota-Engil', subTotal: 7500, vatAmount: 0, grandTotal: 7500, currency: 'USD', status: 'Sent', items: [{id:'qi2', description:'Consulting Hours', quantity:100, unitPrice:75, partNumber: 'CONS-H', customerRef: 'CR-MOTA-002'}] },
];

export const mockRequisitionsData: RequisitionPayload[] = [
    {
        id: 'REQ-MOCK-001',
        requisitionNumber: 'REQ-2024-001',
        requisitionDate: '2024-07-20T09:00:00Z',
        requestedByName: 'Pita Domingos',
        siteId: 1,
        status: 'Submitted for Approval',
        justification: 'Restock office stationery for Q3.',
        items: [
            { id: 'reqi-1-1', partNumber: 'A4REAM-W', description: 'A4 Reams', categoryId: 1, quantity: 10 },
            { id: 'reqi-1-2', partNumber: 'PEN-BL-BX', description: 'Blue Pens', categoryId: 1, quantity: 50 },
        ],
        totalEstimatedValue: 2500,
        siteName: 'TMW',
    },
    {
        id: 'REQ-MOCK-002',
        requisitionNumber: 'REQ-2024-002',
        requisitionDate: '2024-07-21T11:30:00Z',
        requestedByName: 'Gil Lunguze',
        siteId: 2,
        status: 'Draft',
        justification: 'Need new safety helmets for Site B personnel.',
        items: [
            { id: 'reqi-2-1', partNumber: 'SAF-HAT-YEL', description: 'Hard Hats (Yellow)', categoryId: 3, quantity: 5 },
        ],
        totalEstimatedValue: 5000,
        siteName: 'TML',
    },
];

export const mockTagsData: Tag[] = [
  { id: 'TAG001', tagNumber: 'LDV001', registration: 'ALL-001-MP', make: 'Toyota', model: 'Hilux D4D', tankCapacity: 80, year: 2022, chassisNo: 'XYZ123CHASSIS', type: 'LDV', siteId: 1, siteName: 'TMW' },
  { id: 'TAG002', tagNumber: 'TRK005', registration: 'ATR-005-MP', make: 'Mercedes', model: 'Actros', tankCapacity: 400, year: 2020, chassisNo: 'ABC789CHASSIS', type: 'Truck', siteId: 2, siteName: 'TML' },
  { id: 'TAG003', tagNumber: 'GEN002', type: 'Generator', make: 'CAT', model: 'Olympian GEP22', tankCapacity: 50, siteId: 1, siteName: 'TMW' },
  { id: 'TAG004', tagNumber: 'FORK001', type: 'Forklift', make: 'Toyota', model: '8FD30', siteId: 3, siteName: 'MEM' },
  { id: 'TAG005', tagNumber: 'LDV002', registration: 'NTR-002-TT', make: 'Ford', model: 'Ranger', tankCapacity: 70, year: 2023, type: 'LDV', siteId: 1, siteName: 'TMW' },
];

export const tagsWithAll: FilterOption[] = [
  { value: 'all', label: 'All Tags' },
  ...mockTagsData.map(tag => ({ value: tag.id, label: `${tag.tagNumber} (${tag.make || ''} ${tag.model || tag.type || ''})`}))
];

export const mockFuelRecordsData: FuelRecord[] = [
  { id: 'FUEL001', fuelDate: '2024-07-28T08:00:00Z', driver: 'John Doe', odometer: 125000, tagId: 'TAG001', siteId: 1, description: 'Diesel Top-up', uom: 'Liters', quantity: 75, unitCost: 85.50, totalCost: 6412.50, tagName: 'LDV001', siteName: 'TMW' },
  { id: 'FUEL002', fuelDate: '2024-07-28T09:30:00Z', driver: 'Jane Smith', odometer: 250000, tagId: 'TAG002', siteId: 2, description: 'Diesel Full Tank', uom: 'Liters', quantity: 380, unitCost: 85.00, totalCost: 32300.00, tagName: 'TRK005', siteName: 'TML' },
  { id: 'FUEL003', fuelDate: '2024-07-27T15:00:00Z', driver: 'System User', tagId: 'TAG003', siteId: 1, description: 'Generator Refuel', uom: 'Liters', quantity: 45, unitCost: 86.00, totalCost: 3870.00, tagName: 'GEN002', siteName: 'TMW' },
  { id: 'FUEL004', fuelDate: '2024-07-29T10:00:00Z', driver: 'John Doe', odometer: 125650, tagId: 'TAG001', siteId: 1, description: 'Diesel Refuel', uom: 'Liters', quantity: 60, unitCost: 86.00, totalCost: 5160.00, tagName: 'LDV001', siteName: 'TMW' },
  { id: 'FUEL005', fuelDate: '2024-07-29T11:00:00Z', driver: 'Mike Brown', odometer: 1500, tagId: 'TAG004', siteId: 3, description: 'Forklift Diesel', uom: 'Liters', quantity: 25, unitCost: 85.75, totalCost: 2143.75, tagName: 'FORK001', siteName: 'MEM' },
];
