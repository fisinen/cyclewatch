import { useQuery } from "@tanstack/react-query";
import type { BurnRateInfo } from "../types";
import { useBackend } from "./useBackend";

// Loose actor type — method arrives via bindgen.
type MonitoringActor = {
  getBurnRate?: (canisterId: string) => Promise<unknown>;
};

/** Normalize a raw backend burn-rate record into our frontend type. */
function normalizeBurnRate(raw: unknown): BurnRateInfo {
  const r = raw as Record<string, unknown>;
  return {
    cyclesPerDay: typeof r.cyclesPerDay === "number" ? r.cyclesPerDay : 0,
    daysRemaining: typeof r.daysRemaining === "number" ? r.daysRemaining : 0,
    projectedDepletionDate: toBigInt(r.projectedDepletionDate),
    snapshotCount: toBigInt(r.snapshotCount),
  };
}

function toBigInt(v: unknown): bigint {
  if (typeof v === "bigint") return v;
  if (typeof v === "number") return BigInt(Math.trunc(v));
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
 * Fetches burn-rate projection for a canister.
 * Returns cycles/day, days remaining, and projected depletion date.
 */
export function useBurnRate(canisterId: string | null) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor && !!canisterId;

  const query = useQuery<BurnRateInfo, Error>({
    queryKey: ["burnRate", canisterId],
    queryFn: async () => {
      if (!actor || !canisterId) {
        throw new Error("No canister ID");
      }
      const a = actor as unknown as MonitoringActor;
      if (typeof a.getBurnRate !== "function") {
        throw new Error("getBurnRate not available");
      }
      const raw = await a.getBurnRate(canisterId);
      return normalizeBurnRate(raw);
    },
    enabled,
    staleTime: 30_000,
    refetchOnMount: true,
  });

  return {
    burnRate: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
