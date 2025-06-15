
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
  isActive?: boolean | null;
  // For filter "All" option
  value?: string; // Can be 'all'
  label?: string; // Can be 'All Approvers'
}

export interface User {
  id: string;
  name: string;
  email?: string | null;
  role: 'Admin' | 'Manager' | 'User' | 'Viewer' | string;
  siteAccess?: string[];
  isActive: boolean;
  // For filter "All" option
  value?: string;
  label?: string;
}

export interface Site {
  id: number;
  name: string;
  location?: string | null;
  siteCode?: string | null;
  // For filter "All" option
  value?: string | number; // Can be 'all' or site.id
  label?: string; // Can be 'All Sites' or site.name
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
}

export interface POItemForPrint extends POItemPayload {
  siteDisplay?: string;
  categoryDisplay?: string;
}

export interface PurchaseOrderPayload {
  id?: number;
  poNumber: string;
  creationDate: string;
  creatorUserId: string | null;
  requestedByName?: string | null;
  supplierId: string | null;
  approverId: string | null;
  siteId?: number | null;
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

// --- QUOTATION ---
export interface Client {
  id: string;
  name: string;
  email: string;
  contactPerson?: string;
  contactNumber?: string;
  address?: string;
}

export interface QuoteItem {
  id: string; // Client-side ID for react-hook-form field array
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuotePayload {
  id?: string; // Can be number if DB uses int PK
  quoteNumber: string;
  quoteDate: string; // ISO date string
  clientId: string;
  creatorEmail?: string; // For CC, placeholder for now
  clientName?: string; // Denormalized for display
  clientEmail?: string; // Denormalized for email modal
  subTotal: number;
  vatAmount: number; // Or taxAmount
  grandTotal: number;
  currency: string;
  termsAndConditions?: string;
  notes?: string;
  items: QuoteItem[];
  status?: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Archived'; // Example statuses
}

// For FilterBar options
export interface FilterOption {
  value: string;
  label: string;
}
