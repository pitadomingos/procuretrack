
'use client';

import React, { createContext, useState, useEffect, type ReactNode } from 'react';

// Simplified user structure for the mock provider
export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  isActive: boolean;
}

// Simplified context type
export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock user to be used across the app
const MOCK_USER: AuthUser = {
  id: 'user_001',
  name: 'Pita Domingos',
  email: 'pita.domingos@jachris.com',
  role: 'Admin',
  isActive: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // The provider no longer needs to fetch anything. It just provides the mock user.
  // Loading is set to false immediately.
  const value: AuthContextType = {
    user: MOCK_USER,
    loading: false,
    login: async () => { console.warn("Login functionality is currently disabled."); },
    logout: async () => { console.warn("Logout functionality is currently disabled."); },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
