"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <SessionGuard
      loginPath="/admin-login"
      sessionKey="gps_admin_logged_in"
    >
      {children}
    </SessionGuard>
  );
}

export function SubcontractorGuard({ children }: { children: ReactNode }) {
  return (
    <SessionGuard
      loginPath="/subcontractor-login"
      sessionKey="gps_subcontractor_logged_in"
    >
      {children}
    </SessionGuard>
  );
}

function SessionGuard({
  children,
  loginPath,
  sessionKey,
}: {
  children: ReactNode;
  loginPath: string;
  sessionKey: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Future auth replacement: use Supabase Auth or NextAuth session checks
    // with role permissions instead of this browser-session MVP gate.
    if (sessionStorage.getItem(sessionKey) === "true") {
      setAllowed(true);
      return;
    }

    router.replace(`${loginPath}?next=${encodeURIComponent(pathname)}`);
  }, [loginPath, pathname, router, sessionKey]);

  if (!allowed) {
    return null;
  }

  return children;
}
