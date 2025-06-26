
'use client';

import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from './sidebar';
import { AppHeader } from './header';

export function AppLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // If we are on the login page, don't render the main app layout.
  // This prevents the sidebar and header from flashing on the login screen.
  if (pathname === '/auth') {
    return <>{children}</>;
  }

  // For all other authenticated pages, render the full app layout.
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
