import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminDeleteButton } from "@/components/AdminDeleteButton";
import { AdminEmptyState, AdminTable } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";
import { updateSubcontractorApplicationStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSubcontractorsPage() {
  const { applications, jobAssignments, subcontractors } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="Manage vendor applications, trade information, contact details, approval status, and assigned project counts."
        title="Vendors"
      >
        <div className="grid gap-8">
          <AdminBackLink />

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Applications</h2>
            <div className="mt-5 grid gap-4">
              {applications.length === 0 ? <AdminEmptyState /> : null}
              {applications.map((application) => {
                const status = readText(application, "status");
                const showActions = !["Approved", "Denied"].includes(status);

                return (
                  <article
                    className="rounded-md bg-stonewash p-4"
                    key={readText(application, "id")}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="font-black text-navy">
                          {readText(application, "applicant_name")}
                        </h3>
                        <p className="mt-2 text-sm font-semibold leading-6 text-charcoal/70">
                          {readText(application, "application_type")} - {status}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-charcoal/70">
                          {readText(application, "email")} - {readText(application, "phone")}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-charcoal/70">
                          Submitted {readDate(application, "created_at", "Not listed")}
                        </p>
                      </div>
                      {showActions ? (
                        <div className="flex flex-wrap gap-2">
                          <StatusButton
                            applicationId={readText(application, "id")}
                            label="Approve"
                            status="Approved"
                          />
                          <StatusButton
                            applicationId={readText(application, "id")}
                            label="Deny"
                            status="Denied"
                          />
                          <StatusButton
                            applicationId={readText(application, "id")}
                            label="Request More Info"
                            status="More Info Requested"
                          />
                        </div>
                      ) : null}
                      <AdminDeleteButton
                        recordId={readText(application, "id")}
                        tableName="subcontractor_applications"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Vendor Directory</h2>
            <div className="mt-5">
              <AdminTable
                columns={[
                  "Vendor",
                  "Business",
                  "Trade Type",
                  "Contact",
                  "Approval Status",
                  "Assigned Projects",
                ]}
                deleteTableName="subcontractors"
                minWidth="900px"
                rowIds={subcontractors.map((subcontractor) =>
                  readText(subcontractor, "id"),
                )}
                rows={subcontractors.map((subcontractor) => [
                  readText(subcontractor, "full_name"),
                  readText(subcontractor, "business_name"),
                  readText(subcontractor, "trade_skills"),
                  `${readText(subcontractor, "email")} / ${readText(subcontractor, "phone")}`,
                  readText(subcontractor, "status"),
                  String(
                    jobAssignments.filter(
                      (assignment) =>
                        readText(assignment, "subcontractor_id", "") ===
                        readText(subcontractor, "id", ""),
                    ).length,
                  ),
                ])}
              />
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

function StatusButton({
  applicationId,
  label,
  status,
}: {
  applicationId: string;
  label: string;
  status: "Approved" | "Denied" | "More Info Requested";
}) {
  return (
    <form action={updateSubcontractorApplicationStatus}>
      <input name="applicationId" type="hidden" value={applicationId} />
      <input name="status" type="hidden" value={status} />
      <button
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent"
        type="submit"
      >
        {label}
      </button>
    </form>
  );
}
