
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const verifySession = useCallback(async () => {
    // Only set loading to true on the very first run.
    // Subsequent runs (like route changes) shouldn't show a full-screen loader.
    if (loading) {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to verify session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  }, [loading]); // Depends only on the initial loading state

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
        // The middleware will handle redirecting to /auth
        // This push can sometimes conflict if the user is already on a page that will redirect.
        // Let the middleware be the single source of truth.
        window.location.href = '/auth'; // Force a hard reload to the auth page
    }
  };
  
  const isAuthPage = usePathname() === '/auth';

  // Show a loader only on the initial load of the app, not on every route change.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If we are on the auth page, we don't need the main AppLayout, just the page content.
  if (isAuthPage) {
    return (
       <AuthContext.Provider value={{ user, loading, login, logout }}>
         {children}
       </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
