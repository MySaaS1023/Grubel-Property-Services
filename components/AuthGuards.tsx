import type { ReactNode } from "react";

export function AdminGuard({ children }: { children: ReactNode }) {
  // Server-side route protection is handled by middleware using signed,
  // HttpOnly cookies. Future production auth should replace this MVP gate with
  // Supabase Auth role checks for Admin users.
  return children;
}

export function SubcontractorGuard({ children }: { children: ReactNode }) {
  // Server-side route protection is handled by middleware using signed,
  // HttpOnly cookies. Future production auth should replace this MVP gate with
  // Supabase Auth role checks for Subcontractor users.
  return children;
}
