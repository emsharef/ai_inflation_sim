# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Next.js development server
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- No test framework is configured

## Tech Stack

- **Next.js 16** (App Router) with React 19, TypeScript 5
- **Tailwind CSS 4** via `@tailwindcss/postcss`
- **Recharts 3** for data visualization
- **JetBrains Mono** font (loaded via `next/font`)
- Path alias: `@/*` maps to `./src/*`

## Architecture

This is an economic simulation dashboard that projects how AI adoption affects CPI (Consumer Price Index) inflation. Users select a **scenario** (baseline/moderate/transformative) and **time horizon** (1yr/3yr/10yr), and all visualizations update accordingly.

### Data Flow

User selects scenario + horizon → `useScenario` hook → passed as props to all components → `calculations.ts` functions compute projections using data from `cpiComponents` + `aiImpactModifiers` → formatted via `formatters.ts` → rendered in Recharts charts and detail cards.

### Key Layers

**`src/data/`** — Static data definitions (no runtime fetching for core projections):
- `cpiComponents.ts` — 3-level CPI hierarchy (8 major groups → classes → ~60 leaf strata) with BLS series IDs and CPI weights
- `aiImpactModifiers.ts` — 540 modifiers (60 leaves × 3 scenarios × 3 horizons), each with inflation impact (pp), weight shift, confidence, explanation, and citations. Looked up via `getModifier(componentId, scenario, horizon)`
- `scenarios.ts` — Three scenario definitions (Conservative/Acemoglu, Moderate/IMF, Transformative/Goldman Sachs)

**`src/lib/`** — Pure logic, no React:
- `calculations.ts` — Core projection engine. `projectComponent()` projects one leaf; `calculateAggregateProjection()` aggregates all leaves with weight rebalancing; `generateTrajectory()` produces monthly chart data. Uses exponential mean-reversion toward Fed's 2.0% target from current 2.7%
- `formatters.ts` — Display helpers (`formatPp`, `getImpactColor`, `getHeatmapBg`, etc.)
- `types.ts` — All TypeScript interfaces (`ScenarioId`, `HorizonId`, `CpiComponent`, `AiImpactModifier`, `ProjectionResult`, etc.)
- `bls.ts` — BLS API client (batches requests, 25 series max per call)

**`src/hooks/`** — Client state:
- `useScenario` — Holds selected `scenario` and `horizon` (defaults: moderate, 10yr)
- `useBlsData` — Fetches real BLS CPI data via `/api/bls` proxy route (24hr cache)

**`src/components/`** — Organized by feature area:
- `layout/` — Navbar
- `dashboard/` — DashboardOverview (main page), ScenarioSelector, InflationSummaryCard
- `charts/` — InflationTrajectoryChart, WaterfallChart, HeatmapGrid, ScenarioComparisonChart, WeightComparisonChart
- `cpi/` — CpiTreeView (recursive 3-level tree), CpiComponentCard (detail panel), CpiWeightBar
- `scenarios/` — ScenarioCard, ScenarioComparison

### Pages (App Router)

- `/` — Main dashboard with summary cards, trajectory chart, waterfall, heatmap, and CPI tree browser
- `/scenarios` — Side-by-side comparison of all three scenarios
- `/explorer` — Deep-dive into individual CPI components with cross-scenario and cross-horizon analysis
- `/api/bls` (POST) — Proxy to BLS `api.bls.gov` public API

### Styling

Dark theme with CSS variables defined in `globals.css` (e.g., `--bg-primary: #0a0a0f`, `--accent-green: #10b981`). Colors are applied directly via Tailwind utility classes referencing hex values, not the CSS variables in most components.
