
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, UserCircle, LogOut, Settings, ChevronLeft, Sun, Moon, Computer } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { navItems } from '@/config/site';
import { useTheme } from 'next-themes';
import { ClientOnly } from '@/components/shared/ClientOnly';
import { StarRating } from '@/components/shared/star-rating'; // Import StarRating

// Mock ratings for demonstration
const mockPageRatings: Record<string, { initialRating: number; totalVoters: number }> = {
  '/': { initialRating: 4, totalVoters: 120 },
  '/create-document': { initialRating: 3.5, totalVoters: 85 },
  '/approvals': { initialRating: 4.2, totalVoters: 95 },
  '/activity-log': { initialRating: 3, totalVoters: 40 },
  '/analytics': { initialRating: 4.5, totalVoters: 60 },
  '/reports': { initialRating: 0, totalVoters: 0 }, // No ratings yet
  '/management': { initialRating: 3.8, totalVoters: 70 },
  '/survey': { initialRating: 0, totalVoters: 0 },
  '/todo-progress': { initialRating: 4.8, totalVoters: 25 },
  '/user-manual': { initialRating: 4, totalVoters: 15 },
  '/system-documentation': { initialRating: 4, totalVoters: 10 },
};


export function AppHeader() {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const [avatarFallbackContent, setAvatarFallbackContent] = useState("U"); 

  useEffect(() => {
    setAvatarFallbackContent("PD");
  }, []);

  const currentNavItem = navItems.find(item => {
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href) && item.href !== '/';
  });
  
  let pageTitle = currentNavItem ? currentNavItem.title : "ProcureTrack";
  let breadcrumbBase = null;

  // Determine current page rating data
  const currentPageKey = currentNavItem?.href || pathname;
  const currentRatingData = mockPageRatings[currentPageKey] || { initialRating: 0, totalVoters: 0 };

  if (pathname.startsWith('/management/') && pathname !== '/management') {
    const managementSubPath = pathname.split('/').pop();
    if (managementSubPath) {
      const subPageName = managementSubPath.charAt(0).toUpperCase() + managementSubPath.slice(1).replace(/-/g, ' ');
      pageTitle = `Manage ${subPageName}`;
    } else {
      pageTitle = "Manage Entity"; 
    }
    
    breadcrumbBase = {
      title: 'Management',
      href: '/management',
    };
  }

  const handleRating = (newRating: number) => {
    console.log(`Page ${currentPageKey} rated ${newRating} stars.`);
    // In a real app, you would send this rating to a backend
    // For now, the StarRating component updates its internal mock store
  };


  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8 print-hidden">
      <ClientOnly>
        <SidebarTrigger className="md:hidden" />
      </ClientOnly>
      <ClientOnly>
        <SidebarTrigger className="hidden md:flex" />
      </ClientOnly>
      <div className="flex-1 flex items-center gap-2">
        {breadcrumbBase && (
          <>
            <Link href={breadcrumbBase.href} className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {breadcrumbBase.title}
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
          </>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-lg font-semibold font-headline md:text-xl">{pageTitle}</h1>
            <div className="mt-1 sm:mt-0">
                <StarRating
                key={currentPageKey} // Important for re-rendering if page changes
                pageKey={currentPageKey}
                initialRating={currentRatingData.initialRating}
                totalVoters={currentRatingData.totalVoters}
                onRate={handleRating}
                size="sm"
                />
            </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Computer className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2">
          <Image
            src="/headerlogo.png"
            alt="Company Logo"
            width={40} 
            height={40}
            className="rounded-sm object-contain" 
            data-ai-hint="company brand logo"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="user avatar" />
                <AvatarFallback>{avatarFallbackContent}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Pita Domingos</p>
                <p className="text-xs leading-none text-muted-foreground">
                  pita.domingos@jachris.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
