
import type { LucideIcon } from 'lucide-react';

export interface StatCardItem { // Kept for now, but dashboard will transition away
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
}

export interface SubStat {
  label: string;
  value: string;
  description?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
}

export interface GroupedStatCardItem {
  title: string;
  icon: LucideIcon;
  subStats: SubStat[];
  viewMoreLink?: string;
  mainValue?: string; 
  mainValueDescription?: string;
}

// This will be the shape of the data fetched from /api/dashboard-stats
export interface FetchedDashboardStats {
  users: { total: number; active: number; inactive: number };
  purchaseOrders: { total: number; approved: number; pending: number; rejected: number };
  goodsReceived: {
    totalApprovedPOs: number; 
    totalPOsWithGRNActivity: number;
  };
  requisitions: { total: number; /* more statuses later */ };
  fuel: { totalTags: number; totalRecords: number; };
  clientQuotes: { total: number; approved: number; pending: number; rejected: number; };
}


export interface ActivityLogEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string; 
  details?: string;
}

export interface ChartDataPoint {
  name: string; 
  'Pending Approval'?: number;
  'Approved'?: number;
  'PendingApprovalValue'?: number;
  'ApprovedValue'?: number;
  [key: string]: number | string | undefined; 
}

export interface POItem {
  id: string; 
  partNumber?: string;
  description: string;
  categoryId: number | null; 
  siteId: number | null;    
  uom: string;
  quantity: number;
  unitPrice: number;
  quantityReceived?: number;
  itemStatus?: string; 
}

export interface Supplier {
  supplierCode: string;
  supplierName: string;
  salesPerson?: string | null;
  cellNumber?: string | null;
  physicalAddress?: string | null;
  nuitNumber?: string | null;
  emailAddress?: string | null;
}

export interface Approver {
  id: string;
  name: string;
  email?: string | null;
  department?: string | null;
  isActive: boolean;
  approvalLimit?: number | null;
}

export interface User {
  id: string;
  name: string;
  email?: string | null;
  role?: string | null;
  siteAccess?: string[];
  isActive: boolean;
}

export interface UserSiteAccessDisplay {
  userId: string;
  siteId: number;
  siteName?: string;
  siteCode?: string;
}


export interface Site {
  id: number;
  name: string;
  location?: string | null;
  siteCode?: string | null;
}

