import { SubcontractorPage } from "@/components/SubcontractorPage";

const fields = [
  { label: "Full Name", name: "fullName", required: true },
  { label: "Company Name", name: "companyName" },
  { label: "Phone", name: "phone", required: true, type: "tel" as const },
  { label: "Email", name: "email", required: true, type: "email" as const },
  { label: "Commercial Experience", name: "commercialExperience", required: true },
  { label: "Services Offered", name: "servicesOffered", required: true },
  { label: "Licensed/Insured", name: "licensedInsured", required: true },
  { label: "Crew Size", name: "crewSize", required: true },
  { label: "Service Territories", name: "serviceTerritories", required: true },
  { label: "Safety Certifications", name: "safetyCertifications" },
  { label: "Upload ID", name: "identification", type: "file" as const },
  { label: "Upload Insurance", name: "insurance", type: "file" as const },
  { label: "Upload Certifications", name: "certifications", type: "file" as const },
  { label: "Upload Project Portfolio", name: "projectPortfolio", type: "file" as const },
  { label: "Additional Notes", name: "notes", type: "textarea" as const },
];

export default function CommercialApplicationPage() {
  return (
    <SubcontractorPage
      applicationType="commercial"
      description="Apply for commercial property maintenance, repair, and project support opportunities."
      fields={fields}
      title="Commercial Subcontractor Application"
    />
  );
}
