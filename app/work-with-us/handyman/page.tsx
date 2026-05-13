import { SubcontractorPage } from "@/components/SubcontractorPage";

const fields = [
  { label: "Full Name", name: "fullName", required: true },
  { label: "Phone", name: "phone", required: true, type: "tel" as const },
  { label: "Email", name: "email", required: true, type: "email" as const },
  { label: "Years Experience", name: "yearsExperience", required: true },
  { label: "Service Areas", name: "serviceAreas", required: true },
  { label: "Handyman Skills", name: "handymanSkills", required: true },
  { label: "Tools Available", name: "toolsAvailable", required: true },
  { label: "Transportation Available", name: "transportationAvailable", required: true },
  { label: "Upload ID", name: "identification", type: "file" as const },
  { label: "Upload Work Photos", name: "workPhotos", type: "file" as const },
  { label: "Additional Notes", name: "notes", type: "textarea" as const },
];

export default function HandymanApplicationPage() {
  return (
    <SubcontractorPage
      applicationType="handyman"
      description="Apply to work with Grubel Property Services on general maintenance, repair, and property upkeep projects."
      fields={fields}
      title="Handyman Subcontractor Application"
    />
  );
}
