import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminTable } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const { customers } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="View customer records created through service requests, quotes, and portal activity."
        title="Customers"
      >
        <div className="grid gap-6">
          <AdminBackLink />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <AdminTable
              columns={["Name", "Email", "Phone", "Property", "Created"]}
              minWidth="820px"
              rows={customers.map((customer) => [
                readText(customer, "full_name"),
                readText(customer, "email"),
                readText(customer, "phone"),
                readText(customer, ["property_address", "billing_address"]),
                readDate(customer, "created_at", "Not listed"),
              ])}
            />
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
