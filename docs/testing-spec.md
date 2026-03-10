# Testing Specification

## Approach

This project uses **Test-Driven Development (TDD)**. Tests are written before implementation.

## Test Runner

- **Jest** with `ts-jest` for TypeScript support
- **React Testing Library** for component tests
- **jest-environment-jsdom** for DOM simulation (unit/component tests)
- **jest-environment-node** for API integration tests (via `@jest-environment` docblock)

## Test Organization

Tests are split between backend and frontend, co-located with the code they test.

### Backend tests (`app/api/__tests__/`)

```
app/api/__tests__/
  unit/
    analytics/              # Service logic (8 suites, 111 tests)
      overview.test.ts
      agents.test.ts
      teams.test.ts
      insights.test.ts
      trends.test.ts
      models.test.ts
      alerts.test.ts
      troubleshooting.test.ts
    api/                    # API utility + middleware (3 suites)
      api-handler.test.ts   # Error handling, logging, rate limiting, request IDs
      api-logger.test.ts    # Structured JSON logging
      rate-limiter.test.ts  # Token bucket rate limiting
    authz/                  # Authorization (2 suites)
      role-auth.test.ts     # Role-based access control unit tests
      response-redaction.test.ts  # Field-level redaction unit tests
  integration/
    api/                    # Route response shape validation (8 suites, 60 tests)
      overview.test.ts
      agents.test.ts
      teams.test.ts
      insights.test.ts
      trends.test.ts
      models.test.ts
      alerts.test.ts
      troubleshooting.test.ts
    authz/                  # Authorization integration tests
      authz.test.ts         # End-to-end role gating + redaction across endpoints
```

### Frontend tests (`__tests__/`)

```
__tests__/
  setup.ts                    # @testing-library/jest-dom setup
  unit/
    utils/                    # Utility functions (4 suites)
      format.test.ts
      date-filter.test.ts
      build-url.test.ts
      parse-date-params.test.ts
    hooks/                    # React Query hooks + role context (3 suites)
      use-date-range.test.tsx
      use-analytics.test.tsx
      use-role.test.tsx
    lib/                      # Shared library tests (1 suite)
      role-visibility.test.ts
    components/               # Component rendering with mocked data
      charts/                 # Chart components (9 suites)
      dashboard/              # KPI card, section, sidebar nav, etc. (9 suites)
      tables/                 # Data tables (5 suites)
      insights/               # Insight cards (1 suite)
      alerts/                 # Alert card (1 suite)
      layout/                 # Dashboard layout (1 suite)
      pages/                  # Page-level rendering (7 suites)
  e2e/                        # Full page rendering with fetch-level mocking (8 suites)
    helpers.tsx
    overview.e2e.test.tsx
    agents.e2e.test.tsx
    teams.e2e.test.tsx
    optimization.e2e.test.tsx
    navigation.e2e.test.tsx
    models.e2e.test.tsx
    alerts.e2e.test.tsx
    troubleshooting.e2e.test.tsx
```

## Coverage Summary

| Category | Suites | Tests |
|----------|--------|-------|
| Analytics logic | 8 | 111 |
| Components (charts, tables, insights, alerts, dashboard) | 24 | 167 |
| Pages | 7 | 52 |
| Layout & nav | 2 | 28 |
| Hooks, utilities & role visibility | 9 | 126 |
| API integration | 8 | 60 |
| E2E (fetch-level) | 8 | 51 |
| API utility & middleware (handler, logger, rate limiter) | 3 | — |
| Authorization (role-auth, response-redaction, integration) | 3 | — |
| **Total** | **71** | **697** |

## Priority Coverage

### Highest Priority (implemented)
- Overview KPI aggregation (total runs, success rate, latency, cost)
- Agent leaderboard metrics (per-agent runs, success rate, avg latency)
- Failure taxonomy aggregation
- API route response shape validation
- Trend calculations (daily runs, latency, cost)

### Medium Priority (implemented)
- Insight generation logic (thresholds, severity, unique IDs)
- Team-level aggregation (usage, cost by model, top users)
- Edge cases (empty data, single agent, all failures, boundary values)
- Component rendering with loading/error/empty states

### Lower Priority (implemented)
- Chart component rendering (axes, data series, empty states, formatter functions)
- Active nav highlighting across routes
- Table formatting (color-coded success rates, currency, percentages)
- E2E page rendering with fetch-level mocking (all 7 pages + navigation)

## Test Conventions

- Tests must be **deterministic** — no random data, no Date.now()
- Tests must be **fast** — no network, no database (~2s for full suite)
- Tests must be **isolated** — no shared mutable state between tests
- Tests must be **readable** — clear names, arrange/act/assert structure

