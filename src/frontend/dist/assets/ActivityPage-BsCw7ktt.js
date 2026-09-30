import { c as createLucideIcon, j as jsxRuntimeExports, d as Slot, a as cn, e as cva, r as reactExports, m as motion, B as Button, A as Activity, S as Skeleton, f as Link, g as ArrowRight } from "./index-CgHyeyef.js";
import { R as RefreshCw, C as Card, e as CardHeader, g as CardTitle, d as CardContent, h as truncateCanisterId, a as formatCycles, b as formatBurnRate, c as formatRunway, t as timestampToDate, i as CircleAlert } from "./formatCycles-BoTNfZET.js";
import { u as useAutoRefresh, a as useManagedCanisters, b as useActiveCanister, e as useCanisterOverviews } from "./useManagedCanisters-C06wjhjv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
      key: "lc1i9w"
    }
  ],
  ["path", { d: "m7 16.5-4.74-2.85", key: "1o9zyk" }],
  ["path", { d: "m7 16.5 5-3", key: "va8pkn" }],
  ["path", { d: "M7 16.5v5.17", key: "jnp8gn" }],
  [
    "path",
    {
      d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
      key: "8zsnat"
    }
  ],
  ["path", { d: "m17 16.5-5-3", key: "8arw3v" }],
  ["path", { d: "m17 16.5 4.74-2.85", key: "8rfmw" }],
  ["path", { d: "M17 16.5v5.17", key: "k6z78m" }],
  [
    "path",
    {
      d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
      key: "1xygjf"
    }
  ],
  ["path", { d: "M12 8 7.26 5.15", key: "1vbdud" }],
  ["path", { d: "m12 8 4.74-2.85", key: "3rx089" }],
  ["path", { d: "M12 13.5V8", key: "1io7kd" }]
];
const Boxes = createLucideIcon("boxes", __iconNode);
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
const STATUS_LABEL = {
  running: "RUNNING",
  stopping: "STOPPING",
  stopped: "STOPPED",
  unknown: "UNKNOWN"
};
const STATUS_CLASS = {
  running: "status-running",
  stopping: "status-stopping",
  stopped: "status-stopped",
  unknown: "status-stopped"
};
function StatusPill({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      className: cn(
        "status-badge gap-1.5 font-mono text-[0.6875rem] tracking-wider",
        STATUS_CLASS[status]
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "h-1.5 w-1.5 rounded-full bg-current",
            "aria-hidden": "true"
          }
        ),
        STATUS_LABEL[status]
      ]
    }
  );
}
const ADDED_AT_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});
function formatAddedAt(timestamp) {
  const date = timestampToDate(timestamp);
  return date ? ADDED_AT_FORMAT.format(date) : "—";
}
function CanisterRow({
  overview,
  index,
  isActive
}) {
  const shortId = truncateCanisterId(overview.canisterId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: cn(isActive && "bg-primary/10"),
      "data-ocid": `activity.row.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "h-1.5 w-1.5 rounded-full bg-primary shrink-0",
              "aria-label": "Active canister"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "code",
            {
              className: "font-mono text-xs text-foreground truncate",
              title: overview.canisterId,
              children: shortId
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: overview.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: formatCycles(overview.cycleBalance) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: formatBurnRate(overview.burnRateCyclesPerDay) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: formatRunway(overview.runwayDays) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-xs text-muted-foreground whitespace-nowrap", children: formatAddedAt(overview.addedAt) })
      ]
    }
  );
}
const SKELETON_ROWS = Array.from(
  { length: 4 },
  (_, i) => `activity-skeleton-${i}`
);
function TableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-3", "data-ocid": "activity.loading_state", children: SKELETON_ROWS.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-md" }, id)) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
      "data-ocid": "activity.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface-inset", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { size: 22, className: "text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "No canisters managed yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-sm text-sm text-muted-foreground", children: "Add a canister on the Canisters page to start tracking its status, cycle balance, burn rate, and runway here." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            className: "mt-1 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", "data-ocid": "activity.add_canister_link", children: [
              "Add a canister",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 })
            ] })
          }
        )
      ]
    }
  );
}
function ActivityPage() {
  const { autoRefresh } = useAutoRefresh();
  const { data: canisters, isLoading: canistersLoading } = useManagedCanisters(autoRefresh);
  const { data: activeCanisterId } = useActiveCanister(autoRefresh);
  const {
    overviews,
    isLoading: overviewsLoading,
    error,
    refetchAll
  } = useCanisterOverviews(canisters, autoRefresh);
  const isLoading = canistersLoading || overviewsLoading;
  const hasCanisters = ((canisters == null ? void 0 : canisters.length) ?? 0) > 0;
  const rows = reactExports.useMemo(() => {
    const byId = new Map(overviews.map((o) => [o.canisterId, o]));
    return (canisters ?? []).map((c) => byId.get(c.canisterId.toText())).filter((o) => o !== void 0);
  }, [canisters, overviews]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl space-y-4 p-3 sm:space-y-6 sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "flex items-start justify-between gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground sm:text-2xl", children: "Activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Status, cycle balance, burn rate, and runway for every canister you manage." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: refetchAll,
              disabled: isLoading,
              "data-ocid": "activity.refresh_button",
              className: "mt-1 shrink-0 gap-1.5 border-border text-muted-foreground transition-smooth hover:bg-surface-hover hover:text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13, className: cn(isLoading && "animate-spin") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Refresh" })
              ]
            }
          )
        ]
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3",
        "data-ocid": "activity.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "mt-0.5 shrink-0 text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "min-w-0 flex-1 break-words text-xs text-foreground", children: [
            "Some canister telemetry could not be loaded. ",
            error.message
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.05 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "border-b border-border pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display text-sm text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14, className: "text-primary" }),
              "Managed Canisters"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: hasCanisters ? `${(canisters == null ? void 0 : canisters.length) ?? 0} canister${((canisters == null ? void 0 : canisters.length) ?? 0) === 1 ? "" : "s"} under management` : "Nothing under management yet" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading && !hasCanisters ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {}) : !hasCanisters ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "table",
            {
              className: "data-table",
              "data-ocid": "activity.table",
              "aria-label": "Managed canister activity",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", children: "Canister ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "text-right", children: "Cycle Balance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "text-right", children: "Burn Rate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "text-right", children: "Runway" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", children: "Added" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((overview, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CanisterRow,
                  {
                    overview,
                    index,
                    isActive: overview.canisterId === activeCanisterId
                  },
                  overview.canisterId
                )) })
              ]
            }
          ) }) })
        ] })
      }
    )
  ] });
}
export {
  ActivityPage
};
