# Testing Specification

## Approach

This project uses **Test-Driven Development (TDD)**. Tests are written before implementation.

## Test Runner

- **Jest** with `ts-jest` for TypeScript support
- **React Testing Library** for component tests
- **jest-environment-jsdom** for DOM simulation

## Test Organization

```
tests/
  unit/              # Pure logic — no React, no DOM
    analytics/       # Metric calculations
    utils/           # Utility functions
  integration/       # API routes, component + data flow
    api/             # API response shape tests
    components/      # Component rendering with data
  e2e/               # Full page smoke tests
```

## Priority Coverage

### Highest Priority (must have)
- Overview KPI aggregation (total runs, success rate, latency, cost)
- Agent leaderboard metrics (per-agent runs, success rate, avg latency)
- Failure taxonomy aggregation
- API route response shape validation

### Medium Priority (should have)
- Insight generation logic
- Team-level aggregation
- Date range filtering behavior
- Edge cases (empty data, single agent, all failures)

### Lower Priority (nice to have)
- Presentational component rendering
- Chart axis labels and formatting

## Test Conventions

- Tests must be **deterministic** — no random data, no Date.now()
- Tests must be **fast** — no network, no database, no file I/O
- Tests must be **isolated** — no shared mutable state between tests
- Tests must be **readable** — clear names, arrange/act/assert structure

## Naming Convention

```
describe('computeOverviewKPIs', () => {
  it('returns correct total runs count', () => { ... });
  it('returns zero success rate when no runs exist', () => { ... });
});
```

## Running Tests

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode for TDD
npm run test:coverage # Generate coverage report
```
