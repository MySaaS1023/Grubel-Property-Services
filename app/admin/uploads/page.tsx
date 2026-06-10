import { AdminBackLink, AdminShell } from "@/components/AdminShell";
import { AdminTable } from "@/components/AdminTable";
import { AdminGuard } from "@/components/AuthGuards";
import { getAdminData, readDate, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminUploadsPage() {
  const { uploads } = await getAdminData();

  return (
    <AdminGuard>
      <AdminShell
        description="Review uploaded file metadata from service requests, projects, and subcontractor applications."
        title="Uploads"
      >
        <div className="grid gap-6">
          <AdminBackLink />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <AdminTable
              columns={[
                "File",
                "Category",
                "Related Type",
                "Uploaded By",
                "Bucket",
                "Date",
              ]}
              minWidth="920px"
              rows={uploads.map((upload) => [
                readText(upload, "file_name"),
                readText(upload, "category"),
                readText(upload, "related_type"),
                readText(upload, "uploaded_by"),
                readText(upload, "storage_bucket"),
                readDate(upload, "created_at", "Not listed"),
              ])}
            />
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
