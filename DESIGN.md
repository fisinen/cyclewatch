# Design Brief — CycleWatch Monitoring Dashboard

## Tone & Purpose
Dark-mode fintech command center for ICP canister operators monitoring cycle balances across multiple canisters. Confident, precise, operational. Surface burn-rate and threshold risk without decoration.

## Visual Direction
Command-and-control aesthetic. Dark mode primary. Refined minimalism with institutional credibility. Inspired by trading dashboards and infra-monitoring tools (Linear, Vercel, Grafana). Information density over flourish.

## Palette (OKLCH L C H)

| Token | Light | Dark | Usage |
|:------|:------|:------|:------|
| **Primary** | `0.42 0.095 285` (Deep Indigo) | `0.68 0.12 280` | CTAs, headers, active states |
| **Accent** | `0.65 0.17 165` (Emerald) | `0.72 0.18 165` | Healthy status, positive deltas |
| **Destructive** | `0.55 0.22 25` (Red) | `0.62 0.24 25` | Critical status, disconnect |
| **Secondary** | `0.5 0.01 280` (Slate) | `0.28 0.01 280` | Hierarchy, muted text |
| **Background** | `0.96 0` | `0.12 0` | Page canvas |
| **Card** | `0.99 0` | `0.16 0` | Elevated surfaces |
| **Status Healthy** | `0.92 0.13 165` | `0.28 0.12 165` | Balance above threshold |
| **Status Warning** | `0.92 0.14 75` | `0.32 0.13 75` | Below warning threshold |
| **Status Critical** | `0.92 0.16 25` | `0.34 0.16 25` | Below critical threshold |
| **Status Stopped** | `0.92 0.005 280` | `0.24 0.01 280` | Canister not running |
| **Chart Line** | `0.42 0.095 285` | `0.72 0.18 165` | Balance history line |
| **Chart Area** | `0.68 0.12 280` | `0.42 0.095 285` | Area fill under line |
| **Chart Grid** | `0.88 0` | `0.24 0` | Gridlines, axis |

## Typography
- **Display**: Space Grotesk — headers, titles, large figures
- **Body**: DM Sans — body text, labels, descriptions
- **Mono**: Geist Mono — canister IDs, cycle amounts, timestamps

## Structural Zones

| Zone | Treatment | Purpose |
|:-----|:----------|:--------|
| Header | `bg-card` with `border-b`, brand wordmark + backend canister ID (mono) + connection status badge | Identity anchor, backend status |
| Aggregate Summary | `bg-card` strip with `border`, 4 stat tiles: total canisters, total cycles, at-risk count, projected depletion | Fleet-wide health at a glance |
| Canister Card Grid | Responsive grid of `bg-card` cards, each showing canister ID (mono), cycle balance, burn rate, status badge, mini sparkline | Per-canister monitoring, quick scan |
| Canister Detail View | Expanded `bg-card` panel with full balance history chart (line + area), threshold config, projected depletion countdown, top-up recommendation | Deep inspection of single canister |
| Connection Management | `bg-muted/30` section with `border-t`, add-canister form (ID input + connect CTA), connected canisters list with disconnect actions | Onboard/reconnect canisters post-redeploy |

## Elevation & Depth
- Cards: `shadow-subtle` resting, `shadow-card-hover` on hover lift
- Detail view: `shadow-elevated` to distinguish from grid
- Modals: dark overlay `rgba(0,0,0,0.5)` with centered `bg-card`

## Spacing & Rhythm
- Base unit: 4px (0.25rem)
- Card padding: `1.5rem`, section gap: `2rem`
- Grid gap: `1rem` (mobile), `1.5rem` (desktop)
- Max content width: 1200px

## Component Patterns
- Buttons: solid fill, no outlines. Primary = indigo, secondary = slate, danger = destructive
- Status badges: `.status-badge` + `.status-healthy/.status-warning/.status-critical/.status-stopped`, label only (no icons)
- Numeric displays: mono font, high contrast, right-aligned in cards
- Charts: line + area combo, `--chart-line` stroke, `--chart-area` fill, `--chart-grid` axis
- Canister IDs: mono, truncated with copy affordance

## Motion
- `transition-smooth` on all interactive elements
- Card hover: `shadow-card-hover` lift, 200ms
- Balance history chart: `chart-draw` line draw-in on mount (800ms)
- Detail view open: `slide-up` + `fade-in`
- Threshold breach: status badge color transition, no flashing

## Constraints
- Dark mode default; light mode supported via class toggle
- Max content width: 1200px, mobile-first responsive (`sm:` 640, `md:` 768, `lg:` 1024)
- No arbitrary hex values; all colors via CSS variables
- Status indicators: badges with label only, no icons
- No Slack/Discord alerts, auto top-up, Caffeine account linking, credit balance, exchange rate, fund-with-cycles, or funding history

## Signature Detail
Fleet-wide depletion projection in the Aggregate Summary — "Total cycles: X · At-risk: N · Projected fleet depletion: T days" — gives operators the single number that matters: how long before something runs dry.
