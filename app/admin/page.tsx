import Link from "next/link";
import type { ReactNode } from "react";
import { AdminDataNotice } from "@/components/AdminDataNotice";
import { AdminGuard } from "@/components/AuthGuards";
import { LogoutButton } from "@/components/LogoutButton";
import { PageHero } from "@/components/PageHero";
import {
  countWhere,
  getAdminData,
  readCurrency,
  readDate,
  readText,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";

const adminLinks = [
  { href: "/admin/quotes", label: "Create Quote" },
  { href: "/admin/projects", label: "Project Management" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/crm", label: "CRM Logs" },
  { href: "/admin/subcontractors", label: "Subcontractors" },
];

export default async function AdminPage() {
  const {
    applications,
    appointments,
    customers,
    jobAssignments,
    payments,
    projects,
    quotes,
    serviceRequests,
    subcontractors,
    uploads,
  } = await getAdminData();

  const stats = [
    { label: "New Requests", value: countWhere(serviceRequests, "status", "New") },
    {
      label: "Active Quotes",
      value: quotes.filter((item) => readText(item, "quote_status", "") !== "Completed")
        .length,
    },
    { label: "Scheduled Jobs", value: countWhere(appointments, "status", "Scheduled") },
    {
      label: "Pending Subcontractors",
      value: applications.filter((item) => readText(item, "status", "") !== "Approved")
        .length,
    },
    { label: "Completed Projects", value: countWhere(projects, "status", "Completed") },
  ];

  return (
    <AdminGuard>
      <PageHero
        eyebrow="Internal Operations"
        title="Admin Dashboard"
        description="MVP operations dashboard for requests, customers, quotes, projects, appointments, payments, uploads, subcontractors, and job assignments."
      />
      <section className="bg-white py-16">
        <div className="site-container grid gap-8">
          <p className="rounded-md bg-accent/10 p-4 text-sm font-semibold leading-6 text-charcoal">
            MVP authentication is active. Replace with Supabase Auth role
            enforcement before handling production-sensitive data.
          </p>
          <div>
            <LogoutButton role="admin" />
          </div>
          <AdminDataNotice />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat) => (
              <MetricCard key={stat.label} label={stat.label} value={String(stat.value)} />
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {adminLinks.map((link) => (
              <Link
                className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-accentDark"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="New Service Requests">
              <DataTable
                columns={["Customer", "Service", "Property", "Status"]}
                rows={serviceRequests.map((item) => [
                  readText(item, ["customer_name", "customer_email"]),
                  readText(item, "service_type"),
                  readText(item, "property_address"),
                  readText(item, "status"),
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Customers">
              <DataTable
                columns={["Name", "Email", "Phone", "Property"]}
                rows={customers.map((customer) => [
                  readText(customer, "full_name"),
                  readText(customer, "email"),
                  readText(customer, "phone"),
                  readText(customer, ["property_address", "billing_address"]),
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Quotes">
              <DataTable
                columns={["Quote", "Customer", "Amount", "Status"]}
                rows={quotes.map((quote) => [
                  readText(quote, "quote_number"),
                  readText(quote, ["customer_name", "customer_email"]),
                  readCurrency(quote, "amount"),
                  readText(quote, ["quote_status", "payment_status"]),
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Active Projects">
              <DataTable
                columns={["Project", "Service", "Schedule", "Status"]}
                rows={projects.map((project) => [
                  readText(project, "quote_number"),
                  readText(project, "service_type"),
                  readDate(project, "scheduled_date"),
                  readText(project, "status"),
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Appointments">
              <DataTable
                columns={["Customer", "Date", "Window", "Status"]}
                rows={appointments.map((appointment) => [
                  readText(appointment, "customer_name"),
                  readDate(appointment, "appointment_date"),
                  readText(appointment, "time_window"),
                  readText(appointment, "status"),
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Payments">
              <DataTable
                columns={["Quote", "Amount", "Status", "Method"]}
                rows={payments.map((payment) => [
                  readText(payment, "quote_number"),
                  readCurrency(payment, "amount"),
                  readText(payment, "status"),
                  readText(payment, "method"),
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Uploaded Files">
              <DataTable
                columns={["File", "Category", "Uploaded By", "Date"]}
                rows={uploads.map((upload) => [
                  readText(upload, "file_name"),
                  readText(upload, "category"),
                  readText(upload, "uploaded_by"),
                  readDate(upload, "created_at", "Not listed"),
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Subcontractor Applications">
              <DataTable
                columns={["Applicant", "Type", "Status", "Submitted"]}
                rows={applications.map((application) => [
                  readText(application, "applicant_name"),
                  readText(application, "application_type"),
                  readText(application, "status"),
                  readDate(application, "created_at", "Not listed"),
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Approved Subcontractors">
              <DataTable
                columns={["Name", "Skills", "Status", "Availability"]}
                rows={subcontractors.map((subcontractor) => [
                  readText(subcontractor, "full_name"),
                  readText(subcontractor, "trade_skills"),
                  readText(subcontractor, "status"),
                  readText(subcontractor, "availability"),
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Job Assignments">
              <DataTable
                columns={["Job", "Subcontractor", "Due", "Status"]}
                rows={jobAssignments.map((job) => [
                  readText(job, "title"),
                  readText(job, "subcontractor_name"),
                  readDate(job, "due_date"),
                  readText(job, "status"),
                ])}
              />
            </DashboardPanel>
          </section>
        </div>
      </section>
    </AdminGuard>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-navy">{value}</div>
    </div>
  );
}

function DashboardPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-navy">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-md bg-stonewash p-4 text-sm font-semibold text-charcoal/70">
        No records yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
            {columns.map((column) => (
              <th className="py-3 pr-4" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={`${row.join("-")}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td className="py-3 pr-4 font-semibold leading-6 text-charcoal" key={`${cell}-${cellIndex}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