## Mocking Strategies

### Recharts
Charts are mocked with inline factory functions to avoid circular requires:
```tsx
jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
  return { ResponsiveContainer: mock('responsive-container'), ... };
});
```

### React Query Hooks
Page tests mock the hook module and control return values per test:
```tsx
jest.mock('@/lib/hooks/use-analytics', () => ({
  useOverviewKPIs: jest.fn(),
}));
```

### Next.js Navigation
Layout tests mock `usePathname` to test active nav highlighting:
```tsx
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));
```

### Recharts prop capture (chart formatter tests)
Chart tests capture props passed to mocked Recharts components to exercise inline formatters:
```tsx
const capturedProps: Record<string, Record<string, unknown>> = {};
jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children, ...props }: { children?: React.ReactNode }) => {
      capturedProps[name] = props;
      return React.createElement('div', { 'data-testid': name }, children);
    };
  return { ... };
});
// Then in tests:
const tickFormatter = capturedProps['x-axis'].tickFormatter as (d: string) => string;
expect(tickFormatter('2026-02-01')).toBe('02-01');
```

### Fetch-level mocking (E2E tests)
E2E tests mock `global.fetch` and wrap pages with real `QueryClient + DateRangeProvider`, mocking `useRole` directly to control the active role during tests:
```tsx
const fetchMock = jest.fn();
global.fetch = fetchMock;
fetchMock.mockImplementation((url: string) => {
  if (url.includes('/api/analytics/overview')) return Promise.resolve(jsonResponse(data));
  ...
});
render(<OverviewPage />, { wrapper: createE2EWrapper() });
```

## Test Taxonomy Clarification

| Label in This Project | What It Actually Tests | Environment | Real Network? | Real Browser? |
|---|---|---|---|---|
| **Unit tests** | Individual functions, services, utilities, component rendering | jsdom / Node | No | No |
| **API integration tests** | Full route handler → controller → service → repository chain | Node (`@jest-environment node`) | No | No |
| **E2E (fetch-level)** | Full page rendering with mocked `global.fetch`, real React Query + providers | jsdom | No (fetch mocked) | No (jsdom) |
| **True browser E2E** | Real browser, real server, real network | Playwright/Cypress | Yes | Yes |

**Important**: The "E2E" tests in this project are **fetch-level integration tests**, not true browser E2E tests. They mock `global.fetch` and render pages in jsdom with real React Query clients. They exercise the full frontend data flow (fetch → hook → component → DOM) but do not test:
- Real HTTP requests to the Next.js server
- Browser rendering, layout, or CSS
- Client-side navigation between pages
- JavaScript hydration behavior

True browser E2E tests are implemented via **Playwright** (config + smoke tests).

## Risk Coverage

### Covered Risks

| Risk | Coverage | Test Type |
|------|----------|-----------|
| Incorrect metric aggregation | High | Unit tests (8 service suites, 111 tests) |
| API response shape regression | High | Integration tests (8 suites, 60 tests) |
| Component rendering with various states | High | Unit tests (24 component suites) |
| Date range filtering logic | High | Unit + integration tests |
| Role visibility configuration | High | Unit tests (role-visibility suite) |
| Hook error/loading state handling | Medium | Unit tests (use-analytics suite) |
| Page-level data flow | Medium | Fetch-level E2E (8 suites) |

### Uncovered Risks

| Risk | Why Uncovered | Impact | Mitigation |
|------|--------------|--------|------------|
| Browser rendering / CSS layout | No real browser tests | Layout bugs visible only in browser | Manual testing, planned Playwright suite |
| Client-side routing transitions | jsdom doesn't support Next.js navigation | Broken nav in production | Manual testing |
| Hydration mismatches | jsdom doesn't hydrate server HTML | Runtime errors in browser | Addressed architecturally (PD-006) |
| API under concurrent load | No load testing | Performance degradation | Planned — not critical for demo |
| Accessibility compliance | No automated a11y testing | WCAG violations | Planned — axe-core integration |
| Server-side authorization | Covered — role-auth, redaction, and integration tests | — | — |
| Cross-browser compatibility | Only jsdom tested | Browser-specific bugs | Manual testing in Chrome/Firefox/Safari |
| Mobile/responsive layout | Responsive sidebar implemented; no visual regression tests | Layout bugs on edge-case viewports | Manual testing + planned Playwright visual tests |

## Running Tests

```bash
npm test                 # Run all tests once
npm run test:unit        # Unit tests only (frontend + backend)
npm run test:integration # API integration tests only
npm run test:e2e         # E2E page tests only (fetch-level, not browser)
npm run test:watch       # Watch mode for TDD
npm run test:coverage    # Generate coverage report
```
