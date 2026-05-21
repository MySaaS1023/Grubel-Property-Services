import type { ReactNode } from "react";
import { AdminDataNotice } from "@/components/AdminDataNotice";
import { AdminGuard } from "@/components/AuthGuards";
import { PageHero } from "@/components/PageHero";
import { applications, jobAssignments, subcontractors, uploads } from "@/lib/mock-data";

const actions = ["Approve", "Deny", "Request More Info", "Assign Job"];

export default function AdminSubcontractorsPage() {
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
              {applications.map((application) => (
                <article className="rounded-md bg-stonewash p-4" key={application.id}>
                  <h3 className="font-black text-navy">{application.applicantName}</h3>
                  <p className="mt-2 text-sm font-semibold text-charcoal/70">
                    {application.applicationType} · {application.status}
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
              {subcontractors.map((subcontractor) => (
                <article className="rounded-md bg-stonewash p-4" key={subcontractor.id}>
                  <h3 className="font-black text-navy">{subcontractor.fullName}</h3>
                  <p className="mt-2 text-sm font-semibold text-charcoal/70">
                    {subcontractor.tradeSkills.join(", ")}
                  </p>
                  <p className="mt-2 text-sm font-bold text-accentDark">
                    {subcontractor.status}
                  </p>
                </article>
              ))}
            </Panel>
          </section>

          <section className="grid gap-8 lg:grid-cols-3">
            <Panel title="Missing Documents">
              {subcontractors.flatMap((subcontractor) =>
                subcontractor.missingDocuments.map((document) => (
                  <div className="rounded-md bg-stonewash p-3 text-sm font-bold text-charcoal" key={`${subcontractor.id}-${document}`}>
                    {subcontractor.fullName}: {document}
                  </div>
                )),
              )}
            </Panel>
            <Panel title="Assigned Jobs">
              {jobAssignments.map((job) => (
                <div className="rounded-md bg-stonewash p-3 text-sm font-bold leading-6 text-charcoal" key={job.id}>
                  {job.title} · {job.status}
                </div>
              ))}
            </Panel>
            <Panel title="Uploaded Files">
              {uploads
                .filter((upload) => upload.relatedType.includes("subcontractor"))
                .map((upload) => (
                  <div className="rounded-md bg-stonewash p-3 text-sm font-bold leading-6 text-charcoal" key={upload.id}>
                    {upload.fileName} · {upload.uploadedBy}
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
