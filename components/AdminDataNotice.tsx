import { isSupabaseServerConfigured } from "@/lib/supabase/server";

export function AdminDataNotice() {
  if (isSupabaseServerConfigured()) {
    return null;
  }

  return (
    <p className="rounded-md bg-accent/10 p-4 text-sm font-semibold leading-6 text-charcoal">
      Internal notice: Supabase is not configured, so this dashboard is showing
      local MVP data. Connect Supabase environment variables before production
      operations.
    </p>
  );
}
