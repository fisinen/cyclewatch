import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

// Loose actor type — methods arrive via bindgen. Structural cast keeps this
// hook decoupled from a stale backend.d.ts during the foundation wave.
type MonitoringActor = {
  connectCanister?: (canisterId: string) => Promise<void>;
  disconnectCanister?: (canisterId: string) => Promise<void>;
  setThreshold?: (canisterId: string, threshold: bigint) => Promise<void>;
  setAlertEnabled?: (canisterId: string, enabled: boolean) => Promise<void>;
};

/**
 * Mutations for managing monitored canisters.
 * Each mutation invalidates the monitored canisters list and relevant detail
 * queries so the UI reflects the change immediately.
 */
export function useCanisterActions() {
  const { actor, isAuthenticated } = useBackend();
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["monitoredCanisters"] });
    queryClient.invalidateQueries({ queryKey: ["canisterBalance"] });
    queryClient.invalidateQueries({ queryKey: ["canisterStatus"] });
    queryClient.invalidateQueries({ queryKey: ["balanceHistory"] });
    queryClient.invalidateQueries({ queryKey: ["burnRate"] });
  };

  const invalidateDetail = (canisterId: string) => {
    queryClient.invalidateQueries({ queryKey: ["monitoredCanisters"] });
    queryClient.invalidateQueries({
      queryKey: ["canisterBalance", canisterId],
    });
    queryClient.invalidateQueries({
      queryKey: ["canisterStatus", canisterId],
    });
    queryClient.invalidateQueries({
      queryKey: ["balanceHistory", canisterId],
    });
    queryClient.invalidateQueries({ queryKey: ["burnRate", canisterId] });
  };

  const connectMutation = useMutation({
    mutationFn: async (canisterId: string) => {
      if (!actor || !isAuthenticated) throw new Error("Not authenticated");
      const a = actor as unknown as MonitoringActor;
      if (typeof a.connectCanister !== "function") {
        throw new Error("connectCanister not available");
      }
      await a.connectCanister(canisterId);
    },
    onSuccess: () => invalidateAll(),
  });

  const disconnectMutation = useMutation({
    mutationFn: async (canisterId: string) => {
      if (!actor || !isAuthenticated) throw new Error("Not authenticated");
      const a = actor as unknown as MonitoringActor;
      if (typeof a.disconnectCanister !== "function") {
        throw new Error("disconnectCanister not available");
      }
      await a.disconnectCanister(canisterId);
    },
    onSuccess: (_data, canisterId) => invalidateDetail(canisterId),
  });

  const setThresholdMutation = useMutation({
    mutationFn: async ({
      canisterId,
      threshold,
    }: {
      canisterId: string;
      threshold: bigint;
    }) => {
      if (!actor || !isAuthenticated) throw new Error("Not authenticated");
      const a = actor as unknown as MonitoringActor;
      if (typeof a.setThreshold !== "function") {
        throw new Error("setThreshold not available");
      }
      await a.setThreshold(canisterId, threshold);
    },
    onSuccess: (_data, vars) => invalidateDetail(vars.canisterId),
  });

  const setAlertEnabledMutation = useMutation({
    mutationFn: async ({
      canisterId,
      enabled,
    }: {
      canisterId: string;
      enabled: boolean;
    }) => {
      if (!actor || !isAuthenticated) throw new Error("Not authenticated");
      const a = actor as unknown as MonitoringActor;
      if (typeof a.setAlertEnabled !== "function") {
        throw new Error("setAlertEnabled not available");
      }
      await a.setAlertEnabled(canisterId, enabled);
    },
    onSuccess: (_data, vars) => invalidateDetail(vars.canisterId),
  });

  return {
    connectCanister: connectMutation.mutate,
    connectCanisterAsync: connectMutation.mutateAsync,
    isConnecting: connectMutation.isPending,
    connectError: connectMutation.error,

    disconnectCanister: disconnectMutation.mutate,
    disconnectCanisterAsync: disconnectMutation.mutateAsync,
    isDisconnecting: disconnectMutation.isPending,
    disconnectError: disconnectMutation.error,

    setThreshold: setThresholdMutation.mutate,
    setThresholdAsync: setThresholdMutation.mutateAsync,
    isSettingThreshold: setThresholdMutation.isPending,
    setThresholdError: setThresholdMutation.error,

    setAlertEnabled: setAlertEnabledMutation.mutate,
    setAlertEnabledAsync: setAlertEnabledMutation.mutateAsync,
    isSettingAlert: setAlertEnabledMutation.isPending,
    setAlertError: setAlertEnabledMutation.error,
  };
}
