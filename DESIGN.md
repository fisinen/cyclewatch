# Design Brief — CycleWatch Canister Operations Console

## Direction
Canister Ops Console — a mission-control surface for monitoring and managing multiple Internet Computer canisters and the compute resources inside them.

## Tone
Industrial/utilitarian precision: dense telemetry, mono figures, zero decoration. Every pixel earns its place as an operational instrument, not a marketing surface.

## Differentiation
The segmented memory proportion bar — a single cycle-tinted strip splitting heap / stable / wasm — repeated per canister so a fleet's memory shape is readable at a glance without charts.

## Color Palette

| Token      | OKLCH (Light)     | OKLCH (Dark)      | Role                                |
| ---------- | ----------------- | ----------------- | ----------------------------------- |
| background | `0.96 0 0`        | `0.13 0.006 285`  | Page canvas                         |
| foreground | `0.18 0 0`        | `0.94 0.004 285`  | Primary text                        |
| card       | `0.99 0 0`        | `0.17 0.008 285`  | Stat cards, panels                  |
| primary    | `0.42 0.095 285`  | `0.68 0.12 280`   | CTAs, active canister, focus ring   |
| accent     | `0.65 0.17 165`   | `0.72 0.18 165`   | Re-up action, live rate, stable mem |
| success    | `0.58 0.16 155`   | `0.72 0.17 155`   | Running badge, healthy runway       |
| warning    | `0.68 0.15 75`    | `0.78 0.15 80`    | Stopping badge, low runway, wasm    |
| destructive| `0.55 0.22 25`    | `0.62 0.24 25`    | Frozen threshold breach, errors     |
| info       | `0.55 0.11 250`   | `0.68 0.11 250`   | Neutral telemetry, links            |
| muted      | `0.92 0 0`        | `0.21 0.008 285`  | Stopped badge, secondary text       |
| surface-inset | `0.93 0.004 280` | `0.14 0.007 285` | Recessed telemetry wells, table head |
| track      | `0.9 0.004 280`   | `0.24 0.01 285`   | Memory bar track                    |

## Typography
- Display: Space Grotesk — panel titles, canister names, section headers
- Body: DM Sans — labels, hints, descriptions, table cells
- Mono: Geist Mono — cycle balances, burn rate, runway, memory bytes, principal IDs, ICP rate
- Scale: hero `text-3xl md:text-4xl font-bold tracking-tight`, section `text-lg font-semibold`, label `text-[0.6875rem] font-semibold uppercase tracking-widest`, body `text-sm`, figure `font-mono text-2xl tabular-nums`

## Elevation & Depth
Flat by default: borders and surface-inset wells define structure; only stat cards and popovers lift, via `shadow-card-light` / `shadow-card-dark`.

## Structural Zones

| Zone              | Background            | Border     | Notes                                                        |
| ----------------- | --------------------- | ---------- | ------------------------------------------------------------ |
| Header            | `bg-card`             | `border-b` | Canister switcher, aggregate cycle total, live rate, theme toggle |
| Canister rail     | `bg-sidebar`          | `border-r` | Add / switch canisters; active row uses `bg-sidebar-accent` + primary left rule |
| Fleet overview    | `bg-background`       | —          | Stat-card grid: total cycles, aggregate burn rate, min runway |
| Comparison table  | `bg-card`             | `border`   | Side-by-side canisters: status, cycles, burn, runway, memory bar |
| Canister detail   | `bg-card`             | `border`   | Memory breakdown, settings rows, Re-up CTA                   |
| Footer            | `bg-muted/40`         | `border-t` | ICP→Cycles rate attribution, NNS link                        |

## Spacing & Rhythm
Base unit 4px; cards `p-4`, panels `p-5`, table cells `px-3 py-2.5`, settings rows `py-3`, section gaps `1.5rem`, grid gap `1rem`.

## Component Patterns
- Buttons: solid, `rounded-md`; primary = indigo, Re-up = accent emerald with external-link affordance; hover lifts shadow only
- Cards: `rounded-lg`, `bg-card`, 1px `border-border`; stat cards show uppercase label → mono figure → sub-metric
- Badges: `status-badge` pill; running = success tint, stopping = warning tint, stopped = muted; text label always, never icon-only
- Memory bar: `memory-bar` track with `memory-heap` / `memory-stable` / `memory-wasm` segments + `memory-legend` dots
- Tables: `data-table` with inset header, hover row tint, right-aligned mono numerics
- Settings rows: label + hint left, mono value / control right, hairline dividers

## Motion
- Entrance: `animate-fade-in-up` on stat cards, staggered ~40ms
- Live data: `animate-pulse-live` dot beside the ICP→Cycles rate; memory bars `animate-bar-grow` on load
- Hover: `transition-smooth` background tint and shadow lift; no scale on dense rows
- No decorative animation beyond state communication

## Constraints
- Dark mode default; light mode fully supported via `.dark` class toggle
- Max content width 1400px; canister rail collapses under `lg:`
- Mobile-first: `sm:` 640px, `md:` 768px, `lg:` 1024px
- All colors via OKLCH CSS variables; no hex, no arbitrary color classes
- No credits or exchange-rate-for-credits concepts anywhere; only the live ICP→Cycles rate from the CMC
- Re-up actions link out to the official NNS canister management UI; no in-app top-up
- No historical cycle/burn-rate trend charts

## Signature Detail
The segmented memory proportion bar: heap (indigo), stable (emerald), wasm (amber) in one track with mono byte labels — a compact, repeatable visual signature that turns a fleet of canisters into a scannable memory profile.
