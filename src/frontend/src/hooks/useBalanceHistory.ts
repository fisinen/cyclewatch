import { useQuery } from "@tanstack/react-query";
import type { BalanceSnapshot } from "../types";
import { useBackend } from "./useBackend";

// Loose actor type — method arrives via bindgen.
type MonitoringActor = {
  getBalanceHistory?: (canisterId: string) => Promise<unknown[]>;
};

/** Normalize a raw backend snapshot record into our frontend type. */
function normalizeSnapshot(raw: unknown): BalanceSnapshot {
  const r = raw as Record<string, unknown>;
  return {
    canisterId: principalToText(r.canisterId),
    balance: toBigInt(r.balance),
    timestamp: toBigInt(r.timestamp),
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
 * Fetches balance snapshots for a canister.
 * Used to render the balance history chart on the detail view.
 */
export function useBalanceHistory(canisterId: string | null) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor && !!canisterId;

  const query = useQuery<BalanceSnapshot[]>({
    queryKey: ["balanceHistory", canisterId],
    queryFn: async () => {
      if (!actor || !canisterId) return [];
      const a = actor as unknown as MonitoringActor;
      if (typeof a.getBalanceHistory !== "function") return [];
      const raw = await a.getBalanceHistory(canisterId);
      return raw.map(normalizeSnapshot);
    },
    enabled,
    staleTime: 30_000,
    refetchOnMount: true,
  });

  return {
    snapshots: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
