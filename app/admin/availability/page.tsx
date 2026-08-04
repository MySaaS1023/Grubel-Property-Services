import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminConfirmSubmitButton } from "@/components/AdminConfirmSubmitButton";
import { AdminSendZoomLink } from "@/components/AdminSendZoomLink";
import { AdminGuard } from "@/components/AuthGuards";
import Link from "next/link";
import {
  type ConsultationAppointment,
  type ConsultationSlotOverride,
  businessTimeZone,
  consultationTimeSlots,
  dayBlockTimeWindow,
  defaultProjectManagerName,
  formatScheduledSlot,
  generateConsultationSlots,
  getSlotKey,
  isCancelableAppointment,
} from "@/lib/consultation-availability";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  blockAvailabilityDay,
  blockAvailabilitySlot,
  cancelConsultationBooking,
  saveAvailabilitySlot,
  unblockAvailabilityDay,
  unblockAvailabilitySlot,
} from "./actions";

export const dynamic = "force-dynamic";

const editableStatuses = ["Available", "Blocked"];

export default async function AdminAvailabilityPage() {
  const { appointments, error: appointmentError } = await getConsultationAppointments();
  const { overrides, error: overrideError } = await getAvailabilityOverrides();
  const calendarSlots = generateConsultationSlots({ overrides: [] });
  const appointmentMap = new Map(
    appointments.map((appointment) => [
      getSlotKey(appointment.appointment_date, appointment.time_window),
      appointment,
    ]),
  );
  const overrideMap = new Map(
    overrides
      .filter((override) => override.time_window !== dayBlockTimeWindow)
      .map((override) => [getSlotKey(override.slot_date, override.time_window), override]),
  );
  const blockedDays = new Set(
    overrides
      .filter(
        (override) =>
          override.time_window === dayBlockTimeWindow &&
          override.status === "Unavailable",
      )
      .map((override) => override.slot_date),
  );
  const groupedSlots = groupSlotsByDate(calendarSlots);

  return (
    <AdminGuard>
      <AdminShell
        description={`Manage the Monday through Saturday consultation calendar. Business timezone: ${businessTimeZone}.`}
        title="Consultation Availability"
      >
        <div className="grid gap-6">
          <AdminBackLink />

          {overrideError || appointmentError ? (
            <p className="rounded-md bg-red-50 p-4 text-sm font-semibold text-red-800">
              {overrideError || appointmentError}
            </p>
          ) : null}

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-navy">
              Monday-Saturday Consultation Calendar
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-charcoal/70">
              Default consultation slots run hourly from 8:00 AM through 5:00 PM.
              Use overrides to block a slot, unblock it, block a whole day, update
              the Project Manager, or attach a Zoom link.
            </p>
          </section>

          <div className="grid gap-6">
            {groupedSlots.map(({ date, slots }) => {
              const dayBlocked = blockedDays.has(date);

              return (
                <section
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                  key={date}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-black text-navy">
                        {formatDateHeading(date)}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-charcoal/60">
                        {dayBlocked ? "Day blocked" : "Open business day"}
                      </p>
                    </div>
                    {dayBlocked ? (
                      <form action={unblockAvailabilityDay}>
                        <input name="slotDate" type="hidden" value={date} />
                        <button
                          className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-accentDark"
                          type="submit"
                        >
                          Unblock Day
                        </button>
                      </form>
                    ) : (
                      <form action={blockAvailabilityDay}>
                        <input name="slotDate" type="hidden" value={date} />
                        <AdminConfirmSubmitButton
                          className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-800 transition hover:bg-red-100"
                          message="Block this entire consultation day?"
                        >
                          Block Entire Day
                        </AdminConfirmSubmitButton>
                      </form>
                    )}
                  </div>

                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[1220px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
                          {[
                            "Time Slot",
                            "Status",
                            "Booked Customer",
                            "Project Manager",
                            "Zoom Link",
                            "Save",
                            "Actions",
                          ].map((column) => (
                            <th className="py-3 pr-4" key={column}>
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {slots.map((slot) => {
                          const key = getSlotKey(slot.date, slot.timeWindow);
                          const override = overrideMap.get(key);
                          const appointment = appointmentMap.get(key);
                          const storedStatus = appointment
                            ? "Booked"
                            : dayBlocked
                              ? "Unavailable"
                              : override?.status ?? "Available";
                          const displayStatus =
                            storedStatus === "Unavailable" ? "Blocked" : storedStatus;
                          const formId = `slot-${slot.date}-${slot.timeWindow.replace(/[^a-z0-9]/gi, "-")}`;

                          return (
                            <tr
                              className="border-b border-slate-100 last:border-b-0"
                              key={key}
                            >
                              <td className="py-3 pr-4 font-black text-navy">
                                {slot.timeWindow}
                              </td>
                              <td className="py-3 pr-4 font-semibold text-charcoal">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-black ${
                                    displayStatus === "Booked"
                                      ? "bg-green-50 text-green-800"
                                      : displayStatus === "Blocked"
                                        ? "bg-red-50 text-red-800"
                                        : "bg-slate-100 text-charcoal"
                                  }`}
                                >
                                  {displayStatus}
                                </span>
                              </td>
                              <td className="py-3 pr-4 font-semibold text-charcoal">
                                {appointment ? (
                                  <div className="grid gap-1">
                                    <span>{appointment.customer_name ?? "Customer"}</span>
                                    <span className="text-xs text-charcoal/60">
                                      {appointment.customer_email ?? "No email listed"}
                                    </span>
                                    <span className="text-xs text-charcoal/60">
                                      Request: {appointment.service_request_id ?? "Not listed"}
                                    </span>
                                    {appointment.service_request_id ? (
                                      <Link
                                        className="text-xs font-black text-accent underline-offset-4 hover:underline"
                                        href="/admin/requests"
                                      >
                                        View Request
                                      </Link>
                                    ) : null}
                                  </div>
                                ) : (
                                  "Not booked"
                                )}
                              </td>
                              <td className="py-3 pr-4">
                                <form action={saveAvailabilitySlot} id={formId}>
                                  <input name="slotDate" type="hidden" value={slot.date} />
                                  <input
                                    name="timeWindow"
                                    type="hidden"
                                    value={slot.timeWindow}
                                  />
                                  <input
                                    name="appointmentId"
                                    type="hidden"
                                    value={appointment?.id ?? ""}
                                  />
                                </form>
                                <input
                                  className="min-h-10 rounded-md border border-slate-300 px-3 text-sm text-charcoal"
                                  defaultValue={
                                    override?.project_manager_name ??
                                    defaultProjectManagerName
                                  }
                                  form={formId}
                                  name="projectManagerName"
                                  required
                                />
                              </td>
                              <td className="py-3 pr-4">
                                <input
                                  className="min-h-10 w-72 rounded-md border border-slate-300 px-3 text-sm text-charcoal"
                                  defaultValue={
                                    override?.zoom_link ?? appointment?.zoom_link ?? ""
                                  }
                                  form={formId}
                                  name="zoomLink"
                                  placeholder="Optional Zoom link"
                                  type="url"
                                />
                              </td>
                              <td className="py-3 pr-4">
                                {appointment ? (
                                  <input form={formId} name="status" type="hidden" value="Booked" />
                                ) : (
                                  <select
                                    className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-charcoal"
                                    defaultValue={
                                      displayStatus === "Blocked" ? "Blocked" : "Available"
                                    }
                                    form={formId}
                                    name="status"
                                    required
                                  >
                                    {editableStatuses.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                )}
                                <button
                                  className="ml-2 rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-accentDark"
                                  form={formId}
                                  type="submit"
                                >
                                  Save
                                </button>
                              </td>
                              <td className="py-3 pr-4">
                                <div className="flex flex-wrap gap-2">
                                  {displayStatus === "Blocked" ? (
                                    <form action={unblockAvailabilitySlot}>
                                      <input name="slotDate" type="hidden" value={slot.date} />
                                      <input
                                        name="timeWindow"
                                        type="hidden"
                                        value={slot.timeWindow}
                                      />
                                      <button
                                        className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-accentDark"
                                        type="submit"
                                      >
                                        Unblock Slot
                                      </button>
                                    </form>
                                  ) : !appointment ? (
                                    <form action={blockAvailabilitySlot}>
                                      <input name="slotDate" type="hidden" value={slot.date} />
                                      <input
                                        name="timeWindow"
                                        type="hidden"
                                        value={slot.timeWindow}
                                      />
                                      <button
                                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent"
                                        type="submit"
                                      >
                                        Block Slot
                                      </button>
                                    </form>
                                  ) : null}
                                  {appointment?.customer_email && appointment.service_request_id ? (
                                    <AdminSendZoomLink
                                      customerEmail={appointment.customer_email}
                                      requestId={appointment.service_request_id}
                                      scheduledDateTime={formatScheduledSlot(
                                        appointment.appointment_date,
                                        appointment.time_window,
                                      )}
                                    />
                                  ) : null}
                                  {isCancelableAppointment(appointment) ? (
                                    <form action={cancelConsultationBooking}>
                                      <input
                                        name="appointmentId"
                                        type="hidden"
                                        value={appointment?.id ?? ""}
                                      />
                                      <input name="slotDate" type="hidden" value={slot.date} />
                                      <input
                                        name="timeWindow"
                                        type="hidden"
                                        value={slot.timeWindow}
                                      />
                                      <AdminConfirmSubmitButton
                                        className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-800 transition hover:bg-red-100"
                                        message="Cancel this consultation booking?"
                                      >
                                        Cancel Booking
                                      </AdminConfirmSubmitButton>
                                    </form>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

async function getAvailabilityOverrides() {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return {
      error: "Supabase is not configured. Availability overrides cannot load.",
      overrides: [] as ConsultationSlotOverride[],
    };
  }

  const { data, error } = await supabase
    .from("consultation_availability")
    .select("id,slot_date,time_window,project_manager_name,zoom_link,status")
    .order("slot_date", { ascending: true });

  if (error) {
    console.error("[admin-availability] Override lookup failed", error);
    return {
      error: "Availability overrides could not be loaded.",
      overrides: [] as ConsultationSlotOverride[],
    };
  }

  return { error: "", overrides: (data ?? []) as ConsultationSlotOverride[] };
}

async function getConsultationAppointments() {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return {
      appointments: [] as ConsultationAppointment[],
      error: "Supabase is not configured. Bookings cannot load.",
    };
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id,appointment_date,time_window,customer_name,customer_email,status,service_request_id,zoom_link",
    )
    .neq("status", "Canceled")
    .order("appointment_date", { ascending: true });

  if (error) {
    console.error("[admin-availability] Appointment lookup failed", error);
    return {
      appointments: [] as ConsultationAppointment[],
      error: "Consultation bookings could not be loaded.",
    };
  }

  return {
    appointments: (data ?? []) as ConsultationAppointment[],
    error: "",
  };
}

function groupSlotsByDate(slots: ReturnType<typeof generateConsultationSlots>) {
  const grouped = new Map<string, typeof slots>();

  for (const slot of slots) {
    grouped.set(slot.date, [...(grouped.get(slot.date) ?? []), slot]);
  }

  return Array.from(grouped.entries()).map(([date, items]) => ({
    date,
    slots: items,
  }));
}

function formatDateHeading(date: string) {
  return formatScheduledSlot(date, consultationTimeSlots[0]).replace(
    ` at ${consultationTimeSlots[0]}`,
    "",
  );
}
