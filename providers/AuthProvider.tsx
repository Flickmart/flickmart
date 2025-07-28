"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth provider that manages user authentication state globally
 * This prevents multiple api.users.current queries across components
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const authState = useAuthUser({ redirectOnUnauthenticated: false });

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the auth context
 * Use this instead of useAuthUser in components wrapped by AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthProvider;