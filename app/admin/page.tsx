import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import type { ReactNode } from "react";
import {
  applications,
  jobAssignments,
  payments,
  projects,
  quotes,
  subcontractors,
  uploads,
} from "@/lib/operations-data";

const serviceRequests = [
  {
    name: "New Homeowner Request",
    service: "Maintenance & Repair",
    property: "101 Palm Ln, Phoenix, AZ",
    status: "Needs Review",
  },
  {
    name: "Rental Preservation Request",
    service: "Property Preservation",
    property: "220 Adobe St, Tempe, AZ",
    status: "Scope Pending",
  },
];

const notifications = [
  "Quote GPS-1001 is awaiting payment",
  "Insurance renewal pending for Approved Repair Partner",
  "New handyman application received",
  "Property Preservation Team uploaded progress photo",
];

const adminActions = [
  "Create quote",
  "Update project status",
  "Assign subcontractors",
  "Update payment status",
  "Add notes",
  "Upload files",
  "Approve/deny subcontractors",
];

export default function AdminPage() {
  return (
    <>
      <PageHero
        eyebrow="Internal Operations"
        title="Admin Dashboard"
        description="A lightweight operations CRM foundation for quotes, projects, payments, subcontractors, uploads, and notifications."
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6">
          <p className="rounded-md bg-accent/10 p-4 text-sm font-semibold leading-6 text-charcoal">
            Security prep: this route should be protected with authentication,
            admin role permissions, audit logging, and row-level database
            policies before production use.
          </p>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="New Service Requests" value={String(serviceRequests.length)} />
            <MetricCard label="Active Quotes" value={String(quotes.length)} />
            <MetricCard label="Customer Projects" value={String(projects.length)} />
            <MetricCard label="Active Subcontractors" value={String(subcontractors.length)} />
          </div>

          <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <DashboardPanel title="New Service Requests">
              <DataTable
                columns={["Name", "Service", "Property", "Status"]}
                rows={serviceRequests.map((item) => [
                  item.name,
                  item.service,
                  item.property,
                  item.status,
                ])}
              />
            </DashboardPanel>

            <DashboardPanel title="Admin Actions">
              <div className="grid gap-3">
                {adminActions.map((action) => (
                  <Button className="justify-start" key={action} type="button" variant="outline">
                    {action}
                  </Button>
                ))}
              </div>
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Active Quotes">
              <DataTable
                columns={["Quote", "Customer", "Amount", "Status"]}
                rows={quotes.map((quote) => [
                  quote.quoteNumber,
                  quote.customerName,
                  quote.displayAmount,
                  quote.quoteStatus,
                ])}
              />
            </DashboardPanel>

            <DashboardPanel title="Customer Projects">
              <DataTable
                columns={["Project", "Service", "Schedule", "Status"]}
                rows={projects.map((project) => [
                  project.quoteNumber,
                  project.serviceType,
                  project.scheduledDate,
                  project.status,
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Payments">
              <DataTable
                columns={["Quote", "Amount", "Status", "Method"]}
                rows={payments.map((payment) => [
                  payment.quoteNumber,
                  payment.displayAmount,
                  payment.status,
                  payment.method,
                ])}
              />
            </DashboardPanel>

            <DashboardPanel title="Subcontractor Applications">
              <DataTable
                columns={["Applicant", "Type", "Status", "Submitted"]}
                rows={applications.map((application) => [
                  application.applicantName,
                  application.applicationType,
                  application.status,
                  application.submittedAt,
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Assigned Jobs">
              <DataTable
                columns={["Job", "Property", "Due", "Status"]}
                rows={jobAssignments.map((job) => [
                  job.title,
                  job.propertyAddress,
                  job.dueDate,
                  job.status,
                ])}
              />
            </DashboardPanel>

            <DashboardPanel title="Project Status Tracking">
              <DataTable
                columns={["Project", "Team", "Next Step", "Updated"]}
                rows={projects.map((project) => [
                  project.quoteNumber,
                  project.assignedTeam,
                  project.nextStep,
                  project.updatedAt,
                ])}
              />
            </DashboardPanel>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            <DashboardPanel title="Uploads / Documents">
              <DataTable
                columns={["File", "Category", "Uploaded By", "Date"]}
                rows={uploads.map((upload) => [
                  upload.fileName,
                  upload.category,
                  upload.uploadedBy,
                  upload.createdAt,
                ])}
              />
            </DashboardPanel>

            <DashboardPanel title="Notifications">
              <div className="grid gap-3">
                {notifications.map((notification) => (
                  <div className="rounded-md bg-stonewash p-4 text-sm font-bold text-charcoal" key={notification}>
                    {notification}
                  </div>
                ))}
              </div>
            </DashboardPanel>
          </section>
        </div>
      </section>
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-navy">{value}</div>
    </div>
  );
}

function DashboardPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-navy">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
            {columns.map((column) => (
              <th className="py-3 pr-4" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={row.join("-")}>
              {row.map((cell) => (
                <td className="py-3 pr-4 font-semibold leading-6 text-charcoal" key={cell}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
