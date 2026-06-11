"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminDeleteButton({
  recordId,
  tableName,
}: {
  recordId: string;
  tableName: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch("/api/admin/delete-record", {
        body: JSON.stringify({ recordId, tableName }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        window.alert(data?.error ?? "Unable to delete record.");
        return;
      }

      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50"
      disabled={deleting}
      onClick={handleDelete}
      type="button"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
