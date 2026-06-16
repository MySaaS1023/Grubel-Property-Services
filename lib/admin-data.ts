import { createServiceSupabaseClient } from "@/lib/supabase/server";

export type AdminRow = Record<string, unknown>;

type AdminData = {
  applications: AdminRow[];
  jobAssignments: AdminRow[];
  payments: AdminRow[];
  projects: AdminRow[];
  quotes: AdminRow[];
  serviceRequests: AdminRow[];
  subcontractors: AdminRow[];
  uploads: AdminRow[];
};

const emptyAdminData: AdminData = {
  applications: [],
  jobAssignments: [],
  payments: [],
  projects: [],
  quotes: [],
  serviceRequests: [],
  subcontractors: [],
  uploads: [],
};

const tableMap = {
  applications: "subcontractor_applications",
  jobAssignments: "job_assignments",
  payments: "payments",
  projects: "projects",
  quotes: "quotes",
  serviceRequests: "service_requests",
  subcontractors: "subcontractors",
  uploads: "uploads",
} satisfies Record<keyof AdminData, string>;

export async function getAdminData(): Promise<AdminData> {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return emptyAdminData;
  }

  const entries = await Promise.all(
    Object.entries(tableMap).map(async ([key, table]) => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(`[admin-data] Failed to load ${table}`, error);
        return [key, []] as const;
      }

      return [key, data ?? []] as const;
    }),
  );

  return {
    ...emptyAdminData,
    ...Object.fromEntries(entries),
  } as AdminData;
}

export function readText(
  row: AdminRow,
  keys: string | string[],
  fallback = "Not listed",
) {
  const lookupKeys = Array.isArray(keys) ? keys : [keys];

  for (const key of lookupKeys) {
    const value = row[key];

    if (Array.isArray(value) && value.length > 0) {
      return value.map((item) => String(item)).join(", ");
    }

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return fallback;
}

export function readCurrency(
  row: AdminRow,
  keys: string | string[],
  fallback = "$0.00",
) {
  const lookupKeys = Array.isArray(keys) ? keys : [keys];

  for (const key of lookupKeys) {
    const value = row[key];

    if (typeof value === "number") {
      return new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(value / 100);
    }

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
}

export function readDate(
  row: AdminRow,
  keys: string | string[],
  fallback = "Not scheduled",
) {
  const rawValue = readText(row, keys, "");

  if (!rawValue) {
    return fallback;
  }

  const date = new Date(rawValue);

  if (Number.isNaN(date.getTime())) {
    return rawValue;
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function countWhere(
  rows: AdminRow[],
  key: string,
  values: string | string[],
) {
  const expectedValues = Array.isArray(values) ? values : [values];

  return rows.filter((row) => expectedValues.includes(readText(row, key, "")))
    .length;
}
