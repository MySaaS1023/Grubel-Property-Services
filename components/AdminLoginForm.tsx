"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";

export function AdminLoginForm() {
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
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Invalid admin login.");
        return;
      }

      router.push(searchParams.get("next") ?? "/admin");
    } catch {
      setError("Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <p className="rounded-md bg-accent/10 p-4 text-sm font-semibold leading-6 text-charcoal">
        Authentication is currently in MVP mode and must be replaced with
        secure auth before real operations.
      </p>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Email
        <input className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal" name="email" required type="email" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Password
        <input className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal" name="password" required type="password" />
      </label>
      {error ? (
        <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      <Button disabled={loading} type="submit">
        {loading ? "Logging In..." : "Login"}
      </Button>
    </form>
  );
}
