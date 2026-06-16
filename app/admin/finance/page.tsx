import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminTable } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readCurrency, readDate, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
  const { payments, projects, quotes } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="Track customer payments, vendor payouts, and outstanding balances."
        title="Finance"
      >
        <div className="grid gap-8">
          <AdminBackLink />
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Payments</h2>
            <div className="mt-5">
              <AdminTable
                columns={["Quote", "Amount", "Status", "Method", "Paid At"]}
                deleteTableName="payments"
                minWidth="820px"
                rowIds={payments.map((payment) => readText(payment, "id"))}
                rows={payments.map((payment) => [
                  readText(payment, "quote_number"),
                  readCurrency(payment, "amount"),
                  readText(payment, "status"),
                  readText(payment, "method"),
                  readDate(payment, "paid_at", "Not paid"),
                ])}
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Outstanding Balances</h2>
            <div className="mt-5">
              <AdminTable
                columns={["Quote", "Customer", "Service", "Balance Due", "Payment Status"]}
                deleteTableName="quotes"
                minWidth="900px"
                rowIds={quotes.map((quote) => readText(quote, "id"))}
                rows={quotes.map((quote) => [
                  readText(quote, "quote_number"),
                  readText(quote, "customer_name"),
                  readText(quote, "service_type"),
                  readCurrency(quote, "balance_due"),
                  readText(quote, "payment_status"),
                ])}
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Vendor Payouts</h2>
            <div className="mt-5">
              <AdminTable
                columns={[
                  "Project",
                  "Customer",
                  "Vendor Status",
                  "Project Status",
                  "Payment Status",
                ]}
                minWidth="980px"
                rows={projects.map((project) => [
                  readText(project, "id").slice(0, 8),
                  readText(project, "customer_name"),
                  readText(project, "vendor_status"),
                  readText(project, "status"),
                  readText(project, "payment_status"),
                ])}
              />
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
