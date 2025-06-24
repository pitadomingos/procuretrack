
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

// A mock user to be used across the app, ensuring all components have a user context.
const MOCK_USER: AuthUser = {
  id: 'user_001',
  name: 'Pita Domingos',
  email: 'pita.domingos@jachris.com',
  role: 'Admin',
  isActive: true,
};

// This provider is now a simple mock. It does not perform any fetching or redirection.
// It immediately provides the MOCK_USER to the entire application.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: AuthContextType = {
    user: MOCK_USER,
    loading: false, // Set loading to false immediately.
    login: async () => { console.warn("Login functionality is disabled."); },
    logout: async () => { console.warn("Logout functionality is disabled."); },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
