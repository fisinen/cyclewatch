import type { Principal } from "@icp-sdk/core/principal";
import type { backendInterface } from "../backend";

// Mock principal factory — mimics the Principal.toText() shape used by bindgen.
function mockPrincipal(text: string): Principal {
  return { toString: () => text, toText: () => text } as unknown as Principal;
}

const NS = BigInt(1_000_000);
const now = () => BigInt(Date.now()) * NS;
const minutes = (m: number) => BigInt(m * 60_000) * NS;
const hours = (h: number) => BigInt(h * 3_600_000) * NS;
const days = (d: number) => BigInt(d * 86_400_000) * NS;

const T = BigInt(1_000_000_000_000);

// ─── Seed canister data ──────────────────────────────────────────────────────

const CANISTER_IDS = [
  "rrkah-fqaaa-aaaaa-aaaaq-cai",
  "ryjl3-tyaaa-aaaaa-aaaba-cai",
  "qaa6y-5yaaa-aaaaa-aaaab-cai",
  "qjdve-lqaaa-aaaaa-aaaeq-cai",
  "u4bso-2qaaa-aaaaa-aaaba-cai",
];

interface SeedCanister {
  canisterId: string;
  balance: bigint;
  status: string;
  threshold: bigint;
  alertEnabled: boolean;
  belowThreshold: boolean;
  lastChecked: bigint;
  controllers: string[];
}

function buildSeed(): SeedCanister[] {
  const t = now();
  return [
    {
      canisterId: CANISTER_IDS[0],
      balance: BigInt(5_230) * T,
      status: "running",
      threshold: BigInt(1_000) * T,
      alertEnabled: true,
      belowThreshold: false,
      lastChecked: t - minutes(2),
      controllers: [CANISTER_IDS[0]],
    },
    {
      canisterId: CANISTER_IDS[1],
      balance: BigInt(820) * T,
      status: "running",
      threshold: BigInt(1_000) * T,
      alertEnabled: true,
      belowThreshold: true,
      lastChecked: t - minutes(5),
      controllers: [CANISTER_IDS[1]],
    },
    {
      canisterId: CANISTER_IDS[2],
      balance: BigInt(12_400) * T,
      status: "running",
      threshold: BigInt(2_000) * T,
      alertEnabled: false,
      belowThreshold: false,
      lastChecked: t - minutes(1),
      controllers: [CANISTER_IDS[2]],
    },
    {
      canisterId: CANISTER_IDS[3],
      balance: BigInt(0),
      status: "stopped",
      threshold: BigInt(500) * T,
      alertEnabled: true,
      belowThreshold: true,
      lastChecked: t - hours(1),
      controllers: [CANISTER_IDS[3]],
    },
    {
      canisterId: CANISTER_IDS[4],
      balance: BigInt(1_540) * T,
      status: "running",
      threshold: BigInt(1_500) * T,
      alertEnabled: true,
      belowThreshold: false,
      lastChecked: t - minutes(8),
      controllers: [CANISTER_IDS[4]],
    },
  ];
}

const seed = buildSeed();

function findSeed(canisterId: string): SeedCanister | undefined {
  return seed.find((c) => c.canisterId === canisterId);
}

// ─── Balance history snapshots (descending) ──────────────────────────────────

function buildHistory(canisterId: string): Array<{
  balance: bigint;
  timestamp: bigint;
  canisterId: Principal;
}> {
  const c = findSeed(canisterId);
  const base = c?.balance ?? BigInt(0);
  const t = now();
  return Array.from({ length: 12 }, (_, i) => ({
    balance: base + BigInt(i * 50) * T,
    timestamp: t - hours(i * 6),
    canisterId: mockPrincipal(canisterId),
  }));
}

// ─── Mock backend implementation ──────────────────────────────────────────────

export const mockBackend: backendInterface = {
  connectCanister: async (_canisterId: string) => undefined,

  disconnectCanister: async (_canisterId: string) => undefined,

  getBackendCanisterId: async () => "rrkah-fqaaa-aaaaa-aaaaq-cai",

  getMonitoredCanisters: async () =>
    seed.map((c) => ({
      canisterId: mockPrincipal(c.canisterId),
      balance: c.balance,
      status: c.status,
      controllers: c.controllers.map((id) => mockPrincipal(id)),
      lastChecked: c.lastChecked,
      threshold: c.threshold,
      alertEnabled: c.alertEnabled,
      belowThreshold: c.belowThreshold,
    })),

  getCanisterStatus: async (canisterId: string) => {
    const c = findSeed(canisterId);
    if (!c) {
      return {
        __kind__: "err" as const,
        err: `Canister ${canisterId} is not connected. Call connectCanister first.`,
      };
    }
    return {
      __kind__: "ok" as const,
      ok: {
        canisterId: mockPrincipal(c.canisterId),
        balance: c.balance,
        status: c.status,
        controllers: c.controllers.map((id) => mockPrincipal(id)),
        lastChecked: c.lastChecked,
        threshold: c.threshold,
        alertEnabled: c.alertEnabled,
        belowThreshold: c.belowThreshold,
      },
    };
  },

  getCanisterCycleBalance: async (canisterId: string) => {
    const c = findSeed(canisterId);
    if (!c) {
      return {
        __kind__: "err" as const,
        err: `Canister ${canisterId} is not connected.`,
      };
    }
    return { __kind__: "ok" as const, ok: c.balance };
  },

  getBalanceHistory: async (canisterId: string) => buildHistory(canisterId),

  getBurnRate: async (canisterId: string) => {
    const c = findSeed(canisterId);
    const balance = c?.balance ?? BigInt(0);
    const cyclesPerDay = 2_000_000_000_000; // 2T cycles/day
    const balanceNum = Number(balance);
    const daysRemaining =
      cyclesPerDay > 0 ? balanceNum / cyclesPerDay : 0;
    return {
      cyclesPerDay,
      daysRemaining,
      projectedDepletionDate: now() + days(30),
      snapshotCount: BigInt(12),
    };
  },

  setThreshold: async (_canisterId: string, _thresholdCycles: bigint) => {},

  setAlertEnabled: async (_canisterId: string, _enabled: boolean) => {},
};
