"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export function CustomerLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const quoteNumber = String(formData.get("quoteNumber") ?? "").trim().toUpperCase();
    const email = String(formData.get("email") ?? "").trim();

    try {
      const response = await fetch("/api/customer-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteNumber, email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "We could not find a matching quote. Please check your information or contact Grubel Property Services.",
        );
        return;
      }

      router.push(`/customer-portal?quote=${encodeURIComponent(data.quoteNumber)}`);
    } catch {
      setError("Unable to access the portal. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-2 text-sm font-bold text-navy">
        Quote Number
        <input
          className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          name="quoteNumber"
          placeholder="Quote Number"
          required
          type="text"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Email Address
        <input
          className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          name="email"
          placeholder="Email Address"
          required
          type="email"
        />
      </label>
      {error ? (
        <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      <Button disabled={loading} type="submit">
        {loading ? "Checking..." : "Access Portal"}
      </Button>
    </form>
  );
}
