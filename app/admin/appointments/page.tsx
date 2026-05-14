import { AdminGuard } from "@/components/AuthGuards";
import { PageHero } from "@/components/PageHero";
import { appointments } from "@/lib/mock-data";

export default function AdminAppointmentsPage() {
  return (
    <AdminGuard>
      <PageHero
        eyebrow="Admin Appointments"
        title="Appointments"
        description="Track requested, scheduled, completed, and canceled appointments from the service request intake flow."
      />
      <section className="bg-white py-16">
        <div className="site-container">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <DataTable
              columns={["Customer Name", "Service Type", "Appointment Date", "Time Window", "Contact Method", "Status", "Notes"]}
              rows={appointments.map((appointment) => [
                appointment.customerName,
                appointment.serviceType,
                appointment.appointmentDate,
                appointment.timeWindow,
                appointment.contactMethod,
                appointment.status,
                appointment.notes,
              ])}
            />
          </div>
        </div>
      </section>
    </AdminGuard>
  );
}

function DataTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
            {columns.map((column) => (
              <th className="py-3 pr-4" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td className="py-3 pr-4 font-semibold leading-6 text-charcoal" key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
