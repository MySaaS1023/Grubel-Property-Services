import { SubcontractorPage } from "@/components/SubcontractorPage";

const fields = [
  {
    label: "Role You’re Interested In",
    name: "roleInterested",
    options: ["Cleaning Professional", "Property Care Professional", "Both"],
    required: true,
    type: "select" as const,
  },
  { label: "Full Name", name: "fullName", required: true },
  { label: "Phone", name: "phone", required: true, type: "tel" as const },
  { label: "Email", name: "email", required: true, type: "email" as const },
  { label: "Years Experience", name: "yearsExperience", required: true },
  { label: "Service Areas", name: "serviceAreas", required: true },
  {
    label: "Relevant Experience / Services",
    name: "relevantExperience",
    required: true,
    type: "textarea" as const,
  },
  {
    label: "Transportation Available",
    name: "transportationAvailable",
    required: true,
  },
  { label: "Upload ID", name: "identification", type: "file" as const },
  { label: "Upload Work Photos", name: "workPhotos", type: "file" as const },
  { label: "Additional Notes", name: "notes", type: "textarea" as const },
];

export default function WorkWithUsPage() {
  return (
    <SubcontractorPage
      applicationType="general"
      description="Apply to work with Grubel Property Services as a cleaning professional or property care professional."
      fields={fields}
      title="Work With Us"
    />
  );
}
