"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import type { SessionRole } from "@/lib/auth";

export function LogoutButton({ role }: { role: SessionRole }) {
  const router = useRouter();

  async function handleLogout() {
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await response.json().catch(() => null);

    router.push(data?.redirectTo ?? "/");
    router.refresh();
  }

  return (
    <Button onClick={handleLogout} type="button" variant="outline">
      Logout
    </Button>
  );
}
