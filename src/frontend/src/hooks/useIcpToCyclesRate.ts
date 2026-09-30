import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IcpToCyclesRate } from "../backend.d";
import { useBackend } from "./useBackend";

/**
 * Reads the live ICP-to-Cycles rate sourced from the CMC.
 * Refetches on the shared 60s rate interval.
 */
export function useIcpToCyclesRate(autoRefresh = true) {
  const { actor, isAuthenticated, isLoading } = useBackend();

  return useQuery<IcpToCyclesRate, Error>({
    queryKey: ["icpToCyclesRate"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.getIcpToCyclesRate();
    },
    enabled: isAuthenticated && !isLoading && !!actor,
    refetchInterval: autoRefresh ? 60_000 : false,
    staleTime: 30_000,
    retry: 2,
    throwOnError: false,
  });
}

/** Forces a fresh rate pull from the CMC. */
export function useRefreshIcpToCyclesRate() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.refreshIcpToCyclesRate();
    },
    onSuccess: (rate) => {
      queryClient.setQueryData(["icpToCyclesRate"], rate);
      void queryClient.invalidateQueries({ queryKey: ["icpToCyclesRate"] });
    },
  });
}
