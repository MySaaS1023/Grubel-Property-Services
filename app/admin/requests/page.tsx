import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminDeleteButton } from "@/components/AdminDeleteButton";
import { AdminEmptyState } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";
import { requestStatuses } from "@/lib/operations-workflow";
import { updateRequestAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const { serviceRequests, uploads } = await getAdminData();
  const activeRequests = serviceRequests.filter((request) =>
    requestStatuses.includes(readText(request, "status", "New Request") as never),
  );

  return (
    <AdminGuard>
      <AdminShell
        description="Review service request submissions from the request service intake form."
        title="Requests"
      >
        <div className="grid gap-6">
          <AdminBackLink />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            {activeRequests.length === 0 ? <AdminEmptyState /> : null}
            {activeRequests.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
                      {[
                        "Customer",
                        "Contact",
                        "Service",
                        "Property",
                        "Walkthrough",
                        "Availability",
                        "Uploads",
                        "Status",
                        "Submitted",
                        "Actions",
                      ].map((column) => (
                        <th className="py-3 pr-4" key={column}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeRequests.map((request) => {
                      const requestId = readText(request, "id");
                      const requestUploads = uploads.filter(
                        (upload) =>
                          readText(upload, "related_type", "") === "service_request" &&
                          readText(upload, "related_id", "") === requestId,
                      );

                      return (
                        <tr className="border-b border-slate-100 last:border-b-0" key={requestId}>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(request, "customer_name")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            <div>{readText(request, "customer_email")}</div>
                            <div className="text-xs text-charcoal/60">
                              {readText(request, "customer_phone")}
                            </div>
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(request, "service_type")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(request, "property_address")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(request, "walkthrough_option")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            <div>
                              {readText(
                                request,
                                ["preferred_days", "additional_notes"],
                                "No preferred days",
                              )}
                            </div>
                            <div className="text-xs text-charcoal/60">
                              {readText(request, "preferred_time_window")}
                            </div>
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {requestUploads.length ? (
                              <ul className="grid gap-1">
                                {requestUploads.map((upload) => (
                                  <li key={readText(upload, "id")}>
                                    {readText(upload, "file_name")}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              "No uploads"
                            )}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readText(request, "status")}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readDate(request, "created_at", "Not listed")}
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex flex-wrap gap-2">
                              <RequestActionButton
                                action="Start Vendor Pricing"
                                requestId={requestId}
                              />
                              <AdminDeleteButton
                                recordId={requestId}
                                tableName="service_requests"
                              />
                            </div>
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

function RequestActionButton({
  action,
  requestId,
}: {
  action: "Start Vendor Pricing";
  requestId: string;
}) {
  return (
    <form action={updateRequestAction}>
      <input name="requestId" type="hidden" value={requestId} />
      <input name="action" type="hidden" value={action} />
      <button
        className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-accentDark"
        type="submit"
      >
        {action}
      </button>
    </form>
  );
}
