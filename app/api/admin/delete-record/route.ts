import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const allowedTables = new Set([
  "customers",
  "service_requests",
  "projects",
  "appointments",
  "quotes",
  "payments",
  "uploads",
  "subcontractor_applications",
  "subcontractors",
  "job_assignments",
  "crm_logs",
]);

export async function POST(request: Request) {
  const profile = await getCurrentProfile("admin");

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tableName = typeof body?.tableName === "string" ? body.tableName : "";
  const recordId = typeof body?.recordId === "string" ? body.recordId : "";

  if (!allowedTables.has(tableName) || !recordId) {
    return NextResponse.json({ error: "Invalid delete request." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  if (tableName === "uploads") {
    const { data: upload } = await supabase
      .from("uploads")
      .select("storage_bucket,storage_path")
      .eq("id", recordId)
      .maybeSingle();

    if (upload?.storage_bucket && upload?.storage_path) {
      const { error: storageError } = await supabase.storage
        .from(upload.storage_bucket)
        .remove([upload.storage_path]);

      if (storageError) {
        console.error("[admin-delete] upload storage delete failed", storageError);
      }
    }
  }

  const { error } = await supabase.from(tableName).delete().eq("id", recordId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
