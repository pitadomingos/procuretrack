
'use client';

import React, { createContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  isActive: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_ROUTE = '/auth';
const PROTECTED_ROUTES = ['/', '/create-document', '/approvals', '/activity-log', '/analytics', '/reports', '/management'];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const verifySession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
        if (PROTECTED_ROUTES.some(p => pathname.startsWith(p))) {
            router.push(AUTH_ROUTE);
        }
      }
    } catch (error) {
      console.error('Failed to verify session:', error);
      setUser(null);
       if (PROTECTED_ROUTES.some(p => pathname.startsWith(p))) {
            router.push(AUTH_ROUTE);
        }
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const login = async (email: string, password?: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      router.push('/');
    } else {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error("Error during logout API call:", error);
    } finally {
        setUser(null);
        router.push('/auth');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
