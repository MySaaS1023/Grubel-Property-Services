import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminTable } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const { serviceRequests } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="Review service request submissions from the request service intake form."
        title="Service Requests"
      >
        <div className="grid gap-6">
          <AdminBackLink />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <AdminTable
              columns={[
                "Customer",
                "Email",
                "Phone",
                "Service",
                "Property",
                "Preferred Date",
                "Status",
                "Submitted",
              ]}
              minWidth="980px"
              rows={serviceRequests.map((request) => [
                readText(request, "customer_name"),
                readText(request, "customer_email"),
                readText(request, "customer_phone"),
                readText(request, "service_type"),
                readText(request, "property_address"),
                readDate(request, "preferred_date"),
                readText(request, "status"),
                readDate(request, "created_at", "Not listed"),
              ])}
            />
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
