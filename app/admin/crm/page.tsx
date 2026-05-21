import { AdminGuard } from "@/components/AuthGuards";
import { AdminDataNotice } from "@/components/AdminDataNotice";
import { PageHero } from "@/components/PageHero";
import { crmLogs } from "@/lib/mock-data";

export default function AdminCRMPage() {
  return (
    <AdminGuard>
      <PageHero
        eyebrow="Admin CRM"
        title="CRM & Activity Log"
        description="Operational log for requests, consultations, appointments, quotes, projects, customer communication, payments, uploads, and subcontractor actions."
      />
      <section className="bg-white py-16">
        <div className="site-container grid gap-6">
          <AdminDataNotice />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <DataTable
              columns={["Date", "Type", "Customer/Sub", "Related Quote/Project", "Status", "Notes"]}
              rows={crmLogs.map((log) => [
                log.date,
                log.type,
                log.actor,
                log.relatedQuoteOrProject,
                log.status,
                log.notes,
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
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
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
