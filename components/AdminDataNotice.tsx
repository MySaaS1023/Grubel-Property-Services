import { isSupabaseServerConfigured } from "@/lib/supabase/server";

export function AdminDataNotice() {
  const supabaseConfigured = isSupabaseServerConfigured();

  return (
    <p className="rounded-md bg-accent/10 p-4 text-sm font-semibold leading-6 text-charcoal">
      MVP authentication is active. Replace with Supabase Auth before handling
      production-sensitive data.
      {!supabaseConfigured ? (
        <>
          {" "}
          Internal notice: Supabase is not configured, so this dashboard is
          showing local MVP data. Connect Supabase environment variables before
          production operations.
        </>
      ) : null}
    </p>
  );
}
