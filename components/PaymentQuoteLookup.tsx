"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import type { ReactNode } from "react";

type PaymentStatus = "Unpaid" | "Deposit Paid" | "Paid";

type PortalUpload = {
  id?: string;
  fileName: string;
  size: number;
  uploadedBy?: string;
};

type PortalMessage = {
  id: string;
  body: string;
};

type InvoiceHistory = {
  id: string;
  displayAmount: string;
  status: string;
  method: string;
  paidAt?: string;
};

type PortalQuote = {
  quoteNumber: string;
  customerName: string;
  serviceType: string;
  propertyAddress: string;
  amount: number;
  depositAmount: number;
  amountPaid: number;
  balanceDue: number;
  displayAmount: string;
  displayDepositAmount: string;
  displayAmountPaid: string;
  displayBalanceDue: string;
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
  paidAt?: string;
  paymentMethod: string;
  uploads: PortalUpload[];
  messages: PortalMessage[];
  invoiceHistory: InvoiceHistory[];
};

export function PaymentQuoteLookup() {
  const [quoteNumber, setQuoteNumber] = useState("");
  const [quote, setQuote] = useState<PortalQuote | null>(null);
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

  async function handlePayment(amount: number) {
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
          amount,
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

  const payment = quote ? getPaymentSummary(quote) : null;
  const isUnpaid = quote?.paymentStatus === "Unpaid";
  const hasProjectAccess =
    quote?.paymentStatus === "Deposit Paid" || quote?.paymentStatus === "Paid";

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
          {loading ? "Loading Quote..." : "View Quote"}
        </Button>
      </form>

      {quote && payment && isUnpaid ? (
        <article className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
                Balance Due
              </p>
              <h2 className="mt-2 text-2xl font-black text-navy">
                {quote.quoteNumber}
              </h2>
            </div>
            <StatusBadge label={quote.paymentStatus} />
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoField label="Quote Number" value={quote.quoteNumber} />
            <InfoField label="Customer Name" value={quote.customerName} />
            <InfoField label="Service Type" value={quote.serviceType} />
            <InfoField label="Property Address" value={quote.propertyAddress} />
            <InfoField label="Quote Amount" value={quote.displayAmount} />
            <InfoField label="Deposit Amount" value={quote.displayDepositAmount} />
            <InfoField label="Amount Paid" value={payment.amountPaidDisplay} />
            <InfoField label="Balance Due" value={payment.balanceDueDisplay} />
            <InfoField label="Payment Status" value={quote.paymentStatus} />
            <InfoField label="Next Step" value={quote.nextStep} />
          </dl>

          {paymentError ? (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
              {paymentError}
            </p>
          ) : null}

          <Button
            className="mt-6"
            disabled={paying}
            onClick={() => handlePayment(payment.balanceDue)}
          >
            {paying ? "Opening Payment..." : "Proceed to Payment"}
          </Button>
        </article>
      ) : null}

      {quote && payment && hasProjectAccess ? (
        <article className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
                Project Dashboard
              </p>
              <h2 className="mt-2 text-2xl font-black text-navy">
                {quote.quoteNumber}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={quote.paymentStatus} />
              <StatusBadge label={quote.serviceStatus} />
            </div>
          </div>

          <DashboardSection title="Project Overview">
            <InfoField label="Quote Number" value={quote.quoteNumber} />
            <InfoField label="Customer Name" value={quote.customerName} />
            <InfoField label="Service Type" value={quote.serviceType} />
            <InfoField label="Property Address" value={quote.propertyAddress} />
          </DashboardSection>

          <DashboardSection title="Service Details">
            <InfoField label="Payment Status" value={quote.paymentStatus} />
            <InfoField label="Service Status" value={quote.serviceStatus} />
            <InfoField label="Scheduled Date" value={quote.scheduledDate} />
            <InfoField label="Assigned Team" value={quote.assignedTeam} />
          </DashboardSection>

          <DashboardSection title="Notes / Next Steps">
            <InfoField label="Next Step" value={quote.nextStep} />
            <InfoField label="Notes" value={quote.notes} />
            <InfoField
              label="Latest Message"
              value={quote.messages[0]?.body ?? "No messages yet."}
            />
          </DashboardSection>

          <DashboardSection title="Uploaded Files">
            {quote.uploads.length ? (
              quote.uploads.map((upload) => (
                <InfoField
                  key={upload.id ?? upload.fileName}
                  label={upload.fileName}
                  value={`${formatFileSize(upload.size)}${upload.uploadedBy ? ` uploaded by ${upload.uploadedBy}` : ""}`}
                />
              ))
            ) : (
              <InfoField label="Files" value="No uploaded files yet." />
            )}
          </DashboardSection>

          <DashboardSection title="Payment Summary">
            <InfoField label="Quote Amount" value={quote.displayAmount} />
            <InfoField label="Deposit Amount" value={quote.displayDepositAmount} />
            <InfoField label="Amount Paid" value={payment.amountPaidDisplay} />
            <InfoField label="Balance Due" value={payment.balanceDueDisplay} />
            <InfoField label="Payment Method" value={quote.paymentMethod} />
            <InfoField label="Paid Date" value={quote.paidAt ?? "Not paid in full"} />
          </DashboardSection>

          {paymentError ? (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
              {paymentError}
            </p>
          ) : null}

          {quote.paymentStatus === "Deposit Paid" && payment.balanceDue > 0 ? (
            <Button
              className="mt-6"
              disabled={paying}
              onClick={() => handlePayment(payment.balanceDue)}
            >
              {paying ? "Opening Payment..." : "Pay Remaining Balance"}
            </Button>
          ) : (
            <p className="mt-6 rounded-md bg-white p-4 text-sm font-semibold text-charcoal/72">
              Payment received. No balance due.
            </p>
          )}
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

function InfoField({ label, value }: { label: string; value: string }) {
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

function getPaymentSummary(quote: PortalQuote) {
  if (quote.paymentStatus === "Paid") {
    return {
      amountPaid: quote.amount,
      amountPaidDisplay: quote.displayAmount,
      balanceDue: 0,
      balanceDueDisplay: "$0.00",
    };
  }

  if (quote.paymentStatus === "Deposit Paid") {
    return {
      amountPaid: quote.amountPaid,
      amountPaidDisplay: quote.displayAmountPaid,
      balanceDue: quote.balanceDue,
      balanceDueDisplay: quote.displayBalanceDue,
    };
  }

  return {
    amountPaid: 0,
    amountPaidDisplay: "$0.00",
    balanceDue: quote.balanceDue,
    balanceDueDisplay: quote.displayBalanceDue,
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(amount / 100);
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
