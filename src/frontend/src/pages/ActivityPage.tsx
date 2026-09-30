import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Boxes,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useActiveCanister } from "../hooks/useActiveCanister";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { useCanisterOverviews } from "../hooks/useCanisterOverview";
import { useManagedCanisters } from "../hooks/useManagedCanisters";
import type { CanisterOverview, CanisterStatusKind } from "../types";
import {
  formatBurnRate,
  formatCycles,
  formatRunway,
  timestampToDate,
  truncateCanisterId,
} from "../utils/formatCycles";

// ─── Status presentation ──────────────────────────────────────────────────────

const STATUS_LABEL: Record<CanisterStatusKind, string> = {
  running: "RUNNING",
  stopping: "STOPPING",
  stopped: "STOPPED",
  unknown: "UNKNOWN",
};

const STATUS_CLASS: Record<CanisterStatusKind, string> = {
  running: "status-running",
  stopping: "status-stopping",
  stopped: "status-stopped",
  unknown: "status-stopped",
};

function StatusPill({ status }: { status: CanisterStatusKind }) {
  return (
    <Badge
      className={cn(
        "status-badge gap-1.5 font-mono text-[0.6875rem] tracking-wider",
        STATUS_CLASS[status],
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
        aria-hidden="true"
      />
      {STATUS_LABEL[status]}
    </Badge>
  );
}

// ─── Added-at formatting ──────────────────────────────────────────────────────

const ADDED_AT_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatAddedAt(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? ADDED_AT_FORMAT.format(date) : "—";
}

// ─── Table row ────────────────────────────────────────────────────────────────

function CanisterRow({
  overview,
  index,
  isActive,
}: {
  overview: CanisterOverview;
  index: number;
  isActive: boolean;
}) {
  const shortId = truncateCanisterId(overview.canisterId);

  return (
    <tr
      className={cn(isActive && "bg-primary/10")}
      data-ocid={`activity.row.${index + 1}`}
    >
      <td className="min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          {isActive && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"
              aria-label="Active canister"
            />
          )}
          <code
            className="font-mono text-xs text-foreground truncate"
            title={overview.canisterId}
          >
            {shortId}
          </code>
        </div>
      </td>
      <td>
        <StatusPill status={overview.status} />
      </td>
      <td className="num">{formatCycles(overview.cycleBalance)}</td>
      <td className="num">{formatBurnRate(overview.burnRateCyclesPerDay)}</td>
      <td className="num">{formatRunway(overview.runwayDays)}</td>
      <td className="text-xs text-muted-foreground whitespace-nowrap">
        {formatAddedAt(overview.addedAt)}
      </td>
    </tr>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const SKELETON_ROWS = Array.from(
  { length: 4 },
  (_, i) => `activity-skeleton-${i}`,
);

function TableSkeleton() {
  return (
    <div className="space-y-2 p-3" data-ocid="activity.loading_state">
      {SKELETON_ROWS.map((id) => (
        <Skeleton key={id} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
      data-ocid="activity.empty_state"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface-inset">
        <Boxes size={22} className="text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h2 className="font-display text-base font-semibold text-foreground">
          No canisters managed yet
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Add a canister on the Canisters page to start tracking its status,
          cycle balance, burn rate, and runway here.
        </p>
      </div>
      <Button
        asChild
        className="mt-1 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
      >
        <Link to="/dashboard" data-ocid="activity.add_canister_link">
          Add a canister
          <ArrowRight size={14} />
        </Link>
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ActivityPage() {
  const { autoRefresh } = useAutoRefresh();
  const { data: canisters, isLoading: canistersLoading } =
    useManagedCanisters(autoRefresh);
  const { data: activeCanisterId } = useActiveCanister(autoRefresh);
  const {
    overviews,
    isLoading: overviewsLoading,
    error,
    refetchAll,
  } = useCanisterOverviews(canisters, autoRefresh);

  const isLoading = canistersLoading || overviewsLoading;
  const hasCanisters = (canisters?.length ?? 0) > 0;

  // Keep the table in the same order the panel lists canisters.
  const rows = useMemo(() => {
    const byId = new Map(overviews.map((o) => [o.canisterId, o]));
    return (canisters ?? [])
      .map((c) => byId.get(c.canisterId.toText()))
      .filter((o): o is CanisterOverview => o !== undefined);
  }, [canisters, overviews]);

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-3 sm:space-y-6 sm:p-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            Activity
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Status, cycle balance, burn rate, and runway for every canister you
            manage.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={refetchAll}
          disabled={isLoading}
          data-ocid="activity.refresh_button"
          className="mt-1 shrink-0 gap-1.5 border-border text-muted-foreground transition-smooth hover:bg-surface-hover hover:text-foreground"
        >
          <RefreshCw size={13} className={cn(isLoading && "animate-spin")} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </motion.div>

      {/* Error banner */}
      {error && (
        <div
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3"
          data-ocid="activity.error_state"
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-destructive" />
          <p className="min-w-0 flex-1 break-words text-xs text-foreground">
            Some canister telemetry could not be loaded. {error.message}
          </p>
        </div>
      )}

      {/* Activity table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Card className="overflow-hidden border-border bg-card">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-sm text-foreground">
              <Activity size={14} className="text-primary" />
              Managed Canisters
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {hasCanisters
                ? `${canisters?.length ?? 0} canister${
                    (canisters?.length ?? 0) === 1 ? "" : "s"
                  } under management`
                : "Nothing under management yet"}
            </p>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading && !hasCanisters ? (
              <TableSkeleton />
            ) : !hasCanisters ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="data-table"
                  data-ocid="activity.table"
                  aria-label="Managed canister activity"
                >
                  <thead>
                    <tr>
                      <th scope="col">Canister ID</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="text-right">
                        Cycle Balance
                      </th>
                      <th scope="col" className="text-right">
                        Burn Rate
                      </th>
                      <th scope="col" className="text-right">
                        Runway
                      </th>
                      <th scope="col">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((overview, index) => (
                      <CanisterRow
                        key={overview.canisterId}
                        overview={overview}
                        index={index}
                        isActive={overview.canisterId === activeCanisterId}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
