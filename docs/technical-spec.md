# Technical Specification

## Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router) | Server components, API routes, file-based routing |
| Language | TypeScript (strict) | Type safety, zero `any` |
| Styling | Tailwind CSS v4 | Utility-first, no custom CSS overhead |
| Data fetching | @tanstack/react-query v5 | Cache, refetch, loading/error states |
| Charts | Recharts 2 | React-native charting, composable, well-maintained |
| Testing | Jest + React Testing Library | TDD workflow, fast unit tests |

## Architecture

```
app/                    # Next.js App Router
  api/                  # Thin API routes — call lib/analytics, return shaped JSON
  dashboard/            # Page composition — thin, delegates to components
    page.tsx            # Overview
    agents/page.tsx     # Agent analytics
    teams/page.tsx      # Team analytics
    optimization/page.tsx # Insights & optimization

components/             # Reusable presentational UI
  charts/               # Chart wrappers (Recharts)
  dashboard/            # Shared dashboard UI (KPI cards, section headers)
  tables/               # Data tables
  insights/             # Insight cards

lib/                    # Business logic — no React dependencies
  analytics/            # Metric calculations, aggregations, insight generation
    overview.ts         # KPI aggregation
    agents.ts           # Agent-level metrics
    teams.ts            # Team-level metrics
    insights.ts         # Insight generation
  mock-data/            # Deterministic seed data
    agents.ts           # Agent entities
    runs.ts             # Run entities
    users.ts            # User entities
  utils/                # Shared helpers (formatting, math)

tests/                  # Tests organized by concern
  unit/                 # Analytics logic, utilities
  integration/          # API routes, component + data
  e2e/                  # Full page rendering
```

## Data Flow

```
Mock Data (lib/mock-data)
  → Analytics Logic (lib/analytics)
    → API Routes (app/api)
      → React Query hooks
        → Components (components/)
          → Pages (app/dashboard/)
```

## Key Decisions

1. **Business logic in `lib/analytics`** — never in components or pages. Charts render prepared data.
2. **API routes are thin** — they call analytics functions and shape responses. No business logic.
3. **Mock data is deterministic** — seeded, no `Math.random()`. Same output every run.
4. **TDD** — tests written before implementation for all analytics logic.
5. **No unnecessary abstractions** — no state management library, no custom design system, no ORM.

## TypeScript Conventions

- Strict mode enabled
- Explicit interfaces for domain entities (Agent, Run, User)
- Typed return values on all exported functions
- Discriminated unions for status types
- No `any`, no unsafe casts
