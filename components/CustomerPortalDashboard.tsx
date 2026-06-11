"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

type PortalUpload = {
  id?: string;
  fileName: string;
  size: number;
  uploadedBy?: string;
};

type PortalQuote = {
  quoteNumber: string;
  customerName: string;
  serviceType: string;
  propertyAddress: string;
  displayAmount: string;
  displayDepositAmount: string;
  displayBalanceDue: string;
  balanceDue: number;
  paymentStatus: string;
  serviceStatus: string;
  scheduledDate: string;
  nextStep: string;
  notes: string;
  uploads: PortalUpload[];
};

export function CustomerPortalDashboard({ quoteNumber }: { quoteNumber: string }) {
  const router = useRouter();
  const [quote, setQuote] = useState<PortalQuote | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!quoteNumber) {
      router.replace("/customer-login");
      return;
    }

    async function loadQuote() {
      try {
        const response = await fetch("/api/quote-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quoteNumber }),
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Quote not found.");
          return;
        }

        setQuote(data.quote);
      } catch {
        setError("Unable to load your portal. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadQuote();
  }, [quoteNumber, router]);

  async function handlePayment() {
    if (!quote || quote.balanceDue <= 0) {
      return;
    }

    setPaying(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteNumber: quote.quoteNumber,
          amount: quote.balanceDue,
          serviceType: quote.serviceType,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to start payment.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Unable to start payment. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return <p className="font-semibold text-charcoal/70">Loading portal...</p>;
  }

  if (error) {
    return (
      <p className="rounded-md bg-red-50 p-4 text-sm font-semibold text-red-800">
        {error}
      </p>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
            Customer Dashboard
          </p>
          <h2 className="mt-2 text-2xl font-black text-navy">{quote.quoteNumber}</h2>
          <p className="mt-2 text-sm font-semibold text-charcoal/70">
            {quote.customerName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={quote.paymentStatus} />
          <StatusBadge label={quote.serviceStatus} />
        </div>
      </div>

      <section className="mt-6">
        <h3 className="text-xl font-black text-navy">Project Overview</h3>
        <dl className="mt-4 grid gap-4 md:grid-cols-2">
          <Info label="Quote Number" value={quote.quoteNumber} />
          <Info label="Customer Name" value={quote.customerName} />
          <Info label="Service Type" value={quote.serviceType} />
          <Info label="Property Address" value={quote.propertyAddress} />
          <Info label="Quote Amount" value={quote.displayAmount} />
          <Info label="Deposit Amount" value={quote.displayDepositAmount} />
          <Info label="Balance Due" value={quote.displayBalanceDue} />
          <Info label="Payment Status" value={quote.paymentStatus} />
          <Info label="Project Status" value={quote.serviceStatus} />
          <Info label="Scheduled Date" value={quote.scheduledDate} />
          <Info label="Notes / Next Steps" value={quote.nextStep || quote.notes} />
          <Info
            label="Uploaded Files"
            value={
              quote.uploads.length
                ? quote.uploads.map((upload) => upload.fileName).join(", ")
                : "No uploaded files yet."
            }
          />
        </dl>
      </section>

      {quote.balanceDue > 0 ? (
        <Button className="mt-6" disabled={paying} onClick={handlePayment}>
          {paying ? "Opening Payment..." : "Pay Now"}
        </Button>
      ) : (
        <p className="mt-6 rounded-md bg-white p-4 text-sm font-semibold text-charcoal/72">
          Payment received. No balance due.
        </p>
      )}
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
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
