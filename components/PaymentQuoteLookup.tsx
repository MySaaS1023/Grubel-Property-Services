"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";

type PaymentStatus = "Unpaid" | "Deposit Paid" | "Paid";

type PaymentQuote = {
  quoteNumber: string;
  customerName: string;
  serviceType: string;
  amount: number;
  displayAmount: string;
  paymentStatus: PaymentStatus;
};

export function PaymentQuoteLookup() {
  const [quoteNumber, setQuoteNumber] = useState("");
  const [quote, setQuote] = useState<PaymentQuote | null>(null);
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

  const isPaidInFull = quote?.paymentStatus === "Paid";
  const amountPaid = quote ? getAmountPaid(quote) : "$0.00";
  const balanceDue = quote ? getBalanceDue(quote) : "$0.00";
  const canPay = quote?.paymentStatus === "Unpaid";

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
          {loading ? "Checking Balance..." : "Continue to Payment"}
        </Button>
      </form>

      {quote ? (
        isPaidInFull ? (
          <article className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
              Paid In Full
            </p>
            <h2 className="mt-2 text-2xl font-black text-navy">
              This quote is paid in full.
            </h2>
            <p className="mt-3 leading-7 text-charcoal/72">
              View your project status in the Customer Portal.
            </p>
            <Button className="mt-5" href="/customer-portal">
              Go to Customer Portal
            </Button>
          </article>
        ) : (
          <article className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
                  Payment Summary
                </p>
                <h2 className="mt-2 text-2xl font-black text-navy">
                  {quote.quoteNumber}
                </h2>
              </div>
              <StatusBadge label={quote.paymentStatus} />
            </div>

            <dl className="mt-6 grid gap-4 md:grid-cols-2">
              <PaymentField label="Quote Number" value={quote.quoteNumber} />
              <PaymentField label="Customer Name" value={quote.customerName} />
              <PaymentField label="Service Type" value={quote.serviceType} />
              <PaymentField label="Quote Amount" value={quote.displayAmount} />
              <PaymentField label="Amount Paid" value={amountPaid} />
              <PaymentField label="Balance Due" value={balanceDue} />
              <PaymentField label="Payment Status" value={quote.paymentStatus} />
            </dl>

            {paymentError ? (
              <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
                {paymentError}
              </p>
            ) : null}

            {canPay ? (
              <Button className="mt-6" disabled={paying} onClick={handlePayNow}>
                {paying ? "Opening Payment..." : "Pay Now"}
              </Button>
            ) : (
              <p className="mt-6 rounded-md bg-white p-4 text-sm font-semibold text-charcoal/72">
                Deposit has been received. Use the Customer Portal to view your
                project status and next steps.
              </p>
            )}
          </article>
        )
      ) : null}
    </div>
  );
}

function PaymentField({ label, value }: { label: string; value: string }) {
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

function getAmountPaid(quote: PaymentQuote) {
  return quote.paymentStatus === "Unpaid" ? "$0.00" : quote.displayAmount;
}

function getBalanceDue(quote: PaymentQuote) {
  return quote.paymentStatus === "Unpaid" ? quote.displayAmount : "$0.00";
}
