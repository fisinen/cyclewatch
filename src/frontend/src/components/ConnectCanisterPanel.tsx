import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Link2,
  RefreshCw,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../hooks/useBackend";
import { useCanisterActions } from "../hooks/useCanisterActions";
import { useCanisterStatus } from "../hooks/useCanisterStatus";
import {
  type ICErrorKind,
  classifyICError,
  formatICError,
} from "../utils/formatICError";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Poll every 5s while awaiting controller setup. */
const CONTROLLER_POLL_INTERVAL_MS = 5_000;
/** Give up polling after 2 minutes. */
const CONTROLLER_POLL_TIMEOUT_MS = 2 * 60 * 1_000;

/**
 * Basic principal format check.
 * ICP canister IDs are textual principals: 5 groups of base32 chars separated
 * by dashes, ending in a checksum suffix (commonly "-cai" for canisters).
 * We do a loose check — non-empty, has dashes, ends with a dash-suffix.
 */
function looksLikePrincipal(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 10) return false;
  // Principals always contain at least 4 dashes (5 groups).
  const dashCount = (trimmed.match(/-/g) ?? []).length;
  if (dashCount < 4) return false;
  // Only allow base32 chars, dashes, and whitespace (already trimmed).
  return /^[a-z2-7-]+$/i.test(trimmed);
}

// ─── Backend canister ID query ─────────────────────────────────────────────────

type BackendActor = {
  getBackendCanisterId?: () => Promise<string>;
};

function useBackendCanisterId() {
  const { actor, isAuthenticated, isLoading } = useBackend();
  return useQuery<string, Error>({
    queryKey: ["backendCanisterId"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as unknown as BackendActor;
      if (typeof a.getBackendCanisterId !== "function") {
        throw new Error("getBackendCanisterId not available");
      }
      return a.getBackendCanisterId();
    },
    enabled: isAuthenticated && !isLoading && !!actor,
    staleTime: 60_000,
  });
}

// ─── Copy button ───────────────────────────────────────────────────────────────

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

// ─── Controller setup guide ────────────────────────────────────────────────────

type ControllerPollState = "idle" | "polling" | "verified" | "timed_out";

