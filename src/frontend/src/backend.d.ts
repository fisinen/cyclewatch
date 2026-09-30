import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CanisterId = Principal;
export interface CanisterResources {
    memory: MemoryBreakdown;
    burnRateCyclesPerDay: bigint;
    cycleBalance: Cycles;
    settings: CanisterSettings;
    runwayDays: bigint;
}
export interface CanisterSettings {
    freezingThreshold: bigint;
    memoryAllocation: bigint;
    computeAllocation: bigint;
}
export type CanisterStatus = {
    __kind__: "stopped";
    stopped: null;
} | {
    __kind__: "stopping";
    stopping: null;
} | {
    __kind__: "unknown";
    unknown: string;
} | {
    __kind__: "running";
    running: null;
};
export interface CanisterStatusInfo {
    status: CanisterStatus;
    controllers: Array<string>;
    resources: CanisterResources;
    canisterId: CanisterId;
}
export interface Cell {
    value: Value;
    name: string;
}
export type Cycles = bigint;
export interface IcpToCyclesRate {
    icpPerXdr: bigint;
    updatedAt: Timestamp;
}
export interface ManagedCanister {
    addedAt: Timestamp;
    canisterId: CanisterId;
}
export interface MemoryBreakdown {
    stableBytes: bigint;
    heapBytes: bigint;
    wasmBytes: bigint;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface backendInterface {
    addCanister(canisterId: string): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getActiveCanister(): Promise<CanisterId | null>;
    getApiDoc(): Promise<string>;
    getBackendCanisterId(): Promise<string>;
    getCanisterCycleBalance(canisterId: string): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCanisterResources(canisterId: string): Promise<{
        __kind__: "ok";
        ok: CanisterResources;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCanisterStatus(canisterId: string): Promise<{
        __kind__: "ok";
        ok: CanisterStatusInfo;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getIcpToCyclesRate(): Promise<IcpToCyclesRate>;
    listManagedCanisters(): Promise<Array<ManagedCanister>>;
    refreshIcpToCyclesRate(): Promise<IcpToCyclesRate>;
    removeCanister(canisterId: string): Promise<void>;
    schema(): Promise<string>;
    setActiveCanister(canisterId: string): Promise<void>;
}
