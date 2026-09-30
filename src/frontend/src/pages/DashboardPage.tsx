import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Copy,
  Cpu,
  ExternalLink,
  Gauge,
  HardDrive,
  Layers,
  Plus,
  RefreshCw,
  Server,
  Trash2,
  TrendingDown,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ManagedCanister } from "../backend.d";
import {
  useActiveCanister,
  useSetActiveCanister,
} from "../hooks/useActiveCanister";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { useCanisterAggregate } from "../hooks/useCanisterAggregate";
import { useCanisterOverviews } from "../hooks/useCanisterOverview";
import {
  useIcpToCyclesRate,
  useRefreshIcpToCyclesRate,
} from "../hooks/useIcpToCyclesRate";
import {
  useAddCanister,
  useManagedCanisters,
  useRemoveCanister,
} from "../hooks/useManagedCanisters";
import type {
  CanisterOverview,
  CanisterStatusKind,
  MemorySegment,
} from "../types";
import {
  formatBurnRate,
  formatBytes,
  formatCycles,
  formatIcpToCyclesRate,
  formatRunway,
  timestampToDate,
  truncateCanisterId,
} from "../utils/formatCycles";
import { classifyICError, formatICError } from "../utils/formatICError";

// ─── Constants ────────────────────────────────────────────────────────────────

const NNS_CANISTER_URL = "https://nns.ic0.app/canisters";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function memorySegments(memory: CanisterOverview["memory"]): MemorySegment[] {
  const total = memory.heapBytes + memory.stableBytes + memory.wasmBytes;
  const pct = (bytes: bigint) =>
    total > BigInt(0) ? (Number(bytes) / Number(total)) * 100 : 0;
  return [
    {
      key: "heap",
      label: "HEAP",
      bytes: memory.heapBytes,
      percent: pct(memory.heapBytes),
      className: "memory-heap",
    },
    {
      key: "stable",
      label: "STABLE",
      bytes: memory.stableBytes,
      percent: pct(memory.stableBytes),
      className: "memory-stable",
    },
    {
      key: "wasm",
      label: "WASM",
      bytes: memory.wasmBytes,
      percent: pct(memory.wasmBytes),
      className: "memory-wasm",
    },
  ];
}

