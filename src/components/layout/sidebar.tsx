
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
  // SidebarMenuSkeleton, // No longer needed here
  sidebarMenuButtonVariants,
} from '@/components/ui/sidebar';
import { navItems } from '@/config/site';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import React, { useState, useEffect } from 'react'; // useEffect for ClientOnlyYear

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
  // const [mounted, setMounted] = useState(false); // Removed

  // useEffect(() => { // Removed
  //   setMounted(true);
  // }, []);

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
              {/* Always render the Link and SidebarMenuButton directly */}
              <Link href={item.href} passHref legacyBehavior={false}>
                <SidebarMenuButton
                  as="a" // Ensure it behaves like an anchor for Link
                  href={item.href} // Pass href for direct anchor usage
                  isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
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
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ClientOnlyYear />
      </SidebarFooter>
    </>
  );
}

