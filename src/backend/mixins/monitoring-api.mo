import Types "../types/monitoring";
import Common "../types/common";
import MonitoringLib "../lib/monitoring";
import EmailClient "mo:caffeineai-email/emailClient";
import Array "mo:core/Array";
import Error "mo:core/Error";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

mixin (
  monitored : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.MonitoredCanister>>,
  snapshots : Map.Map<Types.CanisterId, List.List<Types.BalanceSnapshot>>,
  // This backend canister's own principal as Text, injected by main.mo via
  // Principal.fromActor(Backend).toText() at the include site. Used in error
  // messages so users get a runnable dfx command with the real backend ID
  // instead of a placeholder. The mixin itself cannot call Principal.fromActor
  // because the actor reference (Backend) is unbound inside a mixin.
  backendCanisterId : Text,
) {

  // Management Canister interface, matching system-idl/aaaaa-aa.did.
  //
  // canister_status and canister_info are BOTH UPDATE methods (no `query`
  // modifier per aaaaa-aa.did). Declaring either as `shared query` causes the
  // management canister to reject the call at runtime. Always declare both as
  // `shared`.
  type ManagementCanister = actor {
    canister_status : shared ({ canister_id : Principal }) -> async {
      cycles : Nat;
      status : { #running; #stopped; #stopping };
    };
    canister_info : shared ({ canister_id : Principal; num_requested_changes : ?Nat64 }) -> async {
      total_num_changes : Nat64;
      recent_changes : [{}];
      module_hash : ?[Nat8];
      controllers : [Principal];
    };
  };

  // The management canister reference is a constant derived from the literal
  // "aaaaa-aa"; it does not need to persist across upgrades.
  transient let management : ManagementCanister = actor "aaaaa-aa";

  // 24-hour cooldown between repeated alerts, in nanoseconds.
  let alertCooldownNanos : Int = 86_400_000_000_000;

  // Add a canister to the caller's monitored set.
  public shared ({ caller }) func connectCanister(canisterId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let target = Principal.fromText(canisterId);
    MonitoringLib.addMonitoredCanister(monitored, caller, target, Time.now());
  };

  // Remove a canister from the caller's monitored set and delete its snapshots.
  public shared ({ caller }) func disconnectCanister(canisterId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let target = Principal.fromText(canisterId);
    MonitoringLib.removeMonitoredCanister(monitored, snapshots, caller, target);
  };

  // Get the caller's full monitored set with current balances, thresholds,
  // alert states, and status.
  public shared ({ caller }) func getMonitoredCanisters() : async [Types.CanisterStatusInfo] {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let set = MonitoringLib.getMonitoredSet(monitored, caller);
    // For each monitored canister, fetch current status from the management
    // canister. Failures degrade gracefully to an "unknown" status entry.
    let results = List.empty<Types.CanisterStatusInfo>();
    for (entry in set.values()) {
      let info : Types.CanisterStatusInfo = try {
        let status = await management.canister_status({ canister_id = entry.canisterId });
        {
          canisterId = entry.canisterId;
          balance = status.cycles;
          status = switch (status.status) {
            case (#running) { "running" };
            case (#stopped) { "stopped" };
            case (#stopping) { "stopping" };
          };
          controllers = [];
          lastChecked = Time.now();
          threshold = entry.thresholdCycles;
          alertEnabled = entry.alertEnabled;
          belowThreshold = status.cycles < entry.thresholdCycles;
        };
      } catch (e) {
        {
          canisterId = entry.canisterId;
          balance = 0;
          status = "unknown (" # e.message() # ")";
          controllers = [];
          lastChecked = Time.now();
          threshold = entry.thresholdCycles;
          alertEnabled = entry.alertEnabled;
          belowThreshold = false;
        };
      };
      results.add(info);
    };
    results.toArray();
  };

  // Read the cycle balance of a specific monitored canister via the IC
  // management canister canister_status (shared update, NOT query), record a
  // balance snapshot, evaluate the threshold, and dispatch an email alert if
  // the balance is below threshold and alerts are enabled (with cooldown).
  // Returns a fresh error message on failure including the target canister ID,
  // raw IC error code, backend canister ID, and remediation dfx command.
  public shared ({ caller }) func getCanisterCycleBalance(canisterId : Text) : async Types.BalanceResult {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let target = Principal.fromText(canisterId);
    let targetText = canisterId;
    let backendText = backendCanisterId;

    // Verify the canister is in the caller's monitored set.
    switch (MonitoringLib.getMonitoredCanister(monitored, caller, target)) {
      case null {
        return #err(
          "Not monitoring: canister " # targetText # " is not in your monitored set. " #
          "Call connectCanister(\"" # targetText # "\") first, then ensure the backend " #
          "canister is a controller of it."
        );
      };
      case (?_) {};
    };

    try {
      let status = await management.canister_status({ canister_id = target });
      let balance = status.cycles;
      let now = Time.now();

      // Record a balance snapshot for burn-rate computation.
      MonitoringLib.recordSnapshot(snapshots, target, balance, now);

      // Evaluate threshold and dispatch an alert if needed.
      if (MonitoringLib.shouldSendAlert(monitored, caller, target, balance, now, alertCooldownNanos)) {
        // Best-effort email alert. Failures here do not affect the balance
        // result returned to the caller.
        try {
          let subject = "CycleWatch alert: canister " # targetText # " below threshold";
          let htmlBody = (
            "<h2>Low cycle balance alert</h2>" #
            "<p>Canister <code>" # targetText # "</code> has fallen below its alert threshold.</p>" #
            "<table>" #
            "<tr><td>Current balance:</td><td>" # balance.toText() # " cycles</td></tr>" #
            "<tr><td>Threshold:</td><td>" # Nat.toText(
              switch (MonitoringLib.getMonitoredCanister(monitored, caller, target)) {
                case (?m) { m.thresholdCycles };
                case null { 0 };
              }
            ) # " cycles</td></tr>" #
            "</table>" #
            "<p>Top up the canister or adjust your threshold via the CycleWatch dashboard.</p>"
          );
          ignore await EmailClient.sendServiceEmail(
            "cyclewatch",
            [],
            subject,
            htmlBody,
          );
        } catch (emailErr) {
          // Email dispatch failed; do not block the balance read.
        };
        MonitoringLib.markAlertSent(monitored, caller, target, now);
      };

      #ok(balance);
    } catch (e) {
      // Build a FRESH, detailed error message every call.
      let code = e.code();
      let rawMsg = e.message();
      let codeText = debug_show(code);
      #err(
        "Cannot read cycle balance for canister " # targetText # ".\n" #
        "IC error code: " # codeText # "\n" #
        "IC error message: " # rawMsg #
        "\n\nTo fix a 'not a controller' error, add the backend canister as a controller of the target canister.\n" #
        "  Backend canister ID:  " # backendText #
        "\n  Target canister ID:   " # targetText #
        "\n\nRun:\n  dfx canister update-settings --add-controller " # backendText # " " # targetText
      );
    };
  };

  // Get the status (controllers + running state) of a specific monitored
  // canister using canister_info with canister_status fallback.
  public shared ({ caller }) func getCanisterStatus(canisterId : Text) : async Types.StatusResult {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let target = Principal.fromText(canisterId);
    let targetText = canisterId;

    // Verify the canister is in the caller's monitored set.
    let entry = switch (MonitoringLib.getMonitoredCanister(monitored, caller, target)) {
      case null {
        return #err(
          "Not monitoring: canister " # targetText # " is not in your monitored set. " #
          "Call connectCanister(\"" # targetText # "\") first."
        );
      };
      case (?e) { e };
    };

    try {
      let info = await management.canister_info({ canister_id = target; num_requested_changes = null });
      let controllers = info.controllers;
      // canister_info does not return status; try canister_status for it and
      // fall back to "unknown" if the backend is not a controller.
      let statusText : Text = try {
        let status = await management.canister_status({ canister_id = target });
        switch (status.status) {
          case (#running) { "running" };
          case (#stopped) { "stopped" };
          case (#stopping) { "stopping" };
        };
      } catch (e) {
        "unknown (" # e.message() # ")";
      };
      let balance : Nat = try {
        let status = await management.canister_status({ canister_id = target });
        status.cycles;
      } catch (e) {
        0;
      };
      #ok({
        canisterId = target;
        balance;
        status = statusText;
        controllers;
        lastChecked = Time.now();
        threshold = entry.thresholdCycles;
        alertEnabled = entry.alertEnabled;
        belowThreshold = balance < entry.thresholdCycles;
      });
    } catch (e) {
      #err(
        "Failed to read canister info for " # targetText #
        " (IC error: " # debug_show(e.code()) # " — " # e.message() # ")"
      );
    };
  };

  // Set the alert threshold (in cycles) for a specific monitored canister.
  public shared ({ caller }) func setThreshold(canisterId : Text, thresholdCycles : Nat) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let target = Principal.fromText(canisterId);
    MonitoringLib.setThreshold(monitored, caller, target, thresholdCycles);
  };

  // Enable or disable alerts for a specific monitored canister.
  public shared ({ caller }) func setAlertEnabled(canisterId : Text, enabled : Bool) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let target = Principal.fromText(canisterId);
    MonitoringLib.setAlertEnabled(monitored, caller, target, enabled);
  };

  // Get the recorded balance snapshots for a specific monitored canister.
  public shared ({ caller }) func getBalanceHistory(canisterId : Text) : async [Types.BalanceSnapshot] {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let target = Principal.fromText(canisterId);
    MonitoringLib.getSnapshots(snapshots, target);
  };

  // Compute the burn rate, days remaining, and projected depletion date for a
  // specific monitored canister from its recent snapshots.
  public shared ({ caller }) func getBurnRate(canisterId : Text) : async Types.BurnRateInfo {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let target = Principal.fromText(canisterId);
    // Use the most recent snapshot's balance as the current balance; fall
    // back to 0 if no snapshots exist.
    let currentBalance : Nat = switch (snapshots.get(target)) {
      case (?l) {
        switch (l.get(0)) {
          case (?s) { s.balance };
          case null { 0 };
        };
      };
      case null { 0 };
    };
    MonitoringLib.computeBurnRate(snapshots, target, currentBalance, Time.now());
  };
};
