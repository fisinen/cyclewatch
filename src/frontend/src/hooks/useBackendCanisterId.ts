import { useQuery } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

/**
 * Reads the backend canister's own principal so the UI can show
 * controller-setup guidance for canisters it does not yet control.
 */
export function useBackendCanisterId() {
  const { actor, isAuthenticated, isLoading } = useBackend();

  return useQuery<string | null>({
    queryKey: ["backendCanisterId"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBackendCanisterId();
    },
    enabled: isAuthenticated && !isLoading && !!actor,
    staleTime: Number.POSITIVE_INFINITY,
    retry: 1,
  });
}
