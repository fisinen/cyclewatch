import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  Copy,
  Gauge,
  Link2,
  PlusCircle,
  RefreshCw,
  Server,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ConnectCanisterPanel } from "../components/ConnectCanisterPanel";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { useCanisterStatus } from "../hooks/useCanisterStatus";
import { useMonitoredCanisters } from "../hooks/useMonitoredCanisters";
import type { CanisterStatusInfo } from "../types";
import { formatICError } from "../utils/formatICError";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "healthy" | "warning" | "critical" | "error";
type SortKey = "balance-desc" | "balance-asc" | "name-asc" | "days-asc";

interface DashboardSearch {
  status?: string;
  sort?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCycles(cycles: bigint): string {
  const t = Number(cycles) / 1e12;
  if (t >= 1000) return `${(t / 1000).toFixed(1)}P`;
  if (t >= 1) return `${t.toFixed(2)}T`;
  const b = Number(cycles) / 1e9;
  if (b >= 1) return `${b.toFixed(1)}B`;
  const m = Number(cycles) / 1e6;
  return `${m.toFixed(0)}M`;
}

function truncateCanisterId(id: string): string {
  if (id.length <= 22) return id;
  return `${id.slice(0, 10)}…${id.slice(-8)}`;
}

function formatRelativeTime(ns: bigint): string {
  const ms = Number(ns) / 1e6;
  const diff = Date.now() - ms;
  if (diff < 0) return "just now";
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

/** Derive a card status from the backend status info. */
function deriveCardStatus(
  info: CanisterStatusInfo | null,
): "healthy" | "warning" | "critical" | "stopped" {
  if (!info) return "stopped";
  if (info.status === "stopped") return "stopped";
  if (info.belowThreshold) return "critical";
  // Warning if balance is within 2x of threshold
  if (info.threshold > BigInt(0) && info.balance < info.threshold * BigInt(2)) {
    return "warning";
  }
  return "healthy";
}

const STATUS_LABEL: Record<string, string> = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
  stopped: "Stopped",
  error: "Error",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  mono,
  variant = "default",
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  mono?: boolean;
  variant?: "default" | "accent" | "critical";
}) {
  const iconWrap =
    variant === "accent"
      ? "bg-accent/15 border-accent/25"
      : variant === "critical"
        ? "bg-destructive/15 border-destructive/25"
        : "bg-primary/15 border-primary/25";
  const iconColor =
    variant === "accent"
      ? "text-accent"
      : variant === "critical"
        ? "text-destructive"
        : "text-primary";
  const valueColor =
    variant === "critical"
      ? "text-destructive"
      : variant === "accent"
        ? "text-accent"
        : "text-foreground";

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {label}
            </p>
            <div
              className={cn(
                "text-xl sm:text-2xl font-bold truncate",
                mono && "font-mono",
                valueColor,
              )}
            >
              {value}
            </div>
          </div>
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border",
              iconWrap,
            )}
          >
            <Icon size={17} className={iconColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Canister Card ────────────────────────────────────────────────────────────

function CanisterCard({
  canisterId,
  index,
  autoRefresh,
}: {
  canisterId: string;
  index: number;
  autoRefresh: boolean;
}) {
  const navigate = useNavigate();
  const { status, isLoading, error } = useCanisterStatus(canisterId, {
    refetchInterval: autoRefresh ? 30_000 : undefined,
  });

  const cardStatus = deriveCardStatus(status);
  const balance = status?.balance ?? BigInt(0);
  const threshold = status?.threshold ?? BigInt(0);
  const lastChecked = status?.lastChecked ?? BigInt(0);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(canisterId);
    toast.success("Canister ID copied");
  };

  const handleClick = () => {
    navigate({ to: "/canister/$canisterId", params: { canisterId } });
  };

  const thresholdPct =
    threshold > BigInt(0)
      ? Math.min(100, Number((balance * BigInt(100)) / threshold))
      : 100;

  if (isLoading) {
    return (
      <Card data-ocid={`canister.card.${index + 1}`}>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card
        data-ocid={`canister.card.${index + 1}`}
        className={cn(
          "border-border bg-card relative transition-smooth hover:shadow-card-hover",
          "focus-within:ring-2 focus-within:ring-ring",
        )}
      >
        <CardContent className="p-4 space-y-3">
          <button
            type="button"
            onClick={handleClick}
            aria-label={`View details for canister ${canisterId}`}
            data-ocid={`canister.card_link.${index + 1}`}
            className="absolute inset-0 h-full w-full cursor-pointer"
          />
          {/* Header: canister ID + copy */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            <code
              className="text-xs font-mono text-foreground truncate min-w-0"
              title={canisterId}
            >
              {truncateCanisterId(canisterId)}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy canister ID"
              data-ocid={`canister.copy_button.${index + 1}`}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth shrink-0"
            >
              <Copy size={12} />
            </button>
          </div>

          {/* Balance */}
          {error ? (
            <p
              className="text-xs text-destructive break-words min-w-0"
              data-ocid={`canister.error_state.${index + 1}`}
            >
              {formatICError(error)}
            </p>
          ) : (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Cycle Balance
              </p>
              <p className="text-2xl font-mono font-bold text-foreground">
                {formatCycles(balance)}
              </p>
            </div>
          )}

          {/* Status badge */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "status-badge",
                cardStatus === "healthy" && "status-healthy",
                cardStatus === "warning" && "status-warning",
                cardStatus === "critical" && "status-critical",
                cardStatus === "stopped" && "status-stopped",
              )}
              data-ocid={`canister.status_badge.${index + 1}`}
            >
              {STATUS_LABEL[cardStatus]}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {formatRelativeTime(lastChecked)}
            </span>
          </div>

          {/* Threshold indicator */}
          {threshold > BigInt(0) && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Threshold: {formatCycles(threshold)}</span>
                <span>{thresholdPct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    cardStatus === "critical"
                      ? "bg-destructive"
                      : cardStatus === "warning"
                        ? "status-warning"
                        : "bg-accent",
                  )}
                  style={{ width: `${thresholdPct}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

const FILTER_PILLS: { key: StatusFilter; label: string; className: string }[] =
  [
    { key: "all", label: "All", className: "" },
    { key: "healthy", label: "Healthy", className: "status-healthy" },
    { key: "warning", label: "Warning", className: "status-warning" },
    { key: "critical", label: "Critical", className: "status-critical" },
    { key: "error", label: "Error", className: "status-stopped" },
  ];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "balance-desc", label: "Balance: High → Low" },
  { value: "balance-asc", label: "Balance: Low → High" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "days-asc", label: "Days Remaining" },
];

function FilterBar({
  statusFilter,
  sortKey,
  onStatusChange,
  onSortChange,
}: {
  statusFilter: StatusFilter;
  sortKey: SortKey;
  onStatusChange: (s: StatusFilter) => void;
  onSortChange: (s: SortKey) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Status filter pills */}
      <div
        className="flex items-center gap-1.5 flex-wrap"
        data-ocid="filter.bar"
      >
        {FILTER_PILLS.map((pill) => {
          const active = statusFilter === pill.key;
          return (
            <button
              key={pill.key}
              type="button"
              onClick={() => onStatusChange(pill.key)}
              aria-pressed={active}
              data-ocid={`filter.tab.${pill.key}`}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-smooth border",
                active
                  ? cn(
                      "border-transparent",
                      pill.className || "bg-primary text-primary-foreground",
                    )
                  : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground hidden sm:block">
          Sort:
        </span>
        <Select
          value={sortKey}
          onValueChange={(v) => onSortChange(v as SortKey)}
        >
          <SelectTrigger
            className="w-full sm:w-52 h-9 text-xs"
            data-ocid="sort.select"
            aria-label="Sort canisters"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                data-ocid={`sort.option.${opt.value}`}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="space-y-4">
      <Card
        className="border-dashed border-2 border-border bg-card/50"
        data-ocid="canister.empty_state"
      >
        <CardContent className="p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto">
            <Server size={26} className="text-primary" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-display font-semibold text-foreground">
              No canisters connected
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Connect your first ICP canister to start monitoring cycle
              balances, burn rates, and receive threshold alerts.
            </p>
          </div>
          <Button
            onClick={onConnect}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth gap-2"
            data-ocid="canister.connect_first_button"
          >
            <PlusCircle size={15} />
            Connect Your First Canister
          </Button>
        </CardContent>
      </Card>
      <ConnectCanisterPanel />
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card
      className="border-destructive/30 bg-destructive/5"
      data-ocid="canister.error_state"
    >
      <CardContent className="p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-destructive/15 border border-destructive/25 flex items-center justify-center mx-auto">
          <AlertCircle size={26} className="text-destructive" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-display font-semibold text-foreground">
            Failed to load canisters
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            We couldn't fetch your monitored canisters. Check your connection
            and try again.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRetry}
          className="border-border text-foreground hover:bg-muted/60 transition-smooth gap-2"
          data-ocid="canister.retry_button"
        >
          <RefreshCw size={14} />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Loading Skeletons ────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {["sk0", "sk1", "sk2", "sk3", "sk4", "sk5"].map((sk) => (
        <Card key={sk}>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-1.5 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { autoRefresh, toggleAutoRefresh } = useAutoRefresh();
  const { canisters, isLoading, error, refetch } = useMonitoredCanisters();

  // URL search params for filter/sort persistence
  const search = useSearch({ from: "/dashboard" }) as DashboardSearch;
  const statusFilter = (search.status as StatusFilter) || "all";
  const sortKey = (search.sort as SortKey) || "balance-desc";

  const [refreshing, setRefreshing] = useState(false);
  const [showConnectPanel, setShowConnectPanel] = useState(false);

  const updateSearch = (updates: Partial<DashboardSearch>) => {
    navigate({
      to: "/dashboard",
      search: { ...search, ...updates },
      replace: true,
    });
  };

  // Fetch all card statuses for aggregate stats
  const allStatuses = useMemo(() => {
    return canisters.map((c) => c.canisterId);
  }, [canisters]);

  const handleRefreshAll = async () => {
    setRefreshing(true);
    await refetch();
    queryClient.invalidateQueries({ queryKey: ["canisterStatus"] });
    queryClient.invalidateQueries({ queryKey: ["canisterBalance"] });
    setTimeout(() => setRefreshing(false), 600);
  };

  // Aggregate stats — we need balances. Since useMonitoredCanisters returns
  // MonitoredCanister (no balance), we read cached canisterStatus queries.
  const stats = useMemo(() => {
    let totalCycles = BigInt(0);
    let belowThresholdCount = 0;

    for (const id of allStatuses) {
      const cached = queryClient.getQueryData<CanisterStatusInfo>([
        "canisterStatus",
        id,
      ]);
      if (cached) {
        totalCycles += cached.balance;
        if (cached.belowThreshold) belowThresholdCount += 1;
      }
    }

    return {
      totalCanisters: allStatuses.length,
      totalCycles,
      belowThresholdCount,
    };
  }, [allStatuses, queryClient]);

  // Filter + sort the canister list
  const filteredCanisters = useMemo(() => {
    let list = [...canisters];

    // Status filter — needs cached status data
    if (statusFilter !== "all") {
      list = list.filter((c) => {
        const cached = queryClient.getQueryData<CanisterStatusInfo>([
          "canisterStatus",
          c.canisterId,
        ]);
        if (!cached) return false;
        const cardStatus = deriveCardStatus(cached);
        if (statusFilter === "error") return cardStatus === "stopped";
        return cardStatus === statusFilter;
      });
    }

    // Sort
    list.sort((a, b) => {
      const aStatus = queryClient.getQueryData<CanisterStatusInfo>([
        "canisterStatus",
        a.canisterId,
      ]);
      const bStatus = queryClient.getQueryData<CanisterStatusInfo>([
        "canisterStatus",
        b.canisterId,
      ]);
      const aBalance = aStatus?.balance ?? BigInt(0);
      const bBalance = bStatus?.balance ?? BigInt(0);

      switch (sortKey) {
        case "balance-desc":
          return bBalance > aBalance ? 1 : bBalance < aBalance ? -1 : 0;
        case "balance-asc":
          return aBalance > bBalance ? 1 : aBalance < bBalance ? -1 : 0;
        case "name-asc":
          return a.canisterId.localeCompare(b.canisterId);
        case "days-asc":
          // Approximate days remaining from balance (lower = sooner)
          return aBalance > bBalance ? 1 : aBalance < bBalance ? -1 : 0;
        default:
          return 0;
      }
    });

    return list;
  }, [canisters, statusFilter, sortKey, queryClient]);

  return (
    <div className="p-3 sm:p-6 max-w-[1200px] mx-auto space-y-4 sm:space-y-6">
      {/* Page header + refresh controls */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor cycle balances across all your ICP canisters.
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Add canister toggle */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowConnectPanel((v) => !v)}
            aria-pressed={showConnectPanel}
            aria-expanded={showConnectPanel}
            aria-controls="connect-canister-panel"
            data-ocid="add_canister.toggle_button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth h-9 px-3 gap-1.5"
          >
            <PlusCircle size={14} />
            <span className="hidden sm:inline">Add Canister</span>
          </Button>

          {/* Auto-refresh toggle */}
          <button
            type="button"
            onClick={toggleAutoRefresh}
            aria-pressed={autoRefresh}
            aria-label={
              autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"
            }
            data-ocid="auto_refresh.toggle"
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-smooth",
              autoRefresh
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border bg-muted/30 text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                autoRefresh ? "bg-accent animate-pulse" : "bg-muted-foreground",
              )}
            />
            <span className="hidden sm:inline">
              {autoRefresh ? "Live" : "Paused"}
            </span>
          </button>

          {/* Manual refresh all */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshAll}
            disabled={refreshing}
            aria-label="Refresh all canisters"
            data-ocid="refresh_all.button"
            className="text-muted-foreground hover:text-foreground transition-smooth h-9 px-3 gap-1.5"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh All</span>
          </Button>
        </div>
      </motion.div>

      {/* Collapsible connect-canister panel */}
      <AnimatePresence initial={false}>
        {showConnectPanel && (
          <motion.div
            id="connect-canister-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <ConnectCanisterPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aggregate summary header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        <StatCard
          label="Total Canisters"
          value={
            isLoading ? <Skeleton className="h-7 w-16" /> : stats.totalCanisters
          }
          icon={Server}
        />
        <StatCard
          label="Total Cycles"
          value={
            isLoading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              formatCycles(stats.totalCycles)
            )
          }
          icon={Zap}
          mono
          variant="accent"
        />
        <StatCard
          label="Below Threshold"
          value={
            isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              stats.belowThresholdCount
            )
          }
          icon={Gauge}
          variant={stats.belowThresholdCount > 0 ? "critical" : "default"}
        />
      </motion.div>

      {/* Filter / Sort bar */}
      {!isLoading && !error && canisters.length > 0 && (
        <FilterBar
          statusFilter={statusFilter}
          sortKey={sortKey}
          onStatusChange={(s) => updateSearch({ status: s })}
          onSortChange={(s) => updateSearch({ sort: s })}
        />
      )}

      {/* Content: loading / error / empty / grid */}
      {isLoading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : canisters.length === 0 ? (
        <EmptyState onConnect={() => setShowConnectPanel(true)} />
      ) : filteredCanisters.length === 0 ? (
        <Card data-ocid="canister.empty_state">
          <CardContent className="p-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              No canisters match the current filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSearch({ status: "all" })}
              className="border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
              data-ocid="filter.reset_button"
            >
              Clear filter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredCanisters.map((c, i) => (
            <CanisterCard
              key={c.canisterId}
              canisterId={c.canisterId}
              index={i}
              autoRefresh={autoRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
