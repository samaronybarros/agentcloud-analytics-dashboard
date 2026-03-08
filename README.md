# AgentCloud Analytics Dashboard

A production-quality organizational analytics dashboard for cloud-hosted AI agents. Built as a take-home assignment demonstrating product thinking, engineering quality, and TDD discipline.

## Quick Start

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # 28 suites, 242 tests
npm run test:coverage
```

No external services required — all data is deterministically mocked.

## What It Does

The dashboard helps engineering organizations understand their AI agent fleet across four dimensions:

| Page | Purpose |
|------|---------|
| **Overview** | Adoption and health at a glance — 8 KPI cards + trend charts |
| **Agents** | Agent-level reliability — leaderboard, failure taxonomy |
| **Teams** | Team-level visibility — usage by team, cost by model, top users |
| **Optimization** | Actionable insights — high-cost/low-success agents, degraded latency, rising failures |

## Architecture

```
Mock Data (lib/mock-data)
  → Analytics Logic (lib/analytics)
    → API Routes (app/api/analytics)
      → React Query Hooks (lib/hooks)
        → Components (components/)
          → Pages (app/dashboard/)
```

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict, zero `any`) |
| Styling | Tailwind CSS v4 |
| Data fetching | React Query v5 |
| Charts | Recharts 2 |
| Testing | Jest + React Testing Library |

### Key Design Decisions

1. **Business logic in `lib/analytics/`** — never in components or pages. Charts render prepared data.
2. **API routes are thin** — call analytics functions, shape responses. No business logic.
3. **Deterministic mock data** — seeded PRNG (seed=42), same output every run. 10 agents, 8 users, 500 runs across 30 days.
4. **TDD workflow** — tests written before implementation for all analytics logic and components.
5. **Insight cards over raw charts** — the Optimization page surfaces actionable conclusions, not just data.

### Project Structure

```
app/
  api/analytics/        # 5 API routes (overview, agents, teams, insights, trends)
  dashboard/            # 4 pages + layout with active nav highlighting
components/
  charts/               # 5 chart components (Recharts wrappers)
  dashboard/            # KPI card, section header, sidebar nav
  tables/               # 3 table components
  insights/             # Severity-styled insight cards
lib/
  analytics/            # Pure metric logic (overview, agents, teams, insights, trends)
  mock-data/            # Deterministic entities (agents, runs, users, seeded PRNG)
  hooks/                # React Query hooks
  utils/                # Formatting helpers
tests/
  unit/                 # 23 suites — analytics, components, pages, utils
  integration/          # 5 suites — API route response shape validation
```

## Test Coverage

| Category | Suites | Tests |
|----------|--------|-------|
| Analytics logic | 5 | 64 |
| Components (charts, tables, insights, dashboard) | 12 | 76 |
| Pages | 4 | 26 |
| Layout & nav | 2 | 25 |
| Utilities | 1 | 16 |
| API integration | 5 | 32 |
| **Total** | **28** | **242** |

Tests are deterministic, fast (~2s), and isolated. No network, no database.

## Mock Data

All data is generated from a seeded PRNG (mulberry32, seed=42):

- **10 agents** across 4 teams (Platform, Backend, Data, Frontend) using 4 models
- **8 users** with realistic names and roles
- **500 runs** over 30 days with ~75% success, ~15% error, ~10% retry distribution

The dataset supports meaningful aggregation for adoption, reliability, performance, and cost analysis.

## Documentation

- [`docs/requirements-spec.md`](docs/requirements-spec.md) — Product requirements and user personas
- [`docs/technical-spec.md`](docs/technical-spec.md) — Architecture, stack, data flow
- [`docs/testing-spec.md`](docs/testing-spec.md) — TDD approach and test organization
- [`docs/product-decisions.md`](docs/product-decisions.md) — Key product decisions with rationale
- [`docs/ai-workflow.md`](docs/ai-workflow.md) — How AI was used, what was human-led
- [`docs/development-workflow.md`](docs/development-workflow.md) — Phase-based workflow with mermaid diagram

## AI-Assisted Development

This project was built with Claude Code following a disciplined workflow:

- **Human-led:** Architecture, product requirements, stack choices, quality standards, and all product decisions
- **AI-assisted:** Implementation scaffolding, test generation, documentation drafting
- **Guardrails:** CLAUDE.md enforces TDD, inspect-before-code, minimal scope, and architectural boundaries
