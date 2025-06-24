'use client';

import { usePathname } from 'next/navigation';
import { AppLayout } from './app-layout';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}