export interface Allocation {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Category {
  id: number;
  category: string;
}

export interface POItemPayload {
  id?: number;
  poId?: number;
  partNumber?: string | null;
  description: string;
  categoryId: number | null;
  siteId?: number | null;
  uom: string;
  quantity: number;
  unitPrice: number;
  quantityReceived: number; 
  itemStatus: string; 
}

export interface POItemForPrint extends POItemPayload {
  siteDisplay?: string;
  categoryDisplay?: string;
}

export type PurchaseOrderStatus =
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'Draft';

export interface PurchaseOrderPayload {
  id?: number;
  poNumber: string;
  creationDate: string; 
  creatorUserId: string | null;
  requestedByName?: string | null;
  supplierId: string | null;
  approverId: string | null;
  status: PurchaseOrderStatus; 
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  currency: string;
  pricesIncludeVat: boolean;
  notes?: string | null;
  items: POItemPayload[] | POItemForPrint[]; 
  approvalDate?: string | null;
  rejectionReason?: string | null;
  rejectionDate?: string | null;
  supplierDetails?: Supplier;
  supplierName?: string;
  creatorName?: string;
  approverName?: string;
  approverSignatureUrl?: string;
  quoteNo?: string;
  siteId?: number | null; 
}


export interface POApprovalQueueItem { 
  id: number;
  poNumber: string;
  creationDate: string;
  supplierName: string | null;
  requestedByName: string | null;
  creatorUserId?: string | null;
  creatorName?: string | null;
  grandTotal: number;
  currency: string;
  status: string;
}

export interface QuoteApprovalQueueItem { 
  id: string; 
  quoteNumber: string;
  quoteDate: string; 
  clientName: string | null | undefined;
  creatorEmail: string | null | undefined; 
  grandTotal: number;
  currency: string;
  status: string;
}

export interface RequisitionApprovalQueueItem {
  id: string;
  documentNumber: string; // Requisition Number
  creationDate: string; // Requisition Date
  submittedBy: string; // Requested By Name or User Name
  entityName: string; // Site Name or Code
  totalAmount: number | null; // Total Estimated Value (can be null or 0)
  currency: string | null; // Currency (may not be applicable or set to MZN default)
  status: string; // Requisition Status
}


export interface UnifiedApprovalItem {
  id: string | number; 
  documentType: 'PO' | 'Quote' | 'Requisition';
  documentNumber: string;
  creationDate: string; 
  submittedBy: string | null; 
  entityName: string | null; 
  totalAmount: number | null; // Made nullable
  currency: string | null; // Made nullable
  status: string;
}


export interface POReviewItem extends POItemPayload {
  isChecked: boolean;
  reviewComment: string;
  totalPrice: number;
}

export interface Client {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteItem {
  id: string;
  partNumber?: string;
  customerRef?: string;
  description: string;
  quantity: number;
  unitPrice: number; 
  quoteId?: string; 
}

export type QuoteStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Sent to Client' | 'Archived';

export interface QuotePayload {
  id?: string;
  quoteNumber: string;
  quoteDate: string; 
  clientId: string;
  creatorEmail?: string; 
  clientName?: string; 
  clientEmail?: string; 
  clientAddress?: string;
  clientCity?: string;
  clientCountry?: string;
  clientContactPerson?: string;
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  currency: string;
  termsAndConditions?: string;
  notes?: string;
  items: QuoteItem[];
  status: QuoteStatus;
  approverId?: string | null;
  approverName?: string; 
  approvalDate?: string | null | undefined; 
  createdAt?: string; 
  updatedAt?: string; 
}

export type RequisitionStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Closed' | 'Cancelled';

export interface RequisitionItem {
  id: string;
  requisitionId?: string;
  partNumber?: string | null;
  description: string;
  categoryId: number | null;
  categoryName?: string;
  quantity: number;
  justification?: string | null; 
}

export interface RequisitionPayload {
  id?: string;
  requisitionNumber: string;
  requisitionDate: string; 
  requestedByUserId?: string | null; 
  requestedByName: string; 
  requestorFullName?: string;
  siteId: number; 
  siteName?: string;
  siteCode?: string;
  status: RequisitionStatus;
  items: RequisitionItem[]; 
  totalEstimatedValue?: number; 
  approverId?: string | null; 
  approverName?: string; 
  approverSignatureUrl?: string;
  approvalDate?: string | null; 
  createdAt?: string; 
  updatedAt?: string; 
}

export type TagStatus = 'Active' | 'Inactive' | 'Under Maintenance' | 'Sold' | 'Decommissioned';

export interface Tag {
  id: string;
  tagNumber: string;
  registration?: string | null;
  make?: string | null;
  model?: string | null;
  tankCapacity?: number | null;
  year?: number | null;
  chassisNo?: string | null;
  type?: string | null;
  siteId: number | null;
  siteName?: string; 
  status: TagStatus; 
  createdAt?: string; 
  updatedAt?: string; 
}

export interface FuelRecord {
  id?: string;
  fuelDate: string; 
  reqNo?: string;
  invNo?: string;
  driver?: string;
  odometer?: number;
  tagId: string; 
  siteId: number | null; 
  description?: string;
  uom?: string;
  quantity: number;
  unitCost: number;
  totalCost?: number; 
  distanceTravelled?: number | null; 
  recorderUserId?: string; 
  tagName?: string; 
  siteName?: string; 
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ManagementStats { 
  suppliersCount: number;
  approversCount: number;
  usersCount: number;
  sitesCount: number;
  categoriesCount: number;
  tagsCount: number;
  tagStatusSummary?: Record<TagStatus, number>; 
  clientsCount: number;
}

export interface SurveyFormValues {
  easeOfUse: string;
  featureSatisfaction: string;
  responsiveness: string;
  recommendationLikelihood: string;
  mostUsedFeatures: string;
  suggestions: string;
}
    
