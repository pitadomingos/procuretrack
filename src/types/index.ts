
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
  value?: string;
  label?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string | null;
  role: 'Admin' | 'Manager' | 'User' | 'Viewer' | string;
  siteAccess?: string[];
  isActive: boolean;
  value?: string;
  label?: string;
}

export interface Site {
  id: number;
  name: string;
  location?: string | null;
  siteCode?: string | null;
  value?: string | number;
  label?: string;
}

export interface Allocation {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Category {
  id: number;
  category: string; // Changed from 'name' to 'category' to match DB script
  description?: string; // Optional description
  parentCategory?: number | null; // Optional parent category ID
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

// This is the primary type for a full PO object, used in forms, previews, and API responses (potentially with all details)
export interface PurchaseOrderPayload {
  id?: number;
  poNumber: string;
  creationDate: string; // ISO String
  creatorUserId: string | null;
  requestedByName?: string | null; // Free-text from form
  supplierId: string | null; // Supplier Code
  approverId: string | null; // Approver ID
  siteId?: number | null; // Overall PO Site ID
  status: string;
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  currency: string;
  pricesIncludeVat: boolean;
  notes?: string | null;
  items: POItemPayload[] | POItemForPrint[]; // Array of items associated with the PO
  approvalDate?: string | null; // ISO String
  rejectionReason?: string | null;
  rejectionDate?: string | null;

  // Denormalized/joined fields often returned by API for display convenience
  supplierDetails?: Supplier; // Full supplier object (e.g. for print page)
  supplierName?: string; // Just supplier name (e.g. for lists)
  creatorName?: string; // Name of the user who created the PO (from User table)
  approverName?: string; // Name of the assigned approver (from Approver table)
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
  email?: string | null;
  contactPerson?: string | null;
  contactNumber?: string | null;
  address?: string | null;
}

export interface QuoteItem {
  id: string; // Client-side or DB ID
  partNumber?: string;
  customerRef?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  quoteId?: string; // Foreign key to Quote table
}

export interface QuotePayload {
  id?: string; // DB ID
  quoteNumber: string;
  quoteDate: string; // ISO String
  clientId: string; // Foreign key to Client table
  creatorEmail?: string; // Email of the user who created the quote
  clientName?: string; // Denormalized for display
  clientEmail?: string; // Denormalized for display
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  currency: string;
  termsAndConditions?: string;
  notes?: string;
  items: QuoteItem[];
  status?: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Archived';
}

// --- REQUISITION ---
export interface RequisitionItem {
  id: string; // Client-side or DB ID
  partNumber?: string;
  description: string;
  categoryId: number | null;
  quantity: number;
  estimatedUnitPrice?: number | null;
  notes?: string;
  requisitionId?: string; // Foreign key to Requisition table
}

export interface RequisitionPayload {
  id?: string; // DB ID
  requisitionNumber: string;
  requisitionDate: string; // ISO String
  requestedByUserId?: string | null;
  requestedByName: string;
  siteId: number | null;
  status: 'Draft' | 'Submitted for Approval' | 'Approved' | 'Rejected' | 'Closed';
  justification?: string;
  items: RequisitionItem[];
  totalEstimatedValue?: number;

  // For display in lists
  siteName?: string; // Will hold siteCode for display
}

// --- TAG (Vehicle/Equipment) ---
export interface Tag {
  id: string;
  tagNumber: string;
  registration?: string;
  make?: string;
  model?: string;
  tankCapacity?: number;
  year?: number;
  chassisNo?: string;
  type?: string;
  siteId?: number | null;
  siteName?: string; // Will hold siteCode for display
}

// --- FUEL RECORD ---
export interface FuelRecord {
  id?: string;
  fuelDate: string; // ISO String
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

  // For display in lists
  tagName?: string;
  siteName?: string; // Will hold siteCode for display
}


// For FilterBar options
export interface FilterOption {
  value: string;
  label: string;
}
