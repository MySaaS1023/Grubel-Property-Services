import Link from "next/link";
import { AdminGuard } from "@/components/AuthGuards";
import { AdminNotice, AdminShell } from "@/components/AdminShell";
import {
  countWhere,
  getAdminData,
  readCurrency,
  readDate,
  readText,
} from "@/lib/admin-data";
import { formatWorkflowStage } from "@/lib/workflow";

export const dynamic = "force-dynamic";

const quickActions = [
  { href: "/admin/requests", label: "Review Requests" },
  { href: "/admin/customers", label: "View Customers" },
  { href: "/admin/quotes", label: "Manage Quotes" },
  { href: "/admin/projects", label: "Track Projects" },
  { href: "/admin/uploads", label: "Review Uploads" },
  { href: "/admin/subcontractors", label: "Review Subcontractors" },
  { href: "/admin/finance", label: "Finance" },
];

export default async function AdminPage() {
  const {
    applications,
    payments,
    projects,
    serviceRequests,
    uploads,
  } = await getAdminData();

  const stats = [
    { label: "New Requests", value: countWhere(serviceRequests, "status", "New") },
    {
      label: "PM Review",
      value: countWhere(projects, "workflow_stage", "pm_review"),
    },
    {
      label: "Awaiting Approval",
      value: countWhere(projects, "workflow_stage", "approval_to_proceed"),
    },
    {
      label: "Awaiting Payment",
      value: countWhere(projects, "workflow_stage", "payment_to_start"),
    },
    { label: "Scheduled Jobs", value: countWhere(projects, "workflow_stage", "scheduled") },
    {
      label: "Pending Subs",
      value: applications.filter((item) =>
        ["New", "Pending Review", "More Info Requested"].includes(
          readText(item, "status", ""),
        ),
      ).length,
    },
  ];

  return (
    <AdminGuard>
      <AdminShell
        description="A focused operations dashboard for current requests, quote activity, projects, payments, uploads, and subcontractor activity."
        title="Admin Dashboard"
      >
        <div className="grid gap-8">
          <AdminNotice />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat) => (
              <MetricCard key={stat.label} label={stat.label} value={String(stat.value)} />
            ))}
          </div>

          <section className="grid gap-5 lg:grid-cols-3">
            <SummaryCard
              label="Payments"
              title={`${payments.length} payment record${payments.length === 1 ? "" : "s"}`}
              value={
                payments.length
                  ? `${readCurrency(payments[0], "amount")} latest payment`
                  : "No records yet."
              }
            />
            <SummaryCard
              label="Uploads"
              title={`${uploads.length} uploaded file${uploads.length === 1 ? "" : "s"}`}
              value={
                uploads.length
                  ? `${readText(uploads[0], "file_name")} latest upload`
                  : "No records yet."
              }
            />
            <SummaryCard
              label="Projects"
              title={`${projects.length} project${projects.length === 1 ? "" : "s"}`}
              value={
                projects.length
                  ? `${readText(projects[0], "status")} latest status`
                  : "No records yet."
              }
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <AlertPanel title="Newest Service Requests" href="/admin/requests">
              {serviceRequests.length === 0 ? <EmptyCard /> : null}
              {serviceRequests.slice(0, 4).map((request) => (
                <AlertCard
                  href="/admin/requests"
                  key={readText(request, "id")}
                  meta={`${readText(request, "service_type")} - ${readDate(request, "created_at", "Not listed")}`}
                  title={readText(request, ["customer_name", "customer_email"])}
                  value={readText(request, "property_address")}
                />
              ))}
            </AlertPanel>

            <AlertPanel title="Latest Project Alerts" href="/admin/projects">
              {projects.length === 0 ? <EmptyCard /> : null}
              {projects.slice(0, 4).map((project) => (
                <AlertCard
                  href="/admin/projects"
                  key={readText(project, "id")}
                  meta={`${formatWorkflowStage(readText(project, "workflow_stage", "intake_received"))} - ${readDate(project, "updated_at", "Not listed")}`}
                  title={readText(project, "customer_name")}
                  value={readText(project, "property_address")}
                />
              ))}
            </AlertPanel>

            <AlertPanel title="Pending Approval Alerts" href="/admin/projects">
              {projects.filter((project) =>
                ["approval_to_proceed", "payment_to_start"].includes(
                  readText(project, "workflow_stage", ""),
                ),
              ).length === 0 ? <EmptyCard /> : null}
              {projects
                .filter((project) =>
                  ["approval_to_proceed", "payment_to_start"].includes(
                    readText(project, "workflow_stage", ""),
                  ),
                )
                .slice(0, 4)
                .map((project) => (
                  <AlertCard
                    href="/admin/projects"
                    key={readText(project, "id")}
                    meta={formatWorkflowStage(readText(project, "workflow_stage", ""))}
                    title={readText(project, "customer_name")}
                    value={readText(project, "service_type")}
                  />
                ))}
            </AlertPanel>

            <AlertPanel title="Pending Subcontractor Applications" href="/admin/subcontractors">
              {applications.length === 0 ? <EmptyCard /> : null}
              {applications.slice(0, 4).map((application) => (
                <AlertCard
                  href="/admin/subcontractors"
                  key={readText(application, "id")}
                  meta={`${readText(application, "application_type")} - ${readDate(application, "created_at", "Not listed")}`}
                  title={readText(application, "applicant_name")}
                  value={readText(application, "status")}
                />
              ))}
            </AlertPanel>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Quick Actions</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <Link
                  className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-accentDark"
                  href={action.href}
                  key={action.href}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </AdminShell>
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

function SummaryCard({
  label,
  title,
  value,
}: {
  label: string;
  title: string;
  value: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
        {label}
      </p>
      <h2 className="mt-2 text-xl font-black text-navy">{title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-charcoal/70">{value}</p>
    </article>
  );
}

function AlertPanel({
  children,
  href,
  title,
}: {
  children: React.ReactNode;
  href: string;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-navy">{title}</h2>
        <Link className="text-sm font-black text-accentDark hover:text-navy" href={href}>
          View all
        </Link>
      </div>
      <div className="mt-5 grid gap-3">{children}</div>
    </section>
  );
}

function AlertCard({
  href,
  meta,
  title,
  value,
}: {
  href: string;
  meta: string;
  title: string;
  value: string;
}) {
  return (
    <Link className="rounded-md bg-stonewash p-4 transition hover:bg-accent/10" href={href}>
      <h3 className="font-black text-navy">{title}</h3>
      <p className="mt-1 text-sm font-semibold leading-6 text-charcoal/70">{value}</p>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-charcoal/50">
        {meta}
      </p>
    </Link>
  );
}

function EmptyCard() {
  return (
    <p className="rounded-md bg-stonewash p-4 text-sm font-semibold text-charcoal/70">
      No records yet.
    </p>
  );
}
