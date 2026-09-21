import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

export function useBackend() {
  const { identity, loginStatus, isLoginSuccess } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);

  const isAuthenticated = isLoginSuccess;
  const isLoading = isFetching || loginStatus === "initializing";

  return {
    actor,
    identity,
    isAuthenticated,
    isLoading,
    loginStatus,
  };
}
