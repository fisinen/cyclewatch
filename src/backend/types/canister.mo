import Common "common";

module {
  public type CanisterId = Principal;

  // A user's connected canister configuration
  public type ConnectedCanister = {
    canisterId : CanisterId;
    connectedAt : Common.Timestamp;
  };
};
