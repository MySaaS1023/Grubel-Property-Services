import { Button } from "@/components/Button";
import { SubcontractorGuard } from "@/components/AuthGuards";
import { LogoutButton } from "@/components/LogoutButton";
import { PageHero } from "@/components/PageHero";
import { jobAssignments, subcontractors } from "@/lib/operations-data";

const subcontractor = subcontractors[0];

const policies = [
  "Approved work must follow the assigned scope",
  "No unauthorized subcontracting",
  "Completion photos may be required",
  "Property access details are confidential",
  "Safety and work quality standards apply",
];

const documents = [
  "Valid identification",
  "Insurance documents",
  "Licenses or certifications",
  "Work photos",
  "Signed project scope",
];

const pendingApprovals = [
  "Insurance renewal review",
  "Updated service territory confirmation",
];

export default function SubcontractorPortalPage() {
  return (
    <SubcontractorGuard>
      <PageHero
        eyebrow="Subcontractor Portal"
        title="Subcontractor Portal"
        description="Approved subcontractors can review assigned work, submit updates, upload completion photos, and manage availability."
      />
      <section className="bg-white py-16">
        <div className="site-container grid gap-8">
          <div>
            <LogoutButton role="subcontractor" />
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            <DashboardCard label="Status" value={subcontractor.status} />
            <DashboardCard label="Availability" value={subcontractor.availability} />
            <DashboardCard label="Assigned Jobs" value={String(jobAssignments.length)} />
            <DashboardCard label="Pending Approvals" value={String(pendingApprovals.length)} />
          </div>

          <section className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-black text-navy">Assigned Jobs</h2>
                <p className="mt-2 leading-7 text-charcoal/72">
                  Review assigned work and submit field updates. Editing job
                  assignments is reserved for internal admin users.
                </p>
              </div>
              <StatusBadge label={subcontractor.status} />
            </div>
            <div className="mt-6 grid gap-4">
              {jobAssignments.map((job) => (
                <article className="rounded-lg border border-slate-200 bg-white p-5" key={job.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black text-navy">{job.title}</h3>
                      <p className="mt-2 text-sm font-semibold text-charcoal/70">
                        {job.propertyAddress}
                      </p>
                    </div>
                    <StatusBadge label={job.status} />
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <InfoTile label="Due Date" value={job.dueDate} />
                    <InfoTile label="Notes" value={job.notes} />
                    <InfoTile label="Job Status" value={job.status} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-navy">Submit Job Update</h2>
              <form className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Job Status
                  <select className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-charcoal">
                    <option>Accepted</option>
                    <option>In Progress</option>
                    <option>Needs Review</option>
                    <option>Completed</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Notes / Updates
                  <textarea className="min-h-32 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Upload completion photos
                  <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" multiple type="file" />
                </label>
                <Button type="button">Submit Update</Button>
              </form>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-navy">Availability</h2>
              <form className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Availability Status
                  <select className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-charcoal">
                    <option>Available</option>
                    <option>Limited availability</option>
                    <option>Unavailable</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Availability Notes
                  <textarea className="min-h-32 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal" />
                </label>
                <Button type="button">Update Availability</Button>
              </form>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Document & Photo Uploads</h2>
            <p className="mt-2 leading-7 text-charcoal/72">
              Upload required documents, work photos, completion photos, and
              supporting notes for review. Files are logged locally for now and
              prepared for future private storage.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                "Upload ID",
                "Upload Insurance",
                "Upload License/Certifications",
                "Upload Work Photos",
                "Completion Photos",
              ].map((label) => (
                <label className="grid gap-2 text-sm font-bold text-navy" key={label}>
                  {label}
                  <input
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    multiple={label.includes("Photos")}
                    type="file"
                  />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">
                Notes
                <textarea className="min-h-28 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal" />
              </label>
            </div>
            <Button className="mt-5" type="button">
              Submit Documents
            </Button>
          </section>

          <section className="grid gap-8 lg:grid-cols-3">
            <ListCard title="Pending Approvals" items={pendingApprovals} />
            <ListCard title="Company Policies" items={policies} />
            <ListCard title="Required Documents Checklist" items={documents} />
          </section>

          <p className="rounded-md bg-accent/10 p-4 text-sm font-semibold leading-6 text-charcoal">
            Security prep: future versions should require subcontractor
            authentication and role permissions before displaying assignments or
            accepting updates.
          </p>
        </div>
      </section>
    </SubcontractorGuard>
  );
}

function DashboardCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
        {label}
      </div>
      <div className="mt-2 text-2xl font-black text-navy">{value}</div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-stonewash p-4">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
        {label}
      </div>
      <div className="mt-2 text-sm font-bold leading-6 text-charcoal">{value}</div>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-navy">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div className="rounded-md bg-stonewash p-3 text-sm font-bold text-charcoal" key={item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-navy px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
      {label}
    </span>
  );
}
