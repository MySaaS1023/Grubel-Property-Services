import { NextResponse } from "next/server";

const requiredFieldsByType = {
  handyman: [
    "fullName",
    "phone",
    "email",
    "yearsExperience",
    "serviceAreas",
    "handymanSkills",
    "toolsAvailable",
    "transportationAvailable",
  ],
  residential: [
    "fullName",
    "phone",
    "email",
    "residentialExperience",
    "tradesOffered",
    "licensedInsured",
    "coverageAreas",
    "crewSize",
  ],
  commercial: [
    "fullName",
    "phone",
    "email",
    "commercialExperience",
    "servicesOffered",
    "licensedInsured",
    "crewSize",
    "serviceTerritories",
  ],
  general: [
    "fullName",
    "phone",
    "email",
    "tradeSkill",
    "experienceType",
    "yearsExperience",
    "serviceAreas",
    "availability",
  ],
} as const;

type ApplicationType = keyof typeof requiredFieldsByType;

export async function POST(request: Request) {
  const formData = await request.formData();
  const applicationTypeValue = formData.get("applicationType");
  const applicationType =
    typeof applicationTypeValue === "string"
      ? applicationTypeValue
      : "";

  if (!isApplicationType(applicationType)) {
    return NextResponse.json(
      { error: "Valid application type is required." },
      { status: 400 },
    );
  }

  for (const field of requiredFieldsByType[applicationType]) {
    const value = formData.get(field);
    if (!value || typeof value !== "string" || !value.trim()) {
      return NextResponse.json(
        { error: `${field} is required.` },
        { status: 400 },
      );
    }
  }

  // Future database integration point: store application details by
  // applicationType and upload file attachments to private storage.
  const submission = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [
      key,
      value instanceof File
        ? { fileName: value.name, size: value.size, type: value.type }
        : value,
    ]),
  );

  console.info("New subcontractor application", submission);

  return NextResponse.json({
    success: true,
    message: "Subcontractor application received.",
  });
}

function isApplicationType(value: string): value is ApplicationType {
  return value in requiredFieldsByType;
}
