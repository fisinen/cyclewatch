import type { Principal } from "@icp-sdk/core/principal";
import type { backendInterface } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const DAY_NS = BigInt(86_400_000_000_000);

/** Minimal Principal stand-in for mock data — only `toText` is consumed. */
function mockPrincipal(text: string): Principal {
  return { toText: () => text } as unknown as Principal;
}

const LEDGER = "ryjl3-tyaaa-aaaaa-aaab-cai";
const GOVERNANCE = "rrkah-fqaaa-aaaaa-aaaaq-cai";
const INTERNET_IDENTITY = "rdmx6-jaaaa-aaaaa-aaadq-cai";

const MOCK_CANISTERS = [
  { canisterId: LEDGER, addedAt: now - DAY_NS * BigInt(12) },
  { canisterId: GOVERNANCE, addedAt: now - DAY_NS * BigInt(9) },
  { canisterId: INTERNET_IDENTITY, addedAt: now - DAY_NS * BigInt(4) },
];

const MOCK_RESOURCES: Record<
  string,
  {
    cycleBalance: bigint;
    burnRateCyclesPerDay: bigint;
    runwayDays: bigint;
    heapBytes: bigint;
    stableBytes: bigint;
    wasmBytes: bigint;
    computeAllocation: bigint;
    memoryAllocation: bigint;
    freezingThreshold: bigint;
  }
> = {
  [LEDGER]: {
    cycleBalance: BigInt(6_180_000_000_000),
    burnRateCyclesPerDay: BigInt(53_400_000_000),
    runwayDays: BigInt(118),
    heapBytes: BigInt(1_288_490_188),
    stableBytes: BigInt(536_870_912),
    wasmBytes: BigInt(67_108_864),
    computeAllocation: BigInt(100),
    memoryAllocation: BigInt(4_294_967_296),
    freezingThreshold: BigInt(1_048_576),
  },
  [GOVERNANCE]: {
    cycleBalance: BigInt(2_180_000_000_000),
    burnRateCyclesPerDay: BigInt(44_400_000_000),
    runwayDays: BigInt(49),
    heapBytes: BigInt(1_073_741_824),
    stableBytes: BigInt(268_435_456),
    wasmBytes: BigInt(33_554_432),
    computeAllocation: BigInt(50),
    memoryAllocation: BigInt(2_147_483_648),
    freezingThreshold: BigInt(524_288),
  },
  [INTERNET_IDENTITY]: {
    cycleBalance: BigInt(1_180_000_000_000),
    burnRateCyclesPerDay: BigInt(65_500_000_000),
    runwayDays: BigInt(18),
    heapBytes: BigInt(805_306_368),
    stableBytes: BigInt(134_217_728),
    wasmBytes: BigInt(16_777_216),
    computeAllocation: BigInt(25),
    memoryAllocation: BigInt(1_073_741_824),
    freezingThreshold: BigInt(262_144),
  },
};

const MOCK_STATUS: Record<string, "running" | "stopping" | "stopped"> = {
  [LEDGER]: "running",
  [GOVERNANCE]: "stopping",
  [INTERNET_IDENTITY]: "stopped",
};

function resourcesFor(canisterId: string) {
  const r = MOCK_RESOURCES[canisterId] ?? MOCK_RESOURCES[LEDGER];
  return {
    cycleBalance: r.cycleBalance,
    burnRateCyclesPerDay: r.burnRateCyclesPerDay,
    runwayDays: r.runwayDays,
    settings: {
      computeAllocation: r.computeAllocation,
      memoryAllocation: r.memoryAllocation,
      freezingThreshold: r.freezingThreshold,
    },
    memory: {
      heapBytes: r.heapBytes,
      stableBytes: r.stableBytes,
      wasmBytes: r.wasmBytes,
    },
  };
}

export const mockBackend: backendInterface = {
  addCanister: async (_canisterId: string) => undefined,
  removeCanister: async (_canisterId: string) => undefined,
  listManagedCanisters: async () =>
    MOCK_CANISTERS.map((c) => ({
      canisterId: mockPrincipal(c.canisterId),
      addedAt: c.addedAt,
    })),
  setActiveCanister: async (_canisterId: string) => undefined,
  getActiveCanister: async () => mockPrincipal(LEDGER),
  getCanisterCycleBalance: async (canisterId: string) => ({
    __kind__: "ok" as const,
    ok: resourcesFor(canisterId).cycleBalance,
  }),
  getCanisterResources: async (canisterId: string) => ({
    __kind__: "ok" as const,
    ok: resourcesFor(canisterId),
  }),
  getCanisterStatus: async (canisterId: string) => {
    const status = MOCK_STATUS[canisterId] ?? "running";
    return {
      __kind__: "ok" as const,
      ok: {
        canisterId: mockPrincipal(canisterId),
        status:
          status === "running"
            ? ({ __kind__: "running", running: null } as const)
            : status === "stopping"
              ? ({ __kind__: "stopping", stopping: null } as const)
              : ({ __kind__: "stopped", stopped: null } as const),
        controllers: ["rrkah-fqaaa-aaaaa-aaaaq-cai"],
        resources: resourcesFor(canisterId),
      },
    };
  },
  getIcpToCyclesRate: async () => ({
    // 1e9-scaled ICP-per-XDR: 10_000_000_000 / 7142 ≈ 1_400_168
    // (xdr_permyriad_per_icp ≈ 7142 → ~0.7142 TC per ICP).
    icpPerXdr: BigInt(1_400_168),
    updatedAt: now,
  }),
  refreshIcpToCyclesRate: async () => ({
    icpPerXdr: BigInt(1_400_168),
    updatedAt: now,
  }),
  getBackendCanisterId: async () => "rrkah-fqaaa-aaaaa-aaaaq-cai",
  getApiDoc: async () => "CycleWatch backend API",
  schema: async () => "{}",
  execute: async (_qJson: string) => ({ hasMore: false, rows: [] }),
};
