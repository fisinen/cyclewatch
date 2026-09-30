import { useMemo } from "react";
import type { AggregateResources, CanisterOverview } from "../types";

/**
 * Derives the header and stat-card aggregates from the per-canister overviews.
 * Pure computation — no backend round-trip.
 */
export function useCanisterAggregate(
  overviews: CanisterOverview[],
): AggregateResources {
  return useMemo(() => {
    let totalCycleBalance = BigInt(0);
    let totalBurnRateCyclesPerDay = BigInt(0);
    let minRunwayDays: bigint | null = null;

    for (const overview of overviews) {
      totalCycleBalance += overview.cycleBalance;
      totalBurnRateCyclesPerDay += overview.burnRateCyclesPerDay;
      if (minRunwayDays === null || overview.runwayDays < minRunwayDays) {
        minRunwayDays = overview.runwayDays;
      }
    }

    return {
      totalCycleBalance,
      totalBurnRateCyclesPerDay,
      minRunwayDays: minRunwayDays ?? BigInt(0),
      canisterCount: overviews.length,
    };
  }, [overviews]);
}
