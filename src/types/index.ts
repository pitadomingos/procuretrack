

import type { LucideIcon } from 'lucide-react';

export interface StatCardItem {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  change?: string; // e.g., "+5.2% from last month"
  changeType?: 'positive' | 'negative';
}

export interface ActivityLogEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string; // ISO date string or formatted string
  details?: string;
}

export interface ChartDataPoint {
  name: string; // e.g., month or category
  [key: string]: number | string; // values for different series
}

// For PO Form state and item structure within the form
export interface POItem {
  id: string; // Client-side ID for react-hook-form field array
  partNumber?: string;
  description: string;
  categoryId: number | null; // Stores Category ID as number
  siteId: number | null;    // Stores Site ID as number
  uom: string;
  quantity: number;
  unitPrice: number;
  quantityReceived?: number; // Added
  itemStatus?: string; // Added: e.g., 'Pending', 'Partially Received', 'Fully Received'
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

export interface PurchaseOrderPayload {
  id?: number;
  poNumber: string;
  creationDate: string; // ISO String
  creatorUserId: string | null;
  requestedByName?: string | null;
  supplierId: string | null;
  approverId: string | null;
  // siteId?: number | null; // Removed Overall PO Site ID
  status: string;
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
}


export interface ApprovalQueueItem {
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

export interface POReviewItem extends POItemPayload {
  isChecked: boolean;
  reviewComment: string;
  totalPrice: number;
}

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  contactPerson?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  nuit?: string | null; 
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

export interface QuotePayload {
  id?: string;
  quoteNumber: string;
  quoteDate: string;
  clientId: string;
  creatorEmail?: string;
  clientName?: string;
  clientEmail?: string;
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  currency: string;
  termsAndConditions?: string;
  notes?: string;
  items: QuoteItem[];
  status?: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Archived';
}

export interface RequisitionItem {
  id: string;
  partNumber?: string;
  description: string;
  categoryId: number | null;
  quantity: number;
  estimatedUnitPrice?: number | null;
  notes?: string;
  requisitionId?: string;
}

export interface RequisitionPayload {
  id?: string;
  requisitionNumber: string;
  requisitionDate: string;
  requestedByUserId?: string | null;
  requestedByName: string;
  siteId: number | null; // Site ID for the Requisition itself (department/origin)
  status: 'Draft' | 'Submitted for Approval' | 'Approved' | 'Rejected' | 'Closed';
  justification?: string;
  items: RequisitionItem[];
  totalEstimatedValue?: number;
  siteName?: string; // For display purposes if fetched
}

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

