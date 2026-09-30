import { c as createLucideIcon, l as useInternetIdentity, p as useDarkMode, r as reactExports, j as jsxRuntimeExports, m as motion, B as Button, C as Check, b as Copy, S as Skeleton, E as ExternalLink, M as Moon, q as Sun } from "./index-CgHyeyef.js";
import { q as useBackend, r as useQuery, C as Card, e as CardHeader, g as CardTitle, d as CardContent, i as CircleAlert, R as RefreshCw, f as formatIcpToCyclesRate, t as timestampToDate } from "./formatCycles-BoTNfZET.js";
import { u as useIcpToCyclesRate, S as Server } from "./useIcpToCyclesRate-CpbmEfwP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
];
const UserRound = createLucideIcon("user-round", __iconNode);
function useBackendCanisterId() {
  const { actor, isAuthenticated, isLoading } = useBackend();
  return useQuery({
    queryKey: ["backendCanisterId"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBackendCanisterId();
    },
    enabled: isAuthenticated && !isLoading && !!actor,
    staleTime: Number.POSITIVE_INFINITY,
    retry: 1
  });
}
const NNS_CANISTER_URL = "https://nns.ic0.app/canisters/";
function formatUpdatedAt(updatedAt) {
  if (updatedAt === void 0) return "—";
  const date = timestampToDate(updatedAt);
  if (!date) return "—";
  return date.toLocaleString(void 0, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}
function AccountPage() {
  const { identity } = useInternetIdentity();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const {
    data: backendCanisterId,
    isLoading: isBackendIdLoading,
    isError: isBackendIdError
  } = useBackendCanisterId();
  const {
    data: rate,
    isLoading: isRateLoading,
    isError: isRateError,
    refetch: refetchRate,
    isFetching: isRateFetching
  } = useIcpToCyclesRate();
  const [copied, setCopied] = reactExports.useState(false);
  const principalText = (identity == null ? void 0 : identity.getPrincipal().toText()) ?? "";
  const handleCopy = () => {
    if (!principalText) return;
    navigator.clipboard.writeText(principalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-3 sm:p-6 max-w-3xl mx-auto space-y-6",
      "data-ocid": "account-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-display font-bold text-foreground", children: "Account" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Your signed-in identity, the backend canister serving this panel, and the live ICP-to-Cycles rate." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.05 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "identity-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-display flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { size: 15, className: "text-primary" }),
                "Signed-in Principal"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-inset px-3 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label mb-1.5", children: "Principal ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "code",
                      {
                        className: "text-sm font-mono text-foreground flex-1 min-w-0 break-all",
                        "data-ocid": "principal-value",
                        children: principalText || "Not connected"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        onClick: handleCopy,
                        disabled: !principalText,
                        "aria-label": "Copy principal ID",
                        "data-ocid": "copy-principal-btn",
                        className: "shrink-0 text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-smooth",
                        children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Internet Identity gives each app a separate, anonymous principal. This is the identity the panel uses to read canister status and resources." })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.1 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border-border bg-card",
                "data-ocid": "backend-canister-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-display flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 15, className: "text-primary" }),
                    "Backend Canister"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: isBackendIdLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
                  ] }) : isBackendIdError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-start gap-2 text-sm text-destructive",
                      "data-ocid": "backend-canister-error",
                      role: "alert",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "shrink-0 mt-0.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 break-words", children: "Could not read the backend canister ID. Reload the page to try again." })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-inset px-3 py-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label mb-1.5", children: "Canister ID" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "code",
                        {
                          className: "text-sm font-mono text-foreground break-all",
                          "data-ocid": "backend-canister-id",
                          children: backendCanisterId ?? "—"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Add this principal as a controller of a canister so the panel can read its status, cycle balance, memory breakdown and settings." })
                  ] }) })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.15 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "rate-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-display flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15, className: "text-accent" }),
                  "ICP-to-Cycles Rate"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "inline-flex items-center gap-1.5 rounded-md bg-accent/15 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-widest text-accent",
                    "data-ocid": "rate-source-badge",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent animate-pulse" }),
                      "Live · CMC"
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
                isRateLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" })
                ] }) : isRateError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-2 text-sm text-destructive",
                    "data-ocid": "rate-error",
                    role: "alert",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 break-words", children: "Could not read the live rate from the CMC. Try refreshing." })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-inset px-3 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label mb-1.5", children: "Current Rate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-2xl font-semibold tabular-nums tracking-tight text-accent",
                      "data-ocid": "rate-value",
                      children: rate ? formatIcpToCyclesRate(rate.icpPerXdr) : "—"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-muted-foreground mt-1.5",
                      "data-ocid": "rate-updated-at",
                      children: [
                        "Last updated ",
                        formatUpdatedAt(rate == null ? void 0 : rate.updatedAt)
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => void refetchRate(),
                      disabled: isRateFetching,
                      "data-ocid": "refresh-rate-btn",
                      className: "border-border text-foreground hover:bg-surface-hover transition-smooth",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          RefreshCw,
                          {
                            size: 14,
                            className: isRateFetching ? "animate-spin" : void 0
                          }
                        ),
                        isRateFetching ? "Refreshing…" : "Refresh rate"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: NNS_CANISTER_URL,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      "data-ocid": "nns-canister-link",
                      className: "inline-flex items-center gap-1.5 rounded-md border border-accent/40 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-smooth",
                      children: [
                        "Re-up in NNS",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13 })
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.2 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "appearance-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-display flex items-center gap-2", children: [
                isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 15, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 15, className: "text-primary" }),
                "Appearance"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "settings-row-label", children: "Dark mode" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "settings-row-hint", children: isDark ? "Dark theme is active for this browser." : "Light theme is active for this browser." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: toggleDark,
                    "aria-pressed": isDark,
                    "data-ocid": "dark-mode-toggle",
                    className: "border-border text-foreground hover:bg-surface-hover transition-smooth shrink-0",
                    children: [
                      isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 14 }),
                      isDark ? "Switch to light" : "Switch to dark"
                    ]
                  }
                )
              ] }) })
            ] })
          }
        )
      ]
    }
  );
}
export {
  AccountPage
};
