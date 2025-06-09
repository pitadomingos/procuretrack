
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
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { navItems } from '@/config/site';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// Helper component for client-side year
function ClientOnlyYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (year === null) {
    // Render a placeholder or nothing during SSR / initial client render for the year part
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Flame className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-semibold text-sidebar-foreground">ProcureTrack</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {!mounted ? (
          <div className="p-2 space-y-1"> {/* Matches SidebarMenu structure for consistent padding */}
            {navItems.map((item, index) => (
              // Using SidebarMenuItem to wrap skeleton for consistent structure if it adds specific styling/layout
              <SidebarMenuItem key={item.title + "-skeleton-" + index}>
                 <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))}
          </div>
        ) : (
          <SidebarMenu>
            {navItems.map((item) => {
              const isActuallyActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={isActuallyActive}
                      disabled={!!item.disabled}
                      aria-disabled={!!item.disabled} // Ensure this is explicitly boolean
                      tabIndex={item.disabled ? -1 : 0}
                      tooltip={item.title}
                      className={cn(item.disabled && "cursor-not-allowed opacity-50")}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ClientOnlyYear />
      </SidebarFooter>
    </>
  );
}
