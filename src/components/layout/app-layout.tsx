
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
import { Loader2 } from 'lucide-react';

export function AppLayout({ children }: PropsWithChildren) {
  const { loading } = useAuth();
  const pathname = usePathname();

  // If we are on the login page, don't render the main app layout.
  if (pathname === '/auth') {
    return <>{children}</>;
  }

  // While the auth state is being checked on initial load, show a loader.
  // This prevents the main layout from rendering before the middleware has a chance
  // to redirect unauthenticated users, avoiding UI flashes.
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
