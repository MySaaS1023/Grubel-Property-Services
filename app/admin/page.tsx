import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/PageHero";
import {
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
} from "@/lib/mock-data";

const stats = [
  { label: "New Requests", value: serviceRequests.filter((item) => item.status === "New").length },
  { label: "Active Quotes", value: quotes.filter((item) => item.quoteStatus !== "Completed").length },
  { label: "Scheduled Jobs", value: appointments.filter((item) => item.status === "Scheduled").length },
  { label: "Pending Subcontractors", value: applications.filter((item) => item.status !== "Approved").length },
  { label: "Completed Projects", value: projects.filter((item) => item.status === "Completed").length },
];

const adminLinks = [
  { href: "/admin/quotes", label: "Create Quote" },
  { href: "/admin/projects", label: "Project Management" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/crm", label: "CRM Logs" },
  { href: "/admin/subcontractors", label: "Subcontractors" },
];

export default function AdminPage() {
  return (
    <>
      <PageHero
        eyebrow="Internal Operations"
        title="Admin Dashboard"
        description="MVP operations dashboard for requests, customers, quotes, projects, appointments, payments, uploads, subcontractors, and job assignments."
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6">
          <p className="rounded-md bg-accent/10 p-4 text-sm font-semibold leading-6 text-charcoal">
            Admin authentication will be added before production operations.
            Future roles: Admin, Customer, and Subcontractor.
          </p>

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
                  item.customerName,
                  item.serviceType,
                  item.propertyAddress,
                  item.status,
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Customers">
              <DataTable
                columns={["Name", "Email", "Phone", "Property"]}
                rows={customers.map((customer) => [
                  customer.fullName,
                  customer.email,
                  customer.phone,
                  customer.propertyAddress ?? customer.billingAddress ?? "Not listed",
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Quotes">
              <DataTable
                columns={["Quote", "Customer", "Amount", "Status"]}
                rows={quotes.map((quote) => [
                  quote.quoteNumber,
                  quote.customerName,
                  quote.displayAmount,
                  quote.quoteStatus,
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Active Projects">
              <DataTable
                columns={["Project", "Service", "Schedule", "Status"]}
                rows={projects.map((project) => [
                  project.quoteNumber,
                  project.serviceType,
                  project.scheduledDate,
                  project.status,
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Appointments">
              <DataTable
                columns={["Customer", "Date", "Window", "Status"]}
                rows={appointments.map((appointment) => [
                  appointment.customerName,
                  appointment.appointmentDate,
                  appointment.timeWindow,
                  appointment.status,
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Payments">
              <DataTable
                columns={["Quote", "Amount", "Status", "Method"]}
                rows={payments.map((payment) => [
                  payment.quoteNumber,
                  payment.displayAmount,
                  payment.status,
                  payment.method,
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Uploaded Files">
              <DataTable
                columns={["File", "Category", "Uploaded By", "Date"]}
                rows={uploads.map((upload) => [
                  upload.fileName,
                  upload.category,
                  upload.uploadedBy,
                  upload.createdAt,
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Subcontractor Applications">
              <DataTable
                columns={["Applicant", "Type", "Status", "Submitted"]}
                rows={applications.map((application) => [
                  application.applicantName,
                  application.applicationType,
                  application.status,
                  application.submittedAt,
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Approved Subcontractors">
              <DataTable
                columns={["Name", "Skills", "Status", "Availability"]}
                rows={subcontractors.map((subcontractor) => [
                  subcontractor.fullName,
                  subcontractor.tradeSkills.join(", "),
                  subcontractor.status,
                  subcontractor.availability,
                ])}
              />
            </DashboardPanel>
            <DashboardPanel title="Job Assignments">
              <DataTable
                columns={["Job", "Subcontractor", "Due", "Status"]}
                rows={jobAssignments.map((job) => [
                  job.title,
                  job.subcontractorName,
                  job.dueDate,
                  job.status,
                ])}
              />
            </DashboardPanel>
          </section>
        </div>
      </section>
    </>
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
