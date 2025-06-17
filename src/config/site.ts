
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, FilePlus2, ListChecks, Settings, BarChart3, FileText, BookUser, FileCode, ClipboardCheck, UserCheck, FileQuestion } from 'lucide-react';

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
    title: 'Create Document',
    href: '/create-document',
    icon: FilePlus2,
  },
  {
    title: 'My Approvals', // Consolidated approvals
    href: '/approvals',
    icon: UserCheck, // UserCheck can represent general approvals
  },
  // { // Removed separate Quote Approvals
  //   title: 'My Quote Approvals',
  //   href: '/quote-approvals',
  //   icon: FileQuestion,
  // },
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
    title: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    title: 'Management',
    href: '/management',
    icon: Settings,
  },
  {
    title: 'To-Do / Progress',
    href: '/todo-progress',
    icon: ClipboardCheck,
  },
  {
    title: 'User Manual',
    href: '/user-manual',
    icon: BookUser,
  },
  {
    title: 'System Documentation',
    href: '/system-documentation',
    icon: FileCode,
  },
];
