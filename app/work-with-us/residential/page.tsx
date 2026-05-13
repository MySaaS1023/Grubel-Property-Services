import { SubcontractorPage } from "@/components/SubcontractorPage";

const fields = [
  { label: "Full Name", name: "fullName", required: true },
  { label: "Company Name", name: "companyName" },
  { label: "Phone", name: "phone", required: true, type: "tel" as const },
  { label: "Email", name: "email", required: true, type: "email" as const },
  { label: "Residential Experience", name: "residentialExperience", required: true },
  { label: "Trades Offered", name: "tradesOffered", required: true },
  { label: "Licensed/Insured", name: "licensedInsured", required: true },
  { label: "Coverage Areas", name: "coverageAreas", required: true },
  { label: "Crew Size", name: "crewSize", required: true },
  { label: "Upload ID", name: "identification", type: "file" as const },
  { label: "Upload Insurance", name: "insurance", type: "file" as const },
  { label: "Upload License", name: "license", type: "file" as const },
  { label: "Upload Portfolio", name: "portfolio", type: "file" as const },
  { label: "Additional Notes", name: "notes", type: "textarea" as const },
];

export default function ResidentialApplicationPage() {
  return (
    <SubcontractorPage
      applicationType="residential"
      description="Apply for residential repair, turnover, and maintenance opportunities with Grubel Property Services."
      fields={fields}
      title="Residential Subcontractor Application"
    />
  );
}
