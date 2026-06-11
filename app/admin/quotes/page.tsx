import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminTable } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readCurrency, readDate, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const { quotes } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="Review customer quote records, payment status, service status, and quote notes."
        title="Quotes"
      >
        <div className="grid gap-6">
          <AdminBackLink />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <AdminTable
              columns={[
                "Quote",
                "Customer",
                "Email",
                "Service",
                "Amount",
                "Payment",
                "Service Status",
                "Created",
              ]}
              deleteTableName="quotes"
              minWidth="1020px"
              rowIds={quotes.map((quote) => readText(quote, "id"))}
              rows={quotes.map((quote) => [
                readText(quote, "quote_number"),
                readText(quote, "customer_name"),
                readText(quote, "customer_email"),
                readText(quote, "service_type"),
                readCurrency(quote, "amount"),
                readText(quote, "payment_status"),
                readText(quote, "service_status"),
                readDate(quote, "created_at", "Not listed"),
              ])}
            />
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
