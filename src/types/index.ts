
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
  email: string;
  contactPerson?: string;
  contactNumber?: string;
  address?: string;
}

export interface QuoteItem {
  id: string;
  partNumber?: string;
  customerRef?: string;
  description: string;
  quantity: number;
  unitPrice: number;
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

// --- REQUISITION ---
export interface RequisitionItem {
  id: string; // Client-side ID for react-hook-form field array
  partNumber?: string;
  description: string;
  categoryId: number | null;
  quantity: number;
  estimatedUnitPrice?: number | null; // Optional
  notes?: string; // Optional item-specific notes
}

export interface RequisitionPayload {
  id?: string; // Mock ID from backend
  requisitionNumber: string;
  requisitionDate: string; // ISO String
  requestedByUserId?: string | null; // Could be a user ID from an auth system
  requestedByName: string; // For display or if no user system
  siteId: number | null;
  status: 'Draft' | 'Submitted for Approval' | 'Approved' | 'Rejected' | 'Closed';
  justification?: string;
  items: RequisitionItem[];
  totalEstimatedValue?: number; // Calculated or entered

  // For display in lists
  siteName?: string;
  categoryName?: string; // (Maybe not needed here, item specific)
}

// --- TAG (Vehicle/Equipment) ---
export interface Tag {
  id: string; // Unique ID for the tag/equipment
  tagNumber: string; // The "TAG" field from fuel record, e.g., vehicle plate or equipment ID
  registration?: string;
  make?: string;
  model?: string;
  tankCapacity?: number;
  year?: number;
  chassisNo?: string;
  type?: string; // E.g., "Truck", "Generator", "LDV"
  siteId?: number | null; // Site where it's primarily located
  siteName?: string; // Denormalized for display
}

// --- FUEL RECORD ---
export interface FuelRecord {
  id?: string; // Mock ID from backend
  fuelDate: string; // ISO String
  reqNo?: string;
  invNo?: string;
  driver?: string;
  odometer?: number;
  tagId: string; // Foreign key to Tag.id
  siteId: number | null;
  description?: string;
  uom?: string;
  quantity: number;
  unitCost: number;
  totalCost?: number; // Calculated: quantity * unitCost

  // For display in lists
  tagName?: string; // Denormalized from Tag table
  siteName?: string; // Denormalized from Site table
}


// For FilterBar options
export interface FilterOption {
  value: string;
  label: string;
}

    