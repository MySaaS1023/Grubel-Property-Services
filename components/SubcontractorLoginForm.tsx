"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";

export function SubcontractorLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/subcontractor-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          accessCode: formData.get("accessCode"),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "We could not validate that subcontractor access.");
        return;
      }

      router.push(searchParams.get("next") ?? "/subcontractor-portal");
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
        Email
        <input className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal" name="email" required type="email" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Access Code
        <input className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal" name="accessCode" required type="password" />
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
