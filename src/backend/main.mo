import Common "types/common";
import MonitoringTypes "types/monitoring";
import MonitoringMixin "mixins/monitoring-api";
import Migration "migration";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";


// The actor is named `Backend` so that Principal.fromActor(Backend) can be used
// to derive this canister's own principal (exposed via getBackendCanisterId
// and embedded in error messages so users know which canister to add as a
// controller of their targets).
//
// The `with migration = Migration.run` clause handles the transition from the
// old CyclesFunder stable state (caffeineAccounts, connections, creditBalances,
// exchangeRateState, nextTxId, transactions) to the new CycleWatch state
// (monitored, snapshots). All old state is intentionally discarded.

(with migration = Migration.run)
actor Backend {
  // Monitored canisters: userId → (canisterId → MonitoredCanister).
  // Each user monitors many canisters, each with its own threshold and alert
  // settings.
  let monitored = Map.empty<Common.UserId, Map.Map<MonitoringTypes.CanisterId, MonitoringTypes.MonitoredCanister>>();

  // Balance snapshots: canisterId → list of BalanceSnapshot (most recent first,
  // capped at 100 entries). Used to compute burn rate and cost projection.
  let snapshots = Map.empty<MonitoringTypes.CanisterId, List.List<MonitoringTypes.BalanceSnapshot>>();

  include MonitoringMixin(monitored, snapshots, Principal.fromActor(Backend).toText());

  // Returns this backend canister's own principal as Text, so the frontend can
  // pass it to getCanisterCycleBalance and include it in controller-setup
  // instructions shown to the user.
  public query func getBackendCanisterId() : async Text {
    Principal.fromActor(Backend).toText();
  };
};
