import Types "../types/canister";
import Common "../types/common";
import CanisterLib "../lib/canister";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

mixin (
  managed : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.ManagedCanister>>,
  active : Map.Map<Common.UserId, Types.CanisterId>,
) {

  // Add a canister (by principal text) to the caller's managed list.
  public shared ({ caller }) func addCanister(canisterId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let id = CanisterLib.parseCanisterId(canisterId);
    CanisterLib.addCanister(managed, caller, id, Time.now());
    // First canister added becomes the active selection.
    if (CanisterLib.getActiveCanister(active, caller) == null) {
      CanisterLib.setActiveCanister(active, caller, id);
    };
  };

  // Remove a canister (by principal text) from the caller's managed list.
  public shared ({ caller }) func removeCanister(canisterId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let id = CanisterLib.parseCanisterId(canisterId);
    CanisterLib.removeCanister(managed, caller, id);
    // Clear the active selection if it pointed at the removed canister.
    switch (CanisterLib.getActiveCanister(active, caller)) {
      case (?current) {
        if (current == id) {
          active.remove(caller);
        };
      };
      case null {};
    };
  };

  // List the caller's managed canisters.
  public query ({ caller }) func listManagedCanisters() : async [Types.ManagedCanister] {
    if (caller.isAnonymous()) {
      return [];
    };
    CanisterLib.listCanisters(managed, caller);
  };

  // Set the caller's active canister (by principal text).
  public shared ({ caller }) func setActiveCanister(canisterId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let id = CanisterLib.parseCanisterId(canisterId);
    CanisterLib.requireManaged(managed, caller, id);
    CanisterLib.setActiveCanister(active, caller, id);
  };

  // Get the caller's active canister, if any.
  public query ({ caller }) func getActiveCanister() : async ?Types.CanisterId {
    if (caller.isAnonymous()) {
      return null;
    };
    CanisterLib.getActiveCanister(active, caller);
  };
};
