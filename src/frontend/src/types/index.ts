// ─── Monitoring types ─────────────────────────────────────────────────────────
// These mirror the backend monitoring-api.mo types. The backend uses Principal
// for canister IDs and Nat for cycle amounts; on the frontend we work with
// string canister IDs (Principal.toText) and bigint for cycles.

/** A canister the user has connected for monitoring. */
export interface MonitoredCanister {
  canisterId: string;
  connectedAt: bigint;
  thresholdCycles: bigint;
  alertEnabled: boolean;
  /** null when no alert has been sent yet. */
  lastAlertSentAt: bigint | null;
}

/** A single balance sample recorded by the backend. */
export interface BalanceSnapshot {
  canisterId: string;
  balance: bigint;
  timestamp: bigint;
}

/** Aggregated status info for a monitored canister. */
export interface CanisterStatusInfo {
  canisterId: string;
  balance: bigint;
  /** Raw canister status string from the IC (e.g. "running", "stopped"). */
  status: string;
  /** Controller principals as text. */
  controllers: string[];
  lastChecked: bigint;
  threshold: bigint;
  alertEnabled: boolean;
  belowThreshold: boolean;
}

/** Burn-rate projection computed from balance history. */
export interface BurnRateInfo {
  cyclesPerDay: number;
  daysRemaining: number;
  projectedDepletionDate: bigint;
  snapshotCount: bigint;
}

// ─── Result variants ──────────────────────────────────────────────────────────
// The backend returns Motoko result variants as discriminated unions via
// bindgen. We mirror the shape here for type-safe handling.

export type BalanceResult =
  | { __kind__: "ok"; ok: bigint }
  | { __kind__: "err"; err: string };

export type StatusResult =
  | { __kind__: "ok"; ok: CanisterStatusInfo }
  | { __kind__: "err"; err: string };
