import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminTable } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const { appointments } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="Track requested, scheduled, completed, and canceled appointments from the service request intake flow."
        title="Appointments"
      >
        <div className="grid gap-6">
          <AdminBackLink />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <AdminTable
              columns={[
                "Customer Name",
                "Service Type",
                "Appointment Date",
                "Time Window",
                "Contact Method",
                "Status",
                "Notes",
              ]}
              minWidth="980px"
              rows={appointments.map((appointment) => [
                readText(appointment, "customer_name"),
                readText(appointment, "service_type"),
                readDate(appointment, "appointment_date"),
                readText(appointment, "time_window"),
                readText(appointment, "contact_method"),
                readText(appointment, "status"),
                readText(appointment, "notes"),
              ])}
            />
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
