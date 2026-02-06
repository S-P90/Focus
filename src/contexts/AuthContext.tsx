"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { User } from "@/lib/types";
import {
  getCurrentUser,
  signIn as doSignIn,
  signUp as doSignUp,
  signOut as doSignOut,
} from "@/lib/storage";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  signUp: (
    email: string,
    name: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const loading = false;

  const signIn = async (email: string, password: string) => {
    const result = await doSignIn(email, password);
    if (result.ok) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  };

  const signUp = async (email: string, name: string, password: string) => {
    const result = await doSignUp(email, name, password);
    if (result.ok) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  };

  const signOut = () => {
    doSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
