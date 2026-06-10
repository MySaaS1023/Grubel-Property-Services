import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/LogoutButton";

const adminTabs = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/crm", label: "CRM Logs" },
  { href: "/admin/subcontractors", label: "Subcontractors" },
  { href: "/admin/uploads", label: "Uploads" },
];

export function AdminShell({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="min-h-screen bg-stonewash">
      <header className="border-b border-slate-200 bg-white">
        <div className="site-container py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accentDark">
                Admin Portal
              </p>
              <h1 className="mt-2 text-3xl font-black text-navy md:text-4xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-charcoal/70">
                  {description}
                </p>
              ) : null}
            </div>
            <LogoutButton role="admin" />
          </div>

          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Admin navigation">
            {adminTabs.map((tab) => (
              <Link
                className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-accentDark"
                href={tab.href}
                key={tab.href}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="site-container py-10">{children}</div>
    </section>
  );
}

export function AdminBackLink() {
  return (
    <Link
      className="inline-flex text-sm font-black text-navy transition hover:text-accentDark"
      href="/admin"
    >
      ← Back to Dashboard
    </Link>
  );
}

export function AdminNotice() {
  return (
    <p className="rounded-md bg-accent/10 p-4 text-sm font-semibold leading-6 text-charcoal">
      Admin access is protected by Supabase Auth and role-based permissions.
    </p>
  );
}
