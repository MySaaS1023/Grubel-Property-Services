import { AdminDataNotice } from "@/components/AdminDataNotice";
import { AdminGuard } from "@/components/AuthGuards";
import { PageHero } from "@/components/PageHero";
import { getAdminData, readDate, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const { projects, uploads } = await getAdminData();

  return (
    <AdminGuard>
      <PageHero
        eyebrow="Admin Projects"
        title="Project Management"
        description="View active projects, status, payment state, assigned teams, scheduling, notes, and uploaded files."
      />
      <section className="bg-white py-16">
        <div className="site-container grid gap-6">
          <AdminDataNotice />
          {projects.length === 0 ? (
            <p className="rounded-md bg-stonewash p-4 text-sm font-semibold text-charcoal/70">
              No records yet.
            </p>
          ) : null}
          {projects.map((project) => {
            const projectId = readText(project, "id", "");
            const projectUploads = uploads.filter(
              (upload) =>
                readText(upload, "related_id", "") === projectId ||
                readText(upload, "related_type", "") === "project",
            );

            return (
              <article
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                key={projectId}
              >
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-navy">
                      {readText(project, "quote_number")}
                    </h2>
                    <p className="mt-2 font-semibold text-charcoal/70">
                      {readText(project, "customer_name")} ·{" "}
                      {readText(project, "service_type")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge label={readText(project, "status")} />
                    <Badge label={readText(project, "payment_status")} />
                  </div>
                </div>
                <dl className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Info
                    label="Property Address"
                    value={readText(project, "property_address")}
                  />
                  <Info label="Assigned Team" value={readText(project, "assigned_team")} />
                  <Info label="Scheduled Date" value={readDate(project, "scheduled_date")} />
                  <Info label="Notes" value={readText(project, "notes")} />
                  <Info label="Next Step" value={readText(project, "next_step")} />
                  <Info
                    label="Uploaded Files"
                    value={
                      projectUploads.length
                        ? projectUploads
                            .map((upload) => readText(upload, "file_name"))
                            .join(", ")
                        : "No uploaded files"
                    }
                  />
                </dl>
              </article>
            );
          })}
        </div>
      </section>
    </AdminGuard>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-stonewash p-4">
      <dt className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-bold leading-6 text-charcoal">{value}</dd>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-navy px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
      {label}
    </span>
  );
}
