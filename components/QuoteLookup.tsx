"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import type { ReactNode } from "react";

type PaymentStatus = "Unpaid" | "Deposit Paid" | "Paid";

type PortalUpload = {
  id?: string;
  fileName: string;
  fileType?: string;
  size: number;
  uploadedBy?: string;
  createdAt?: string;
};

type PortalMessage = {
  id: string;
  senderName: string;
  body: string;
  createdAt: string;
};

type InvoiceHistory = {
  id: string;
  displayAmount: string;
  status: string;
  method: string;
  paidAt?: string;
};

type Quote = {
  quoteNumber: string;
  customerName: string;
  serviceType: string;
  propertyAddress: string;
  amount: number;
  displayAmount: string;
  paymentStatus: PaymentStatus;
  serviceStatus:
    | "Quote Sent"
    | "Awaiting Payment"
    | "Deposit Paid"
    | "Scheduled"
    | "In Progress"
    | "Completed"
    | "Canceled";
  scheduledDate: string;
  assignedTeam: string;
  nextStep: string;
  notes: string;
  quoteStatus: string;
  expiresAt?: string;
  paidAt?: string;
  paymentMethod: string;
  uploads: PortalUpload[];
  messages: PortalMessage[];
  invoiceHistory: InvoiceHistory[];
};

export function QuoteLookup() {
  const [quoteNumber, setQuoteNumber] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setQuote(null);
    setLookupError("");
    setPaymentError("");

    try {
      const response = await fetch("/api/quote-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteNumber }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLookupError(data.error ?? "Quote not found.");
        return;
      }

      setQuote(data.quote);
    } catch {
      setLookupError("Unable to look up that quote. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleProceedToPayment() {
    if (!quote) {
      return;
    }

    setPaying(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteNumber: quote.quoteNumber,
          amount: quote.amount,
          serviceType: quote.serviceType,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setPaymentError(data.error ?? "Unable to start payment.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setPaymentError("Unable to start payment. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  const hasPayment = quote?.paymentStatus === "Paid" || quote?.paymentStatus === "Deposit Paid";

  return (
    <div className="grid gap-8">
      <form
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleLookup}
      >
        <label className="grid gap-2 text-sm font-bold text-navy">
          Quote Number
          <input
            className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            onChange={(event) => setQuoteNumber(event.target.value)}
            placeholder="GPS-1001"
            required
            type="text"
            value={quoteNumber}
          />
        </label>
        {lookupError ? (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
            {lookupError}
          </p>
        ) : null}
        <Button className="mt-5 w-full sm:w-auto" disabled={loading} type="submit">
          {loading ? "Loading Project..." : "View Project"}
        </Button>
      </form>

      {quote ? (
        <article className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
                {hasPayment ? "Project Dashboard" : "Quote Ready"}
              </p>
              <h2 className="mt-2 text-2xl font-black text-navy">
                {quote.quoteNumber}
              </h2>
              <p className="mt-2 text-sm font-semibold text-charcoal/70">
                {quote.customerName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={quote.paymentStatus} />
              <StatusBadge label={quote.serviceStatus} />
            </div>
          </div>

          <DashboardSection title="Project Overview">
            <PortalField label="Service Type" value={quote.serviceType} />
            <PortalField label="Property Address" value={quote.propertyAddress} />
            <PortalField label="Upcoming Schedule" value={quote.scheduledDate} />
            <PortalField label="Assigned Team" value={quote.assignedTeam} />
          </DashboardSection>

          <DashboardSection title="Quote Information">
            <PortalField label="Quote Number" value={quote.quoteNumber} />
            <PortalField label="Quote Amount" value={quote.displayAmount} />
            <PortalField label="Quote Status" value={quote.quoteStatus} />
            <PortalField label="Quote Expires" value={quote.expiresAt ?? "Not set"} />
          </DashboardSection>

          <DashboardSection title="Payment Summary">
            <PortalField label="Payment Status" value={quote.paymentStatus} />
            <PortalField label="Payment Method" value={quote.paymentMethod} />
            <PortalField label="Balance Due" value={hasPayment ? "$0.00" : quote.displayAmount} />
            <PortalField label="Paid Date" value={quote.paidAt ?? "Not paid"} />
          </DashboardSection>

          {!hasPayment ? (
            <div className="mt-6 rounded-md bg-white p-4">
              <div className="text-sm font-black text-navy">Next Steps</div>
              <p className="mt-2 text-sm leading-6 text-charcoal/72">{quote.nextStep}</p>
              {paymentError ? (
                <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
                  {paymentError}
                </p>
              ) : null}
              <Button className="mt-4" disabled={paying} onClick={handleProceedToPayment}>
                {paying ? "Opening Payment..." : "Proceed to Payment"}
              </Button>
            </div>
          ) : null}

          <DashboardSection title="Service Updates">
            <PortalField label="Service Status" value={quote.serviceStatus} />
            <PortalField label="Next Step" value={quote.nextStep} />
            <PortalField label="Notes" value={quote.notes} />
            <PortalField
              label="Latest Message"
              value={quote.messages[0]?.body ?? "No messages yet."}
            />
          </DashboardSection>

          <DashboardSection title="Uploaded Files">
            {quote.uploads.length ? (
              quote.uploads.map((upload) => (
                <PortalField
                  key={upload.id ?? upload.fileName}
                  label={upload.fileName}
                  value={`${formatFileSize(upload.size)}${upload.uploadedBy ? ` uploaded by ${upload.uploadedBy}` : ""}`}
                />
              ))
            ) : (
              <PortalField label="Files" value="No uploaded files yet." />
            )}
          </DashboardSection>

          <DashboardSection title="Invoice / Payment History">
            {quote.invoiceHistory.length ? (
              quote.invoiceHistory.map((invoice) => (
                <PortalField
                  key={invoice.id}
                  label={`${invoice.status} - ${invoice.displayAmount}`}
                  value={`${invoice.method}${invoice.paidAt ? ` on ${invoice.paidAt}` : ""}`}
                />
              ))
            ) : (
              <PortalField label="History" value="No payment history yet." />
            )}
          </DashboardSection>
        </article>
      ) : null}
    </div>
  );
}

function DashboardSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="text-xl font-black text-navy">{title}</h3>
      <dl className="mt-4 grid gap-4 md:grid-cols-2">{children}</dl>
    </section>
  );
}

function PortalField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-4">
      <dt className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-bold leading-6 text-charcoal">{value}</dd>
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

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
