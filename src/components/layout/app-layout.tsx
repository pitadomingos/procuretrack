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
import { useAuth } from '@/hooks/use-auth';

export function AppLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { user } = useAuth();

  // If the user is not authenticated, we're likely on the login page,
  // which handles its own layout. So, we just render the children directly.
  if (!user) {
    return <>{children}</>;
  }

  // If the user is authenticated, render the full app layout.
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
