import { AdminGuard } from "@/components/AuthGuards";
import { AdminDataNotice } from "@/components/AdminDataNotice";
import { PageHero } from "@/components/PageHero";
import { projects, uploads } from "@/lib/mock-data";

export default function AdminProjectsPage() {
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
          {projects.map((project) => {
            const projectUploads = uploads.filter((upload) =>
              project.uploadedFileIds.includes(upload.id),
            );

            return (
              <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" key={project.id}>
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-navy">{project.quoteNumber}</h2>
                    <p className="mt-2 font-semibold text-charcoal/70">
                      {project.customerName} · {project.serviceType}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge label={project.status} />
                    <Badge label={project.paymentStatus} />
                  </div>
                </div>
                <dl className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Info label="Property Address" value={project.propertyAddress} />
                  <Info label="Assigned Team" value={project.assignedTeam} />
                  <Info label="Scheduled Date" value={project.scheduledDate} />
                  <Info label="Notes" value={project.notes} />
                  <Info label="Next Step" value={project.nextStep} />
                  <Info
                    label="Uploaded Files"
                    value={
                      projectUploads.length
                        ? projectUploads.map((upload) => upload.fileName).join(", ")
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
