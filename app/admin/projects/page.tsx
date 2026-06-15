import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminDeleteButton } from "@/components/AdminDeleteButton";
import { AdminEmptyState } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";
import { projectStatuses } from "@/lib/operations-workflow";
import { updateProjectStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const { projects } = await getAdminData();
  const activeProjects = projects.filter((project) =>
    projectStatuses.includes(readText(project, "status", "Vendor Pricing") as never),
  );

  return (
    <AdminGuard>
      <AdminShell
        description="View active projects created from reviewed requests."
        title="Active Projects"
      >
        <div className="grid gap-6">
          <AdminBackLink />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            {activeProjects.length === 0 ? <AdminEmptyState /> : null}
            {activeProjects.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1320px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
                      {[
                        "Project ID",
                        "Customer",
                        "Service Type",
                        "Property Address",
                        "Status",
                        "Payment",
                        "Assigned Vendor",
                        "Scheduled",
                        "Last Updated",
                        "Move Status",
                        "Actions",
                      ].map((column) => (
                        <th className="py-3 pr-4" key={column}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeProjects.map((project) => {
                      const projectId = readText(project, "id");
                      const currentStatus = readText(project, "status", "Vendor Pricing");

                      return (
                        <tr className="border-b border-slate-100 last:border-b-0" key={projectId}>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {projectId.slice(0, 8)}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(project, "customer_name")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(project, "service_type")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(project, "property_address")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(project, "status")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(project, "payment_status")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(project, "assigned_team")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readDate(project, "scheduled_date")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readDate(project, "updated_at", "Not listed")}
                          </td>
                          <td className="py-3 pr-4">
                            <form action={updateProjectStatus} className="flex gap-2">
                              <input name="projectId" type="hidden" value={projectId} />
                              <select
                                className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-xs font-bold text-charcoal"
                                defaultValue={currentStatus}
                                name="status"
                              >
                                {projectStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-accentDark"
                                type="submit"
                              >
                                Update
                              </button>
                            </form>
                          </td>
                          <td className="py-3 pr-4">
                            <AdminDeleteButton recordId={projectId} tableName="projects" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
