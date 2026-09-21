import { useQuery } from "@tanstack/react-query";
import type { MonitoredCanister } from "../types";
import { useBackend } from "./useBackend";

// Loose actor type — the real methods arrive via bindgen (backend.d.ts).
// Using a structural cast avoids coupling this hook to a stale backend.d.ts
// during the foundation wave; the check wave regenerates backend.d.ts.
type MonitoringActor = {
  getMonitoredCanisters?: () => Promise<unknown[]>;
};

/** Normalize a raw backend record into our frontend MonitoredCanister type. */
function normalize(raw: unknown): MonitoredCanister {
  const r = raw as Record<string, unknown>;
  const lastAlert = r.lastAlertSentAt;
  return {
    canisterId: principalToText(r.canisterId),
    connectedAt: toBigInt(r.connectedAt),
    thresholdCycles: toBigInt(r.threshold),
    alertEnabled: Boolean(r.alertEnabled),
    lastAlertSentAt:
      lastAlert === null || lastAlert === undefined
        ? null
        : toBigInt(lastAlert),
  };
}

function principalToText(p: unknown): string {
  if (typeof p === "string") return p;
  if (p && typeof p === "object" && "toText" in p) {
    return (p as { toText: () => string }).toText();
  }
  return String(p);
}

function toBigInt(v: unknown): bigint {
  if (typeof v === "bigint") return v;
  if (typeof v === "number") return BigInt(v);
  if (typeof v === "string") {
    try {
      return BigInt(v);
    } catch {
      return BigInt(0);
    }
  }
  return BigInt(0);
}

/**
 * Fetches the user's monitored canister set.
 * Refetches every 30s so the dashboard stays current.
 */
export function useMonitoredCanisters() {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor;

  const query = useQuery<MonitoredCanister[]>({
    queryKey: ["monitoredCanisters"],
    queryFn: async () => {
      if (!actor) return [];
      const a = actor as unknown as MonitoringActor;
      if (typeof a.getMonitoredCanisters !== "function") return [];
      const raw = await a.getMonitoredCanisters();
      return raw.map(normalize);
    },
    enabled,
    refetchInterval: 30_000,
    staleTime: 15_000,
    refetchOnMount: true,
  });

  return {
    canisters: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
