"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { UserRole } from "@/lib/roles";
import { useAuth } from "@/components/AuthContext";

function RoleGuardContent({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: UserRole[];
}) {
  const router = useRouter();
  const { session, loading } = useAuth();
  const allowed = !!session && allowedRoles.includes(session.role);

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (!allowed) {
      router.replace("/unauthorized");
    }
  }, [allowed, loading, router, session]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5 min-vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!session || !allowed) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5 min-vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function RoleGuard({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: UserRole[];
}) {
  return (
    <RoleGuardContent allowedRoles={allowedRoles}>
      {children}
    </RoleGuardContent>
  );
}