function ControllerSetupGuide({
  backendCanisterId,
  canisterId,
}: {
  backendCanisterId: string | null;
  canisterId: string;
}) {
  const [pollState, setPollState] = useState<ControllerPollState>("polling");
  const pollStartRef = useRef<number | null>(null);

  // Poll canister status every 5s to detect when the backend has been added
  // as a controller. We only enable polling while in the "polling" state so
  // the query pauses once verified or timed out.
  const { status, error } = useCanisterStatus(
    pollState === "polling" ? canisterId : null,
    { refetchInterval: CONTROLLER_POLL_INTERVAL_MS },
  );

  // Track polling start time.
  useEffect(() => {
    if (pollState === "polling" && pollStartRef.current === null) {
      pollStartRef.current = Date.now();
    }
  }, [pollState]);

  // Check each status result for the backend principal in the controllers list.
  useEffect(() => {
    if (pollState !== "polling" || !status || !backendCanisterId) return;

    const normalizedBackend = backendCanisterId.trim().toLowerCase();
    const found = status.controllers.some(
      (c) => c.trim().toLowerCase() === normalizedBackend,
    );
    if (found) {
      setPollState("verified");
      pollStartRef.current = null;
      toast.success("Controller verified! Monitoring is now active.");
    }
  }, [status, backendCanisterId, pollState]);

  // Timeout: give up after CONTROLLER_POLL_TIMEOUT_MS.
  useEffect(() => {
    if (pollState !== "polling") return;
    const elapsed = pollStartRef.current
      ? Date.now() - pollStartRef.current
      : 0;
    const remaining = Math.max(0, CONTROLLER_POLL_TIMEOUT_MS - elapsed);
    const timer = setTimeout(() => {
      setPollState("timed_out");
    }, remaining);
    return () => clearTimeout(timer);
  }, [pollState]);

  const handleRetryDetection = () => {
    pollStartRef.current = Date.now();
    setPollState("polling");
  };

  const command = backendCanisterId
    ? `dfx canister update-settings --add-controller ${backendCanisterId} ${canisterId}`
    : `dfx canister update-settings --add-controller <BACKEND_CANISTER_ID> ${canisterId}`;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mt-3 rounded-lg border border-primary/25 bg-primary/5 p-3.5 space-y-3.5"
      data-ocid="controller-setup-guide"
    >
      <div className="flex items-start gap-2">
        <ShieldCheck size={14} className="shrink-0 mt-0.5 text-primary" />
        <div className="min-w-0 space-y-1.5">
          <p className="text-xs font-semibold text-foreground">
            Controller setup required
          </p>
          <p className="text-xs text-muted-foreground break-words">
            Add the backend canister as a controller of your target canister
            before monitoring will work.
          </p>
        </div>
      </div>

      {/* Polling status indicator */}
      {pollState === "polling" && (
        <output
          className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/8 px-3 py-2.5"
          data-ocid="controller-polling-status"
          aria-live="polite"
        >
          <RefreshCw
            size={13}
            className="shrink-0 animate-spin text-primary"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-xs text-foreground font-medium">
              Waiting for controller setup…
            </p>
            <p className="text-[11px] text-muted-foreground">
              Checking every 5s for up to 2 minutes.
            </p>
          </div>
        </output>
      )}

      {/* Verified state */}
      {pollState === "verified" && (
        <output
          className="flex items-center gap-2.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5"
          data-ocid="controller-verified-state"
          aria-live="polite"
        >
          <CheckCircle2 size={14} className="shrink-0 text-accent" />
          <p className="text-xs font-medium text-accent">
            Controller verified! Monitoring is now active.
          </p>
        </output>
      )}

      {/* Timeout state */}
      {pollState === "timed_out" && (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-2.5 space-y-2"
          data-ocid="controller-polling-timeout"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              size={13}
              className="shrink-0 mt-0.5 text-destructive"
            />
            <p className="text-xs text-foreground break-words min-w-0">
              Could not detect the controller after 2 minutes. Make sure the
              backend canister was added as a controller, then retry detection.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRetryDetection}
            data-ocid="controller-timeout-retry-btn"
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth h-8 text-xs gap-1.5"
          >
            <RefreshCw size={12} />
            Retry detection
          </Button>
        </div>
      )}

      {/* Backend canister ID with copy */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Backend canister ID
        </p>
        <div className="flex items-center gap-2">
          <code
            className="flex-1 min-w-0 text-xs font-mono text-foreground bg-muted/50 border border-border rounded px-2 py-1.5 break-all"
            data-ocid="backend-canister-id-display"
          >
            {backendCanisterId ?? "Loading backend canister ID…"}
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

      {/* dfx command with copy */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Terminal size={10} />
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
        <p className="text-[10px] text-muted-foreground">
          Or add the controller from the{" "}
          <a
            href="https://nns.icp0.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:no-underline"
            data-ocid="nns-dashboard-link"
          >
            NNS dashboard
          </a>
          .
        </p>
      </div>

      {/* Inline error from status poll (non-blocking) */}
      {error && pollState === "polling" && (
        <p
          className="text-[11px] text-muted-foreground break-words"
          data-ocid="controller-poll-error"
        >
          Status check returned: {formatICError(error)}
        </p>
      )}
    </motion.div>
  );
}

// ─── Main panel ────────────────────────────────────────────────────────────────

