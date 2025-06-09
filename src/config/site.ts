
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, FilePlus2, ListChecks, Settings, BarChart3 } from 'lucide-react'; // Removed PackageCheck

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Create Document', // New consolidated page
    href: '/create-document',
    icon: FilePlus2, // Re-using FilePlus2, consider a more generic icon if available/needed
  },
  {
    title: 'Activity Log',
    href: '/activity-log',
    icon: ListChecks,
  },
   {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Management',
    href: '/management',
    icon: Settings,
  },
];

