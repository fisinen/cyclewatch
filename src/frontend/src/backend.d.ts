import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type CanisterId = Principal;
export interface CanisterStatusInfo {
    status: string;
    controllers: Array<Principal>;
    balance: bigint;
    threshold: bigint;
    alertEnabled: boolean;
    lastChecked: Timestamp;
    belowThreshold: boolean;
    canisterId: CanisterId;
}
export type StatusResult = {
    __kind__: "ok";
    ok: CanisterStatusInfo;
} | {
    __kind__: "err";
    err: string;
};
export interface BurnRateInfo {
    cyclesPerDay: number;
    projectedDepletionDate: Timestamp;
    snapshotCount: bigint;
    daysRemaining: number;
}
export type BalanceResult = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "err";
    err: string;
};
export interface BalanceSnapshot {
    balance: bigint;
    timestamp: Timestamp;
    canisterId: CanisterId;
}
export interface backendInterface {
    connectCanister(canisterId: string): Promise<void>;
    disconnectCanister(canisterId: string): Promise<void>;
    getBackendCanisterId(): Promise<string>;
    getBalanceHistory(canisterId: string): Promise<Array<BalanceSnapshot>>;
    getBurnRate(canisterId: string): Promise<BurnRateInfo>;
    getCanisterCycleBalance(canisterId: string): Promise<BalanceResult>;
    getCanisterStatus(canisterId: string): Promise<StatusResult>;
    getMonitoredCanisters(): Promise<Array<CanisterStatusInfo>>;
    setAlertEnabled(canisterId: string, enabled: boolean): Promise<void>;
    setThreshold(canisterId: string, thresholdCycles: bigint): Promise<void>;
}
