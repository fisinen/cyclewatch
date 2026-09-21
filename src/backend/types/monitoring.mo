import Common "common";

module {
  public type CanisterId = Principal;

  // A canister a user is monitoring. Replaces the old single-canister
  // ConnectedCanister — a user now monitors many canisters, each with its own
  // threshold and alert settings.
  public type MonitoredCanister = {
    canisterId : CanisterId;
    connectedAt : Common.Timestamp;
    thresholdCycles : Nat;
    alertEnabled : Bool;
    lastAlertSentAt : ?Common.Timestamp;
  };

  // A recorded cycle-balance reading for a canister, used to compute burn rate.
  public type BalanceSnapshot = {
    canisterId : CanisterId;
    balance : Nat;
    timestamp : Common.Timestamp;
  };

  // Dashboard view of a monitored canister: current balance, status, threshold
  // state, and alert configuration.
  public type CanisterStatusInfo = {
    canisterId : CanisterId;
    balance : Nat;
    status : Text;
    controllers : [Principal];
    lastChecked : Common.Timestamp;
    threshold : Nat;
    alertEnabled : Bool;
    belowThreshold : Bool;
  };

  // Cost projection for a monitored canister.
  public type BurnRateInfo = {
    cyclesPerDay : Float;
    daysRemaining : Float;
    projectedDepletionDate : Common.Timestamp;
    snapshotCount : Nat;
  };

  // Result of a cycle-balance read.
  public type BalanceResult = { #ok : Nat; #err : Text };

  // Result of a canister status read.
  public type StatusResult = { #ok : CanisterStatusInfo; #err : Text };
};
