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
import React from 'react';

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
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild={!item.disabled}
                  className={cn(item.disabled && "cursor-not-allowed opacity-50")}
                  isActive={pathname === item.href}
                  disabled={item.disabled}
                  aria-disabled={item.disabled}
                  tabIndex={item.disabled ? -1 : undefined}
                  tooltip={item.title}
                >
                  <> {/* Wrap children in a Fragment */}
                    <item.icon />
                    <span>{item.title}</span>
                  </>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-xs text-sidebar-foreground/70 text-center">
          © {new Date().getFullYear()} ProcureTrack
        </p>
      </SidebarFooter>
    </>
  );
}
