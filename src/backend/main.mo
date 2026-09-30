import CanisterTypes "types/canister";
import Common "types/common";
import CanisterMixin "mixins/canister-api";
import FundingMixin "mixins/funding-api";
import ApiDocMixin "mixins/api-doc";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import IntValue "mo:caffeineai-oql/IntValue";
import NatValue "mo:caffeineai-oql/NatValue";

// The actor is named `Backend` so that Principal.fromActor(Backend) can be used
// to derive this canister's own principal (exposed via getBackendCanisterId).

actor Backend {
  // Managed canisters per user: userId → (canisterId → ManagedCanister)
  let managed : Map.Map<Common.UserId, Map.Map<CanisterTypes.CanisterId, CanisterTypes.ManagedCanister>>;

  // Active canister per user
  let active : Map.Map<Common.UserId, CanisterTypes.CanisterId>;

  // Live ICP-to-Cycles rate state (mutable so the mixin receives it by reference)
  let rateState : { var icpPerXdr : Nat; var updatedAt : Common.Timestamp };

  // Last observed cycle balance per canister, used to derive burn rate/runway.
  let observations : CanisterTypes.ObservationStore;

  include CanisterMixin(managed, active);
  include FundingMixin(managed, active, rateState, observations);

  // Flatten the per-user managed-canister map into one row per managed canister
  // so the Data Intelligence agent can answer questions about them.
  type ManagedCanisterRow = {
    owner : Principal;
    canisterId : Principal;
    addedAt : Common.Timestamp;
  };

  func managedRows() : Iter.Iter<ManagedCanisterRow> {
    managed.entries().flatMap(
      func((owner, perUser)) {
        perUser.values().map(
          func(c) = { owner; canisterId = c.canisterId; addedAt = c.addedAt }
        );
      }
    );
  };

  // One row per user's active canister selection.
  type ActiveCanisterRow = {
    owner : Principal;
    canisterId : Principal;
  };

  func activeRows() : Iter.Iter<ActiveCanisterRow> {
    active.entries().map(func((owner, canisterId)) = { owner; canisterId });
  };

  // One row per canister with a recorded balance observation.
  type ObservationRow = {
    canisterId : Principal;
    balance : Common.Cycles;
    observedAt : Common.Timestamp;
  };

  func observationRows() : Iter.Iter<ObservationRow> {
    observations.entries().map(
      func((canisterId, obs)) = { canisterId; balance = obs.balance; observedAt = obs.observedAt }
    );
  };

  // The single live ICP-to-Cycles rate row.
  type RateRow = {
    icpPerXdr : Nat;
    updatedAt : Common.Timestamp;
  };

  func rateRows() : Iter.Iter<RateRow> {
    [{ icpPerXdr = rateState.icpPerXdr; updatedAt = rateState.updatedAt }].values();
  };

  include Expose({
    entities = [
      OQL.Entity.manual<ManagedCanisterRow>("managedCanister", managedRows, "ManagedCanister", "canisterId")
        .sample({ owner = Principal.fromText("aaaaa-aa"); canisterId = Principal.fromText("aaaaa-aa"); addedAt = 0 })
        .payload("owner", func r = r.owner)
        .payload("canisterId", func r = r.canisterId)
        .payload("addedAt", func r = r.addedAt)
        .controllerOnly()
        .build(),
      OQL.Entity.manual<ActiveCanisterRow>("activeCanister", activeRows, "ActiveCanister", "owner")
        .sample({ owner = Principal.fromText("aaaaa-aa"); canisterId = Principal.fromText("aaaaa-aa") })
        .payload("owner", func r = r.owner)
        .payload("canisterId", func r = r.canisterId)
        .controllerOnly()
        .build(),
      OQL.Entity.manual<ObservationRow>("balanceObservation", observationRows, "BalanceObservation", "canisterId")
        .sample({ canisterId = Principal.fromText("aaaaa-aa"); balance = 0; observedAt = 0 })
        .payload("canisterId", func r = r.canisterId)
        .payload("balance", func r = r.balance)
        .payload("observedAt", func r = r.observedAt)
        .controllerOnly()
        .build(),
      OQL.Entity.manual<RateRow>("icpToCyclesRate", rateRows, "IcpToCyclesRate", "icpPerXdr")
        .sample({ icpPerXdr = 0; updatedAt = 0 })
        .payload("icpPerXdr", func r = r.icpPerXdr)
        .payload("updatedAt", func r = r.updatedAt)
        .controllerOnly()
        .build(),
    ];
  });

  include ApiDocMixin();

  // Returns this backend canister's own principal as Text, so the frontend can
  // include it in controller-setup instructions shown to the user.
  public query func getBackendCanisterId() : async Text {
    Principal.fromActor(Backend).toText();
  };
};
