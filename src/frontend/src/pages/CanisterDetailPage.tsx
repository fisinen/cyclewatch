import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Check,
  Copy,
  Gauge,
  LineChart,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Unplug,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useBackend } from "../hooks/useBackend";
import { useBalanceHistory } from "../hooks/useBalanceHistory";
import { useBurnRate } from "../hooks/useBurnRate";
import { useCanisterActions } from "../hooks/useCanisterActions";
import { useCanisterBalance } from "../hooks/useCanisterBalance";
import { useCanisterStatus } from "../hooks/useCanisterStatus";
import type { BalanceSnapshot } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCycles(cycles: bigint): string {
  const n = Number(cycles);
  if (Number.isNaN(n)) return "0";
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toLocaleString();
}

function formatCyclesFull(cycles: bigint): string {
  return Number(cycles).toLocaleString();
}

function formatCyclesPerDay(cyclesPerDay: number): string {
  if (cyclesPerDay >= 1e12) return `${(cyclesPerDay / 1e12).toFixed(2)}T`;
  if (cyclesPerDay >= 1e9) return `${(cyclesPerDay / 1e9).toFixed(2)}B`;
  if (cyclesPerDay >= 1e6) return `${(cyclesPerDay / 1e6).toFixed(2)}M`;
  if (cyclesPerDay >= 1e3) return `${(cyclesPerDay / 1e3).toFixed(2)}K`;
  return cyclesPerDay.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function relativeTime(ns: bigint | null): string {
  if (ns === null) return "never";
  const ms = Number(ns) / 1_000_000;
  const diff = Date.now() - ms;
  if (Number.isNaN(diff) || diff < 0) return "just now";
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

function formatDate(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  if (Number.isNaN(ms)) return "—";
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "running") return "status-badge status-healthy";
  if (s === "stopped") return "status-badge status-stopped";
  if (s === "error" || s === "failed") return "status-badge status-critical";
  return "status-badge status-warning";
}

function statusLabel(status: string): string {
  const s = status.toLowerCase();
  if (s === "running") return "Running";
  if (s === "stopped") return "Stopped";
  if (s === "error" || s === "failed") return "Error";
  return status || "Unknown";
}

// ─── Copy Button ─────────────────────────────────────────────────────────────

function CopyButton({
  value,
  label,
  ocid,
  className,
}: {
  value: string;
  label: string;
  ocid: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      data-ocid={ocid}
      aria-label={label}
      className={cn(
        "h-7 px-2 text-xs gap-1.5 border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth shrink-0",
        className,
      )}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  iconClass,
  children,
  ocid,
  action,
}: {
  title: string;
  icon: React.ElementType;
  iconClass?: string;
  children: React.ReactNode;
  ocid: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card
        className="border-border bg-card hover:shadow-card-hover transition-smooth"
        data-ocid={ocid}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base font-display flex items-center gap-2 text-foreground">
              <Icon size={16} className={iconClass ?? "text-primary"} />
              {title}
            </CardTitle>
            {action}
          </div>
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Balance History Chart ───────────────────────────────────────────────────

type ChartPoint = { time: number; label: string; cycles: number };

function BalanceHistoryChart({
  snapshots,
  isLoading,
}: {
  snapshots: BalanceSnapshot[];
  isLoading: boolean;
}) {
  const data: ChartPoint[] = useMemo(() => {
    return [...snapshots]
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
      .map((s) => ({
        time: Number(s.timestamp) / 1_000_000,
        label: new Date(Number(s.timestamp) / 1_000_000).toLocaleString(
          undefined,
          {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
        cycles: Number(s.balance),
      }));
  }, [snapshots]);

  if (isLoading) {
    return (
      <div className="space-y-2" data-ocid="balance-chart.loading_state">
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 py-10 text-center"
        data-ocid="balance-chart.empty_state"
      >
        <LineChart size={24} className="text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Balance history will appear after a few refreshes
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 animate-chart-draw" data-ocid="balance-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 4, left: 8 }}
        >
          <defs>
            <linearGradient id="balanceArea" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="oklch(var(--chart-area))"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="oklch(var(--chart-area))"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="oklch(var(--chart-grid))"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "oklch(var(--chart-grid))" }}
            minTickGap={32}
          />
          <YAxis
            tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(v: number) => formatCycles(BigInt(Math.trunc(v)))}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(var(--popover))",
              border: "1px solid oklch(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "12px",
              color: "oklch(var(--popover-foreground))",
            }}
            labelStyle={{ color: "oklch(var(--muted-foreground))" }}
            formatter={(v: number) => [
              formatCyclesFull(BigInt(Math.trunc(v))),
              "Cycles",
            ]}
          />
          <Area
            type="monotone"
            dataKey="cycles"
            stroke="oklch(var(--chart-line))"
            strokeWidth={2}
            fill="url(#balanceArea)"
            dot={false}
            activeDot={{
              r: 4,
              fill: "oklch(var(--chart-line))",
              stroke: "oklch(var(--background))",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Controller Setup Guide ──────────────────────────────────────────────────

function ControllerSetupGuide({
  backendCanisterId,
  canisterId,
  isPolling,
  onRetry,
  isRetrying,
}: {
  backendCanisterId: string | null;
  canisterId: string;
  isPolling: boolean;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  const command = backendCanisterId
    ? `dfx canister update-settings --add-controller ${backendCanisterId} ${canisterId}`
    : `dfx canister update-settings --add-controller <BACKEND_CANISTER_ID> ${canisterId}`;

  return (
    <div
      className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3"
      data-ocid="controller-setup-guide"
    >
      <div className="flex items-start gap-2">
        <ShieldAlert size={16} className="shrink-0 mt-0.5 text-destructive" />
        <div className="min-w-0 space-y-1.5">
          <p className="text-sm font-semibold text-foreground">
            Controller permission required
          </p>
          <p className="text-xs text-muted-foreground break-words">
            The CycleWatch backend canister is not a controller of this
            canister. Add it as a controller so the backend can read the cycle
            balance and record snapshots.
          </p>
        </div>
      </div>

      {isPolling && (
        <output
          className="flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/8 px-3 py-2.5"
          data-ocid="controller-polling-status"
          aria-live="polite"
        >
          <span
            className="relative flex h-2.5 w-2.5 shrink-0"
            aria-hidden="true"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <p className="text-xs text-foreground font-medium">
            Detecting controller…
          </p>
          <span className="text-xs text-muted-foreground min-w-0">
            Checking every 5s.
          </span>
        </output>
      )}

      <div className="space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Backend canister ID
        </p>
        <div className="flex items-center gap-2">
          <code
            className="flex-1 min-w-0 text-xs font-mono text-foreground bg-muted/50 border border-border rounded px-2 py-1.5 break-all"
            data-ocid="backend-canister-id-display"
          >
            {backendCanisterId ?? "Loading…"}
          </code>
          {backendCanisterId && (
            <CopyButton
              value={backendCanisterId}
              label="Copy backend canister ID"
              ocid="copy-backend-canister-id-btn"
            />
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Run this command
        </p>
        <div className="flex items-center gap-2">
          <code
            className="flex-1 min-w-0 text-xs font-mono text-foreground bg-muted/50 border border-border rounded px-2 py-1.5 break-all"
            data-ocid="controller-setup-command"
          >
            {command}
          </code>
          <CopyButton
            value={command}
            label="Copy command"
            ocid="copy-controller-command-btn"
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isRetrying}
        data-ocid="retry-after-controller-btn"
        className="border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth h-8 text-xs gap-1.5"
      >
        {isRetrying ? (
          <RefreshCw size={12} className="animate-spin" />
        ) : (
          <RefreshCw size={12} />
        )}
        {isRetrying ? "Checking…" : "I've added it — recheck"}
      </Button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function CanisterDetailPage() {
  const { canisterId } = useParams({ from: "/canister/$canisterId" });
  const navigate = useNavigate();

  const { actor } = useBackend();
  const {
    balance,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useCanisterBalance(canisterId);
  const {
    status,
    isLoading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useCanisterStatus(canisterId);
  const {
    snapshots,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = useBalanceHistory(canisterId);
  const {
    burnRate,
    isLoading: burnLoading,
    error: burnError,
    refetch: refetchBurn,
  } = useBurnRate(canisterId);
  const {
    disconnectCanister,
    isDisconnecting,
    setThreshold,
    isSettingThreshold,
    setAlertEnabled,
    isSettingAlert,
  } = useCanisterActions();

  // Backend canister ID for controller setup guide
  const [backendCanisterId, setBackendCanisterId] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (!actor) return;
    let cancelled = false;
    actor
      .getBackendCanisterId()
      .then((id: string) => {
        if (!cancelled) setBackendCanisterId(id);
      })
      .catch(() => {
        if (!cancelled) setBackendCanisterId(null);
      });
    return () => {
      cancelled = true;
    };
  }, [actor]);

  // Poll status while backend is not a controller (every 5s, up to ~2 min)
  const isController =
    !!status && status.controllers.some((c) => c === backendCanisterId);
  const [polling, setPolling] = useState(false);
  useEffect(() => {
    if (!canisterId || !backendCanisterId) return;
    if (isController) {
      setPolling(false);
      return;
    }
    setPolling(true);
    const interval = setInterval(() => refetchStatus(), 5_000);
    const timeout = setTimeout(() => {
      setPolling(false);
      clearInterval(interval);
    }, 120_000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [canisterId, backendCanisterId, isController, refetchStatus]);

  // Threshold input state — synced from status
  const [thresholdInput, setThresholdInput] = useState("");
  useEffect(() => {
    if (status) setThresholdInput(status.threshold.toString());
  }, [status]);
  const thresholdDirty =
    thresholdInput !== "" &&
    status &&
    thresholdInput !== status.threshold.toString();

  const handleRefresh = () => {
    refetchBalance();
    refetchHistory();
    refetchBurn();
    refetchStatus();
    toast.success("Refreshing canister data…");
  };

  const handleSaveThreshold = () => {
    const trimmed = thresholdInput.trim();
    if (!trimmed) return;
    let parsed: bigint;
    try {
      parsed = BigInt(trimmed);
    } catch {
      toast.error("Threshold must be a whole number of cycles");
      return;
    }
    if (parsed < BigInt(0)) {
      toast.error("Threshold cannot be negative");
      return;
    }
    setThreshold(
      { canisterId, threshold: parsed },
      {
        onSuccess: () => toast.success("Threshold saved"),
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  const handleAlertToggle = (enabled: boolean) => {
    setAlertEnabled(
      { canisterId, enabled },
      {
        onSuccess: () =>
          toast.success(
            enabled ? "Email alerts enabled" : "Email alerts disabled",
          ),
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const handleDisconnect = () => {
    disconnectCanister(canisterId, {
      onSuccess: () => {
        toast.success("Canister disconnected");
        navigate({ to: "/dashboard" });
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  // Top-up recommendation: 30-day runway
  const recommendedTopUp =
    burnRate && burnRate.cyclesPerDay > 0
      ? BigInt(Math.ceil(burnRate.cyclesPerDay * 30))
      : null;

  const hasBurnData = burnRate && burnRate.cyclesPerDay > 0;
  const insufficientData = !burnRate || burnRate.snapshotCount < BigInt(2);

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* ── 1. HEADER ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/dashboard" })}
            data-ocid="back-to-dashboard-btn"
            className="text-muted-foreground hover:text-foreground transition-smooth gap-1.5"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={balanceLoading || historyLoading || burnLoading}
            data-ocid="refresh-canister-btn"
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth gap-1.5"
          >
            <RefreshCw
              size={13}
              className={cn(
                (balanceLoading || historyLoading || burnLoading) &&
                  "animate-spin",
              )}
            />
            Refresh
          </Button>
        </div>

        <div className="flex items-start gap-3 flex-wrap">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
              Canister Detail
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <code
                className="text-sm font-mono text-foreground bg-muted/50 border border-border rounded px-2 py-1 break-all"
                data-ocid="canister-id-display"
              >
                {canisterId}
              </code>
              <CopyButton
                value={canisterId}
                label="Copy canister ID"
                ocid="copy-canister-id-btn"
              />
            </div>
          </div>
          {status && (
            <span
              className={statusBadgeClass(status.status)}
              data-ocid="canister-status-badge"
            >
              {statusLabel(status.status)}
            </span>
          )}
        </div>
      </motion.div>

      {/* ── 2. BALANCE OVERVIEW ───────────────────────────────────────────── */}
      <SectionCard
        title="Balance Overview"
        icon={Zap}
        iconClass="text-accent"
        ocid="balance-overview"
      >
        {balanceLoading && !balance ? (
          <div className="space-y-2" data-ocid="balance-overview.loading_state">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : balanceError ? (
          <div
            className="flex items-start gap-2 text-sm text-destructive"
            data-ocid="balance-overview.error_state"
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="break-words min-w-0">{balanceError.message}</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Current cycle balance
              </p>
              <p
                className="text-3xl sm:text-4xl font-display font-bold text-foreground tabular-nums"
                data-ocid="balance-display"
              >
                {formatCycles(balance ?? BigInt(0))}
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {formatCyclesFull(balance ?? BigInt(0))} cycles
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Last checked:</span>
                <span className="font-mono text-foreground">
                  {status ? relativeTime(status.lastChecked) : "—"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isController ? (
                  <ShieldCheck size={13} className="text-accent shrink-0" />
                ) : (
                  <ShieldAlert
                    size={13}
                    className="text-destructive shrink-0"
                  />
                )}
                <span
                  className={isController ? "text-accent" : "text-destructive"}
                >
                  {statusLoading && !status
                    ? "Checking controller…"
                    : isController
                      ? "Backend is a controller"
                      : "Backend is NOT a controller"}
                </span>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── 3. BALANCE HISTORY CHART ─────────────────────────────────────── */}
      <SectionCard
        title="Balance History"
        icon={LineChart}
        iconClass="text-primary"
        ocid="balance-history-section"
      >
        <BalanceHistoryChart snapshots={snapshots} isLoading={historyLoading} />
      </SectionCard>

      {/* ── 4. BURN RATE & PROJECTION ─────────────────────────────────────── */}
      <SectionCard
        title="Burn Rate & Projection"
        icon={Gauge}
        iconClass="text-primary"
        ocid="burn-rate-section"
      >
        {burnLoading && !burnRate ? (
          <div className="space-y-2" data-ocid="burn-rate.loading_state">
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : burnError ? (
          <div
            className="flex items-start gap-2 text-sm text-destructive"
            data-ocid="burn-rate.error_state"
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="break-words min-w-0">{burnError.message}</span>
          </div>
        ) : insufficientData ? (
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground py-2"
            data-ocid="burn-rate.insufficient"
          >
            <TrendingDown size={14} className="shrink-0" />
            Insufficient data — need more snapshots
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Burn rate
              </p>
              <p
                className="text-xl font-display font-bold text-foreground tabular-nums"
                data-ocid="burn-rate-display"
              >
                {formatCyclesPerDay(burnRate?.cyclesPerDay ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">cycles / day</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Days remaining
              </p>
              <p
                className="text-xl font-display font-bold text-foreground tabular-nums"
                data-ocid="days-remaining-display"
              >
                {Math.round(burnRate?.daysRemaining ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Projected depletion
              </p>
              <p
                className="text-xl font-display font-bold text-foreground tabular-nums flex items-center gap-1.5"
                data-ocid="depletion-date-display"
              >
                <CalendarClock
                  size={16}
                  className="text-muted-foreground shrink-0"
                />
                {burnRate ? formatDate(burnRate.projectedDepletionDate) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                estimated run-out date
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── 5. TOP-UP RECOMMENDATION ─────────────────────────────────────── */}
      <SectionCard
        title="Top-up Recommendation"
        icon={TrendingDown}
        iconClass="text-accent"
        ocid="topup-recommendation-section"
      >
        {hasBurnData && recommendedTopUp !== null ? (
          <div className="rounded-lg bg-accent/8 border border-accent/25 px-4 py-3">
            <p className="text-sm text-foreground">
              Recommended top-up:{" "}
              <span
                className="font-mono font-bold text-accent"
                data-ocid="topup-amount"
              >
                {formatCyclesFull(recommendedTopUp)}
              </span>{" "}
              cycles for 30 days of runway
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on a burn rate of{" "}
              {formatCyclesPerDay(burnRate?.cyclesPerDay ?? 0)} cycles/day.
            </p>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground py-1"
            data-ocid="topup-insufficient"
          >
            <TrendingDown size={14} className="shrink-0" />
            Set up monitoring to get top-up recommendations
          </div>
        )}
      </SectionCard>

      {/* ── 6. THRESHOLD & ALERT SETTINGS ─────────────────────────────────── */}
      <SectionCard
        title="Threshold & Alert Settings"
        icon={ShieldCheck}
        iconClass="text-primary"
        ocid="threshold-alert-section"
      >
        {statusError ? (
          <div
            className="flex items-start gap-2 text-sm text-destructive"
            data-ocid="threshold.error_state"
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="break-words min-w-0">{statusError.message}</span>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Threshold input */}
            <div className="space-y-2">
              <Label
                htmlFor="threshold-input"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Alert threshold (cycles)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="threshold-input"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(e.target.value)}
                  className="font-mono text-sm flex-1 max-w-xs"
                  data-ocid="threshold.input"
                  disabled={isSettingThreshold}
                  aria-describedby="threshold-current"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveThreshold}
                  disabled={!thresholdDirty || isSettingThreshold}
                  data-ocid="threshold.save_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth gap-1.5"
                >
                  {isSettingThreshold ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Check size={13} />
                  )}
                  Save
                </Button>
              </div>
              <p
                id="threshold-current"
                className="text-xs text-muted-foreground"
                data-ocid="threshold-current-value"
              >
                Current threshold:{" "}
                <span className="font-mono text-foreground">
                  {status ? formatCyclesFull(status.threshold) : "—"}
                </span>{" "}
                cycles
                {status?.belowThreshold && (
                  <span className="text-destructive font-medium ml-2">
                    (balance is below threshold)
                  </span>
                )}
              </p>
            </div>

            {/* Email alert toggle */}
            <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 border border-border px-4 py-3">
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  Email alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  Send an email when balance drops below threshold
                </p>
              </div>
              <Switch
                checked={status?.alertEnabled ?? false}
                onCheckedChange={handleAlertToggle}
                disabled={isSettingAlert || !status}
                data-ocid="alert-enabled.switch"
                aria-label="Toggle email alerts"
              />
            </div>

            {/* Last alert sent */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Last alert sent:</span>
              <span className="font-mono text-foreground">
                {status ? relativeTime(null) : "—"}
              </span>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── 7. CONTROLLER SETUP GUIDE ─────────────────────────────────────── */}
      {status && !isController && (
        <SectionCard
          title="Controller Setup"
          icon={ShieldAlert}
          iconClass="text-destructive"
          ocid="controller-setup-section"
        >
          <ControllerSetupGuide
            backendCanisterId={backendCanisterId}
            canisterId={canisterId}
            isPolling={polling}
            onRetry={() => refetchStatus()}
            isRetrying={statusLoading}
          />
        </SectionCard>
      )}

      {/* ── 8. DISCONNECT ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <Card
          className="border-destructive/30 bg-destructive/5"
          data-ocid="disconnect-section"
        >
          <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground">
                Disconnect canister
              </p>
              <p className="text-xs text-muted-foreground">
                Stop monitoring this canister. You can reconnect it later from
                the dashboard.
              </p>
            </div>
            <AlertDialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisconnectOpen(true)}
                disabled={isDisconnecting}
                data-ocid="disconnect.open_modal_button"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 transition-smooth gap-1.5 shrink-0"
              >
                <Unplug size={13} />
                Disconnect
              </Button>
              <AlertDialogContent data-ocid="disconnect.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Disconnect canister?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will stop monitoring{" "}
                    <code className="font-mono text-xs">{canisterId}</code>.
                    Balance history and threshold settings for this canister
                    will be removed. You can reconnect it later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    data-ocid="disconnect.cancel_button"
                    disabled={isDisconnecting}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    data-ocid="disconnect.confirm_button"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
                  >
                    {isDisconnecting ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Unplug size={13} />
                    )}
                    Disconnect
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
