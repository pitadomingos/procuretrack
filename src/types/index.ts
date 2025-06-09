
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
  category: string;
  allocation: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  // total is calculated dynamically, so not stored in the item itself in the form state
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  salesPerson: string;
  contactNumber: string;
  nuit: string;
  address: string;
}

// Management Entity Types
export interface Approver {
  id: string;
  name: string;
  email: string;
  department?: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User' | 'Viewer';
  siteAccess: string[]; // Array of site IDs or names
  isActive: boolean;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  siteCode?: string;
}

export interface Allocation {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentCategory?: string; // ID of parent category for hierarchy
}
