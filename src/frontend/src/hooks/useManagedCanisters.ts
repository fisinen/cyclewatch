import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ManagedCanister } from "../backend.d";
import { useBackend } from "./useBackend";

/**
 * Lists every canister the user has added to the panel.
 * Refetches on the shared 60s canister interval.
 */
export function useManagedCanisters(autoRefresh = true) {
  const { actor, isAuthenticated, isLoading } = useBackend();

  return useQuery<ManagedCanister[]>({
    queryKey: ["managedCanisters"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listManagedCanisters();
    },
    enabled: isAuthenticated && !isLoading && !!actor,
    refetchInterval: autoRefresh ? 60_000 : false,
    staleTime: 0,
    refetchOnMount: true,
  });
}

/** Adds a canister to the panel by its textual canister ID. */
export function useAddCanister() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (canisterId: string) => {
      if (!actor) throw new Error("Backend is not ready");
      await actor.addCanister(canisterId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["managedCanisters"] });
      void queryClient.invalidateQueries({ queryKey: ["activeCanister"] });
    },
  });
}

/** Removes a canister from the panel. */
export function useRemoveCanister() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (canisterId: string) => {
      if (!actor) throw new Error("Backend is not ready");
      await actor.removeCanister(canisterId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["managedCanisters"] });
      void queryClient.invalidateQueries({ queryKey: ["activeCanister"] });
      void queryClient.invalidateQueries({ queryKey: ["canisterResources"] });
    },
  });
}
