import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackendCanisterId } from "@/hooks/useBackendCanisterId";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useIcpToCyclesRate } from "@/hooks/useIcpToCyclesRate";
import { formatIcpToCyclesRate, timestampToDate } from "@/utils/formatCycles";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Moon,
  RefreshCw,
  Server,
  Sun,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const NNS_CANISTER_URL = "https://nns.ic0.app/canisters/";

function formatUpdatedAt(updatedAt: bigint | undefined): string {
  if (updatedAt === undefined) return "—";
  const date = timestampToDate(updatedAt);
  if (!date) return "—";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AccountPage() {
  const { identity } = useInternetIdentity();
  const { isDark, toggle: toggleDark } = useDarkMode();

  const {
    data: backendCanisterId,
    isLoading: isBackendIdLoading,
    isError: isBackendIdError,
  } = useBackendCanisterId();

  const {
    data: rate,
    isLoading: isRateLoading,
    isError: isRateError,
    refetch: refetchRate,
    isFetching: isRateFetching,
  } = useIcpToCyclesRate();

  const [copied, setCopied] = useState(false);

  const principalText = identity?.getPrincipal().toText() ?? "";

  const handleCopy = () => {
    if (!principalText) return;
    navigator.clipboard.writeText(principalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-3 sm:p-6 max-w-3xl mx-auto space-y-6"
      data-ocid="account-page"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
          Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your signed-in identity, the backend canister serving this panel, and
          the live ICP-to-Cycles rate.
        </p>
      </motion.div>

      {/* Identity */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Card className="border-border bg-card" data-ocid="identity-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <UserRound size={15} className="text-primary" />
              Signed-in Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="surface-inset px-3 py-3">
              <p className="stat-label mb-1.5">Principal ID</p>
              <div className="flex items-center gap-2">
                <code
                  className="text-sm font-mono text-foreground flex-1 min-w-0 break-all"
                  data-ocid="principal-value"
                >
                  {principalText || "Not connected"}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!principalText}
                  aria-label="Copy principal ID"
                  data-ocid="copy-principal-btn"
                  className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-smooth"
                >
                  {copied ? (
                    <Check size={14} className="text-accent" />
                  ) : (
                    <Copy size={14} />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Internet Identity gives each app a separate, anonymous principal.
              This is the identity the panel uses to read canister status and
              resources.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Backend canister */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card
          className="border-border bg-card"
          data-ocid="backend-canister-card"
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Server size={15} className="text-primary" />
              Backend Canister
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isBackendIdLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : isBackendIdError ? (
              <div
                className="flex items-start gap-2 text-sm text-destructive"
                data-ocid="backend-canister-error"
                role="alert"
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span className="min-w-0 break-words">
                  Could not read the backend canister ID. Reload the page to try
                  again.
                </span>
              </div>
            ) : (
              <>
                <div className="surface-inset px-3 py-3">
                  <p className="stat-label mb-1.5">Canister ID</p>
                  <code
                    className="text-sm font-mono text-foreground break-all"
                    data-ocid="backend-canister-id"
                  >
                    {backendCanisterId ?? "—"}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Add this principal as a controller of a canister so the panel
                  can read its status, cycle balance, memory breakdown and
                  settings.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Live ICP-to-Cycles rate */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card className="border-border bg-card" data-ocid="rate-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <RefreshCw size={15} className="text-accent" />
                ICP-to-Cycles Rate
              </CardTitle>
              <span
                className="inline-flex items-center gap-1.5 rounded-md bg-accent/15 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-widest text-accent"
                data-ocid="rate-source-badge"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Live · CMC
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isRateLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : isRateError ? (
              <div
                className="flex items-start gap-2 text-sm text-destructive"
                data-ocid="rate-error"
                role="alert"
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span className="min-w-0 break-words">
                  Could not read the live rate from the CMC. Try refreshing.
                </span>
              </div>
            ) : (
              <div className="surface-inset px-3 py-3">
                <p className="stat-label mb-1.5">Current Rate</p>
                <p
                  className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-accent"
                  data-ocid="rate-value"
                >
                  {rate ? formatIcpToCyclesRate(rate.icpPerXdr) : "—"}
                </p>
                <p
                  className="text-xs text-muted-foreground mt-1.5"
                  data-ocid="rate-updated-at"
                >
                  Last updated {formatUpdatedAt(rate?.updatedAt)}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetchRate()}
                disabled={isRateFetching}
                data-ocid="refresh-rate-btn"
                className="border-border text-foreground hover:bg-surface-hover transition-smooth"
              >
                <RefreshCw
                  size={14}
                  className={isRateFetching ? "animate-spin" : undefined}
                />
                {isRateFetching ? "Refreshing…" : "Refresh rate"}
              </Button>
              <a
                href={NNS_CANISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="nns-canister-link"
                className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-smooth"
              >
                Re-up in NNS
                <ExternalLink size={13} />
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-border bg-card" data-ocid="appearance-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-display flex items-center gap-2">
              {isDark ? (
                <Moon size={15} className="text-primary" />
              ) : (
                <Sun size={15} className="text-primary" />
              )}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="settings-row">
              <div className="min-w-0">
                <p className="settings-row-label">Dark mode</p>
                <p className="settings-row-hint">
                  {isDark
                    ? "Dark theme is active for this browser."
                    : "Light theme is active for this browser."}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={toggleDark}
                aria-pressed={isDark}
                data-ocid="dark-mode-toggle"
                className="border-border text-foreground hover:bg-surface-hover transition-smooth shrink-0"
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
                {isDark ? "Switch to light" : "Switch to dark"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
