export type ConsultationSlot = {
  id: string;
  date: string;
  timeWindow: string;
  projectManagerName: string;
};

export const consultationSlots: ConsultationSlot[] = [
  {
    id: "pm-tue-morning",
    date: "2026-06-23",
    timeWindow: "Morning",
    projectManagerName: "Grubel Project Manager",
  },
  {
    id: "pm-tue-afternoon",
    date: "2026-06-23",
    timeWindow: "Afternoon",
    projectManagerName: "Grubel Project Manager",
  },
  {
    id: "pm-wed-morning",
    date: "2026-06-24",
    timeWindow: "Morning",
    projectManagerName: "Grubel Project Manager",
  },
  {
    id: "pm-wed-evening",
    date: "2026-06-24",
    timeWindow: "Evening",
    projectManagerName: "Grubel Project Manager",
  },
  {
    id: "pm-thu-afternoon",
    date: "2026-06-25",
    timeWindow: "Afternoon",
    projectManagerName: "Grubel Project Manager",
  },
];

export function getConsultationSlot(slotId: string) {
  return consultationSlots.find((slot) => slot.id === slotId);
}
