"use client";

import { useState } from "react";

export function AdminZoomMeetingActions({
  appointmentId,
  customerJoinUrl,
  requestId,
}: {
  appointmentId: string;
  customerJoinUrl?: string | null;
  requestId?: string | null;
}) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [working, setWorking] = useState("");
  const reschedulePath = requestId
    ? `/schedule-consultation?requestId=${encodeURIComponent(requestId)}`
    : "";

  async function copyJoinLink() {
    if (!customerJoinUrl) {
      setMessageType("error");
      setMessage("Customer join link is not available yet.");
      return;
    }

    await navigator.clipboard.writeText(customerJoinUrl);
    setMessageType("success");
    setMessage("Customer join link copied.");
  }

  async function postAction(action: "resend" | "retry") {
    setWorking(action);
    setMessage("");

    try {
      const response = await fetch(
        action === "resend"
          ? "/api/admin/resend-meeting-email"
          : "/api/admin/retry-zoom",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId }),
        },
      );
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        setMessageType("error");
        setMessage(data?.error ?? "The Zoom action could not be completed.");
        return;
      }

      setMessageType("success");
      setMessage(data.message ?? "Zoom action completed.");
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "Zoom action failed.");
    } finally {
      setWorking("");
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <a
          className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-accentDark"
          href={`/api/admin/start-zoom?appointmentId=${encodeURIComponent(appointmentId)}`}
          rel="noreferrer"
          target="_blank"
        >
          Start Zoom Call
        </a>
        <button
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent"
          onClick={copyJoinLink}
          type="button"
        >
          Copy Customer Join Link
        </button>
        <button
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent disabled:opacity-60"
          disabled={working === "resend"}
          onClick={() => postAction("resend")}
          type="button"
        >
          {working === "resend" ? "Sending..." : "Resend Meeting Email"}
        </button>
        <button
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent disabled:opacity-60"
          disabled={working === "retry"}
          onClick={() => postAction("retry")}
          type="button"
        >
          {working === "retry" ? "Retrying..." : "Retry Zoom Creation"}
        </button>
        {reschedulePath ? (
          <a
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent"
            href={reschedulePath}
            rel="noreferrer"
            target="_blank"
          >
            Reschedule
          </a>
        ) : null}
      </div>
      {message ? (
        <p
          className={`max-w-sm rounded-md px-3 py-2 text-xs font-bold ${
            messageType === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
