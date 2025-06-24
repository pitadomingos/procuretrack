'use client';

import type { PropsWithChildren } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from './sidebar';
import { AppHeader } from './header';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  
  if (pathname === '/auth') {
    return <main>{children}</main>;
  }
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
