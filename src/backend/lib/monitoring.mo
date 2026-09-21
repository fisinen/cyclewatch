import Types "../types/monitoring";
import Common "../types/common";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  let _canisterIdEq = Principal.equal;
  let _userIdEq = Principal.equal;

  // Add a canister to a user's monitored set (upsert). Creates the inner
  // per-user map on first insert.
  public func addMonitoredCanister(
    monitored : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.MonitoredCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
    now : Common.Timestamp,
  ) {
    let inner = switch (monitored.get(userId)) {
      case (?m) { m };
      case null {
        let m = Map.empty<Types.CanisterId, Types.MonitoredCanister>();
        monitored.add(userId, m);
        m;
      };
    };
    let entry : Types.MonitoredCanister = {
      canisterId;
      connectedAt = now;
      thresholdCycles = 0;
      alertEnabled = false;
      lastAlertSentAt = null;
    };
    inner.add(canisterId, entry);
  };

  // Remove a canister from a user's monitored set and delete its snapshots.
  public func removeMonitoredCanister(
    monitored : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.MonitoredCanister>>,
    snapshots : Map.Map<Types.CanisterId, List.List<Types.BalanceSnapshot>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
  ) {
    switch (monitored.get(userId)) {
      case (?inner) {
        inner.remove(canisterId);
        if (inner.size() == 0) {
          monitored.remove(userId);
        };
      };
      case null {};
    };
    snapshots.remove(canisterId);
  };

  // Get a user's monitored canister entry for a specific canister.
  public func getMonitoredCanister(
    monitored : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.MonitoredCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
  ) : ?Types.MonitoredCanister {
    switch (monitored.get(userId)) {
      case (?inner) { inner.get(canisterId) };
      case null { null };
    };
  };

  // Get all of a user's monitored canisters.
  public func getMonitoredSet(
    monitored : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.MonitoredCanister>>,
    userId : Common.UserId,
  ) : [Types.MonitoredCanister] {
    switch (monitored.get(userId)) {
      case (?inner) {
        Array.tabulate(
          inner.size(),
          func(i) {
            let iter = inner.entries();
            var n = 0;
            var result : Types.MonitoredCanister = {
              canisterId = Principal.fromText("aaaaa-aa");
              connectedAt = 0;
              thresholdCycles = 0;
              alertEnabled = false;
              lastAlertSentAt = null;
            };
            for ((_, v) in iter) {
              if (n == i) { result := v };
              n += 1;
            };
            result;
          },
        );
      };
      case null { [] };
    };
  };

  // Set the threshold for a user's monitored canister.
  public func setThreshold(
    monitored : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.MonitoredCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
    thresholdCycles : Nat,
  ) {
    switch (monitored.get(userId)) {
      case (?inner) {
        switch (inner.get(canisterId)) {
          case (?entry) {
            inner.add(canisterId, { entry with thresholdCycles });
          };
          case null {};
        };
      };
      case null {};
    };
  };

  // Enable or disable alerts for a user's monitored canister.
  public func setAlertEnabled(
    monitored : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.MonitoredCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
    enabled : Bool,
  ) {
    switch (monitored.get(userId)) {
      case (?inner) {
        switch (inner.get(canisterId)) {
          case (?entry) {
            inner.add(canisterId, { entry with alertEnabled = enabled });
          };
          case null {};
        };
      };
      case null {};
    };
  };

  // Record a balance snapshot for a canister. Prepends to the list and caps
  // at 100 entries by dropping the tail.
  public func recordSnapshot(
    snapshots : Map.Map<Types.CanisterId, List.List<Types.BalanceSnapshot>>,
    canisterId : Types.CanisterId,
    balance : Nat,
    now : Common.Timestamp,
  ) {
    let snap : Types.BalanceSnapshot = {
      canisterId;
      balance;
      timestamp = now;
    };
    let existing = switch (snapshots.get(canisterId)) {
      case (?l) { l.toArray() };
      case null { [] };
    };
    // Prepend the new snapshot (most recent first), cap at 100 entries.
    let capped = if (existing.size() >= 100) {
      Array.tabulate(
        100,
        func(i) {
          if (i == 0) { snap } else { existing[i - 1] };
        },
      );
    } else {
      Array.tabulate(
        existing.size() + 1,
        func(i) {
          if (i == 0) { snap } else { existing[i - 1] };
        },
      );
    };
    snapshots.add(canisterId, List.fromArray<Types.BalanceSnapshot>(capped));
  };

  // Get the recorded balance snapshots for a canister (most recent first).
  public func getSnapshots(
    snapshots : Map.Map<Types.CanisterId, List.List<Types.BalanceSnapshot>>,
    canisterId : Types.CanisterId,
  ) : [Types.BalanceSnapshot] {
    switch (snapshots.get(canisterId)) {
      case (?l) { l.toArray() };
      case null { [] };
    };
  };

  // Compute the burn rate (cycles/day), days remaining, and projected
  // depletion date from recent snapshots (within the last 7 days).
  public func computeBurnRate(
    snapshots : Map.Map<Types.CanisterId, List.List<Types.BalanceSnapshot>>,
    canisterId : Types.CanisterId,
    currentBalance : Nat,
    now : Common.Timestamp,
  ) : Types.BurnRateInfo {
    let nanosPerDay : Int = 86_400_000_000_000;
    let sevenDaysNanos : Int = 7 * nanosPerDay;
    let cutoff = now - sevenDaysNanos;

    // Collect snapshots within the last 7 days, find earliest and latest.
    let all = switch (snapshots.get(canisterId)) {
      case (?l) { l.toArray() };
      case null { [] };
    };

    // Find earliest and latest snapshots within the 7-day window.
    var earliest : ?Types.BalanceSnapshot = null;
    var latest : ?Types.BalanceSnapshot = null;
    for (s in all.values()) {
      if (s.timestamp >= cutoff and s.timestamp <= now) {
        switch (earliest) {
          case null { earliest := ?s };
          case (?e) {
            if (s.timestamp < e.timestamp) { earliest := ?s };
          };
        };
        switch (latest) {
          case null { latest := ?s };
          case (?l) {
            if (s.timestamp > l.timestamp) { latest := ?s };
          };
        };
      };
    };

    let snapshotCount : Nat = all.size();

    switch (earliest, latest) {
      case (?e, ?l) {
        if (e.timestamp == l.timestamp) {
          // Not enough time elapsed to compute a rate.
          return {
            cyclesPerDay = 0.0;
            daysRemaining = 0.0;
            projectedDepletionDate = now;
            snapshotCount;
          };
        };
        let timeDiffNanos = l.timestamp - e.timestamp;
        let daysBetween = Int.toFloat(timeDiffNanos) / Int.toFloat(nanosPerDay);
        let balanceDrop = Int.toFloat(e.balance - l.balance);
        let cyclesPerDay = balanceDrop / daysBetween;
        if (cyclesPerDay <= 0.0) {
          return {
            cyclesPerDay = 0.0;
            daysRemaining = 0.0;
            projectedDepletionDate = now;
            snapshotCount;
          };
        };
        let daysRemaining = Int.toFloat(currentBalance) / cyclesPerDay;
        let projectedDepletionDate = now + Int.abs(Float.toInt(daysRemaining * Int.toFloat(nanosPerDay)));
        {
          cyclesPerDay;
          daysRemaining;
          projectedDepletionDate;
          snapshotCount;
        };
      };
      case _ {
        // Not enough snapshots to compute a rate.
        {
          cyclesPerDay = 0.0;
          daysRemaining = 0.0;
          projectedDepletionDate = now;
          snapshotCount;
        };
      };
    };
  };

  // Evaluate whether a canister is below its threshold and an alert should be
  // sent. Returns true if an alert should be dispatched (below threshold,
  // alerts enabled, and cooldown has elapsed since the last alert).
  public func shouldSendAlert(
    monitored : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.MonitoredCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
    currentBalance : Nat,
    now : Common.Timestamp,
    cooldownNanos : Int,
  ) : Bool {
    switch (getMonitoredCanister(monitored, userId, canisterId)) {
      case (?entry) {
        if (not entry.alertEnabled) { return false };
        if (currentBalance >= entry.thresholdCycles) { return false };
        switch (entry.lastAlertSentAt) {
          case null { true };
          case (?lastSent) {
            (now - lastSent) > cooldownNanos;
          };
        };
      };
      case null { false };
    };
  };

  // Mark that an alert was sent for a user's monitored canister at the given
  // time, updating lastAlertSentAt.
  public func markAlertSent(
    monitored : Map.Map<Common.UserId, Map.Map<Types.CanisterId, Types.MonitoredCanister>>,
    userId : Common.UserId,
    canisterId : Types.CanisterId,
    now : Common.Timestamp,
  ) {
    switch (monitored.get(userId)) {
      case (?inner) {
        switch (inner.get(canisterId)) {
          case (?entry) {
            inner.add(canisterId, { entry with lastAlertSentAt = ?now });
          };
          case null {};
        };
      };
      case null {};
    };
  };
};
