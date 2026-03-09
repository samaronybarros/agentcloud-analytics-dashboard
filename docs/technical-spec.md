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

The backend follows a DDD-inspired structure where each API context is a self-contained vertical slice with repository, service, and controller layers. No cross-context dependencies.

```
app/
  api/
    _mock-data/             # Deterministic seed data (shared across contexts)
      seed.ts               # Seeded PRNG (mulberry32)
      agents.ts             # Agent entities
      runs.ts               # Run entities (500 runs, 30 days)
      users.ts              # User entities
      index.ts              # Barrel export
    analytics/
      overview/             # Each context follows the same layered pattern:
        overview.repository.ts  # Data access — wraps mock data, swappable for DB
        overview.service.ts     # Business logic — KPI aggregation
        overview.controller.ts  # Request parsing → service → response
        route.ts                # Thin — delegates to controller via withErrorHandler
      agents/               # Agent leaderboard + failure taxonomy
      teams/                # Team usage + cost by model + top users
      trends/               # Daily runs, latency, cost time series
      insights/             # Insight generation (thresholds, severity)
    __tests__/              # Backend tests (11 suites, 128 tests)
      unit/analytics/       # Service logic unit tests (5 suites, 77 tests)
      unit/api/             # API utility tests (1 suite, 11 tests)
      integration/api/      # Route response shape validation (5 suites, 40 tests)
  dashboard/                # Page composition — thin, delegates to components
    page.tsx                # Overview
    agents/page.tsx         # Agent analytics
    teams/page.tsx          # Team analytics
    optimization/page.tsx   # Insights & optimization

components/                 # Reusable presentational UI
  charts/                   # Chart wrappers (Recharts)
  dashboard/                # Shared dashboard UI (KPI cards, section headers)
  tables/                   # Data tables
  insights/                 # Insight cards

lib/                        # Shared frontend concerns — no business logic
  hooks/                    # React Query hooks
  utils/                    # Formatting, date filtering, API handler
  types.ts                  # Shared domain and API response types

__tests__/                  # Frontend tests (33 suites, 267 tests)
  unit/                     # Components, pages, hooks, utils (28 suites)
  e2e/                      # Full page rendering with fetch-level mocking (5 suites, 33 tests)
```

## Data Flow

```
Mock Data (app/api/_mock-data)
  → Repositories (app/api/analytics/*/repository)
    → Services (app/api/analytics/*/service)
      → Controllers (app/api/analytics/*/controller)
        → API Routes (app/api/analytics/*/route)
          → React Query hooks (lib/hooks)
            → Components (components/)
              → Pages (app/dashboard/)
```

## Key Decisions

1. **DDD-inspired backend** — each API context (overview, agents, teams, trends, insights) owns its full vertical slice. No shared analytics module.
2. **Business logic in services** — never in components, pages, or route files. Charts render prepared data.
3. **Repository pattern** — data access isolated behind per-context repositories. Currently wraps mock data; designed to swap for database queries without changing services.
4. **No cross-context dependencies** — teams doesn't import from agents, trends doesn't know about insights. Each context can evolve independently.
5. **API routes are thin** — delegate to controllers via `withErrorHandler`. No business logic.
6. **Mock data is deterministic** — seeded, no `Math.random()`. Same output every run.
7. **TDD** — tests written before implementation for all analytics logic.
8. **No unnecessary abstractions** — no state management library, no custom design system, no ORM.

## TypeScript Conventions

- Strict mode enabled
- Explicit interfaces for domain entities (Agent, Run, User)
- Typed return values on all exported functions
- Discriminated unions for status types
- No `any`, no unsafe casts
