import { useQuery } from "@tanstack/react-query";
import type { CanisterResources, CanisterStatusInfo } from "../backend.d";
import { type ICErrorKind, classifyICError } from "../utils/formatICError";
import { useBackend } from "./useBackend";

/**
 * Reads the cycle balance, burn rate, runway, memory breakdown, and settings
 * for a single canister. Refetches on the shared 30s balance interval.
 */
export function useCanisterResources(
  canisterId: string | null,
  autoRefresh = true,
) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor && !!canisterId;

  const query = useQuery<CanisterResources, Error>({
    queryKey: ["canisterResources", canisterId],
    queryFn: async () => {
      if (!actor || !canisterId) throw new Error("No canister selected");
      const result = await actor.getCanisterResources(canisterId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    enabled,
    refetchInterval: autoRefresh ? 30_000 : false,
    staleTime: 15_000,
    retry: 1,
    throwOnError: false,
  });

  const errorKind: ICErrorKind | null = query.error
    ? classifyICError(query.error)
    : null;

  return { ...query, errorKind };
}

/**
 * Reads the lifecycle status and controller list for a single canister.
 * Refetches on the shared 60s canister interval.
 */
export function useCanisterStatus(
  canisterId: string | null,
  autoRefresh = true,
) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor && !!canisterId;

  const query = useQuery<CanisterStatusInfo, Error>({
    queryKey: ["canisterStatus", canisterId],
    queryFn: async () => {
      if (!actor || !canisterId) throw new Error("No canister selected");
      const result = await actor.getCanisterStatus(canisterId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    enabled,
    refetchInterval: autoRefresh ? 60_000 : false,
    staleTime: 15_000,
    retry: 1,
    throwOnError: false,
  });

  const errorKind: ICErrorKind | null = query.error
    ? classifyICError(query.error)
    : null;

  return { ...query, errorKind };
}

/**
 * Reads the cycle balance for a single canister.
 * Refetches on the shared 30s balance interval.
 */
export function useCanisterCycleBalance(
  canisterId: string | null,
  autoRefresh = true,
) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor && !!canisterId;

  const query = useQuery<bigint, Error>({
    queryKey: ["canisterCycleBalance", canisterId],
    queryFn: async () => {
      if (!actor || !canisterId) throw new Error("No canister selected");
      const result = await actor.getCanisterCycleBalance(canisterId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    enabled,
    refetchInterval: autoRefresh ? 30_000 : false,
    staleTime: 15_000,
    retry: 1,
    throwOnError: false,
  });

  const errorKind: ICErrorKind | null = query.error
    ? classifyICError(query.error)
    : null;

  return { ...query, errorKind };
}
