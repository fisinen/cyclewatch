import Common "common";
import Map "mo:core/Map";

module {
  public type CanisterId = Principal;

  // A canister the user has added to their management panel.
  public type ManagedCanister = {
    canisterId : CanisterId;
    addedAt : Common.Timestamp;
  };

  // Memory breakdown of a canister, in bytes.
  public type MemoryBreakdown = {
    heapBytes : Nat;
    stableBytes : Nat;
    wasmBytes : Nat;
  };

  // Compute-resource settings of a canister.
  public type CanisterSettings = {
    computeAllocation : Nat;
    memoryAllocation : Nat;
    freezingThreshold : Nat;
  };

  // Observed compute-resource state of a canister.
  public type CanisterResources = {
    cycleBalance : Common.Cycles;
    burnRateCyclesPerDay : Nat;
    runwayDays : Nat;
    memory : MemoryBreakdown;
    settings : CanisterSettings;
  };

  // Status of a canister as reported by the management canister.
  public type CanisterStatus = {
    #running;
    #stopped;
    #stopping;
    #unknown : Text;
  };

  // Full status snapshot for a managed canister.
  public type CanisterStatusInfo = {
    canisterId : CanisterId;
    status : CanisterStatus;
    controllers : [Text];
    resources : CanisterResources;
  };

  // Last observed cycle balance for a canister, used to derive a burn rate
  // from the change between two observations.
  public type BalanceObservation = {
    balance : Common.Cycles;
    observedAt : Common.Timestamp;
  };

  // Per-canister observation history, keyed by canister id.
  public type ObservationStore = Map.Map<CanisterId, BalanceObservation>;
};
