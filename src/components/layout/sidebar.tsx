
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
  sidebarMenuButtonVariants, // Import the CVA variants
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
          <ul 
            data-sidebar="menu" 
            className={cn("flex w-full min-w-0 flex-col gap-1 p-2")}
          >
            {navItems.map((item, index) => (
              <SidebarMenuItem key={item.title + "-skeleton-" + index}>
                 {/* Wrap skeleton in an 'a' tag styled like a button */}
                 <a
                  className={cn(
                    sidebarMenuButtonVariants({ variant: 'default', size: 'default' }),
                    "pointer-events-none" 
                  )}
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  <SidebarMenuSkeleton showIcon />
                </a>
              </SidebarMenuItem>
            ))}
          </ul>
        ) : (
          <SidebarMenu className="p-2">
            {navItems.map((item) => {
              const isActuallyActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={isActuallyActive}
                      disabled={!!item.disabled} 
                      aria-disabled={!!item.disabled}
                      tabIndex={item.disabled ? -1 : 0}
                      tooltip={item.title}
                      className={cn(item.disabled && "cursor-not-allowed opacity-50")}
                    >
                      <React.Fragment>
                        <item.icon />
                        <span>{item.title}</span>
                      </React.Fragment>
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
