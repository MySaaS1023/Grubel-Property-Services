import { NextResponse } from "next/server";

const requiredFields = [
  "fullName",
  "phone",
  "email",
  "tradeSkill",
  "experienceType",
  "yearsExperience",
  "serviceAreas",
  "availability",
];

export async function POST(request: Request) {
  const formData = await request.formData();

  for (const field of requiredFields) {
    const value = formData.get(field);
    if (!value || typeof value !== "string" || !value.trim()) {
      return NextResponse.json(
        { error: `${field} is required.` },
        { status: 400 },
      );
    }
  }

  // Future Supabase integration point: store applicant profile details and
  // upload file attachments to private storage before approval review.
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
