# AgentCloud Analytics Dashboard

A production-quality analytics dashboard that helps engineering organizations monitor, optimize, and control their cloud-hosted AI agent fleet.

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next%2Ejs-15-000000?logo=nextdotjs&logoColor=white) ![Tests](https://img.shields.io/badge/tests-599%20passing-brightgreen) ![TDD](https://img.shields.io/badge/workflow-TDD-blue) ![License](https://img.shields.io/badge/license-MIT-green)

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

| Page                | Question                          | Key Metrics                                                              |
| ------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| **Overview**        | Are teams adopting agents?        | 8 KPI cards + trend charts (runs, day-of-week, latency, cost)            |
| **Agents**          | Which agents are reliable?        | Agent leaderboard, cost vs reliability scatter, failure taxonomy          |
| **Teams**           | Where is cost concentrated?       | Usage by team (with success/latency), team comparison, cost by model, top users |
| **Models**          | Which models perform best?        | Model performance table — success rate, latency, cost per token, throughput |
| **Optimization**    | Where can we improve?             | Insight cards — high-cost/low-success, degraded latency, rising failures |
| **Alerts**          | What needs attention now?         | Alert cards — threshold breaches, anomalies, critical events by severity |
| **Troubleshooting** | Why are agents failing?           | Error timeline, agent error breakdown, failure pattern analysis          |

All pages support date range filtering (7d / 14d / 30d / all), role-based views (Org Admin / Eng Manager / Platform Engineer), and include loading, error, and empty states.

---

## Available Scripts

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Start development server at localhost:3000 |
| `npm run build`         | Create production build                    |
| `npm start`             | Serve production build                     |
| `npm test`              | Run all tests (66 suites, 599 tests)       |
| `npm run test:unit`     | Run unit tests only (47 suites)            |
| `npm run test:integration` | Run API integration tests only (8 suites) |
| `npm run test:e2e`      | Run E2E page tests only (8 suites)         |
| `npm run test:watch`    | Run tests in watch mode (TDD)              |
| `npm run test:coverage` | Generate coverage report                   |
| `npm run lint`          | Run ESLint                                 |

---

## Architecture

```
Mock Data (app/api/_mock-data)
  → Repositories (app/api/analytics/*/repository)
    → Services (app/api/analytics/*/service)
      → Controllers (app/api/analytics/*/controller)
        → API Routes (app/api/analytics/*/route)
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
  api/
    _mock-data/           # Deterministic entities (agents, runs, users, seeded PRNG)
    analytics/
      overview/           # repository → service → controller → route (same for each context)
      agents/
      teams/
      trends/
      insights/
      models/
      alerts/
      troubleshooting/
    __tests__/            # Backend tests (17 suites — analytics unit + API integration + API utility)
      unit/analytics/
      unit/api/
      integration/api/
  dashboard/              # 7 pages + layout with role-based nav highlighting
components/
  charts/                 # 9 chart components (Recharts wrappers)
  dashboard/              # KPI card, section header, sidebar nav, date picker, role selector
  tables/                 # 5 table components (with role-aware column visibility)
  insights/               # Severity-styled insight cards
lib/
  hooks/                  # React Query hooks + role context (useRole)
  utils/                  # Formatting, date filtering, API handler
  types.ts                # Shared domain and API response types
  role-visibility.ts      # Role-based page/section visibility config
__tests__/                # Frontend tests (49 suites — components, pages, hooks, utils, e2e)
  unit/
  e2e/                    # 8 suites — fetch-level page integration tests
docs/                     # Product specs, decisions, workflow docs
```

### Key Design Decisions

1. **DDD-inspired backend** — each API context (overview, agents, teams, trends, insights, models, alerts, troubleshooting) is a self-contained vertical slice with its own repository, service, and controller. No cross-context dependencies.
2. **Business logic in services** — never in components, pages, or route files. Charts render prepared data.
3. **Repository pattern** — data access is isolated behind repositories, making it straightforward to swap mock data for a real database.
4. **API routes are thin** — delegate to controllers, which orchestrate services. No business logic in route files.
5. **Deterministic mock data** — seeded PRNG (seed=42), same output every run. 10 agents, 8 users, 500 runs across 30 days.
6. **TDD workflow** — tests written before implementation for all analytics logic and components.
7. **Insight cards over raw charts** — the Optimization page surfaces actionable conclusions, not just data.
8. **Role-based views** — a "Viewing as" selector lets users switch between Org Admin, Eng Manager, and Platform Engineer personas. Each role sees different pages, KPIs, and table columns based on a declarative visibility config. Cost-sensitive data is restricted to leadership roles.

See [`docs/product-decisions.md`](docs/product-decisions.md) for the full decision log (25 documented decisions).

---

## Test Coverage

| Category                                                  | Suites | Tests   |
| --------------------------------------------------------- | ------ | ------- |
| Analytics logic                                           | 8      | 111     |
| Components (charts, tables, insights, alerts, dashboard)  | 24     | 167     |
| Pages                                                     | 7      | 52      |
| Layout & nav                                              | 2      | 28      |
| Hooks, utilities & role visibility                        | 9      | 126     |
| API integration                                           | 8      | 60      |
| E2E (fetch-level)                                         | 8      | 51      |
| API utility                                               | 1      | 6       |
| **Total**                                                 | **66** | **599** |

Tests are deterministic, fast (~3s), and isolated. No network, no database.

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
