"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";

type PaymentStatus = "unpaid" | "deposit_paid" | "paid";

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

  const hasPayment = quote?.paymentStatus === "paid" || quote?.paymentStatus === "deposit_paid";

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

      {quote && !hasPayment ? (
        <article className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
                Quote Ready
              </p>
              <h2 className="mt-2 text-2xl font-black text-navy">
                {quote.quoteNumber}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
                Balance Due
              </div>
              <div className="mt-1 text-2xl font-black text-charcoal">
                {quote.displayAmount}
              </div>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <PortalField label="Service Type" value={quote.serviceType} />
            <PortalField label="Property Address" value={quote.propertyAddress} />
            <PortalField label="Quote Amount" value={quote.displayAmount} />
            <PortalField label="Payment Status" value={formatStatus(quote.paymentStatus)} />
            <PortalField label="Service Status" value={quote.serviceStatus} />
            <PortalField label="Next Step" value={quote.nextStep} />
          </dl>

          {paymentError ? (
            <p className="mt-5 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
              {paymentError}
            </p>
          ) : null}
          <Button className="mt-5" disabled={paying} onClick={handleProceedToPayment}>
            {paying ? "Opening Payment..." : "Proceed to Payment"}
          </Button>
        </article>
      ) : null}

      {quote && hasPayment ? (
        <article className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
              Project Dashboard
            </p>
            <h2 className="mt-2 text-2xl font-black text-navy">
              {quote.quoteNumber}
            </h2>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <PortalField label="Quote Number" value={quote.quoteNumber} />
            <PortalField label="Service Type" value={quote.serviceType} />
            <PortalField label="Property Address" value={quote.propertyAddress} />
            <PortalField label="Payment Status" value={formatStatus(quote.paymentStatus)} />
            <PortalField label="Service Status" value={quote.serviceStatus} />
            <PortalField label="Scheduled Date" value={quote.scheduledDate} />
            <PortalField label="Assigned Team" value={quote.assignedTeam} />
            <PortalField label="Next Step" value={quote.nextStep} />
          </dl>

          <div className="mt-6 rounded-md bg-white p-4">
            <div className="text-sm font-black text-navy">Notes</div>
            <p className="mt-2 text-sm leading-6 text-charcoal/72">{quote.notes}</p>
          </div>
        </article>
      ) : null}
    </div>
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

function formatStatus(status: PaymentStatus) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
