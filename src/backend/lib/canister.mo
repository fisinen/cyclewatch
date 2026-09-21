import Types "../types/canister";
import Common "../types/common";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Connect a canister for a user (upserts)
  public func connectCanister(
    connections : Map.Map<Common.UserId, Types.ConnectedCanister>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
    now : Common.Timestamp,
  ) {
    let entry : Types.ConnectedCanister = {
      canisterId;
      connectedAt = now;
    };
    connections.add(userId, entry);
  };

  // Disconnect the canister for a user
  public func disconnectCanister(
    connections : Map.Map<Common.UserId, Types.ConnectedCanister>,
    userId : Common.UserId,
  ) {
    connections.remove(userId);
  };

  // Get the connected canister for a user
  public func getConnectedCanister(
    connections : Map.Map<Common.UserId, Types.ConnectedCanister>,
    userId : Common.UserId,
  ) : ?Types.ConnectedCanister {
    connections.get(userId);
  };
};
