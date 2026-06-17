import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminEmptyState } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { consultationTimeSlots } from "@/lib/consultation-availability";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  addAvailabilitySlot,
  deleteAvailabilitySlot,
  updateAvailabilitySlot,
} from "./actions";

export const dynamic = "force-dynamic";

type AvailabilitySlot = {
  id: string;
  slot_date: string;
  time_window: string;
  project_manager_name: string | null;
  zoom_link: string | null;
  status: string | null;
};

const statuses = ["Available", "Unavailable", "Booked"];

export default async function AdminAvailabilityPage() {
  const { slots, error } = await getAvailabilitySlots();

  return (
    <AdminGuard>
      <AdminShell
        description="Manage available Project Manager consultation times shown on the public scheduler."
        title="Consultation Availability"
      >
        <div className="grid gap-6">
          <AdminBackLink />

          {error ? (
            <p className="rounded-md bg-red-50 p-4 text-sm font-semibold text-red-800">
              Availability table is not available yet. Apply the latest
              Supabase schema before managing slots.
            </p>
          ) : null}

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-navy">Add Consultation Slot</h2>
            <form action={addAvailabilitySlot} className="mt-5 grid gap-4 md:grid-cols-5">
              <label className="grid gap-2 text-sm font-bold text-navy">
                Date
                <input
                  className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal"
                  name="slotDate"
                  required
                  type="date"
                />
              </label>
              <Select
                name="timeWindow"
                options={consultationTimeSlots}
                required
                title="Time Slot"
              />
              <label className="grid gap-2 text-sm font-bold text-navy">
                Project Manager
                <input
                  className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal"
                  defaultValue="Grubel Project Manager"
                  name="projectManagerName"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Zoom Override
                <input
                  className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal"
                  name="zoomLink"
                  placeholder="Optional"
                  type="url"
                />
              </label>
              <div className="flex items-end">
                <button
                  className="min-h-11 w-full rounded-md bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-accentDark"
                  type="submit"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-navy">Available Slots</h2>
            {!error && slots.length === 0 ? <AdminEmptyState /> : null}
            {slots.length ? (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
                      {[
                        "Date",
                        "Time Slot",
                        "Project Manager",
                        "Zoom Override",
                        "Status",
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
                      const formId = `availability-${slot.id}`;

                      return (
                        <tr className="border-b border-slate-100 last:border-b-0" key={slot.id}>
                          <td className="py-3 pr-4">
                            <input
                              className="min-h-10 rounded-md border border-slate-300 px-3 text-sm text-charcoal"
                              defaultValue={slot.slot_date}
                              form={formId}
                              name="slotDate"
                              required
                              type="date"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <Select
                              defaultValue={slot.time_window}
                              form={formId}
                              name="timeWindow"
                              options={consultationTimeSlots}
                              required
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              className="min-h-10 rounded-md border border-slate-300 px-3 text-sm text-charcoal"
                              defaultValue={slot.project_manager_name ?? "Grubel Project Manager"}
                              form={formId}
                              name="projectManagerName"
                              required
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              className="min-h-10 rounded-md border border-slate-300 px-3 text-sm text-charcoal"
                              defaultValue={slot.zoom_link ?? ""}
                              form={formId}
                              name="zoomLink"
                              placeholder="Optional"
                              type="url"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <Select
                              defaultValue={slot.status ?? "Available"}
                              form={formId}
                              name="status"
                              options={statuses}
                              required
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <form action={updateAvailabilitySlot} id={formId}>
                              <input name="slotId" type="hidden" value={slot.id} />
                            </form>
                            <div className="flex flex-wrap gap-2">
                              <button
                                className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-accentDark"
                                form={formId}
                                type="submit"
                              >
                                Save
                              </button>
                              <form action={deleteAvailabilitySlot}>
                                <input name="slotId" type="hidden" value={slot.id} />
                                <button
                                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-800 transition hover:bg-red-100"
                                  type="submit"
                                >
                                  Delete
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

function Select({
  defaultValue,
  form,
  name,
  options,
  required,
  title,
}: {
  defaultValue?: string;
  form?: string;
  name: string;
  options: string[];
  required?: boolean;
  title?: string;
}) {
  const select = (
    <select
      className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-charcoal"
      defaultValue={defaultValue ?? ""}
      form={form}
      name={name}
      required={required}
    >
      <option disabled value="">
        Select
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  if (!title) {
    return select;
  }

  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {title}
      {select}
    </label>
  );
}

async function getAvailabilitySlots() {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return { slots: [] as AvailabilitySlot[], error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("consultation_availability")
    .select("id,slot_date,time_window,project_manager_name,zoom_link,status")
    .order("slot_date", { ascending: true });

  if (error) {
    console.error("[admin-availability] Slot lookup failed", error);
    return { slots: [] as AvailabilitySlot[], error: error.message };
  }

  return { slots: (data ?? []) as AvailabilitySlot[], error: "" };
}
