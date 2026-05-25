import type { ReactNode } from "react";
import { AdminDataNotice } from "@/components/AdminDataNotice";
import { AdminGuard } from "@/components/AuthGuards";
import { PageHero } from "@/components/PageHero";
import { getAdminData, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

const actions = ["Approve", "Deny", "Request More Info", "Assign Job"];

export default async function AdminSubcontractorsPage() {
  const { applications, jobAssignments, subcontractors, uploads } =
    await getAdminData();
  const missingDocuments = subcontractors.flatMap((subcontractor) => {
    const documents = subcontractor.missing_documents;

    if (!Array.isArray(documents)) {
      return [];
    }

    return documents.map((document) => ({
      document: String(document),
      subcontractor: readText(subcontractor, "full_name"),
    }));
  });
  const subcontractorUploads = uploads.filter((upload) =>
    readText(upload, "related_type", "").includes("subcontractor"),
  );

  return (
    <AdminGuard>
      <PageHero
        eyebrow="Admin Subcontractors"
        title="Subcontractor Management"
        description="Review applications, approved partners, missing documents, job assignments, and uploaded files."
      />
      <section className="bg-white py-16">
        <div className="site-container grid gap-8">
          <AdminDataNotice />
          <section className="grid gap-8 lg:grid-cols-2">
            <Panel title="New Applications">
              {applications.length === 0 ? <EmptyState /> : null}
              {applications.map((application) => (
                <article
                  className="rounded-md bg-stonewash p-4"
                  key={readText(application, "id")}
                >
                  <h3 className="font-black text-navy">
                    {readText(application, "applicant_name")}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-charcoal/70">
                    {readText(application, "application_type")} -{" "}
                    {readText(application, "status")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <button
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent"
                        key={action}
                        type="button"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </Panel>
            <Panel title="Approved Subcontractors">
              {subcontractors.length === 0 ? <EmptyState /> : null}
              {subcontractors.map((subcontractor) => (
                <article
                  className="rounded-md bg-stonewash p-4"
                  key={readText(subcontractor, "id")}
                >
                  <h3 className="font-black text-navy">
                    {readText(subcontractor, "full_name")}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-charcoal/70">
                    {readText(subcontractor, "trade_skills")}
                  </p>
                  <p className="mt-2 text-sm font-bold text-accentDark">
                    {readText(subcontractor, "status")}
                  </p>
                </article>
              ))}
            </Panel>
          </section>

          <section className="grid gap-8 lg:grid-cols-3">
            <Panel title="Missing Documents">
              {missingDocuments.length === 0 ? <EmptyState /> : null}
              {missingDocuments.map((item) => (
                <div
                  className="rounded-md bg-stonewash p-3 text-sm font-bold text-charcoal"
                  key={`${item.subcontractor}-${item.document}`}
                >
                  {item.subcontractor}: {item.document}
                </div>
              ))}
            </Panel>
            <Panel title="Assigned Jobs">
              {jobAssignments.length === 0 ? <EmptyState /> : null}
              {jobAssignments.map((job) => (
                <div
                  className="rounded-md bg-stonewash p-3 text-sm font-bold leading-6 text-charcoal"
                  key={readText(job, "id")}
                >
                  {readText(job, "title")} - {readText(job, "status")}
                </div>
              ))}
            </Panel>
            <Panel title="Uploaded Files">
              {subcontractorUploads.length === 0 ? <EmptyState /> : null}
              {subcontractorUploads.map((upload) => (
                <div
                  className="rounded-md bg-stonewash p-3 text-sm font-bold leading-6 text-charcoal"
                  key={readText(upload, "id")}
                >
                  {readText(upload, "file_name")} - {readText(upload, "uploaded_by")}
                </div>
              ))}
            </Panel>
          </section>
        </div>
      </section>
    </AdminGuard>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-navy">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <p className="rounded-md bg-stonewash p-4 text-sm font-semibold text-charcoal/70">
      No records yet.
    </p>
  );
}
