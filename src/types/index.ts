
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
  category: string;
}

// Payload for creating a PO Item (sent to backend)
export interface POItemPayload {
  partNumber?: string | null;
  description: string;
  categoryId: number | null; // Converted to number or null before sending
  allocation: string; // This is Site.id for the item, sent as string
  uom: string;
  quantity: number;
  unitPrice: number;
}

// Payload for creating a Purchase Order (sent to backend)
export interface PurchaseOrderPayload {
  poNumber: string;
  creationDate: string; // ISO date string
  creatorUserId: string | null; // Firebase User ID, null for now
  requestedByName?: string | null; // New field for the free-text requester
  supplierId: string; // This is supplierCode from Supplier table
  approverId: string; // This is Approver.id from Approver table
  siteId?: number | null; // Overall PO Site ID - currently not in form header, items have allocation (siteId)
  status: string;
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  currency: string;
  pricesIncludeVat: boolean;
  notes?: string | null;
  items: POItemPayload[];
}
