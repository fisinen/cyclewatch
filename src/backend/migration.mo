// Migration from the old CyclesFunder stable state to the new CycleWatch
// stable state. The app pivoted from a single-canister cycles funder to a
// multi-canister cycle monitoring dashboard, so all of the old funding-related
// state is intentionally discarded and the new monitoring state starts empty.
//
// Old stable fields (consumed and discarded):
//   caffeineAccounts : Map<UserId, Text>
//   connections      : Map<UserId, ConnectedCanister>
//   creditBalances   : Map<UserId, Nat>
//   exchangeRateState : { creditsPerTrillionCycles : Nat; updatedAt : Timestamp }
//   nextTxId         : [var Nat]
//   transactions     : List<FundingTransaction>
//
// New stable fields (produced empty):
//   monitored : Map<UserId, Map<CanisterId, MonitoredCanister>>
//   snapshots  : Map<CanisterId, List<BalanceSnapshot>>

import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Common "types/common";
import MonitoringTypes "types/monitoring";

module {
  // Old types defined inline to mirror the previously deployed stable
  // signature (see .old/src/backend/dist/backend.most). We only need the
  // field names and shapes that the migration input must consume; the old
  // values are discarded, so the inner element types are left opaque.
  type OldUserId = Principal;
  type OldTimestamp = Int;

  type OldConnectedCanister = {
    canisterId : Principal;
    connectedAt : OldTimestamp;
  };

  type OldExchangeRateState = {
    var creditsPerTrillionCycles : Nat;
    var updatedAt : OldTimestamp;
  };

  // The old Map and List internal structures are opaque to us; we only need
  // to accept them so the migration input matches the deployed signature. We
  // never inspect their contents.
  type OldMap<K, V> = {
    var root : OldNode<K, V>;
    var size : Nat;
  };

  type OldNode<K, V> = {
    #internal : {
      children : [var ?OldNode<K, V>];
      data : { var count : Nat; kvs : [var ?(K, V)] };
    };
    #leaf : { data : { var count : Nat; kvs : [var ?(K, V)] } };
  };

  type OldTransactions = {
    var blockIndex : Nat;
    var blocks : [var [var ?OldFundingTransaction]];
    var elementIndex : Nat;
  };

  type OldFundingTransaction = {
    createdAt : OldTimestamp;
    creditsReceived : Nat;
    cyclesAmount : Nat;
    id : Nat;
    status : { #confirmed; #failed : Text; #pending };
    updatedAt : OldTimestamp;
    userId : OldUserId;
  };

  // The full old actor stable record. Field names and types must match the
  // previously deployed signature exactly.
  public type OldActor = {
    caffeineAccounts : OldMap<OldUserId, Text>;
    connections : OldMap<OldUserId, OldConnectedCanister>;
    creditBalances : OldMap<OldUserId, Nat>;
    exchangeRateState : OldExchangeRateState;
    nextTxId : [var Nat];
    transactions : OldTransactions;
  };

  // The new actor stable record. Field names and types must match the new
  // actor body. Both fields are `let` bindings in main.mo, so they are
  // non-var here.
  public type NewActor = {
    monitored : Map.Map<Common.UserId, Map.Map<MonitoringTypes.CanisterId, MonitoringTypes.MonitoredCanister>>;
    snapshots : Map.Map<MonitoringTypes.CanisterId, List.List<MonitoringTypes.BalanceSnapshot>>;
  };

  // Discard all old state and start the new monitoring state empty. The old
  // fields are consumed (named in the input) but not produced, which is the
  // intended data loss for this pivot.
  public func run(old : OldActor) : NewActor {
    ignore old.caffeineAccounts;
    ignore old.connections;
    ignore old.creditBalances;
    ignore old.exchangeRateState;
    ignore old.nextTxId;
    ignore old.transactions;
    {
      monitored = Map.empty();
      snapshots = Map.empty();
    };
  };
};
