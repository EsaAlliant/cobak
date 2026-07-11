"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SessionPayload } from "@/lib/session";

type AuthContextValue = {
  session: SessionPayload | null;
  loading: boolean;
  setSession: (session: SessionPayload | null) => void;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  loading: true,
  setSession: () => undefined,
});

export function AuthProvider({
  children,
  session,
  loading,
}: {
  children: ReactNode;
  session: SessionPayload | null;
  loading: boolean;
}) {
  const [currentSession, setCurrentSession] = useState<SessionPayload | null>(session);

  const value = useMemo(
    () => ({
      session: currentSession,
      loading,
      setSession: setCurrentSession,
    }),
    [currentSession, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
