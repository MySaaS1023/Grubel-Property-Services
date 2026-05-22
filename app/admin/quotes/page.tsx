import { AdminDataNotice } from "@/components/AdminDataNotice";
import { AdminGuard } from "@/components/AuthGuards";
import { PageHero } from "@/components/PageHero";
import { getAdminData, readCurrency, readText } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

const serviceTypes = [
  "Maintenance & Repair",
  "Property Preservation",
  "Builds & Remodels",
];
const serviceStatuses = [
  "Quote Sent",
  "Awaiting Payment",
  "Deposit Paid",
  "Scheduled",
  "In Progress",
  "Completed",
  "Canceled",
];
const paymentStatuses = ["Unpaid", "Deposit Paid", "Paid"];

export default async function AdminQuotesPage() {
  const { quotes, subcontractors } = await getAdminData();
  const nextQuoteNumber = `GPS-${1000 + quotes.length + 1}`;
  const assignedTeamOptions = subcontractors.map((item) =>
    readText(item, ["full_name", "business_name", "email"]),
  );

  return (
    <AdminGuard>
      <PageHero
        eyebrow="Admin Quotes"
        title="Quote Generation"
        description="Create quote records for customers and review active quote activity from Supabase."
      />
      <section className="bg-white py-16">
        <div className="site-container grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="lg:col-span-2">
            <AdminDataNotice />
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 rounded-md bg-accent/10 p-4 text-sm font-semibold text-charcoal">
              Next quote number preview: {nextQuoteNumber}. Future database
              flow will reserve this number during quote creation.
            </div>
            <form className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Customer Name" name="customerName" />
                <Field label="Customer Email" name="customerEmail" type="email" />
                <Field label="Customer Phone" name="customerPhone" type="tel" />
                <Select label="Service Type" name="serviceType" options={serviceTypes} />
                <Field label="Property Address" name="propertyAddress" />
                <Field label="Quote Amount" name="quoteAmount" type="number" />
                <Field label="Deposit Amount" name="depositAmount" type="number" />
                <Field label="Balance Due" name="balanceDue" type="number" />
                <Select label="Service Status" name="serviceStatus" options={serviceStatuses} />
                <Select label="Payment Status" name="paymentStatus" options={paymentStatuses} />
                <Field label="Scheduled Date" name="scheduledDate" type="date" />
                <Select
                  label="Assigned Team/Subcontractor"
                  name="assignedTeam"
                  options={
                    assignedTeamOptions.length
                      ? assignedTeamOptions
                      : ["No approved subcontractors yet"]
                  }
                />
              </div>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Quote Notes
                <textarea className="min-h-32 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal" />
              </label>
              <button
                className="rounded-md bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-accentDark"
                type="button"
              >
                Generate Quote
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Recent Quotes</h2>
            <div className="mt-5 grid gap-4">
              {quotes.length === 0 ? (
                <p className="rounded-md bg-white p-4 text-sm font-semibold text-charcoal/70">
                  No records yet.
                </p>
              ) : null}
              {quotes.map((quote) => (
                <article
                  className="rounded-md bg-white p-4"
                  key={readText(quote, "id")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-navy">
                        {readText(quote, "quote_number")}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-charcoal/70">
                        {readText(quote, ["customer_name", "customer_email"])}
                      </p>
                    </div>
                    <span className="rounded-full bg-navy px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
                      {readText(quote, "payment_status")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-charcoal/72">
                    {readText(quote, "service_type")} ·{" "}
                    {readCurrency(quote, "amount")}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdminGuard>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <input
        className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal"
        name={name}
        type={type}
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <select
        className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-charcoal"
        name={name}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
