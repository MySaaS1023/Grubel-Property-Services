"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";

type Slot = {
  id: string;
  date: string;
  timeWindow: string;
  projectManagerName: string;
  available: boolean;
};

type SchedulerState = "idle" | "loading" | "booking" | "success" | "error";

export function ConsultationScheduler({ requestId }: { requestId: string }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [state, setState] = useState<SchedulerState>("loading");
  const [message, setMessage] = useState("");
  const [zoomLink, setZoomLink] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSlots() {
      setState("loading");
      try {
        const response = await fetch("/api/consultation-slots", {
          cache: "no-store",
        });
        const data = (await response.json()) as { slots?: Slot[]; error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Unable to load consultation slots.");
        }

        if (active) {
          setSlots(data.slots ?? []);
          setState("idle");
        }
      } catch (error) {
        if (active) {
          setState("error");
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load consultation slots.",
          );
        }
      }
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, []);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId),
    [selectedSlotId, slots],
  );
  const groupedSlots = useMemo(() => groupSlotsByDate(slots), [slots]);

  async function bookSlot() {
    if (!requestId) {
      setState("error");
      setMessage("Missing request reference. Please use the link from your confirmation email.");
      return;
    }

    if (!selectedSlotId) {
      setState("error");
      setMessage("Please choose an available consultation time.");
      return;
    }

    setState("booking");
    setMessage("");

    try {
      const response = await fetch("/api/consultation-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, slotId: selectedSlotId }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        warning?: string;
        zoomLink?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to schedule this consultation.");
      }

      setState("success");
      setZoomLink(data.zoomLink ?? "");
      setMessage("Your consultation has been booked successfully.");
      setSlots((current) =>
        current.map((slot) =>
          slot.id === selectedSlotId ? { ...slot, available: false } : slot,
        ),
      );
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to schedule this consultation.",
      );
    }
  }

  return (
    <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      {state === "loading" ? (
        <p className="text-sm font-semibold text-charcoal/70">
          Loading available consultation times...
        </p>
      ) : null}

      {groupedSlots.length ? (
        <div className="grid gap-6">
          {groupedSlots.map(({ date, slots: dateSlots }) => (
            <section className="grid gap-3" key={date}>
              <h2 className="text-lg font-black text-navy">{formatDate(date)}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {dateSlots.map((slot) => (
                  <label
                    className={`grid cursor-pointer gap-2 rounded-lg border p-4 text-sm transition ${
                      selectedSlotId === slot.id
                        ? "border-accent bg-accent/10"
                        : "border-slate-200 bg-white"
                    } hover:border-accent`}
                    key={slot.id}
                  >
                    <span className="font-black text-navy">{slot.timeWindow}</span>
                    <span className="font-semibold text-charcoal/70">
                      {slot.projectManagerName}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-charcoal/50">
                      Available
                    </span>
                    <input
                      checked={selectedSlotId === slot.id}
                      className="sr-only"
                      disabled={state === "booking" || state === "success"}
                      name="consultationSlot"
                      onChange={() => setSelectedSlotId(slot.id)}
                      type="radio"
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : state !== "loading" ? (
        <p className="text-sm font-semibold text-charcoal/70">
          No consultation slots are available right now. Grubel Property Services will follow up.
        </p>
      ) : null}

      {message ? (
        <div
          className={`grid gap-2 rounded-md px-4 py-3 text-sm font-semibold ${
            state === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          <p>{message}</p>
          {state === "success" && selectedSlot ? (
            <p>
              {formatConfirmedSlot(selectedSlot.date, selectedSlot.timeWindow)}
            </p>
          ) : null}
          {state === "success" && zoomLink ? (
            <a className="underline" href={zoomLink}>
              Open Zoom Link
            </a>
          ) : null}
        </div>
      ) : null}

      <Button
        disabled={state === "booking" || state === "loading" || state === "success"}
        onClick={bookSlot}
        type="button"
      >
        {state === "booking" ? "Scheduling..." : "Schedule Project Consultation"}
      </Button>
    </div>
  );
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatConfirmedSlot(date: string, timeSlot: string) {
  const formattedDate = formatDate(date);

  return `Confirmed: ${formattedDate} at ${timeSlot}`;
}

function groupSlotsByDate(slots: Slot[]) {
  const grouped = new Map<string, Slot[]>();

  for (const slot of slots) {
    grouped.set(slot.date, [...(grouped.get(slot.date) ?? []), slot]);
  }

  return Array.from(grouped.entries()).map(([date, dateSlots]) => ({
    date,
    slots: dateSlots,
  }));
}
