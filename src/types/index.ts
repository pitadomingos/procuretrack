
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
  allocation?: string; 
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
  supplierId: string | null; // Can be null if PO is not for a specific supplier initially
  approverId: string | null; // This is Approver.id from Approver table (who is ASSIGNED to approve)
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
  supplierDetails?: Supplier;
  creatorName?: string;
  approverName?: string;
  approverSignatureUrl?: string; 
  quoteNo?: string; 
}

// For the "My Approvals" page
export interface ApprovalQueueItem {
  id: number; // PO ID
  poNumber: string;
  creationDate: string;
  supplierName: string | null;
  requestedByName: string | null;
  grandTotal: number;
  currency: string;
  status: string; // Should be 'Pending Approval'
}

