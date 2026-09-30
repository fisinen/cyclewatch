import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

/**
 * Reads the canister currently selected in the panel.
 * Refetches on the shared 60s canister interval.
 */
export function useActiveCanister(autoRefresh = true) {
  const { actor, isAuthenticated, isLoading } = useBackend();

  return useQuery<string | null>({
    queryKey: ["activeCanister"],
    queryFn: async () => {
      if (!actor) return null;
      const principal = await actor.getActiveCanister();
      return principal ? principal.toText() : null;
    },
    enabled: isAuthenticated && !isLoading && !!actor,
    refetchInterval: autoRefresh ? 60_000 : false,
    staleTime: 0,
    refetchOnMount: true,
  });
}

/** Switches the active canister. */
export function useSetActiveCanister() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (canisterId: string) => {
      if (!actor) throw new Error("Backend is not ready");
      await actor.setActiveCanister(canisterId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["activeCanister"] });
    },
  });
}
