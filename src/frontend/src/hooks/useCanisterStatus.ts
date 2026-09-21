import { useQuery } from "@tanstack/react-query";
import type { CanisterStatusInfo, StatusResult } from "../types";
import { useBackend } from "./useBackend";

// Loose actor type — method arrives via bindgen.
type MonitoringActor = {
  getCanisterStatus?: (canisterId: string) => Promise<StatusResult>;
};

/** Normalize a raw backend status record into our frontend type. */
function normalizeStatus(raw: CanisterStatusInfo): CanisterStatusInfo {
  return {
    canisterId: raw.canisterId,
    balance: raw.balance,
    status: raw.status,
    controllers: raw.controllers,
    lastChecked: raw.lastChecked,
    threshold: raw.threshold,
    alertEnabled: raw.alertEnabled,
    belowThreshold: raw.belowThreshold,
  };
}

/**
 * Fetches canister status (controllers, status field, balance, threshold).
 * Used for controller-setup detection polling on the detail view.
 */
export function useCanisterStatus(
  canisterId: string | null,
  options?: { refetchInterval?: number },
) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor && !!canisterId;

  const query = useQuery<CanisterStatusInfo, Error>({
    queryKey: ["canisterStatus", canisterId],
    queryFn: async () => {
      if (!actor || !canisterId) {
        throw new Error("No canister ID");
      }
      const a = actor as unknown as MonitoringActor;
      if (typeof a.getCanisterStatus !== "function") {
        throw new Error("getCanisterStatus not available");
      }
      const result = await a.getCanisterStatus(canisterId);
      if (result.__kind__ === "ok") return normalizeStatus(result.ok);
      throw new Error(result.err);
    },
    enabled,
    refetchInterval: options?.refetchInterval ?? false,
    staleTime: 5_000,
    refetchOnMount: true,
  });

  return {
    status: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
