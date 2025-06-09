
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, FilePlus2, PackageCheck, ListChecks, Settings, BarChart3 } from 'lucide-react';

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
    title: 'Create PO',
    href: '/purchase-orders/create',
    icon: FilePlus2,
  },
  {
    title: 'Receiving (GRN)',
    href: '/receiving',
    icon: PackageCheck,
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
