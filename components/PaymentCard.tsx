"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

type PaymentCardProps = {
  title: string;
  description: string;
  type: string;
};

export function PaymentCard({ title, description, type }: PaymentCardProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
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
      setLoading(false);
    }
  }

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black text-navy">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-charcoal/72">
        {description}
      </p>
      {error ? (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      <Button className="mt-6 w-full" disabled={loading} onClick={startCheckout}>
        {loading ? "Opening..." : "Pay Deposit"}
      </Button>
    </article>
  );
}
