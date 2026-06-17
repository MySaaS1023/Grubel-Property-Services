export type ConsultationSlot = {
  id: string;
  date: string;
  timeWindow: string;
  projectManagerName: string;
  zoomLink?: string;
};

export const consultationTimeSlots = [
  "ASAP",
  "6:00 AM",
  "7:00 AM",
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
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

export const consultationSlots: ConsultationSlot[] = [
  {
    id: "pm-asap",
    date: "2026-06-23",
    timeWindow: "ASAP",
    projectManagerName: "Grubel Project Manager",
  },
  {
    id: "pm-tue-9am",
    date: "2026-06-23",
    timeWindow: "9:00 AM",
    projectManagerName: "Grubel Project Manager",
  },
  {
    id: "pm-tue-1pm",
    date: "2026-06-23",
    timeWindow: "1:00 PM",
    projectManagerName: "Grubel Project Manager",
  },
  {
    id: "pm-wed-10am",
    date: "2026-06-24",
    timeWindow: "10:00 AM",
    projectManagerName: "Grubel Project Manager",
  },
  {
    id: "pm-wed-6pm",
    date: "2026-06-24",
    timeWindow: "6:00 PM",
    projectManagerName: "Grubel Project Manager",
  },
  {
    id: "pm-thu-2pm",
    date: "2026-06-25",
    timeWindow: "2:00 PM",
    projectManagerName: "Grubel Project Manager",
  },
];

export function getConsultationSlot(slotId: string) {
  return consultationSlots.find((slot) => slot.id === slotId);
}

export function getSlotKey(date: string, timeWindow: string) {
  return `${date}::${timeWindow}`.toLowerCase();
}
