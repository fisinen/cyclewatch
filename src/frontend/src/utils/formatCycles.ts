/**
 * Formatting helpers for cycle balances, burn rates, memory sizes, and
 * ICP-to-Cycles rates. All cycle values are bigint; never coerce a raw
 * bigint through `Number()` without scaling first.
 */

const TRILLION = 1_000_000_000_000;
const BILLION = 1_000_000_000;
const MILLION = 1_000_000;
const THOUSAND = 1_000;

/** Compact cycle figure, e.g. `12.45T`, `618.2B`, `4.10M`. */
export function formatCycles(cycles: bigint): string {
  const abs = cycles < BigInt(0) ? -cycles : cycles;
  if (abs >= BigInt(TRILLION)) {
    return `${(Number(cycles) / TRILLION).toFixed(2)}T`;
  }
  if (abs >= BigInt(BILLION)) {
    return `${(Number(cycles) / BILLION).toFixed(1)}B`;
  }
  if (abs >= BigInt(MILLION)) {
    return `${(Number(cycles) / MILLION).toFixed(1)}M`;
  }
  if (abs >= BigInt(THOUSAND)) {
    return `${(Number(cycles) / THOUSAND).toFixed(1)}K`;
  }
  return cycles.toString();
}

/** Full cycle figure with thousands separators, e.g. `12,450,000,000,000`. */
export function formatCyclesExact(cycles: bigint): string {
  return cycles.toLocaleString("en-US");
}

/** Cycles-per-second burn rate derived from a per-day figure. */
export function formatBurnRate(cyclesPerDay: bigint): string {
  const perSecond = Number(cyclesPerDay) / 86_400;
  if (perSecond >= 1_000_000) return `${(perSecond / 1_000_000).toFixed(2)}M/s`;
  if (perSecond >= 1_000) return `${(perSecond / 1_000).toFixed(1)}K/s`;
  return `${perSecond.toFixed(0)}/s`;
}

/** Runway in days, e.g. `118d`. */
export function formatRunway(days: bigint): string {
  return `${days.toString()}d`;
}

/** Byte size, e.g. `1.20GB`, `512MB`, `64KB`. */
export function formatBytes(bytes: bigint): string {
  const abs = bytes < BigInt(0) ? -bytes : bytes;
  if (abs >= BigInt(1_073_741_824)) {
    return `${(Number(bytes) / 1_073_741_824).toFixed(2)}GB`;
  }
  if (abs >= BigInt(1_048_576)) {
    return `${(Number(bytes) / 1_048_576).toFixed(0)}MB`;
  }
  if (abs >= BigInt(1_024)) {
    return `${(Number(bytes) / 1_024).toFixed(0)}KB`;
  }
  return `${bytes.toString()}B`;
}

/**
 * Renders the ICP-to-Cycles rate as `1 ICP = 1.0000 TC`.
 *
 * `icpPerXdr` is the ICP price of one XDR scaled by 1e9 (the backend's
 * documented scale: `icpPerXdr = 10_000_000_000 / xdr_permyriad_per_icp`).
 * One XDR is worth 1 trillion cycles, so
 * `cyclesPerIcp = 1e12 * 1e9 / icpPerXdr`.
 */
export function formatIcpToCyclesRate(icpPerXdr: bigint): string {
  const icpPerXdrFloat = Number(icpPerXdr) / 1_000_000_000;
  if (!Number.isFinite(icpPerXdrFloat) || icpPerXdrFloat <= 0) return "—";
  const cyclesPerIcp = 1_000_000_000_000 / icpPerXdrFloat;
  return `1 ICP = ${(cyclesPerIcp / TRILLION).toFixed(4)} TC`;
}

/** Shortens a canister principal for dense table cells. */
export function truncateCanisterId(id: string, head = 12, tail = 8): string {
  if (id.length <= head + tail + 1) return id;
  return `${id.slice(0, head)}…${id.slice(-tail)}`;
}

/** Converts a nanosecond backend timestamp into a Date, or null when invalid. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}
