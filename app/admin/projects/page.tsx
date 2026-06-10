import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminTable } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const { projects } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="View active projects, status, payment state, assigned teams, scheduling, and notes."
        title="Projects"
      >
        <div className="grid gap-6">
          <AdminBackLink />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <AdminTable
              columns={[
                "Quote",
                "Customer",
                "Service",
                "Property",
                "Status",
                "Payment",
                "Scheduled",
                "Assigned Team",
              ]}
              minWidth="1040px"
              rows={projects.map((project) => [
                readText(project, "quote_number"),
                readText(project, "customer_name"),
                readText(project, "service_type"),
                readText(project, "property_address"),
                readText(project, "status"),
                readText(project, "payment_status"),
                readDate(project, "scheduled_date"),
                readText(project, "assigned_team"),
              ])}
            />
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
