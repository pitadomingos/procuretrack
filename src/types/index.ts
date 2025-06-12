
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
  category: string; // Stores Category ID as string (from form select value)
  allocation: string; // Stores Site ID as string (from form select value)
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
  id: string; // This is Approver.id from the Approver table
  name: string;
  email?: string | null;
  department?: string | null;
  isActive?: boolean | null;
}

export interface User {
  id: string;
  name: string;
  email?: string | null;
  role: 'Admin' | 'Manager' | 'User' | 'Viewer' | string;
  siteAccess?: string[];
  isActive: boolean;
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
  category: string; // This is the name/description of the category
}

// Payload for creating a PO Item (sent to backend)
// This is also the structure fetched for PO items from the backend
export interface POItemPayload {
  id?: number; // DB ID of the POItem, if fetched
  poId?: number; // DB ID of the PO, if fetched
  partNumber?: string | null;
  description: string;
  categoryId: number | null; // Actual Category.id
  siteId?: number | null;    // Actual Site.id (used to be item.allocation in form)
  uom: string;
  quantity: number;
  unitPrice: number;
  // For form use / frontend convenience, `allocation` (string Site.id) and `category` (string Category.id)
  // are used. These are mapped to siteId and categoryId when sending to backend or processing.
  allocation?: string; // From form, string version of Site.id
}


// Structure for PO items when displayed in the printable PO view
export interface POItemForPrint extends POItemPayload {
  siteDisplay?: string; // Resolved site code or name
  categoryDisplay?: string; // Resolved category name
}

// Payload for creating a Purchase Order (sent to backend)
// This is also the structure fetched for a PO header from the backend
export interface PurchaseOrderPayload {
  id?: number; // DB ID of the PO, if fetched
  poNumber: string;
  creationDate: string; // ISO date string
  creatorUserId: string | null; // Firebase User ID, null for now
  requestedByName?: string | null;
  supplierId: string; // This is supplierCode from Supplier table
  approverId: string | null; // This is Approver.id from Approver table
  siteId?: number | null; // Overall PO Site ID
  status: string;
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  currency: string;
  pricesIncludeVat: boolean;
  notes?: string | null;
  items: POItemPayload[] | POItemForPrint[]; // Can be either for flexibility
  approvalDate?: string | null; // ISO date string
  approvedByUserId?: string | null; // Firebase User ID of final approver
  // For display on print page
  supplierDetails?: Supplier;
  // Resolved names - these would ideally be populated during data fetching for the print page
  creatorName?: string;
  approverName?: string;
  quoteNo?: string; // Added based on template
}
