"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";

type Quote = {
  quoteNumber: string;
  customerName: string;
  serviceType: string;
  propertyAddress: string;
  amount: number;
  displayAmount: string;
  paymentStatus: "paid" | "unpaid";
  serviceStatus:
    | "Quote Sent"
    | "Awaiting Payment"
    | "Payment Received"
    | "Scheduled"
    | "In Progress"
    | "Completed"
    | "Canceled";
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

  async function handlePayNow() {
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
          {loading ? "Looking Up..." : "Look Up Quote"}
        </Button>
      </form>

      {quote ? (
        <article className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
                Quote Details
              </p>
              <h2 className="mt-2 text-2xl font-black text-navy">
                {quote.quoteNumber}
              </h2>
            </div>
            <div className="text-2xl font-black text-charcoal">
              {quote.displayAmount}
            </div>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <QuoteField label="Customer Name" value={quote.customerName} />
            <QuoteField label="Service Type" value={quote.serviceType} />
            <QuoteField label="Property Address" value={quote.propertyAddress} />
            <QuoteField label="Quote Amount" value={quote.displayAmount} />
            <QuoteField label="Payment Status" value={quote.paymentStatus} />
            <QuoteField label="Service Status" value={quote.serviceStatus} />
          </dl>

          <div className="mt-6 rounded-md bg-white p-4">
            <div className="text-sm font-black text-navy">Notes / Next Step</div>
            <p className="mt-2 text-sm leading-6 text-charcoal/72">{quote.notes}</p>
          </div>

          {quote.paymentStatus === "paid" ? (
            <p className="mt-5 rounded-md bg-green-50 p-4 text-sm font-bold text-green-800">
              Payment received. Your service status is listed below.
            </p>
          ) : (
            <div className="mt-5">
              {paymentError ? (
                <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
                  {paymentError}
                </p>
              ) : null}
              <Button disabled={paying} onClick={handlePayNow}>
                {paying ? "Opening Payment..." : "Pay Now"}
              </Button>
            </div>
          )}
        </article>
      ) : null}
    </div>
  );
}

function QuoteField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-4">
      <dt className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-bold text-charcoal">{value}</dd>
    </div>
  );
}
