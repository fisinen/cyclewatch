import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, o, r as reactExports, v as vt, m as motion, B as Button, G as Gauge, C as Check, b as Copy, T as TrendingDown, S as Skeleton, E as ExternalLink, L as Layers } from "./index-CgHyeyef.js";
import { R as RefreshCw, f as formatIcpToCyclesRate, a as formatCycles, b as formatBurnRate, c as formatRunway, C as Card, d as CardContent, t as timestampToDate, e as CardHeader, g as CardTitle, h as truncateCanisterId, i as CircleAlert, j as formatBytes } from "./formatCycles-BoTNfZET.js";
import { u as useAutoRefresh, a as useManagedCanisters, b as useActiveCanister, c as useSetActiveCanister, d as useRemoveCanister, e as useCanisterOverviews, f as useAddCanister } from "./useManagedCanisters-C06wjhjv.js";
import { u as useIcpToCyclesRate, a as useRefreshIcpToCyclesRate, S as Server } from "./useIcpToCyclesRate-CpbmEfwP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M17 20v2", key: "1rnc9c" }],
  ["path", { d: "M17 2v2", key: "11trls" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M2 17h2", key: "7oei6x" }],
  ["path", { d: "M2 7h2", key: "asdhe0" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "M20 17h2", key: "1fpfkl" }],
  ["path", { d: "M20 7h2", key: "1o8tra" }],
  ["path", { d: "M7 20v2", key: "4gnj0m" }],
  ["path", { d: "M7 2v2", key: "1i4yhu" }],
  ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", key: "1vbyd7" }],
  ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1", key: "z9xiuo" }]
];
const Cpu = createLucideIcon("cpu", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$1);
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
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
var jt = (n) => {
  switch (n) {
    case "success":
      return ee;
    case "info":
      return ae;
    case "warning":
      return oe;
    case "error":
      return se;
    default:
      return null;
  }
}, te = Array(12).fill(0), Yt = ({ visible: n, className: e }) => o.createElement("div", { className: ["sonner-loading-wrapper", e].filter(Boolean).join(" "), "data-visible": n }, o.createElement("div", { className: "sonner-spinner" }, te.map((t, a) => o.createElement("div", { className: "sonner-loading-bar", key: `spinner-bar-${a}` })))), ee = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, o.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z", clipRule: "evenodd" })), oe = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", height: "20", width: "20" }, o.createElement("path", { fillRule: "evenodd", d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z", clipRule: "evenodd" })), ae = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, o.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z", clipRule: "evenodd" })), se = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, o.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" })), Ot = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }, o.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), o.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }));
var Ft = () => {
  let [n, e] = o.useState(document.hidden);
  return o.useEffect(() => {
    let t = () => {
      e(document.hidden);
    };
    return document.addEventListener("visibilitychange", t), () => window.removeEventListener("visibilitychange", t);
  }, []), n;
};
var bt = 1, yt = class {
  constructor() {
    this.subscribe = (e) => (this.subscribers.push(e), () => {
      let t = this.subscribers.indexOf(e);
      this.subscribers.splice(t, 1);
    });
    this.publish = (e) => {
      this.subscribers.forEach((t) => t(e));
    };
    this.addToast = (e) => {
      this.publish(e), this.toasts = [...this.toasts, e];
    };
    this.create = (e) => {
      var S;
      let { message: t, ...a } = e, u = typeof (e == null ? void 0 : e.id) == "number" || ((S = e.id) == null ? void 0 : S.length) > 0 ? e.id : bt++, f = this.toasts.find((g) => g.id === u), w = e.dismissible === void 0 ? true : e.dismissible;
      return this.dismissedToasts.has(u) && this.dismissedToasts.delete(u), f ? this.toasts = this.toasts.map((g) => g.id === u ? (this.publish({ ...g, ...e, id: u, title: t }), { ...g, ...e, id: u, dismissible: w, title: t }) : g) : this.addToast({ title: t, ...a, dismissible: w, id: u }), u;
    };
    this.dismiss = (e) => (this.dismissedToasts.add(e), e || this.toasts.forEach((t) => {
      this.subscribers.forEach((a) => a({ id: t.id, dismiss: true }));
    }), this.subscribers.forEach((t) => t({ id: e, dismiss: true })), e);
    this.message = (e, t) => this.create({ ...t, message: e });
    this.error = (e, t) => this.create({ ...t, message: e, type: "error" });
    this.success = (e, t) => this.create({ ...t, type: "success", message: e });
    this.info = (e, t) => this.create({ ...t, type: "info", message: e });
    this.warning = (e, t) => this.create({ ...t, type: "warning", message: e });
    this.loading = (e, t) => this.create({ ...t, type: "loading", message: e });
    this.promise = (e, t) => {
      if (!t) return;
      let a;
      t.loading !== void 0 && (a = this.create({ ...t, promise: e, type: "loading", message: t.loading, description: typeof t.description != "function" ? t.description : void 0 }));
      let u = e instanceof Promise ? e : e(), f = a !== void 0, w, S = u.then(async (i) => {
        if (w = ["resolve", i], o.isValidElement(i)) f = false, this.create({ id: a, type: "default", message: i });
        else if (ie(i) && !i.ok) {
          f = false;
          let T = typeof t.error == "function" ? await t.error(`HTTP error! status: ${i.status}`) : t.error, F = typeof t.description == "function" ? await t.description(`HTTP error! status: ${i.status}`) : t.description;
          this.create({ id: a, type: "error", message: T, description: F });
        } else if (t.success !== void 0) {
          f = false;
          let T = typeof t.success == "function" ? await t.success(i) : t.success, F = typeof t.description == "function" ? await t.description(i) : t.description;
          this.create({ id: a, type: "success", message: T, description: F });
        }
      }).catch(async (i) => {
        if (w = ["reject", i], t.error !== void 0) {
          f = false;
          let D = typeof t.error == "function" ? await t.error(i) : t.error, T = typeof t.description == "function" ? await t.description(i) : t.description;
          this.create({ id: a, type: "error", message: D, description: T });
        }
      }).finally(() => {
        var i;
        f && (this.dismiss(a), a = void 0), (i = t.finally) == null || i.call(t);
      }), g = () => new Promise((i, D) => S.then(() => w[0] === "reject" ? D(w[1]) : i(w[1])).catch(D));
      return typeof a != "string" && typeof a != "number" ? { unwrap: g } : Object.assign(a, { unwrap: g });
    };
    this.custom = (e, t) => {
      let a = (t == null ? void 0 : t.id) || bt++;
      return this.create({ jsx: e(a), id: a, ...t }), a;
    };
    this.getActiveToasts = () => this.toasts.filter((e) => !this.dismissedToasts.has(e.id));
    this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}, v = new yt(), ne = (n, e) => {
  let t = (e == null ? void 0 : e.id) || bt++;
  return v.addToast({ title: n, ...e, id: t }), t;
}, ie = (n) => n && typeof n == "object" && "ok" in n && typeof n.ok == "boolean" && "status" in n && typeof n.status == "number", le = ne, ce = () => v.toasts, de = () => v.getActiveToasts(), ue = Object.assign(le, { success: v.success, info: v.info, warning: v.warning, error: v.error, custom: v.custom, message: v.message, promise: v.promise, dismiss: v.dismiss, loading: v.loading }, { getHistory: ce, getToasts: de });
function wt(n, { insertAt: e } = {}) {
  if (typeof document == "undefined") return;
  let t = document.head || document.getElementsByTagName("head")[0], a = document.createElement("style");
  a.type = "text/css", e === "top" && t.firstChild ? t.insertBefore(a, t.firstChild) : t.appendChild(a), a.styleSheet ? a.styleSheet.cssText = n : a.appendChild(document.createTextNode(n));
}
wt(`:where(html[dir="ltr"]),:where([data-sonner-toaster][dir="ltr"]){--toast-icon-margin-start: -3px;--toast-icon-margin-end: 4px;--toast-svg-margin-start: -1px;--toast-svg-margin-end: 0px;--toast-button-margin-start: auto;--toast-button-margin-end: 0;--toast-close-button-start: 0;--toast-close-button-end: unset;--toast-close-button-transform: translate(-35%, -35%)}:where(html[dir="rtl"]),:where([data-sonner-toaster][dir="rtl"]){--toast-icon-margin-start: 4px;--toast-icon-margin-end: -3px;--toast-svg-margin-start: 0px;--toast-svg-margin-end: -1px;--toast-button-margin-start: 0;--toast-button-margin-end: auto;--toast-close-button-start: unset;--toast-close-button-end: 0;--toast-close-button-transform: translate(35%, -35%)}:where([data-sonner-toaster]){position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1: hsl(0, 0%, 99%);--gray2: hsl(0, 0%, 97.3%);--gray3: hsl(0, 0%, 95.1%);--gray4: hsl(0, 0%, 93%);--gray5: hsl(0, 0%, 90.9%);--gray6: hsl(0, 0%, 88.7%);--gray7: hsl(0, 0%, 85.8%);--gray8: hsl(0, 0%, 78%);--gray9: hsl(0, 0%, 56.1%);--gray10: hsl(0, 0%, 52.3%);--gray11: hsl(0, 0%, 43.5%);--gray12: hsl(0, 0%, 9%);--border-radius: 8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999;transition:transform .4s ease}:where([data-sonner-toaster][data-lifted="true"]){transform:translateY(-10px)}@media (hover: none) and (pointer: coarse){:where([data-sonner-toaster][data-lifted="true"]){transform:none}}:where([data-sonner-toaster][data-x-position="right"]){right:var(--offset-right)}:where([data-sonner-toaster][data-x-position="left"]){left:var(--offset-left)}:where([data-sonner-toaster][data-x-position="center"]){left:50%;transform:translate(-50%)}:where([data-sonner-toaster][data-y-position="top"]){top:var(--offset-top)}:where([data-sonner-toaster][data-y-position="bottom"]){bottom:var(--offset-bottom)}:where([data-sonner-toast]){--y: translateY(100%);--lift-amount: calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);filter:blur(0);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:none;overflow-wrap:anywhere}:where([data-sonner-toast][data-styled="true"]){padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px #0000001a;width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}:where([data-sonner-toast]:focus-visible){box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast][data-y-position="top"]){top:0;--y: translateY(-100%);--lift: 1;--lift-amount: calc(1 * var(--gap))}:where([data-sonner-toast][data-y-position="bottom"]){bottom:0;--y: translateY(100%);--lift: -1;--lift-amount: calc(var(--lift) * var(--gap))}:where([data-sonner-toast]) :where([data-description]){font-weight:400;line-height:1.4;color:inherit}:where([data-sonner-toast]) :where([data-title]){font-weight:500;line-height:1.5;color:inherit}:where([data-sonner-toast]) :where([data-icon]){display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}:where([data-sonner-toast][data-promise="true"]) :where([data-icon])>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}:where([data-sonner-toast]) :where([data-icon])>*{flex-shrink:0}:where([data-sonner-toast]) :where([data-icon]) svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}:where([data-sonner-toast]) :where([data-content]){display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:none;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}:where([data-sonner-toast]) :where([data-button]):focus-visible{box-shadow:0 0 0 2px #0006}:where([data-sonner-toast]) :where([data-button]):first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}:where([data-sonner-toast]) :where([data-cancel]){color:var(--normal-text);background:rgba(0,0,0,.08)}:where([data-sonner-toast][data-theme="dark"]) :where([data-cancel]){background:rgba(255,255,255,.3)}:where([data-sonner-toast]) :where([data-close-button]){position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]{background:var(--gray1)}:where([data-sonner-toast]) :where([data-close-button]):focus-visible{box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast]) :where([data-disabled="true"]){cursor:not-allowed}:where([data-sonner-toast]):hover :where([data-close-button]):hover{background:var(--gray2);border-color:var(--gray5)}:where([data-sonner-toast][data-swiping="true"]):before{content:"";position:absolute;left:-50%;right:-50%;height:100%;z-index:-1}:where([data-sonner-toast][data-y-position="top"][data-swiping="true"]):before{bottom:50%;transform:scaleY(3) translateY(50%)}:where([data-sonner-toast][data-y-position="bottom"][data-swiping="true"]):before{top:50%;transform:scaleY(3) translateY(-50%)}:where([data-sonner-toast][data-swiping="false"][data-removed="true"]):before{content:"";position:absolute;inset:0;transform:scaleY(2)}:where([data-sonner-toast]):after{content:"";position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}:where([data-sonner-toast][data-mounted="true"]){--y: translateY(0);opacity:1}:where([data-sonner-toast][data-expanded="false"][data-front="false"]){--scale: var(--toasts-before) * .05 + 1;--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}:where([data-sonner-toast])>*{transition:opacity .4s}:where([data-sonner-toast][data-expanded="false"][data-front="false"][data-styled="true"])>*{opacity:0}:where([data-sonner-toast][data-visible="false"]){opacity:0;pointer-events:none}:where([data-sonner-toast][data-mounted="true"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}:where([data-sonner-toast][data-removed="true"][data-front="true"][data-swipe-out="false"]){--y: translateY(calc(var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="false"]){--y: translateY(40%);opacity:0;transition:transform .5s,opacity .2s}:where([data-sonner-toast][data-removed="true"][data-front="false"]):before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y, 0px)) translate(var(--swipe-amount-x, 0px));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width: 600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg: #fff;--normal-border: var(--gray4);--normal-text: var(--gray12);--success-bg: hsl(143, 85%, 96%);--success-border: hsl(145, 92%, 91%);--success-text: hsl(140, 100%, 27%);--info-bg: hsl(208, 100%, 97%);--info-border: hsl(221, 91%, 91%);--info-text: hsl(210, 92%, 45%);--warning-bg: hsl(49, 100%, 97%);--warning-border: hsl(49, 91%, 91%);--warning-text: hsl(31, 92%, 45%);--error-bg: hsl(359, 100%, 97%);--error-border: hsl(359, 100%, 94%);--error-text: hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg: #000;--normal-bg-hover: hsl(0, 0%, 12%);--normal-border: hsl(0, 0%, 20%);--normal-border-hover: hsl(0, 0%, 25%);--normal-text: var(--gray1);--success-bg: hsl(150, 100%, 6%);--success-border: hsl(147, 100%, 12%);--success-text: hsl(150, 86%, 65%);--info-bg: hsl(215, 100%, 6%);--info-border: hsl(223, 100%, 12%);--info-text: hsl(216, 87%, 65%);--warning-bg: hsl(64, 100%, 6%);--warning-border: hsl(60, 100%, 12%);--warning-text: hsl(46, 87%, 65%);--error-bg: hsl(358, 76%, 10%);--error-border: hsl(357, 89%, 16%);--error-text: hsl(358, 100%, 81%)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success],[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info],[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning],[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error],[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size: 16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}to{opacity:.15}}@media (prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}
`);
function tt(n) {
  return n.label !== void 0;
}
var pe = 3, me = "32px", ge = "16px", Wt = 4e3, he = 356, be = 14, ye = 20, we = 200;
function M(...n) {
  return n.filter(Boolean).join(" ");
}
function xe(n) {
  let [e, t] = n.split("-"), a = [];
  return e && a.push(e), t && a.push(t), a;
}
var ve = (n) => {
  var Dt, Pt, Nt, Bt, Ct, kt, It, Mt, Ht, At, Lt;
  let { invert: e, toast: t, unstyled: a, interacting: u, setHeights: f, visibleToasts: w, heights: S, index: g, toasts: i, expanded: D, removeToast: T, defaultRichColors: F, closeButton: et, style: ut, cancelButtonStyle: ft, actionButtonStyle: l, className: ot = "", descriptionClassName: at = "", duration: X, position: st, gap: pt, loadingIcon: rt, expandByDefault: B, classNames: s, icons: P, closeButtonAriaLabel: nt = "Close toast", pauseWhenPageIsHidden: it } = n, [Y, C] = o.useState(null), [lt, J] = o.useState(null), [W, H] = o.useState(false), [A, mt] = o.useState(false), [L, z] = o.useState(false), [ct, d] = o.useState(false), [h, y] = o.useState(false), [R, j] = o.useState(0), [p, _] = o.useState(0), O = o.useRef(t.duration || X || Wt), G = o.useRef(null), k = o.useRef(null), Vt = g === 0, Ut = g + 1 <= w, N = t.type, V = t.dismissible !== false, Kt = t.className || "", Xt = t.descriptionClassName || "", dt = o.useMemo(() => S.findIndex((r) => r.toastId === t.id) || 0, [S, t.id]), Jt = o.useMemo(() => {
    var r;
    return (r = t.closeButton) != null ? r : et;
  }, [t.closeButton, et]), Tt = o.useMemo(() => t.duration || X || Wt, [t.duration, X]), gt = o.useRef(0), U = o.useRef(0), St = o.useRef(0), K = o.useRef(null), [Gt, Qt] = st.split("-"), Rt = o.useMemo(() => S.reduce((r, m, c) => c >= dt ? r : r + m.height, 0), [S, dt]), Et = Ft(), qt = t.invert || e, ht = N === "loading";
  U.current = o.useMemo(() => dt * pt + Rt, [dt, Rt]), o.useEffect(() => {
    O.current = Tt;
  }, [Tt]), o.useEffect(() => {
    H(true);
  }, []), o.useEffect(() => {
    let r = k.current;
    if (r) {
      let m = r.getBoundingClientRect().height;
      return _(m), f((c) => [{ toastId: t.id, height: m, position: t.position }, ...c]), () => f((c) => c.filter((b) => b.toastId !== t.id));
    }
  }, [f, t.id]), o.useLayoutEffect(() => {
    if (!W) return;
    let r = k.current, m = r.style.height;
    r.style.height = "auto";
    let c = r.getBoundingClientRect().height;
    r.style.height = m, _(c), f((b) => b.find((x) => x.toastId === t.id) ? b.map((x) => x.toastId === t.id ? { ...x, height: c } : x) : [{ toastId: t.id, height: c, position: t.position }, ...b]);
  }, [W, t.title, t.description, f, t.id]);
  let $ = o.useCallback(() => {
    mt(true), j(U.current), f((r) => r.filter((m) => m.toastId !== t.id)), setTimeout(() => {
      T(t);
    }, we);
  }, [t, T, f, U]);
  o.useEffect(() => {
    if (t.promise && N === "loading" || t.duration === 1 / 0 || t.type === "loading") return;
    let r;
    return D || u || it && Et ? (() => {
      if (St.current < gt.current) {
        let b = (/* @__PURE__ */ new Date()).getTime() - gt.current;
        O.current = O.current - b;
      }
      St.current = (/* @__PURE__ */ new Date()).getTime();
    })() : (() => {
      O.current !== 1 / 0 && (gt.current = (/* @__PURE__ */ new Date()).getTime(), r = setTimeout(() => {
        var b;
        (b = t.onAutoClose) == null || b.call(t, t), $();
      }, O.current));
    })(), () => clearTimeout(r);
  }, [D, u, t, N, it, Et, $]), o.useEffect(() => {
    t.delete && $();
  }, [$, t.delete]);
  function Zt() {
    var r, m, c;
    return P != null && P.loading ? o.createElement("div", { className: M(s == null ? void 0 : s.loader, (r = t == null ? void 0 : t.classNames) == null ? void 0 : r.loader, "sonner-loader"), "data-visible": N === "loading" }, P.loading) : rt ? o.createElement("div", { className: M(s == null ? void 0 : s.loader, (m = t == null ? void 0 : t.classNames) == null ? void 0 : m.loader, "sonner-loader"), "data-visible": N === "loading" }, rt) : o.createElement(Yt, { className: M(s == null ? void 0 : s.loader, (c = t == null ? void 0 : t.classNames) == null ? void 0 : c.loader), visible: N === "loading" });
  }
  return o.createElement("li", { tabIndex: 0, ref: k, className: M(ot, Kt, s == null ? void 0 : s.toast, (Dt = t == null ? void 0 : t.classNames) == null ? void 0 : Dt.toast, s == null ? void 0 : s.default, s == null ? void 0 : s[N], (Pt = t == null ? void 0 : t.classNames) == null ? void 0 : Pt[N]), "data-sonner-toast": "", "data-rich-colors": (Nt = t.richColors) != null ? Nt : F, "data-styled": !(t.jsx || t.unstyled || a), "data-mounted": W, "data-promise": !!t.promise, "data-swiped": h, "data-removed": A, "data-visible": Ut, "data-y-position": Gt, "data-x-position": Qt, "data-index": g, "data-front": Vt, "data-swiping": L, "data-dismissible": V, "data-type": N, "data-invert": qt, "data-swipe-out": ct, "data-swipe-direction": lt, "data-expanded": !!(D || B && W), style: { "--index": g, "--toasts-before": g, "--z-index": i.length - g, "--offset": `${A ? R : U.current}px`, "--initial-height": B ? "auto" : `${p}px`, ...ut, ...t.style }, onDragEnd: () => {
    z(false), C(null), K.current = null;
  }, onPointerDown: (r) => {
    ht || !V || (G.current = /* @__PURE__ */ new Date(), j(U.current), r.target.setPointerCapture(r.pointerId), r.target.tagName !== "BUTTON" && (z(true), K.current = { x: r.clientX, y: r.clientY }));
  }, onPointerUp: () => {
    var x, Q, q, Z;
    if (ct || !V) return;
    K.current = null;
    let r = Number(((x = k.current) == null ? void 0 : x.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), m = Number(((Q = k.current) == null ? void 0 : Q.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), c = (/* @__PURE__ */ new Date()).getTime() - ((q = G.current) == null ? void 0 : q.getTime()), b = Y === "x" ? r : m, I = Math.abs(b) / c;
    if (Math.abs(b) >= ye || I > 0.11) {
      j(U.current), (Z = t.onDismiss) == null || Z.call(t, t), J(Y === "x" ? r > 0 ? "right" : "left" : m > 0 ? "down" : "up"), $(), d(true), y(false);
      return;
    }
    z(false), C(null);
  }, onPointerMove: (r) => {
    var Q, q, Z, zt;
    if (!K.current || !V || ((Q = window.getSelection()) == null ? void 0 : Q.toString().length) > 0) return;
    let c = r.clientY - K.current.y, b = r.clientX - K.current.x, I = (q = n.swipeDirections) != null ? q : xe(st);
    !Y && (Math.abs(b) > 1 || Math.abs(c) > 1) && C(Math.abs(b) > Math.abs(c) ? "x" : "y");
    let x = { x: 0, y: 0 };
    Y === "y" ? (I.includes("top") || I.includes("bottom")) && (I.includes("top") && c < 0 || I.includes("bottom") && c > 0) && (x.y = c) : Y === "x" && (I.includes("left") || I.includes("right")) && (I.includes("left") && b < 0 || I.includes("right") && b > 0) && (x.x = b), (Math.abs(x.x) > 0 || Math.abs(x.y) > 0) && y(true), (Z = k.current) == null || Z.style.setProperty("--swipe-amount-x", `${x.x}px`), (zt = k.current) == null || zt.style.setProperty("--swipe-amount-y", `${x.y}px`);
  } }, Jt && !t.jsx ? o.createElement("button", { "aria-label": nt, "data-disabled": ht, "data-close-button": true, onClick: ht || !V ? () => {
  } : () => {
    var r;
    $(), (r = t.onDismiss) == null || r.call(t, t);
  }, className: M(s == null ? void 0 : s.closeButton, (Bt = t == null ? void 0 : t.classNames) == null ? void 0 : Bt.closeButton) }, (Ct = P == null ? void 0 : P.close) != null ? Ct : Ot) : null, t.jsx || reactExports.isValidElement(t.title) ? t.jsx ? t.jsx : typeof t.title == "function" ? t.title() : t.title : o.createElement(o.Fragment, null, N || t.icon || t.promise ? o.createElement("div", { "data-icon": "", className: M(s == null ? void 0 : s.icon, (kt = t == null ? void 0 : t.classNames) == null ? void 0 : kt.icon) }, t.promise || t.type === "loading" && !t.icon ? t.icon || Zt() : null, t.type !== "loading" ? t.icon || (P == null ? void 0 : P[N]) || jt(N) : null) : null, o.createElement("div", { "data-content": "", className: M(s == null ? void 0 : s.content, (It = t == null ? void 0 : t.classNames) == null ? void 0 : It.content) }, o.createElement("div", { "data-title": "", className: M(s == null ? void 0 : s.title, (Mt = t == null ? void 0 : t.classNames) == null ? void 0 : Mt.title) }, typeof t.title == "function" ? t.title() : t.title), t.description ? o.createElement("div", { "data-description": "", className: M(at, Xt, s == null ? void 0 : s.description, (Ht = t == null ? void 0 : t.classNames) == null ? void 0 : Ht.description) }, typeof t.description == "function" ? t.description() : t.description) : null), reactExports.isValidElement(t.cancel) ? t.cancel : t.cancel && tt(t.cancel) ? o.createElement("button", { "data-button": true, "data-cancel": true, style: t.cancelButtonStyle || ft, onClick: (r) => {
    var m, c;
    tt(t.cancel) && V && ((c = (m = t.cancel).onClick) == null || c.call(m, r), $());
  }, className: M(s == null ? void 0 : s.cancelButton, (At = t == null ? void 0 : t.classNames) == null ? void 0 : At.cancelButton) }, t.cancel.label) : null, reactExports.isValidElement(t.action) ? t.action : t.action && tt(t.action) ? o.createElement("button", { "data-button": true, "data-action": true, style: t.actionButtonStyle || l, onClick: (r) => {
    var m, c;
    tt(t.action) && ((c = (m = t.action).onClick) == null || c.call(m, r), !r.defaultPrevented && $());
  }, className: M(s == null ? void 0 : s.actionButton, (Lt = t == null ? void 0 : t.classNames) == null ? void 0 : Lt.actionButton) }, t.action.label) : null));
};
function _t() {
  if (typeof window == "undefined" || typeof document == "undefined") return "ltr";
  let n = document.documentElement.getAttribute("dir");
  return n === "auto" || !n ? window.getComputedStyle(document.documentElement).direction : n;
}
function Te(n, e) {
  let t = {};
  return [n, e].forEach((a, u) => {
    let f = u === 1, w = f ? "--mobile-offset" : "--offset", S = f ? ge : me;
    function g(i) {
      ["top", "right", "bottom", "left"].forEach((D) => {
        t[`${w}-${D}`] = typeof i == "number" ? `${i}px` : i;
      });
    }
    typeof a == "number" || typeof a == "string" ? g(a) : typeof a == "object" ? ["top", "right", "bottom", "left"].forEach((i) => {
      a[i] === void 0 ? t[`${w}-${i}`] = S : t[`${w}-${i}`] = typeof a[i] == "number" ? `${a[i]}px` : a[i];
    }) : g(S);
  }), t;
}
reactExports.forwardRef(function(e, t) {
  let { invert: a, position: u = "bottom-right", hotkey: f = ["altKey", "KeyT"], expand: w, closeButton: S, className: g, offset: i, mobileOffset: D, theme: T = "light", richColors: F, duration: et, style: ut, visibleToasts: ft = pe, toastOptions: l, dir: ot = _t(), gap: at = be, loadingIcon: X, icons: st, containerAriaLabel: pt = "Notifications", pauseWhenPageIsHidden: rt } = e, [B, s] = o.useState([]), P = o.useMemo(() => Array.from(new Set([u].concat(B.filter((d) => d.position).map((d) => d.position)))), [B, u]), [nt, it] = o.useState([]), [Y, C] = o.useState(false), [lt, J] = o.useState(false), [W, H] = o.useState(T !== "system" ? T : typeof window != "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), A = o.useRef(null), mt = f.join("+").replace(/Key/g, "").replace(/Digit/g, ""), L = o.useRef(null), z = o.useRef(false), ct = o.useCallback((d) => {
    s((h) => {
      var y;
      return (y = h.find((R) => R.id === d.id)) != null && y.delete || v.dismiss(d.id), h.filter(({ id: R }) => R !== d.id);
    });
  }, []);
  return o.useEffect(() => v.subscribe((d) => {
    if (d.dismiss) {
      s((h) => h.map((y) => y.id === d.id ? { ...y, delete: true } : y));
      return;
    }
    setTimeout(() => {
      vt.flushSync(() => {
        s((h) => {
          let y = h.findIndex((R) => R.id === d.id);
          return y !== -1 ? [...h.slice(0, y), { ...h[y], ...d }, ...h.slice(y + 1)] : [d, ...h];
        });
      });
    });
  }), []), o.useEffect(() => {
    if (T !== "system") {
      H(T);
      return;
    }
    if (T === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? H("dark") : H("light")), typeof window == "undefined") return;
    let d = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      d.addEventListener("change", ({ matches: h }) => {
        H(h ? "dark" : "light");
      });
    } catch (h) {
      d.addListener(({ matches: y }) => {
        try {
          H(y ? "dark" : "light");
        } catch (R) {
          console.error(R);
        }
      });
    }
  }, [T]), o.useEffect(() => {
    B.length <= 1 && C(false);
  }, [B]), o.useEffect(() => {
    let d = (h) => {
      var R, j;
      f.every((p) => h[p] || h.code === p) && (C(true), (R = A.current) == null || R.focus()), h.code === "Escape" && (document.activeElement === A.current || (j = A.current) != null && j.contains(document.activeElement)) && C(false);
    };
    return document.addEventListener("keydown", d), () => document.removeEventListener("keydown", d);
  }, [f]), o.useEffect(() => {
    if (A.current) return () => {
      L.current && (L.current.focus({ preventScroll: true }), L.current = null, z.current = false);
    };
  }, [A.current]), o.createElement("section", { ref: t, "aria-label": `${pt} ${mt}`, tabIndex: -1, "aria-live": "polite", "aria-relevant": "additions text", "aria-atomic": "false", suppressHydrationWarning: true }, P.map((d, h) => {
    var j;
    let [y, R] = d.split("-");
    return B.length ? o.createElement("ol", { key: d, dir: ot === "auto" ? _t() : ot, tabIndex: -1, ref: A, className: g, "data-sonner-toaster": true, "data-theme": W, "data-y-position": y, "data-lifted": Y && B.length > 1 && !w, "data-x-position": R, style: { "--front-toast-height": `${((j = nt[0]) == null ? void 0 : j.height) || 0}px`, "--width": `${he}px`, "--gap": `${at}px`, ...ut, ...Te(i, D) }, onBlur: (p) => {
      z.current && !p.currentTarget.contains(p.relatedTarget) && (z.current = false, L.current && (L.current.focus({ preventScroll: true }), L.current = null));
    }, onFocus: (p) => {
      p.target instanceof HTMLElement && p.target.dataset.dismissible === "false" || z.current || (z.current = true, L.current = p.relatedTarget);
    }, onMouseEnter: () => C(true), onMouseMove: () => C(true), onMouseLeave: () => {
      lt || C(false);
    }, onDragEnd: () => C(false), onPointerDown: (p) => {
      p.target instanceof HTMLElement && p.target.dataset.dismissible === "false" || J(true);
    }, onPointerUp: () => J(false) }, B.filter((p) => !p.position && h === 0 || p.position === d).map((p, _) => {
      var O, G;
      return o.createElement(ve, { key: p.id, icons: st, index: _, toast: p, defaultRichColors: F, duration: (O = l == null ? void 0 : l.duration) != null ? O : et, className: l == null ? void 0 : l.className, descriptionClassName: l == null ? void 0 : l.descriptionClassName, invert: a, visibleToasts: ft, closeButton: (G = l == null ? void 0 : l.closeButton) != null ? G : S, interacting: lt, position: d, style: l == null ? void 0 : l.style, unstyled: l == null ? void 0 : l.unstyled, classNames: l == null ? void 0 : l.classNames, cancelButtonStyle: l == null ? void 0 : l.cancelButtonStyle, actionButtonStyle: l == null ? void 0 : l.actionButtonStyle, removeToast: ct, toasts: B.filter((k) => k.position == p.position), heights: nt.filter((k) => k.position == p.position), setHeights: it, expandByDefault: w, gap: at, loadingIcon: X, expanded: Y, pauseWhenPageIsHidden: rt, swipeDirections: e.swipeDirections });
    })) : null;
  }));
});
function useCanisterAggregate(overviews) {
  return reactExports.useMemo(() => {
    let totalCycleBalance = BigInt(0);
    let totalBurnRateCyclesPerDay = BigInt(0);
    let minRunwayDays = null;
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
      canisterCount: overviews.length
    };
  }, [overviews]);
}
function extractBody(message) {
  try {
    const match = message.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
  } catch {
  }
  return null;
}
function isStopped(message, body) {
  if ((body == null ? void 0 : body.error_code) === "IC0508") return true;
  if (/\bIC0508\b/i.test(message)) return true;
  return false;
}
function isNotFound(message, body) {
  const lower = message.toLowerCase();
  if (lower.includes("canister not found") || lower.includes("ic0301"))
    return true;
  if ((body == null ? void 0 : body.error_code) === "IC0301") return true;
  return false;
}
function isNotAuthorized(message, body) {
  const lower = message.toLowerCase();
  if (lower.includes("not authorized") || lower.includes("unauthorized") || lower.includes("access denied") || lower.includes("ic0511"))
    return true;
  if ((body == null ? void 0 : body.error_code) === "IC0511") return true;
  return false;
}
function isInvalidCanisterId(message) {
  const lower = message.toLowerCase();
  return lower.includes("invalid canister id") || lower.includes("invalid principal") || lower.includes("malformed canister id");
}
function isRateLimit(message) {
  return message.toLowerCase().includes("rate limit") || message.toLowerCase().includes("too many requests");
}
function getRawMessage(err) {
  if (!err) return "";
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
function classifyICError(err) {
  const message = getRawMessage(err);
  const body = extractBody(message);
  if (isStopped(message, body)) return "stopped";
  if (isNotFound(message, body)) return "not_found";
  if (isNotAuthorized(message, body)) return "unauthorized";
  if (isInvalidCanisterId(message)) return "invalid_id";
  if (isRateLimit(message)) return "rate_limit";
  return "retryable";
}
function formatICError(err) {
  if (!err) return "An unexpected error occurred. Please try again.";
  const message = getRawMessage(err);
  const body = extractBody(message);
  if (isStopped(message, body)) {
    return "This canister is currently stopped. Start it from the NNS canister management UI and try again.";
  }
  if (isNotFound(message, body)) {
    return "Canister not found. Please double-check the canister ID and try again.";
  }
  if (isNotAuthorized(message, body)) {
    return "Not authorized to read this canister. The CycleWatch backend canister is not a controller of your canister. To read cycle balances and compute settings, add the backend canister as a controller of your canister. You can do this from the NNS canister management UI or by running:\n\ndfx canister update-settings --add-controller <BACKEND_CANISTER_ID> <YOUR_CANISTER_ID>";
  }
  if (isInvalidCanisterId(message)) {
    return "Invalid canister ID format. Please enter a valid canister ID (e.g. rrkah-fqaaa-aaaaa-aaaaq-cai).";
  }
  if (isRateLimit(message)) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (body == null ? void 0 : body.reject_message) {
    const clean = body.reject_message.trim();
    return clean || "Connection failed. Please try again.";
  }
  const stripped = message.replace(/\{[\s\S]*\}/, "").trim();
  const cleaned = stripped || message;
  return cleaned || "Connection failed. Please try again.";
}
const NNS_CANISTER_URL = "https://nns.ic0.app/canisters";
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
function memorySegments(memory) {
  const total = memory.heapBytes + memory.stableBytes + memory.wasmBytes;
  const pct = (bytes) => total > BigInt(0) ? Number(bytes) / Number(total) * 100 : 0;
  return [
    {
      key: "heap",
      label: "HEAP",
      bytes: memory.heapBytes,
      percent: pct(memory.heapBytes),
      className: "memory-heap"
    },
    {
      key: "stable",
      label: "STABLE",
      bytes: memory.stableBytes,
      percent: pct(memory.stableBytes),
      className: "memory-stable"
    },
    {
      key: "wasm",
      label: "WASM",
      bytes: memory.wasmBytes,
      percent: pct(memory.wasmBytes),
      className: "memory-wasm"
    }
  ];
}
function formatUpdatedAt(timestamp) {
  if (timestamp === void 0) return "—";
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function StatusPill({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("status-badge", STATUS_CLASS[status]), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "h-1.5 w-1.5 rounded-full bg-current",
        "aria-hidden": "true"
      }
    ),
    STATUS_LABEL[status]
  ] });
}
function MemoryBar({
  memory,
  showLegend
}) {
  const segments = memorySegments(memory);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "memory-bar",
        role: "img",
        "aria-label": segments.map((s) => `${s.label} ${formatBytes(s.bytes)}`).join(", "),
        children: segments.map((segment) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn("memory-segment", segment.className),
            style: { width: `${segment.percent}%` }
          },
          segment.key
        ))
      }
    ),
    showLegend && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memory-legend", children: segments.map((segment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: cn("memory-dot", segment.className),
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[0.625rem] font-semibold uppercase tracking-widest", children: segment.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[0.6875rem] tabular-nums text-foreground", children: formatBytes(segment.bytes) })
    ] }, segment.key)) })
  ] });
}
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card", "data-ocid": "stat-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Icon,
        {
          size: 15,
          className: accent ? "text-accent shrink-0" : "text-primary shrink-0",
          "aria-hidden": "true"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("stat-value", accent && "text-accent"), children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-sub", children: sub })
  ] });
}
function AddCanisterForm() {
  const addCanister = useAddCanister();
  const [value, setValue] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setError(null);
    setValue("");
    addCanister.mutate(trimmed, {
      onSuccess: () => ue.success("Canister added to the panel."),
      onError: (err) => {
        setError(formatICError(err));
        setValue((current) => current === "" ? trimmed : current);
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-2",
      "data-ocid": "add-canister-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value,
              onChange: (event) => {
                setValue(event.target.value);
                setError(null);
              },
              placeholder: "rrkah-fqaaa-aaaaa-aaaaq-cai",
              "aria-label": "Canister principal ID",
              className: "font-mono text-sm flex-1",
              "data-ocid": "canister-id-input",
              disabled: addCanister.isPending
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: !value.trim() || addCanister.isPending,
              "data-ocid": "add-canister-button",
              className: "bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth sm:shrink-0",
              children: [
                addCanister.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "animate-spin", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, "aria-hidden": "true" }),
                addCanister.isPending ? "Adding…" : "Add canister"
              ]
            }
          )
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "flex items-start gap-1.5 text-xs text-destructive",
            "data-ocid": "add-canister-error",
            role: "alert",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircleAlert,
                {
                  size: 12,
                  className: "mt-0.5 shrink-0",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 break-words", children: error })
            ]
          }
        )
      ]
    }
  );
}
function CanisterRail({
  canisters,
  activeCanisterId,
  onSelect,
  isSwitching
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "canister-rail", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 14, className: "text-primary", "aria-hidden": "true" }),
      "Managed canisters"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", "data-ocid": "canister-list", children: canisters.map((canister, index) => {
        const canisterId = canister.canisterId.toText();
        const isActive = canisterId === activeCanisterId;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onSelect(canisterId),
            disabled: isSwitching,
            "aria-pressed": isActive,
            "data-ocid": `canister.item.${index + 1}`,
            className: cn(
              "w-full rounded-md border px-3 py-2 text-left transition-smooth",
              isActive ? "border-primary/40 bg-primary/10" : "border-transparent hover:border-border hover:bg-surface-hover"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    isActive ? "bg-accent" : "bg-muted-foreground"
                  ),
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-xs text-foreground", children: truncateCanisterId(canisterId, 14, 6) }),
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Check,
                {
                  size: 12,
                  className: "shrink-0 text-accent",
                  "aria-hidden": "true"
                }
              )
            ] })
          }
        ) }, canisterId);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddCanisterForm, {})
    ] })
  ] });
}
function ComparisonTable({
  canisters,
  overviews,
  activeCanisterId,
  onSelect,
  onRemove,
  isRemoving,
  isLoading
}) {
  const overviewById = new Map(overviews.map((o2) => [o2.canisterId, o2]));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "comparison-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 14, className: "text-primary", "aria-hidden": "true" }),
      "Canister comparison"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "data-table", "data-ocid": "canister-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", children: "Canister ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "text-right", children: "Cycle balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "text-right", children: "Burn rate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "text-right", children: "Runway" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "min-w-[11rem]", children: "Memory proportion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Actions" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: canisters.map((canister, index) => {
        const canisterId = canister.canisterId.toText();
        const overview = overviewById.get(canisterId);
        const isActive = canisterId === activeCanisterId;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `canister.row.${index + 1}`,
            className: cn(isActive && "bg-primary/5"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onSelect(canisterId),
                  "data-ocid": `canister.select_button.${index + 1}`,
                  className: "flex items-center gap-2 text-left transition-smooth hover:text-accent",
                  title: canisterId,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          isActive ? "bg-accent" : "bg-muted-foreground"
                        ),
                        "aria-hidden": "true"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground", children: truncateCanisterId(canisterId, 14, 6) })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: overview ? /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: overview.status }) : isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "status-badge status-error",
                  "data-ocid": `canister.error_state.${index + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 11, "aria-hidden": "true" }),
                    "UNREADABLE"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: overview ? formatCycles(overview.cycleBalance) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: overview ? formatBurnRate(overview.burnRateCyclesPerDay) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: overview ? formatRunway(overview.runwayDays) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: overview ? /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryBar, { memory: overview.memory }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Unavailable" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: () => onRemove(canisterId),
                  disabled: isRemoving,
                  "aria-label": `Remove ${canisterId}`,
                  "data-ocid": `canister.delete_button.${index + 1}`,
                  className: "h-7 w-7 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13, "aria-hidden": "true" })
                }
              ) })
            ]
          },
          canisterId
        );
      }) })
    ] }) }) })
  ] });
}
function ActiveCanisterDetail({
  overview,
  isLoading,
  error,
  onRetry,
  isRetrying
}) {
  if (isLoading && !overview) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", "data-ocid": "detail-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2 w-full rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" })
    ] }) });
  }
  if (!overview) {
    const kind = error ? classifyICError(error) : null;
    const headline = kind === "unauthorized" ? "Not a controller of this canister" : kind === "stopped" ? "Canister is stopped" : kind === "not_found" ? "Canister not found" : "Status unavailable";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", "data-ocid": "detail-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-4", "data-ocid": "detail-error-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CircleAlert,
          {
            size: 15,
            className: "mt-0.5 shrink-0 text-destructive",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: headline }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground break-words", children: error ? formatICError(error) : "Select a canister to inspect its compute resources." })
        ] })
      ] }),
      error && kind !== "stopped" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: onRetry,
          disabled: isRetrying,
          "data-ocid": "detail-retry-button",
          className: "border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-smooth",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                size: 12,
                className: cn(isRetrying && "animate-spin"),
                "aria-hidden": "true"
              }
            ),
            "Retry"
          ]
        }
      )
    ] }) });
  }
  const segments = memorySegments(overview.memory);
  const totalMemory = overview.memory.heapBytes + overview.memory.stableBytes + overview.memory.wasmBytes;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "detail-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { size: 14, className: "text-primary", "aria-hidden": "true" }),
      "Memory breakdown"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryBar, { memory: overview.memory, showLegend: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", children: [
        segments.map((segment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-label", children: segment.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-value", children: formatBytes(segment.bytes) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "settings-row-hint tabular-nums", children: [
              segment.percent.toFixed(1),
              "%"
            ] })
          ] })
        ] }, segment.key)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-label", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-value", children: formatBytes(totalMemory) })
        ] })
      ] })
    ] })
  ] });
}
function SettingsPanel({
  overview,
  canisterId,
  onReup
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", "data-ocid": "settings-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { size: 14, className: "text-primary", "aria-hidden": "true" }),
      "Canister settings"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-label", children: "Compute allocation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-value", children: overview ? overview.settings.computeAllocation.toString() : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-label", children: "Memory allocation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-value", children: overview ? formatBytes(overview.settings.memoryAllocation) : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-label", children: "Freezing threshold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-row-value", children: overview ? `${overview.settings.freezingThreshold.toString()}s` : "—" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            onClick: onReup,
            disabled: !canisterId,
            "data-ocid": "reup-button",
            className: "w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, "aria-hidden": "true" }),
              "Re-up cycles",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 13, "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Opens the official NNS canister management UI in a new tab to top up the selected canister." })
      ] })
    ] })
  ] });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-dashed border-2 border-border bg-card/50",
      "data-ocid": "empty_state",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center gap-3 px-6 py-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 19, className: "text-primary", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold text-foreground", children: "No canisters yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-sm text-sm text-muted-foreground", children: "Add a canister by its principal ID to monitor cycle balance, burn rate, runway, and memory side by side." })
        ] })
      ] })
    }
  );
}
function DashboardPage() {
  const { autoRefresh, toggleAutoRefresh } = useAutoRefresh();
  const [copied, setCopied] = reactExports.useState(false);
  const { data: canisters, isLoading: canistersLoading } = useManagedCanisters(autoRefresh);
  const { data: activeCanisterId } = useActiveCanister(autoRefresh);
  const setActiveCanister = useSetActiveCanister();
  const removeCanister = useRemoveCanister();
  const {
    overviews,
    isLoading: overviewsLoading,
    error: overviewsError,
    refetchAll
  } = useCanisterOverviews(canisters, autoRefresh);
  const aggregate = useCanisterAggregate(overviews);
  const { data: rate, isLoading: rateLoading } = useIcpToCyclesRate(autoRefresh);
  const refreshRate = useRefreshIcpToCyclesRate();
  const list = canisters ?? [];
  const activeOverview = overviews.find(
    (overview) => overview.canisterId === activeCanisterId
  );
  const handleSelect = (canisterId) => {
    if (canisterId === activeCanisterId) return;
    setActiveCanister.mutate(canisterId, {
      onError: (err) => ue.error(formatICError(err))
    });
  };
  const handleRemove = (canisterId) => {
    removeCanister.mutate(canisterId, {
      onSuccess: () => ue.success("Canister removed from the panel."),
      onError: (err) => ue.error(formatICError(err))
    });
  };
  const handleReup = () => {
    if (!activeCanisterId) return;
    window.open(
      `${NNS_CANISTER_URL}/${activeCanisterId}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const handleCopyRate = async () => {
    if (!rate) return;
    try {
      await navigator.clipboard.writeText(
        formatIcpToCyclesRate(rate.icpPerXdr)
      );
      setCopied(true);
      ue.success("Rate copied to clipboard.");
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      ue.error("Could not copy the rate.");
    }
  };
  const hasCanisters = list.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mx-auto max-w-7xl space-y-4 p-3 sm:p-6",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.header,
          {
            initial: { opacity: 0, y: -12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35 },
            className: "flex flex-wrap items-start justify-between gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground sm:text-2xl", children: "Canister operations" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Monitor cycle balance, burn rate, runway, and memory across every canister you manage." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: toggleAutoRefresh,
                    "aria-pressed": autoRefresh,
                    "aria-label": autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh",
                    "data-ocid": "auto-refresh-toggle",
                    className: cn(
                      "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-smooth",
                      autoRefresh ? "border-accent/40 bg-accent/10 text-accent" : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            autoRefresh ? "animate-pulse bg-accent" : "bg-muted-foreground"
                          ),
                          "aria-hidden": "true"
                        }
                      ),
                      autoRefresh ? "Live" : "Paused"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => refetchAll(),
                    "aria-label": "Refresh canister telemetry",
                    "data-ocid": "refresh-button",
                    className: "h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-smooth",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, "aria-hidden": "true" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.05 },
            className: "surface-inset flex flex-wrap items-center justify-between gap-3 px-4 py-3",
            "data-ocid": "rate-panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Gauge,
                  {
                    size: 15,
                    className: "shrink-0 text-accent",
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "ICP to Cycles rate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-sm font-semibold tabular-nums text-foreground",
                      "data-ocid": "rate-value",
                      children: rateLoading ? "Loading…" : rate ? formatIcpToCyclesRate(rate.icpPerXdr) : "Unavailable"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs text-muted-foreground",
                    "data-ocid": "rate-updated-at",
                    children: [
                      "Updated ",
                      formatUpdatedAt(rate == null ? void 0 : rate.updatedAt)
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: handleCopyRate,
                    disabled: !rate,
                    "aria-label": "Copy ICP to Cycles rate",
                    "data-ocid": "copy-rate-button",
                    className: "h-7 w-7 p-0 text-muted-foreground hover:text-foreground transition-smooth",
                    children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13, className: "text-accent", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13, "aria-hidden": "true" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => refreshRate.mutate(),
                    disabled: refreshRate.isPending,
                    "aria-label": "Refresh rate from the CMC",
                    "data-ocid": "refresh-rate-button",
                    className: "h-7 w-7 p-0 text-muted-foreground hover:text-foreground transition-smooth",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RefreshCw,
                      {
                        size: 13,
                        className: cn(refreshRate.isPending && "animate-spin"),
                        "aria-hidden": "true"
                      }
                    )
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.1 },
            className: "grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total cycle balance",
                  value: overviewsLoading && !hasCanisters ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-28" }) : formatCycles(aggregate.totalCycleBalance),
                  sub: `Across ${aggregate.canisterCount} canister${aggregate.canisterCount === 1 ? "" : "s"}`,
                  icon: Zap,
                  accent: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Aggregate burn rate",
                  value: overviewsLoading && !hasCanisters ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-28" }) : formatBurnRate(aggregate.totalBurnRateCyclesPerDay),
                  sub: "Combined cycles consumed per second",
                  icon: TrendingDown
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Minimum runway",
                  value: overviewsLoading && !hasCanisters ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20" }) : formatRunway(aggregate.minRunwayDays),
                  sub: "Shortest estimated time to exhaustion",
                  icon: Gauge
                }
              )
            ]
          }
        ),
        overviewsError && hasCanisters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3",
            "data-ocid": "error_state",
            role: "alert",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircleAlert,
                {
                  size: 15,
                  className: "mt-0.5 shrink-0 text-destructive",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Some canister telemetry could not be read" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground break-words", children: formatICError(overviewsError) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.15 },
            className: "grid grid-cols-1 gap-3 lg:grid-cols-[17rem_minmax(0,1fr)] sm:gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CanisterRail,
                {
                  canisters: list,
                  activeCanisterId: activeCanisterId ?? null,
                  onSelect: handleSelect,
                  isSwitching: setActiveCanister.isPending
                }
              ),
              canistersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", "data-ocid": "loading_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
              ] }) }) : hasCanisters ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                ComparisonTable,
                {
                  canisters: list,
                  overviews,
                  activeCanisterId: activeCanisterId ?? null,
                  onSelect: handleSelect,
                  onRemove: handleRemove,
                  isRemoving: removeCanister.isPending,
                  isLoading: overviewsLoading
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {})
            ]
          }
        ),
        hasCanisters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.2 },
            className: "grid grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ActiveCanisterDetail,
                {
                  overview: activeOverview,
                  isLoading: overviewsLoading,
                  error: overviewsError,
                  onRetry: () => refetchAll(),
                  isRetrying: overviewsLoading
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SettingsPanel,
                {
                  overview: activeOverview,
                  canisterId: activeCanisterId ?? null,
                  onReup: handleReup
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11, "aria-hidden": "true" }),
          "ICP-to-Cycles rate sourced live from the CMC (Cycles Minting Canister)."
        ] })
      ]
    }
  );
}
export {
  DashboardPage
};
