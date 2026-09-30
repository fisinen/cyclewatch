import Types "../types/canister";
import Common "../types/common";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  // Add a canister to the user's managed list (upsert).
  public func addCanister(
    managed : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.ManagedCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
    now : Common.Timestamp,
  ) {
    let perUser = switch (managed.get(userId)) {
      case (?existing) { existing };
      case null {
        let fresh = Map.empty<Types.CanisterId, Types.ManagedCanister>();
        managed.add(userId, fresh);
        fresh;
      };
    };
    perUser.add(canisterId, { canisterId; addedAt = now });
  };

  // Remove a canister from the user's managed list.
  public func removeCanister(
    managed : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.ManagedCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
  ) {
    switch (managed.get(userId)) {
      case (?perUser) { perUser.remove(canisterId) };
      case null {};
    };
  };

  // List the user's managed canisters.
  public func listCanisters(
    managed : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.ManagedCanister>>,
    userId : Common.UserId,
  ) : [Types.ManagedCanister] {
    switch (managed.get(userId)) {
      case (?perUser) { perUser.values().toArray() };
      case null { [] };
    };
  };

  // Set the user's active canister.
  public func setActiveCanister(
    active : Map.Map<Common.UserId, Types.CanisterId>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
  ) {
    active.add(userId, canisterId);
  };

  // Get the user's active canister, if any.
  public func getActiveCanister(
    active : Map.Map<Common.UserId, Types.CanisterId>,
    userId : Common.UserId,
  ) : ?Types.CanisterId {
    active.get(userId);
  };

  // Whether the user has this canister in their managed list.
  public func isManaged(
    managed : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.ManagedCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
  ) : Bool {
    switch (managed.get(userId)) {
      case (?perUser) { perUser.get(canisterId) != null };
      case null { false };
    };
  };

  // Parse a canister id supplied as principal text.
  public func parseCanisterId(text : Text) : Types.CanisterId {
    Principal.fromText(text);
  };

  // Derive a burn rate in cycles/day and a runway in days from the change in
  // observed balance. Returns (0, 0) when there is no usable history yet.
  public func deriveBurnRate(
    previous : ?Types.BalanceObservation,
    currentBalance : Common.Cycles,
    now : Common.Timestamp,
  ) : (Nat, Nat) {
    switch (previous) {
      case (?prev) {
        let elapsedNs = now - prev.observedAt;
        if (elapsedNs <= 0 or currentBalance >= prev.balance) {
          (0, 0);
        } else {
          let burned = prev.balance - currentBalance;
          let nsPerDay : Nat = 86_400_000_000_000;
          let burnRate = burned * nsPerDay / elapsedNs.toNat();
          if (burnRate == 0) {
            (0, 0);
          } else {
            (burnRate, currentBalance / burnRate);
          };
        };
      };
      case null { (0, 0) };
    };
  };

  // Build a compute-resource snapshot from a management-canister status reply,
  // deriving burn rate and runway from the previous observation. Shared by
  // getCanisterResources and getCanisterStatus so both report the same values.
  public func buildResources(
    previous : ?Types.BalanceObservation,
    status : {
      cycles : Common.Cycles;
      memory_size : Nat;
      memory_metrics : {
        stable_memory_size : Nat;
        wasm_binary_size : Nat;
      };
      settings : {
        compute_allocation : Nat;
        memory_allocation : Nat;
        freezing_threshold : Nat;
      };
    },
    now : Common.Timestamp,
  ) : Types.CanisterResources {
    let (burnRate, runway) = deriveBurnRate(previous, status.cycles, now);
    {
      cycleBalance = status.cycles;
      burnRateCyclesPerDay = burnRate;
      runwayDays = runway;
      memory = {
        // memory_size is the canister's actual heap; wasm_memory_size is the
        // wasm heap, which is not the heap segment shown to the user.
        heapBytes = status.memory_size;
        stableBytes = status.memory_metrics.stable_memory_size;
        wasmBytes = status.memory_metrics.wasm_binary_size;
      };
      settings = {
        computeAllocation = status.settings.compute_allocation;
        memoryAllocation = status.settings.memory_allocation;
        freezingThreshold = status.settings.freezing_threshold;
      };
    };
  };

  // Record the latest observed balance for a canister.
  public func recordObservation(
    observations : Types.ObservationStore,
    canisterId : Types.CanisterId,
    balance : Common.Cycles,
    now : Common.Timestamp,
  ) {
    observations.add(canisterId, { balance; observedAt = now });
  };

  // Read the last observed balance for a canister, if any.
  public func getObservation(
    observations : Types.ObservationStore,
    canisterId : Types.CanisterId,
  ) : ?Types.BalanceObservation {
    observations.get(canisterId);
  };

  // Guard: the caller must have this canister in their managed list.
  public func requireManaged(
    managed : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.ManagedCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
  ) {
    if (not isManaged(managed, userId, canisterId)) {
      Runtime.trap("Canister is not in your managed list");
    };
  };
};
