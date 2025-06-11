
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

export interface POItem {
  id: string;
  partNumber?: string;
  description: string;
  category: string; // Stores Category ID as string
  allocation: string; // Stores Site ID as string
  uom: string;
  quantity: number;
  unitPrice: number;
  // total is calculated dynamically, so not stored in the item itself in the form state
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

// Management Entity Types
export interface Approver {
  id: string; // This is Approver.id from the Approver table
  name: string;
  email?: string | null;
  department?: string | null;
  isActive?: boolean | null;
  // approvalLimit?: number | null; // Available in DB but not currently used in UI
}

export interface User {
  id: string;
  name: string;
  email?: string | null; // Changed to optional and nullable to match DB schema better
  role: 'Admin' | 'Manager' | 'User' | 'Viewer' | string; // Allow string for flexibility if other roles exist
  siteAccess?: string[]; // Made optional as it might not always be present
  isActive: boolean;
}

export interface Site {
  id: number; // Changed from string to number
  name: string;
  location?: string | null; // Made optional and nullable
  siteCode?: string | null; // Made optional and nullable
}

export interface Allocation {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Category {
  id: number; // Changed from string to number
  category: string; // Field name in DB is 'category', not 'name'
  // Description and parentCategory are not in the simple Category table based on scripts.
  // If they were, they would be defined here.
  // For example:
  // description?: string;
  // parentCategory?: number; // Assuming parent ID is also a number
}
