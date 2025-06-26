
'use client';

import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

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

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email: string, password?: string) => {
    // This function is for components to call, but the login form handles it directly.
    // It's here for completeness if other parts of the app need to trigger login.
    console.log("Login triggered from AuthContext, but form handles POST directly.");
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/auth'; // Force reload to ensure middleware catches the unauthenticated state
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
  };
  
  // By rendering children immediately, we prevent a jarring layout shift.
  // The middleware is responsible for protecting routes, so children will only
  // be the actual application layout if the user is authenticated.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