export function ConnectCanisterPanel() {
  const [canisterId, setCanisterId] = useState("");
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const { connectCanister, isConnecting, connectError } = useCanisterActions();

  const { data: backendCanisterId } = useBackendCanisterId();

  const trimmedId = canisterId.trim();
  const isValid = looksLikePrincipal(trimmedId);
  const showError = touched && trimmedId.length > 0 && !isValid;

  const errorKind: ICErrorKind | null = useMemo(
    () => (connectError ? classifyICError(connectError) : null),
    [connectError],
  );
  // "stopped" is a hard stop — no retry. All other errors are retryable.
  const isStopped = errorKind === "stopped";

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || isConnecting) return;
    connectCanister(trimmedId, {
      onSuccess: () => {
        setConnectedId(trimmedId);
        setCanisterId("");
        setTouched(false);
        toast.success(
          "Canister connected. Add the backend as controller to begin monitoring.",
        );
      },
      onError: (err: Error) => {
        toast.error(formatICError(err));
      },
    });
  };

  const handleRetry = () => {
    if (!connectedId) return;
    connectCanister(connectedId, {
      onSuccess: () => toast.success("Reconnected successfully."),
      onError: (err: Error) => toast.error(formatICError(err)),
    });
  };

  return (
    <Card
      className="border-dashed border-2 border-border bg-card/50"
      data-ocid="connect-canister-card"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Link2 size={16} className="text-primary" />
          Connect a Canister to Monitor
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter a canister ID to start monitoring its cycle balance and status.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Canister ID input + connect button */}
        <form
          onSubmit={handleConnect}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="flex-1 min-w-0 space-y-1.5">
            <Input
              placeholder="e.g. rrkah-fqaaa-aaaaa-aaaaq-cai"
              value={canisterId}
              onChange={(e) => setCanisterId(e.target.value)}
              onBlur={() => setTouched(true)}
              className={cn(
                "font-mono text-sm",
                showError &&
                  "border-destructive focus-visible:ring-destructive/30",
              )}
              data-ocid="canister-id-input"
              aria-label="Canister ID"
              aria-invalid={showError || undefined}
              disabled={isConnecting}
              autoComplete="off"
              spellCheck={false}
            />
            {showError && (
              <p
                className="text-xs text-destructive"
                data-ocid="canister-id-input.field_error"
              >
                Enter a valid canister ID (Principal text format, e.g.
                rrkah-fqaaa-aaaaa-aaaaq-cai).
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={!isValid || isConnecting}
            data-ocid="connect-canister.primary_button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth sm:shrink-0"
          >
            {isConnecting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Link2 size={14} />
            )}
            {isConnecting ? "Connecting…" : "Connect"}
          </Button>
        </form>

        {/* Backend canister ID display with note */}
        <div
          className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 space-y-1.5"
          data-ocid="backend-canister-id-section"
        >
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Backend canister ID
          </p>
          <div className="flex items-center gap-2">
            <code
              className="flex-1 min-w-0 text-xs font-mono text-foreground bg-background/60 border border-border rounded px-2 py-1.5 break-all"
              data-ocid="backend-canister-id-text"
            >
              {backendCanisterId ?? "Loading…"}
            </code>
            {backendCanisterId && (
              <CopyButton
                value={backendCanisterId}
                label="Copy backend canister ID"
                ocid="copy-backend-id-btn"
              />
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Add this canister as a controller of your target canister before
            monitoring will work.
          </p>
        </div>

        {/* Connection error display */}
        {connectError && (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 space-y-2"
            data-ocid="connect-error-state"
            role="alert"
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                size={14}
                className="shrink-0 mt-0.5 text-destructive"
              />
              <span className="text-xs text-destructive break-words min-w-0">
                {formatICError(connectError)}
              </span>
            </div>
            {!isStopped && connectedId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isConnecting}
                data-ocid="connect-error.retry_button"
                className="border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth h-8 text-xs gap-1.5"
              >
                <RefreshCw size={12} />
                Retry
              </Button>
            )}
          </div>
        )}

        {/* Controller setup guide — shown after a successful connect */}
        {connectedId && (
          <ControllerSetupGuide
            backendCanisterId={backendCanisterId ?? null}
            canisterId={connectedId}
          />
        )}
      </CardContent>
    </Card>
  );
}
