import { useQuery } from "@tanstack/react-query";
import type { BalanceResult } from "../types";
import { useBackend } from "./useBackend";

// Loose actor type — method arrives via bindgen.
type MonitoringActor = {
  getCanisterCycleBalance?: (canisterId: string) => Promise<BalanceResult>;
};

/**
 * Fetches a single canister's cycle balance.
 * Used for manual refresh and per-canister detail views.
 */
export function useCanisterBalance(canisterId: string | null) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor && !!canisterId;

  const query = useQuery<bigint, Error>({
    queryKey: ["canisterBalance", canisterId],
    queryFn: async () => {
      if (!actor || !canisterId) return BigInt(0);
      const a = actor as unknown as MonitoringActor;
      if (typeof a.getCanisterCycleBalance !== "function") {
        throw new Error("getCanisterCycleBalance not available");
      }
      const result = await a.getCanisterCycleBalance(canisterId);
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
    enabled,
    staleTime: 10_000,
    refetchOnMount: true,
  });

  return {
    balance: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
