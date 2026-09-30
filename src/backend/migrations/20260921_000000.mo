import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  // Inline every project type a stable field references; the chain must not
  // import project files.
  type UserId = Principal;
  type Timestamp = Int;
  type Cycles = Nat;

  type ConnectedCanister = {
    canisterId : Principal;
    connectedAt : Timestamp;
  };

  type TransactionStatus = {
    #pending;
    #confirmed;
    #failed : Text;
  };

  type FundingTransaction = {
    id : Nat;
    userId : UserId;
    cyclesAmount : Cycles;
    creditsReceived : Nat;
    status : TransactionStatus;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  type ManagedCanister = {
    canisterId : Principal;
    addedAt : Timestamp;
  };

  type BalanceObservation = {
    balance : Cycles;
    observedAt : Timestamp;
  };

  // Pre-conversion (legacy inline-migration) stable shape. This is the state a
  // live canister actually holds, so the chain starts from it rather than `{}`.
  type OldActor = {
    connections : Map.Map<UserId, ConnectedCanister>;
    transactions : List.List<FundingTransaction>;
    nextTxId : [var Nat];
    exchangeRateState : { var creditsPerTrillionCycles : Nat; var updatedAt : Timestamp };
    creditBalances : Map.Map<UserId, Nat>;
    caffeineAccounts : Map.Map<UserId, Text>;
  };

  type NewActor = {
    managed : Map.Map<UserId, Map.Map<Principal, ManagedCanister>>;
    active : Map.Map<UserId, Principal>;
    rateState : { var icpPerXdr : Nat; var updatedAt : Timestamp };
    observations : Map.Map<Principal, BalanceObservation>;
  };

  // The credits model is replaced by a managed-canister list. The old
  // credit/transaction state is dropped; each previously connected canister is
  // carried over as the user's first managed canister and active selection.
  public func migration(old : OldActor) : NewActor {
    let managed = Map.empty<UserId, Map.Map<Principal, ManagedCanister>>();
    let active = Map.empty<UserId, Principal>();
    for ((userId, conn) in old.connections.entries()) {
      let perUser = Map.empty<Principal, ManagedCanister>();
      perUser.add(conn.canisterId, { canisterId = conn.canisterId; addedAt = conn.connectedAt });
      managed.add(userId, perUser);
      active.add(userId, conn.canisterId);
    };
    {
      managed;
      active;
      rateState = { var icpPerXdr = 0; var updatedAt = 0 };
      observations = Map.empty();
    };
  };
};
