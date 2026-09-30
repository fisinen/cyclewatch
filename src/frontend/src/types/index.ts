/**
 * Shared frontend types for the CycleWatch canister operations panel.
 *
 * These mirror the generated backend contract in `src/frontend/src/backend.d.ts`.
 * Backend enums are re-exported as values so consumers can use them in
 * comparisons and `switch` statements.
 */

export type {
  CanisterId,
  CanisterResources,
  CanisterSettings,
  CanisterStatus,
  CanisterStatusInfo,
  Cycles,
  IcpToCyclesRate,
  ManagedCanister,
  MemoryBreakdown,
  Timestamp,
} from "../backend.d";

/** Lifecycle state of a managed canister, flattened for UI branching. */
export type CanisterStatusKind = "running" | "stopping" | "stopped" | "unknown";

/** A managed canister paired with its live status and resource telemetry. */
export interface CanisterOverview {
  canisterId: string;
  addedAt: bigint;
  status: CanisterStatusKind;
  statusDetail: string | null;
  controllers: string[];
  cycleBalance: bigint;
  burnRateCyclesPerDay: bigint;
  runwayDays: bigint;
  memory: {
    heapBytes: bigint;
    stableBytes: bigint;
    wasmBytes: bigint;
  };
  settings: {
    computeAllocation: bigint;
    memoryAllocation: bigint;
    freezingThreshold: bigint;
  };
}

/** Aggregate figures across every managed canister. */
export interface AggregateResources {
  totalCycleBalance: bigint;
  totalBurnRateCyclesPerDay: bigint;
  minRunwayDays: bigint;
  canisterCount: number;
}

/** A single memory segment rendered in a proportion bar. */
export interface MemorySegment {
  key: "heap" | "stable" | "wasm";
  label: string;
  bytes: bigint;
  percent: number;
  className: string;
}
