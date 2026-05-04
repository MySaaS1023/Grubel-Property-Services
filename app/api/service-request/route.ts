import { NextResponse } from "next/server";
import { validateServiceRequest } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateServiceRequest(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Email delivery can be added here later with Resend or Nodemailer.
  console.info("New Grubel Property Services request", validation.data);

  return NextResponse.json({
    success: true,
    message: "Service request received.",
  });
}
