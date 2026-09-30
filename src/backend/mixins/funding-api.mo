import FundingTypes "../types/funding";
import CanisterTypes "../types/canister";
import Common "../types/common";
import CanisterLib "../lib/canister";
import FundingLib "../lib/funding";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

mixin (
  managed : Map.Map<Common.UserId, Map.Map<CanisterTypes.CanisterId, CanisterTypes.ManagedCanister>>,
  active : Map.Map<Common.UserId, CanisterTypes.CanisterId>,
  rateState : { var icpPerXdr : Nat; var updatedAt : Common.Timestamp },
  observations : CanisterTypes.ObservationStore,
) {

  // The management canister, used for canister_status / canister_info calls.
  type ManagementCanister = actor {
    canister_status : shared query ({ canister_id : Principal }) -> async ({
      status : { #running; #stopping; #stopped };
      settings : {
        controllers : [Principal];
        compute_allocation : Nat;
        memory_allocation : Nat;
        freezing_threshold : Nat;
      };
      memory_size : Nat;
      memory_metrics : {
        wasm_memory_size : Nat;
        stable_memory_size : Nat;
        global_memory_size : Nat;
        wasm_binary_size : Nat;
      };
      cycles : Nat;
      idle_cycles_burned_per_day : Nat;
      module_hash : ?Blob;
    });
    canister_info : shared ({ canister_id : Principal; num_requested_changes : ?Nat64 }) -> async ({
      total_num_changes : Nat64;
      module_hash : ?Blob;
      controllers : [Principal];
    });
  };

  transient let ic : ManagementCanister = actor ("aaaaa-aa");

  // The CMC exposes the ICP/XDR conversion rate. 1 XDR is worth 1T cycles.
  type Cmc = actor {
    get_icp_xdr_conversion_rate : shared query () -> async ({
      data : { xdr_permyriad_per_icp : Nat64; timestamp_seconds : Nat64 };
      hash_tree : Blob;
      certificate : Blob;
    });
  };

  transient let cmc : Cmc = actor ("rkp4c-7iaaa-aaaaa-aaaca-cai");

  // Get the live ICP-to-Cycles rate sourced from the CMC.
  public query func getIcpToCyclesRate() : async FundingTypes.IcpToCyclesRate {
    FundingLib.getRate({ icpPerXdr = rateState.icpPerXdr; updatedAt = rateState.updatedAt });
  };

  // Refresh the ICP-to-Cycles rate from the CMC.
  public shared ({ caller }) func refreshIcpToCyclesRate() : async FundingTypes.IcpToCyclesRate {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let response = await cmc.get_icp_xdr_conversion_rate();
    // xdr_permyriad_per_icp is XDR per 10_000 ICP; invert to get ICP per XDR.
    let permyriad = response.data.xdr_permyriad_per_icp.toNat();
    // 1e13 = 10_000 (permyriad) * 1e9 (the stored scale).
    let icpPerXdr = if (permyriad == 0) { 0 } else { 10_000_000_000_000 / permyriad };
    let fresh : FundingTypes.IcpToCyclesRate = {
      icpPerXdr;
      updatedAt = Time.now();
    };
    FundingLib.updateRate(rateState, fresh);
    fresh;
  };

  // Get the cycle balance of a managed canister.
  public shared ({ caller }) func getCanisterCycleBalance(canisterId : Text) : async { #ok : Nat; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Anonymous callers not allowed");
    };
    let id = CanisterLib.parseCanisterId(canisterId);
    if (not CanisterLib.isManaged(managed, caller, id)) {
      return #err("Canister is not in your managed list");
    };
    try {
      let status = await ic.canister_status({ canister_id = id });
      #ok(status.cycles);
    } catch e {
      ignore e;
      #err("Not authorized to read this canister's status. Add this backend canister as a controller of the target canister.");
    };
  };

  // Get the full compute-resource snapshot of a managed canister.
  public shared ({ caller }) func getCanisterResources(canisterId : Text) : async { #ok : CanisterTypes.CanisterResources; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Anonymous callers not allowed");
    };
    let id = CanisterLib.parseCanisterId(canisterId);
    if (not CanisterLib.isManaged(managed, caller, id)) {
      return #err("Canister is not in your managed list");
    };
    try {
      let status = await ic.canister_status({ canister_id = id });
      let now = Time.now();
      let resources = CanisterLib.buildResources(
        CanisterLib.getObservation(observations, id),
        status,
        now,
      );
      CanisterLib.recordObservation(observations, id, status.cycles, now);
      #ok(resources);
    } catch e {
      ignore e;
      #err("Not authorized to read this canister's status. Add this backend canister as a controller of the target canister.");
    };
  };

  // Get status (controllers + status) of a managed canister.
  public shared ({ caller }) func getCanisterStatus(canisterId : Text) : async { #ok : CanisterTypes.CanisterStatusInfo; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Anonymous callers not allowed");
    };
    let id = CanisterLib.parseCanisterId(canisterId);
    if (not CanisterLib.isManaged(managed, caller, id)) {
      return #err("Canister is not in your managed list");
    };
    try {
      let status = await ic.canister_status({ canister_id = id });
      let canisterStatus : CanisterTypes.CanisterStatus = switch (status.status) {
        case (#running) { #running };
        case (#stopping) { #stopping };
        case (#stopped) { #stopped };
      };
      let controllers = status.settings.controllers.map(func p = p.toText());
      let now = Time.now();
      let resources = CanisterLib.buildResources(
        CanisterLib.getObservation(observations, id),
        status,
        now,
      );
      CanisterLib.recordObservation(observations, id, status.cycles, now);
      #ok({
        canisterId = id;
        status = canisterStatus;
        controllers;
        resources;
      });
    } catch e {
      ignore e;
      // canister_status is controller-gated; fall back to canister_info for
      // controllers so the panel can still show who controls the canister.
      try {
        let info = await ic.canister_info({ canister_id = id; num_requested_changes = null });
        let controllers = info.controllers.map(func p = p.toText());
        #ok({
          canisterId = id;
          status = #unknown("Status unavailable: this backend canister is not a controller of the target canister.");
          controllers;
          resources = {
            cycleBalance = 0;
            burnRateCyclesPerDay = 0;
            runwayDays = 0;
            memory = { heapBytes = 0; stableBytes = 0; wasmBytes = 0 };
            settings = { computeAllocation = 0; memoryAllocation = 0; freezingThreshold = 0 };
          };
        });
      } catch e {
        ignore e;
        #err("Not authorized to read this canister. Add this backend canister as a controller of the target canister.");
      };
    };
  };
};
