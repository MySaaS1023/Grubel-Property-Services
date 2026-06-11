import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminTable } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminCRMPage() {
  const { crmLogs } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="Operational log for requests, appointments, quotes, projects, payments, uploads, and subcontractor activity."
        title="CRM Logs"
      >
        <div className="grid gap-6">
          <AdminBackLink />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <AdminTable
              columns={["Date", "Type", "Customer/Sub", "Related Record", "Status", "Notes"]}
              deleteTableName="crm_logs"
              minWidth="880px"
              rowIds={crmLogs.map((log) => readText(log, "id"))}
              rows={crmLogs.map((log) => [
                readDate(log, ["log_date", "created_at"], "Not listed"),
                readText(log, "type"),
                readText(log, "actor"),
                readText(log, "related_quote_or_project"),
                readText(log, "status"),
                readText(log, "notes"),
              ])}
            />
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
