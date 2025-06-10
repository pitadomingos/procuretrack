
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { navItems } from '@/config/site';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// Helper component for client-side year
function ClientOnlyYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // This ensures getFullYear is called only on the client after hydration
    setYear(new Date().getFullYear());
  }, []); // Empty dependency array ensures this runs once on mount

  if (year === null) {
    // Render a placeholder or nothing on the server and during initial client render
    return <p className="text-xs text-sidebar-foreground/70 text-center">© ProcureTrack</p>;
  }

  return (
    <p className="text-xs text-sidebar-foreground/70 text-center">
      © {year} ProcureTrack
    </p>
  );
}


export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Flame className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-semibold text-sidebar-foreground">ProcureTrack</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href} passHref asChild>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                  disabled={!!item.disabled}
                  aria-disabled={!!item.disabled}
                  tabIndex={item.disabled ? -1 : 0}
                  tooltip={item.title}
                  className={cn(item.disabled && "cursor-not-allowed opacity-50")}
                  // href is passed by Link asChild
                  // onClick is passed by Link asChild
                  // ref is passed by Link asChild
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ClientOnlyYear />
      </SidebarFooter>
    </>
  );
}
