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
    analytics/              # Service logic (5 suites, 77 tests)
      overview.test.ts
      agents.test.ts
      teams.test.ts
      insights.test.ts
      trends.test.ts
    api/                    # API utility (1 suite)
      api-handler.test.ts
  integration/
    api/                    # Route response shape validation (5 suites, 32 tests)
      overview.test.ts
      agents.test.ts
      teams.test.ts
      insights.test.ts
      trends.test.ts
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
    hooks/                    # React Query hooks (2 suites)
      use-date-range.test.tsx
      use-analytics.test.tsx
    components/               # Component rendering with mocked data
      charts/                 # Chart components (5 suites)
      dashboard/              # KPI card, section, sidebar nav, etc. (8 suites)
      tables/                 # Data tables (3 suites)
      insights/               # Insight cards (1 suite)
      layout/                 # Dashboard layout (1 suite)
      pages/                  # Page-level rendering (4 suites)
  e2e/                        # Full page rendering with fetch-level mocking (5 suites)
    helpers.tsx
    overview.e2e.test.tsx
    agents.e2e.test.tsx
    teams.e2e.test.tsx
    optimization.e2e.test.tsx
    navigation.e2e.test.tsx
```

## Coverage Summary

| Category | Suites | Tests |
|----------|--------|-------|
| Analytics logic | 5 | 77 |
| Components (charts, tables, insights, dashboard) | 12 | 83 |
| Pages | 4 | 26 |
| Layout & nav | 2 | 25 |
| Hooks & utilities | 9 | 66 |
| API integration | 5 | 32 |
| E2E (fetch-level) | 5 | 33 |
| API utility | 1 | 11 |
| **Total** | **44** | **395** |

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
- E2E page rendering with fetch-level mocking (all 4 pages + navigation)

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
E2E tests mock `global.fetch` and wrap pages with real `QueryClient + DateRangeProvider`, testing the full data flow:
```tsx
const fetchMock = jest.fn();
global.fetch = fetchMock;
fetchMock.mockImplementation((url: string) => {
  if (url.includes('/api/analytics/overview')) return Promise.resolve(jsonResponse(data));
  ...
});
render(<OverviewPage />, { wrapper: createE2EWrapper() });
```

## Running Tests

```bash
npm test                 # Run all tests once
npm run test:unit        # Unit tests only (frontend + backend)
npm run test:integration # API integration tests only
npm run test:e2e         # E2E page tests only
npm run test:watch       # Watch mode for TDD
npm run test:coverage    # Generate coverage report
```
