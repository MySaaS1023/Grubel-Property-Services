import Link from "next/link";
import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminDeleteButton } from "@/components/AdminDeleteButton";
import { AdminScheduleLiveCallButton } from "@/components/AdminScheduleLiveCallButton";
import { AdminSendZoomLink } from "@/components/AdminSendZoomLink";
import { AdminEmptyState } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";
import { requestStatuses } from "@/lib/operations-workflow";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { updateRequestAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const { serviceRequests, uploads } = await getAdminData();
  const appointments = await getScheduledConsultations();
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AdminBackLink />
            <Link
              className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-accentDark"
              href="/admin/availability"
            >
              Manage Consultation Availability
            </Link>
          </div>
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
                      const status = readText(request, "status", "New Request");
                      const appointment = appointments.find(
                        (item) =>
                          readText(item, "service_request_id", "") === requestId,
                      );
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
                            {status}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-charcoal">
                            {readDate(request, "created_at", "Not listed")}
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex flex-wrap gap-2">
                              {status === "New Request" ? (
                                <AdminScheduleLiveCallButton requestId={requestId} />
                              ) : null}
                              {status === "Consultation Scheduled" ? (
                                <>
                                  <AdminSendZoomLink
                                    customerEmail={readText(request, "customer_email")}
                                    requestId={requestId}
                                    scheduledDateTime={formatScheduledConsultation(
                                      appointment,
                                    )}
                                  />
                                  <RequestActionButton
                                    action="Start Vendor Pricing"
                                    requestId={requestId}
                                  />
                                </>
                              ) : null}
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

async function getScheduledConsultations() {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("id,service_request_id,appointment_date,time_window,status,created_at")
    .neq("status", "Canceled")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin-requests] Consultation appointment lookup failed", error);
    return [];
  }

  return data ?? [];
}

function formatScheduledConsultation(
  appointment: Record<string, unknown> | undefined,
) {
  if (!appointment) {
    return "Scheduled time not found";
  }

  const date = readText(appointment, "appointment_date", "");
  const timeSlot = readText(appointment, "time_window", "");

  if (!date) {
    return timeSlot || "Scheduled time not found";
  }

  const parsedDate = new Date(`${date}T12:00:00`);
  const formattedDate = Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        weekday: "long",
        year: "numeric",
      });

  return timeSlot === "ASAP"
    ? `${formattedDate} - ASAP`
    : `${formattedDate} at ${timeSlot || "Time not listed"}`;
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
