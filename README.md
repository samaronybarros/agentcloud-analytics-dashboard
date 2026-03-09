# AgentCloud Analytics Dashboard

A production-quality analytics dashboard that helps engineering organizations monitor, optimize, and control their cloud-hosted AI agent fleet.

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next%2Ejs-15-000000?logo=nextdotjs&logoColor=white) ![Tests](https://img.shields.io/badge/tests-329%20passing-brightgreen) ![TDD](https://img.shields.io/badge/workflow-TDD-blue) ![License](https://img.shields.io/badge/license-MIT-green)

<!-- TODO: Replace with actual screenshots -->
<!-- ![Dashboard Overview](docs/assets/screenshot-overview.png) -->
<!-- ![Optimization Insights](docs/assets/screenshot-optimization.png) -->

---

## Quick Start

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

No external services, databases, or API keys required — all data is deterministically mocked.

---

## What It Does

The dashboard answers five core questions for org admins, engineering managers, and platform teams:

| Page             | Question                    | Key Metrics                                                              |
| ---------------- | --------------------------- | ------------------------------------------------------------------------ |
| **Overview**     | Are teams adopting agents?  | 8 KPI cards + trend charts (runs, latency, cost)                         |
| **Agents**       | Which agents are reliable?  | Agent leaderboard, failure taxonomy breakdown                            |
| **Teams**        | Where is cost concentrated? | Usage by team, cost by model, top users                                  |
| **Optimization** | Where can we improve?       | Insight cards — high-cost/low-success, degraded latency, rising failures |

All pages support date range filtering (7d / 14d / 30d / all) and include loading, error, and empty states.

---

## Available Scripts

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Start development server at localhost:3000 |
| `npm run build`         | Create production build                    |
| `npm start`             | Serve production build                     |
| `npm test`              | Run all tests (38 suites, 329 tests)       |
| `npm run test:watch`    | Run tests in watch mode (TDD)              |
| `npm run test:coverage` | Generate coverage report                   |
| `npm run lint`          | Run ESLint                                 |

---

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

| Layer         | Technology                      |
| ------------- | ------------------------------- |
| Framework     | Next.js 15 (App Router)         |
| Language      | TypeScript (strict, zero `any`) |
| Styling       | Tailwind CSS v4                 |
| Data fetching | React Query v5                  |
| Charts        | Recharts 2                      |
| Testing       | Jest + React Testing Library    |

### Project Structure

```
app/
  api/analytics/        # 5 API routes (overview, agents, teams, insights, trends)
  dashboard/            # 4 pages + layout with active nav highlighting
components/
  charts/               # 5 chart components (Recharts wrappers)
  dashboard/            # KPI card, section header, sidebar nav, date picker
  tables/               # 3 table components
  insights/             # Severity-styled insight cards
lib/
  analytics/            # Pure metric logic (overview, agents, teams, insights, trends)
  mock-data/            # Deterministic entities (agents, runs, users, seeded PRNG)
  hooks/                # React Query hooks
  utils/                # Formatting, date filtering, API handler
tests/
  unit/                 # 33 suites — analytics, components, pages, hooks, utils
  integration/          # 5 suites — API route response shape validation
docs/                   # Product specs, decisions, workflow docs
```

### Key Design Decisions

1. **Business logic in `lib/analytics/`** — never in components or pages. Charts render prepared data.
2. **API routes are thin** — call analytics functions, shape responses. No business logic.
3. **Deterministic mock data** — seeded PRNG (seed=42), same output every run. 10 agents, 8 users, 500 runs across 30 days.
4. **TDD workflow** — tests written before implementation for all analytics logic and components.
5. **Insight cards over raw charts** — the Optimization page surfaces actionable conclusions, not just data.

See [`docs/product-decisions.md`](docs/product-decisions.md) for the full decision log (23 documented decisions).

---

## Test Coverage

| Category                                         | Suites | Tests   |
| ------------------------------------------------ | ------ | ------- |
| Analytics logic                                  | 5      | 64      |
| Components (charts, tables, insights, dashboard) | 12     | 76      |
| Pages                                            | 4      | 26      |
| Layout & nav                                     | 2      | 25      |
| Hooks & utilities                                | 8      | 48      |
| API integration                                  | 5      | 32      |
| **Total**                                        | **38** | **329** |

Tests are deterministic, fast (~2s), and isolated. No network, no database.

```bash
npm test               # run once
npm run test:watch     # TDD mode
npm run test:coverage  # with coverage report
```

---

## Mock Data

All data is generated from a seeded PRNG (mulberry32, seed=42):

- **10 agents** across 4 teams (Platform, Backend, Data, Frontend) using 4 models
- **8 users** with realistic names and roles
- **500 runs** over 30 days with ~75% success, ~15% error, ~10% retry distribution

The dataset supports meaningful aggregation for adoption, reliability, performance, and cost analysis. See [PD-014 through PD-017](docs/product-decisions.md) for data generation decisions.

---

## Documentation

| Document                                                       | Description                                     |
| -------------------------------------------------------------- | ----------------------------------------------- |
| [`docs/requirements-spec.md`](docs/requirements-spec.md)       | Product requirements and user personas          |
| [`docs/user-stories.md`](docs/user-stories.md)                 | 42 user stories mapped to personas and features |
| [`docs/technical-spec.md`](docs/technical-spec.md)             | Architecture, stack, data flow                  |
| [`docs/testing-spec.md`](docs/testing-spec.md)                 | TDD approach and test organization              |
| [`docs/product-decisions.md`](docs/product-decisions.md)       | 23 product decisions with rationale             |
| [`docs/roadmap.md`](docs/roadmap.md)                           | Completed, in-progress, and planned work        |
| [`docs/ai-workflow.md`](docs/ai-workflow.md)                   | How AI was used, what was human-led             |
| [`docs/development-workflow.md`](docs/development-workflow.md) | Phase-based workflow with mermaid diagram       |

---

## AI-Assisted Development

This project was built with Claude Code following a disciplined workflow:

- **Human-led:** Architecture, product requirements, stack choices, quality standards, and all product decisions
- **AI-assisted:** Implementation scaffolding, test generation, documentation drafting
- **Guardrails:** CLAUDE.md enforces TDD, inspect-before-code, minimal scope, and architectural boundaries

See [`docs/ai-workflow.md`](docs/ai-workflow.md) for details.

---

## License

MIT