function formatUpdatedAt(timestamp: bigint | undefined): string {
  if (timestamp === undefined) return "—";
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: CanisterStatusKind }) {
  return (
    <span className={cn("status-badge", STATUS_CLASS[status])}>
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
        aria-hidden="true"
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ─── Memory proportion bar ────────────────────────────────────────────────────

function MemoryBar({
  memory,
  showLegend,
}: {
  memory: CanisterOverview["memory"];
  showLegend?: boolean;
}) {
  const segments = memorySegments(memory);
  return (
    <div className="min-w-0 space-y-1.5">
      <div
        className="memory-bar"
        role="img"
        aria-label={segments
          .map((s) => `${s.label} ${formatBytes(s.bytes)}`)
          .join(", ")}
      >
        {segments.map((segment) => (
          <span
            key={segment.key}
            className={cn("memory-segment", segment.className)}
            style={{ width: `${segment.percent}%` }}
          />
        ))}
      </div>
      {showLegend && (
        <div className="memory-legend">
          {segments.map((segment) => (
            <span key={segment.key} className="flex items-center gap-1.5">
              <span
                className={cn("memory-dot", segment.className)}
                aria-hidden="true"
              />
              <span className="text-[0.625rem] font-semibold uppercase tracking-widest">
                {segment.label}
              </span>
              <span className="font-mono text-[0.6875rem] tabular-nums text-foreground">
                {formatBytes(segment.bytes)}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="stat-card" data-ocid="stat-card">
      <div className="flex items-start justify-between gap-3">
        <span className="stat-label">{label}</span>
        <Icon
          size={15}
          className={accent ? "text-accent shrink-0" : "text-primary shrink-0"}
          aria-hidden="true"
        />
      </div>
      <span className={cn("stat-value", accent && "text-accent")}>{value}</span>
      <span className="stat-sub">{sub}</span>
    </div>
  );
}

// ─── Add canister form ────────────────────────────────────────────────────────

function AddCanisterForm() {
  const addCanister = useAddCanister();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setError(null);
    setValue("");
    addCanister.mutate(trimmed, {
      onSuccess: () => toast.success("Canister added to the panel."),
      onError: (err: Error) => {
        setError(formatICError(err));
        setValue((current) => (current === "" ? trimmed : current));
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2"
      data-ocid="add-canister-form"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          placeholder="rrkah-fqaaa-aaaaa-aaaaq-cai"
          aria-label="Canister principal ID"
          className="font-mono text-sm flex-1"
          data-ocid="canister-id-input"
          disabled={addCanister.isPending}
        />
        <Button
          type="submit"
          disabled={!value.trim() || addCanister.isPending}
          data-ocid="add-canister-button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth sm:shrink-0"
        >
          {addCanister.isPending ? (
            <RefreshCw size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Plus size={14} aria-hidden="true" />
          )}
          {addCanister.isPending ? "Adding…" : "Add canister"}
        </Button>
      </div>
      {error && (
        <p
          className="flex items-start gap-1.5 text-xs text-destructive"
          data-ocid="add-canister-error"
          role="alert"
        >
          <AlertCircle
            size={12}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <span className="min-w-0 break-words">{error}</span>
        </p>
      )}
    </form>
  );
}

// ─── Canister rail ────────────────────────────────────────────────────────────

function CanisterRail({
  canisters,
  activeCanisterId,
  onSelect,
  isSwitching,
}: {
  canisters: ManagedCanister[];
  activeCanisterId: string | null;
  onSelect: (canisterId: string) => void;
  isSwitching: boolean;
}) {
  return (
    <Card className="border-border bg-card" data-ocid="canister-rail">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          <Layers size={14} className="text-primary" aria-hidden="true" />
          Managed canisters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-1" data-ocid="canister-list">
          {canisters.map((canister, index) => {
            const canisterId = canister.canisterId.toText();
            const isActive = canisterId === activeCanisterId;
            return (
              <li key={canisterId}>
                <button
                  type="button"
                  onClick={() => onSelect(canisterId)}
                  disabled={isSwitching}
                  aria-pressed={isActive}
                  data-ocid={`canister.item.${index + 1}`}
                  className={cn(
                    "w-full rounded-md border px-3 py-2 text-left transition-smooth",
                    isActive
                      ? "border-primary/40 bg-primary/10"
                      : "border-transparent hover:border-border hover:bg-surface-hover",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        isActive ? "bg-accent" : "bg-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                      {truncateCanisterId(canisterId, 14, 6)}
                    </span>
                    {isActive && (
                      <Check
                        size={12}
                        className="shrink-0 text-accent"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <AddCanisterForm />
      </CardContent>
    </Card>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────

function ComparisonTable({
  canisters,
  overviews,
  activeCanisterId,
  onSelect,
  onRemove,
  isRemoving,
  isLoading,
}: {
  canisters: ManagedCanister[];
  overviews: CanisterOverview[];
  activeCanisterId: string | null;
  onSelect: (canisterId: string) => void;
  onRemove: (canisterId: string) => void;
  isRemoving: boolean;
  isLoading: boolean;
}) {
  const overviewById = new Map(overviews.map((o) => [o.canisterId, o]));

  return (
    <Card className="border-border bg-card" data-ocid="comparison-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          <Server size={14} className="text-primary" aria-hidden="true" />
          Canister comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="data-table" data-ocid="canister-table">
            <thead>
              <tr>
                <th scope="col">Canister ID</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-right">
                  Cycle balance
                </th>
                <th scope="col" className="text-right">
                  Burn rate
                </th>
                <th scope="col" className="text-right">
                  Runway
                </th>
                <th scope="col" className="min-w-[11rem]">
                  Memory proportion
                </th>
                <th scope="col" className="text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {canisters.map((canister, index) => {
                const canisterId = canister.canisterId.toText();
                const overview = overviewById.get(canisterId);
                const isActive = canisterId === activeCanisterId;
                return (
                  <tr
                    key={canisterId}
                    data-ocid={`canister.row.${index + 1}`}
                    className={cn(isActive && "bg-primary/5")}
                  >
                    <td>
                      <button
                        type="button"
                        onClick={() => onSelect(canisterId)}
                        data-ocid={`canister.select_button.${index + 1}`}
                        className="flex items-center gap-2 text-left transition-smooth hover:text-accent"
                        title={canisterId}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            isActive ? "bg-accent" : "bg-muted-foreground",
                          )}
                          aria-hidden="true"
                        />
                        <span className="font-mono text-xs text-foreground">
                          {truncateCanisterId(canisterId, 14, 6)}
                        </span>
                      </button>
                    </td>
                    <td>
                      {overview ? (
                        <StatusPill status={overview.status} />
                      ) : isLoading ? (
                        <Skeleton className="h-6 w-20 rounded-md" />
                      ) : (
                        <span
                          className="status-badge status-error"
                          data-ocid={`canister.error_state.${index + 1}`}
                        >
                          <AlertCircle size={11} aria-hidden="true" />
                          UNREADABLE
                        </span>
                      )}
                    </td>
                    <td className="num">
                      {overview ? (
                        formatCycles(overview.cycleBalance)
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="num">
                      {overview ? (
                        formatBurnRate(overview.burnRateCyclesPerDay)
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="num">
                      {overview ? (
                        formatRunway(overview.runwayDays)
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td>
                      {overview ? (
                        <MemoryBar memory={overview.memory} />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(canisterId)}
                        disabled={isRemoving}
                        aria-label={`Remove ${canisterId}`}
                        data-ocid={`canister.delete_button.${index + 1}`}
                        className="h-7 w-7 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Active canister detail ───────────────────────────────────────────────────

function ActiveCanisterDetail({
  overview,
  isLoading,
  error,
  onRetry,
  isRetrying,
}: {
  overview: CanisterOverview | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  if (isLoading && !overview) {
    return (
      <Card className="border-border bg-card" data-ocid="detail-panel">
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-36" />
        </CardContent>
      </Card>
    );
  }

  if (!overview) {
    const kind = error ? classifyICError(error) : null;
    const headline =
      kind === "unauthorized"
        ? "Not a controller of this canister"
        : kind === "stopped"
          ? "Canister is stopped"
          : kind === "not_found"
            ? "Canister not found"
            : "Status unavailable";
    return (
      <Card className="border-border bg-card" data-ocid="detail-panel">
        <CardContent className="space-y-3 p-4" data-ocid="detail-error-state">
          <div className="flex items-start gap-2">
            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground">{headline}</p>
              <p className="text-xs text-muted-foreground break-words">
                {error
                  ? formatICError(error)
                  : "Select a canister to inspect its compute resources."}
              </p>
            </div>
          </div>
          {error && kind !== "stopped" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={isRetrying}
              data-ocid="detail-retry-button"
              className="border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-smooth"
            >
              <RefreshCw
                size={12}
                className={cn(isRetrying && "animate-spin")}
                aria-hidden="true"
              />
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const segments = memorySegments(overview.memory);
  const totalMemory =
    overview.memory.heapBytes +
    overview.memory.stableBytes +
    overview.memory.wasmBytes;

  return (
    <Card className="border-border bg-card" data-ocid="detail-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          <HardDrive size={14} className="text-primary" aria-hidden="true" />
          Memory breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MemoryBar memory={overview.memory} showLegend />
        <div className="space-y-0">
          {segments.map((segment) => (
            <div key={segment.key} className="settings-row">
              <span className="settings-row-label">{segment.label}</span>
              <span className="flex items-center gap-3">
                <span className="settings-row-value">
                  {formatBytes(segment.bytes)}
                </span>
                <span className="settings-row-hint tabular-nums">
                  {segment.percent.toFixed(1)}%
                </span>
              </span>
            </div>
          ))}
          <div className="settings-row">
            <span className="settings-row-label">Total</span>
            <span className="settings-row-value">
              {formatBytes(totalMemory)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Settings panel ───────────────────────────────────────────────────────────

function SettingsPanel({
  overview,
  canisterId,
  onReup,
}: {
  overview: CanisterOverview | undefined;
  canisterId: string | null;
  onReup: () => void;
}) {
  return (
    <Card className="border-border bg-card" data-ocid="settings-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          <Cpu size={14} className="text-primary" aria-hidden="true" />
          Canister settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0">
          <div className="settings-row">
            <span className="settings-row-label">Compute allocation</span>
            <span className="settings-row-value">
              {overview ? overview.settings.computeAllocation.toString() : "—"}
            </span>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">Memory allocation</span>
            <span className="settings-row-value">
              {overview ? formatBytes(overview.settings.memoryAllocation) : "—"}
            </span>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">Freezing threshold</span>
            <span className="settings-row-value">
              {overview
                ? `${overview.settings.freezingThreshold.toString()}s`
                : "—"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            type="button"
            onClick={onReup}
            disabled={!canisterId}
            data-ocid="reup-button"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
          >
            <Zap size={14} aria-hidden="true" />
            Re-up cycles
            <ArrowUpRight size={13} aria-hidden="true" />
          </Button>
          <p className="text-xs text-muted-foreground">
            Opens the official NNS canister management UI in a new tab to top up
            the selected canister.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <Card
      className="border-dashed border-2 border-border bg-card/50"
      data-ocid="empty_state"
    >
      <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/15">
          <Server size={19} className="text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="font-display text-base font-semibold text-foreground">
            No canisters yet
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add a canister by its principal ID to monitor cycle balance, burn
            rate, runway, and memory side by side.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const { autoRefresh, toggleAutoRefresh } = useAutoRefresh();
  const [copied, setCopied] = useState(false);

  const { data: canisters, isLoading: canistersLoading } =
    useManagedCanisters(autoRefresh);
  const { data: activeCanisterId } = useActiveCanister(autoRefresh);
  const setActiveCanister = useSetActiveCanister();
  const removeCanister = useRemoveCanister();

  const {
    overviews,
    isLoading: overviewsLoading,
    error: overviewsError,
    refetchAll,
  } = useCanisterOverviews(canisters, autoRefresh);

  const aggregate = useCanisterAggregate(overviews);

  const { data: rate, isLoading: rateLoading } =
    useIcpToCyclesRate(autoRefresh);
  const refreshRate = useRefreshIcpToCyclesRate();

  const list = canisters ?? [];
  const activeOverview = overviews.find(
    (overview) => overview.canisterId === activeCanisterId,
  );

  const handleSelect = (canisterId: string) => {
    if (canisterId === activeCanisterId) return;
    setActiveCanister.mutate(canisterId, {
      onError: (err: Error) => toast.error(formatICError(err)),
    });
  };

  const handleRemove = (canisterId: string) => {
    removeCanister.mutate(canisterId, {
      onSuccess: () => toast.success("Canister removed from the panel."),
      onError: (err: Error) => toast.error(formatICError(err)),
    });
  };

  const handleReup = () => {
    if (!activeCanisterId) return;
    window.open(
      `${NNS_CANISTER_URL}/${activeCanisterId}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleCopyRate = async () => {
    if (!rate) return;
    try {
      await navigator.clipboard.writeText(
        formatIcpToCyclesRate(rate.icpPerXdr),
      );
      setCopied(true);
      toast.success("Rate copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the rate.");
    }
  };

  const hasCanisters = list.length > 0;

  return (
    <div
      className="mx-auto max-w-7xl space-y-4 p-3 sm:p-6"
      data-ocid="dashboard.page"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div className="min-w-0">
          <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            Canister operations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor cycle balance, burn rate, runway, and memory across every
            canister you manage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAutoRefresh}
            aria-pressed={autoRefresh}
            aria-label={
              autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"
            }
            data-ocid="auto-refresh-toggle"
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-smooth",
              autoRefresh
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border bg-muted/30 text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                autoRefresh ? "animate-pulse bg-accent" : "bg-muted-foreground",
              )}
              aria-hidden="true"
            />
            {autoRefresh ? "Live" : "Paused"}
          </button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => refetchAll()}
            aria-label="Refresh canister telemetry"
            data-ocid="refresh-button"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <RefreshCw size={14} aria-hidden="true" />
          </Button>
        </div>
      </motion.header>

      {/* Live ICP-to-Cycles rate */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="surface-inset flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        data-ocid="rate-panel"
      >
        <div className="flex items-center gap-2.5">
          <Gauge
            size={15}
            className="shrink-0 text-accent"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="stat-label">ICP to Cycles rate</p>
            <p
              className="font-mono text-sm font-semibold tabular-nums text-foreground"
              data-ocid="rate-value"
            >
              {rateLoading
                ? "Loading…"
                : rate
                  ? formatIcpToCyclesRate(rate.icpPerXdr)
                  : "Unavailable"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs text-muted-foreground"
            data-ocid="rate-updated-at"
          >
            Updated {formatUpdatedAt(rate?.updatedAt)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyRate}
            disabled={!rate}
            aria-label="Copy ICP to Cycles rate"
            data-ocid="copy-rate-button"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground transition-smooth"
          >
            {copied ? (
              <Check size={13} className="text-accent" aria-hidden="true" />
            ) : (
              <Copy size={13} aria-hidden="true" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => refreshRate.mutate()}
            disabled={refreshRate.isPending}
            aria-label="Refresh rate from the CMC"
            data-ocid="refresh-rate-button"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <RefreshCw
              size={13}
              className={cn(refreshRate.isPending && "animate-spin")}
              aria-hidden="true"
            />
          </Button>
        </div>
      </motion.div>

      {/* Aggregate stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
      >
        <StatCard
          label="Total cycle balance"
          value={
            overviewsLoading && !hasCanisters ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              formatCycles(aggregate.totalCycleBalance)
            )
          }
          sub={`Across ${aggregate.canisterCount} canister${aggregate.canisterCount === 1 ? "" : "s"}`}
          icon={Zap}
          accent
        />
        <StatCard
          label="Aggregate burn rate"
          value={
            overviewsLoading && !hasCanisters ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              formatBurnRate(aggregate.totalBurnRateCyclesPerDay)
            )
          }
          sub="Combined cycles consumed per second"
          icon={TrendingDown}
        />
        <StatCard
          label="Minimum runway"
          value={
            overviewsLoading && !hasCanisters ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              formatRunway(aggregate.minRunwayDays)
            )
          }
          sub="Shortest estimated time to exhaustion"
          icon={Gauge}
        />
      </motion.div>

      {/* Error banner */}
      {overviewsError && hasCanisters && (
        <div
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3"
          data-ocid="error_state"
          role="alert"
        >
          <AlertCircle
            size={15}
            className="mt-0.5 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-foreground">
              Some canister telemetry could not be read
            </p>
            <p className="text-xs text-muted-foreground break-words">
              {formatICError(overviewsError)}
            </p>
          </div>
        </div>
      )}

      {/* Rail + comparison */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-1 gap-3 lg:grid-cols-[17rem_minmax(0,1fr)] sm:gap-4"
      >
        <CanisterRail
          canisters={list}
          activeCanisterId={activeCanisterId ?? null}
          onSelect={handleSelect}
          isSwitching={setActiveCanister.isPending}
        />

        {canistersLoading ? (
          <Card className="border-border bg-card" data-ocid="loading_state">
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : hasCanisters ? (
          <ComparisonTable
            canisters={list}
            overviews={overviews}
            activeCanisterId={activeCanisterId ?? null}
            onSelect={handleSelect}
            onRemove={handleRemove}
            isRemoving={removeCanister.isPending}
            isLoading={overviewsLoading}
          />
        ) : (
          <EmptyState />
        )}
      </motion.div>

      {/* Active canister detail + settings */}
      {hasCanisters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4"
        >
          <ActiveCanisterDetail
            overview={activeOverview}
            isLoading={overviewsLoading}
            error={overviewsError}
            onRetry={() => refetchAll()}
            isRetrying={overviewsLoading}
          />
          <SettingsPanel
            overview={activeOverview}
            canisterId={activeCanisterId ?? null}
            onReup={handleReup}
          />
        </motion.div>
      )}

      {/* Rate source attribution */}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ExternalLink size={11} aria-hidden="true" />
        ICP-to-Cycles rate sourced live from the CMC (Cycles Minting Canister).
      </p>
    </div>
  );
}
