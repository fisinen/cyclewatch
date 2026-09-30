import { useQueries } from "@tanstack/react-query";
import type { CanisterStatus, ManagedCanister } from "../backend.d";
import type { CanisterOverview } from "../types";
import { useBackend } from "./useBackend";

/** Flattens the backend's variant status into a UI-friendly kind. */
export function toStatusKind(status: CanisterStatus): {
  kind: CanisterOverview["status"];
  detail: string | null;
} {
  switch (status.__kind__) {
    case "running":
      return { kind: "running", detail: null };
    case "stopping":
      return { kind: "stopping", detail: null };
    case "stopped":
      return { kind: "stopped", detail: null };
    case "unknown":
      return { kind: "unknown", detail: status.unknown };
  }
}

/**
 * Loads status + resource telemetry for every managed canister in parallel so
 * the comparison table can render them side by side.
 */
export function useCanisterOverviews(
  canisters: ManagedCanister[] | undefined,
  autoRefresh = true,
) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor;
  const list = canisters ?? [];

  const results = useQueries({
    queries: list.map((canister) => {
      const canisterId = canister.canisterId.toText();
      return {
        queryKey: ["canisterOverview", canisterId],
        queryFn: async (): Promise<CanisterOverview> => {
          if (!actor) throw new Error("Backend is not ready");
          const statusResult = await actor.getCanisterStatus(canisterId);
          if (statusResult.__kind__ === "err")
            throw new Error(statusResult.err);
          const info = statusResult.ok;
          const { kind, detail } = toStatusKind(info.status);
          return {
            canisterId,
            addedAt: canister.addedAt,
            status: kind,
            statusDetail: detail,
            controllers: info.controllers,
            cycleBalance: info.resources.cycleBalance,
            burnRateCyclesPerDay: info.resources.burnRateCyclesPerDay,
            runwayDays: info.resources.runwayDays,
            memory: {
              heapBytes: info.resources.memory.heapBytes,
              stableBytes: info.resources.memory.stableBytes,
              wasmBytes: info.resources.memory.wasmBytes,
            },
            settings: {
              computeAllocation: info.resources.settings.computeAllocation,
              memoryAllocation: info.resources.settings.memoryAllocation,
              freezingThreshold: info.resources.settings.freezingThreshold,
            },
          };
        },
        enabled: enabled && !!canisterId,
        refetchInterval: autoRefresh ? 30_000 : false,
        staleTime: 15_000,
        retry: 1,
      };
    }),
  });

  const overviews: CanisterOverview[] = [];
  let isAnyLoading = false;
  let firstError: Error | null = null;

  for (const result of results) {
    if (result.isLoading) isAnyLoading = true;
    if (result.error && !firstError) firstError = result.error as Error;
    if (result.data) overviews.push(result.data);
  }

  return {
    overviews,
    isLoading: isAnyLoading,
    error: firstError,
    refetchAll: () => {
      for (const result of results) void result.refetch();
    },
  };
}
