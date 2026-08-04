export const businessTimeZone = "America/Phoenix";
export const dayBlockTimeWindow = "DAY";
export const defaultProjectManagerName = "Grubel Project Manager";

export type ConsultationSlot = {
  id: string;
  date: string;
  timeWindow: string;
  projectManagerName: string;
  zoomLink?: string;
};

export type ConsultationSlotOverride = {
  id: string;
  slot_date: string;
  time_window: string;
  project_manager_name?: string | null;
  zoom_link?: string | null;
  status?: string | null;
};

export type ConsultationAppointment = {
  id: string;
  appointment_date: string;
  time_window: string;
  customer_name?: string | null;
  customer_email?: string | null;
  status?: string | null;
  service_request_id?: string | null;
  zoom_link?: string | null;
  zoom_meeting_id?: string | null;
  zoom_join_url?: string | null;
  zoom_start_url?: string | null;
  zoom_password?: string | null;
  zoom_creation_status?: string | null;
  zoom_created_at?: string | null;
  zoom_last_error?: string | null;
  project_manager_name?: string | null;
  property_address?: string | null;
};

export const consultationTimeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export function generateConsultationSlots({
  days = 30,
  now = new Date(),
  overrides = [],
}: {
  days?: number;
  now?: Date;
  overrides?: ConsultationSlotOverride[];
} = {}): ConsultationSlot[] {
  const today = getBusinessDateParts(now);
  const slots: ConsultationSlot[] = [];

  for (let offset = 0; offset < days; offset += 1) {
    const date = addDays(today.date, offset);

    if (isSunday(date)) {
      continue;
    }

    const dateKey = formatDateKey(date);
    const dayIsBlocked = overrides.some(
      (override) =>
        override.slot_date === dateKey &&
        override.time_window === dayBlockTimeWindow &&
        override.status === "Unavailable",
    );

    if (dayIsBlocked) {
      continue;
    }

    for (const timeWindow of consultationTimeSlots) {
      if (dateKey === today.dateKey && isPastTimeSlot(timeWindow, today.minutes)) {
        continue;
      }

      const override = overrides.find(
        (item) => item.slot_date === dateKey && item.time_window === timeWindow,
      );

      if (override?.status === "Unavailable" || override?.status === "Booked") {
        continue;
      }

      slots.push({
        id: override?.id ?? getGeneratedSlotId(dateKey, timeWindow),
        date: dateKey,
        timeWindow,
        projectManagerName:
          override?.project_manager_name?.trim() || defaultProjectManagerName,
        zoomLink: override?.zoom_link?.trim() || undefined,
      });
    }
  }

  return slots;
}

export function getGeneratedSlotId(date: string, timeWindow: string) {
  return `generated-${date}-${timeWindow.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function getSlotKey(date: string, timeWindow: string) {
  return `${date}::${timeWindow}`.toLowerCase();
}

export function getBusinessDateParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone: businessTimeZone,
    year: "numeric",
  }).formatToParts(now);
  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hour = Number(getPart("hour"));
  const minute = Number(getPart("minute"));

  return {
    date: new Date(`${year}-${month}-${day}T12:00:00`),
    dateKey: `${year}-${month}-${day}`,
    minutes: hour * 60 + minute,
  };
}

export function formatScheduledSlot(date: string, timeSlot: string) {
  const parsedDate = new Date(`${date}T12:00:00`);
  const formattedDate = Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        timeZone: "UTC",
        weekday: "long",
        year: "numeric",
      });

  return `${formattedDate} at ${timeSlot}`;
}

export function isCancelableAppointment(appointment: ConsultationAppointment | undefined) {
  if (!appointment) {
    return false;
  }

  return appointment.status !== "Canceled";
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isSunday(date: Date) {
  return date.getUTCDay() === 0;
}

function isPastTimeSlot(timeWindow: string, currentMinutes: number) {
  return getMinutesForTimeSlot(timeWindow) <= currentMinutes;
}

function getMinutesForTimeSlot(timeWindow: string) {
  const match = /^(\d{1,2}):00 (AM|PM)$/.exec(timeWindow);

  if (!match) {
    return 0;
  }

  const hour = Number(match[1]);
  const period = match[2];
  const normalizedHour =
    period === "AM" ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;

  return normalizedHour * 60;
}
