import Link from "next/link";
import { AdminGuard } from "@/components/AuthGuards";
import { AdminShell } from "@/components/AdminShell";
import { getAdminData, readDate, readText } from "@/lib/admin-data";
import { formatWorkflowStage } from "@/lib/workflow";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const {
    applications,
    projects,
    serviceRequests,
  } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="A focused operations dashboard for intake alerts, project movement, approvals, and subcontractor review."
        title="Admin Dashboard"
      >
        <div className="grid gap-6 lg:grid-cols-2">
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
        </div>
      </AdminShell>
    </AdminGuard>
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
