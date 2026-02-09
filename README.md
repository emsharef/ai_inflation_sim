# AI Inflation Impact Simulator

An interactive dashboard that models how AI adoption could affect U.S. consumer price inflation (CPI-U) across ~60 spending categories, under different adoption scenarios and time horizons.

## Overview

The simulator projects AI's impact on inflation by combining:

- **BLS CPI data** — Real category weights and historical rates from the Bureau of Labor Statistics
- **AI impact modifiers** — 500+ hand-researched modifier values mapping AI effects to individual CPI components, each with explanations and academic citations
- **Scenario modeling** — Four scenarios ranging from no impact to transformative, grounded in published research from Acemoglu (MIT), IMF, Penn Wharton, and Goldman Sachs
- **Time horizons** — 1-year, 3-year, and 10-year projections with exponential mean-reversion toward the Fed's 2% target

## Scenarios

| Scenario | Source | 10-Year CPI Impact |
|---|---|---|
| **Baseline** | No AI | 0pp (reference) |
| **Conservative** | Acemoglu (MIT/NBER) | -0.3 to -0.6pp |
| **Moderate** | Penn Wharton / IMF | -0.5 to -1.0pp |
| **Transformative** | Goldman Sachs / Brynjolfsson | -1.0 to -1.5pp |

## Pages

- **Dashboard** — Summary cards, inflation trajectory chart, waterfall breakdown by major CPI group, and a 3-level CPI component tree browser
- **Scenarios** — Side-by-side comparison of all scenarios with key assumptions and projected impacts
- **Explorer** — Deep-dive into individual CPI components with per-scenario narratives, cross-scenario comparison, and weight shift analysis

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router) with React 19 and TypeScript 5
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Recharts 3](https://recharts.org/) for data visualization
- Dark theme with JetBrains Mono font

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Dashboard (main page)
│   ├── scenarios/        # Scenario comparison page
│   ├── explorer/         # CPI component deep-dive
│   └── api/bls/          # BLS API proxy route
├── components/           # React components by feature area
│   ├── charts/           # Recharts visualizations
│   ├── cpi/              # CPI tree browser & detail cards
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Navbar
│   └── scenarios/        # Scenario cards & comparison
├── data/                 # Static data definitions
│   ├── cpiComponents.ts  # 3-level CPI hierarchy (~60 leaves)
│   ├── aiImpactModifiers.ts  # 500+ AI impact modifiers with narratives
│   └── scenarios.ts      # Scenario definitions
├── hooks/                # React hooks (useScenario, useBlsData)
└── lib/                  # Pure logic (calculations, formatters, types)
```

## License

MIT
