import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

// Use a loose actor type since these methods will be added by bindgen
type ActorAny = Record<string, (...args: unknown[]) => Promise<unknown>>;

export function useCaffeineAccountId() {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor;

  return useQuery<string | null>({
    queryKey: ["caffeineAccountId"],
    queryFn: async () => {
      if (!actor) return null;
      const a = actor as unknown as ActorAny;
      if (typeof a.getCaffeineAccountId !== "function") return null;
      const result = await a.getCaffeineAccountId();
      // Result may be null, undefined, a string, or an Option variant
      if (result === null || result === undefined) return null;
      if (typeof result === "string") return result;
      if (
        typeof result === "object" &&
        result !== null &&
        "__kind__" in result
      ) {
        const opt = result as { __kind__: string; value?: string };
        return opt.__kind__ === "Some" && opt.value ? opt.value : null;
      }
      return null;
    },
    enabled,
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useSetCaffeineAccountId() {
  const { actor, isAuthenticated } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      if (!actor || !isAuthenticated) throw new Error("Not authenticated");
      const a = actor as unknown as ActorAny;
      if (typeof a.setCaffeineAccountId !== "function") {
        throw new Error("setCaffeineAccountId not available");
      }
      await a.setCaffeineAccountId(accountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caffeineAccountId"] });
    },
  });
}

export function useClearCaffeineAccountId() {
  const { actor, isAuthenticated } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor || !isAuthenticated) throw new Error("Not authenticated");
      const a = actor as unknown as ActorAny;
      if (typeof a.clearCaffeineAccountId !== "function") {
        throw new Error("clearCaffeineAccountId not available");
      }
      await a.clearCaffeineAccountId();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caffeineAccountId"] });
    },
  });
}
