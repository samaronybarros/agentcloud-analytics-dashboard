# Known Limitations

This document honestly describes what this dashboard does not do, why each limitation exists, and what the fix would be. This is a demo/interview project with intentional scope boundaries.

---

## Mock Data Only

**What:** All data is generated deterministically at import time. There is no database, no persistence, and no real-time updates. Refreshing the page always shows the same data.

**Why:** The project scope is analytics product thinking and engineering quality, not infrastructure. Mock data keeps the project self-contained and reviewable without environment setup.

**Fix:** Implement the repository layer against a real database (PostgreSQL recommended). The repository pattern is already in place -- each service calls repository functions that currently return mock data. Swap those implementations to query a database. No service or controller changes needed.

---

## Client-Side Role Switching

**What:** Users can switch between Admin, Engineering Manager, and Viewer roles via a dropdown in the header. This controls which pages and data are visible, but it is enforced entirely in the browser. There is no server-side validation.

**Why:** Authentication and authorization were out of scope. The role system demonstrates product thinking about persona-based views without building a full auth stack.

**Fix:** Add an authentication provider (NextAuth.js or similar), store roles in a database, and enforce role checks in API route middleware. The current role-based UI logic can remain but should read from a server-validated session instead of local state.

---

## No Authentication or Multi-Tenancy

**What:** There is no login, no session management, no JWT, no OAuth. The dashboard assumes a single organization context.

**Why:** Auth infrastructure is orthogonal to the analytics product quality being demonstrated. Adding it would shift focus away from metrics, insights, and UX.

**Fix:** Integrate NextAuth.js with a provider (Google, GitHub, or credentials). Add a `tenantId` to all data models. Filter all queries by tenant. See `docs/product-decisions.md` (PD-004) for the original scoping rationale.

---

## No Responsive Layout

**What:** The dashboard is designed for desktop viewports (1280px+). It does not adapt gracefully to tablet or mobile screens. Tables and charts may overflow or become unreadable on small screens.

**Why:** Time was allocated to analytics depth, test coverage, and architectural quality rather than responsive CSS. The target audience (engineering managers, platform teams) primarily uses desktop.

**Fix:** Add Tailwind responsive breakpoints (`md:`, `lg:`) to the grid layouts in dashboard pages. Collapse sidebar navigation to a hamburger menu on mobile. Stack chart cards vertically on narrow viewports.

---

## No Accessibility Audit

**What:** No WCAG compliance audit has been performed. ARIA attributes, color contrast, keyboard navigation, and screen reader compatibility have not been systematically tested.

**Why:** Accessibility was deprioritized relative to analytics logic and test coverage within the project timeframe.

**Fix:** Run Lighthouse and axe-core audits. Add `jest-axe` to component tests. Review color contrast ratios in chart palettes. Add ARIA labels to interactive elements. Ensure all functionality is keyboard-accessible.

---

## No CI/CD Pipeline

**What:** There are no GitHub Actions, no automated test runs on push, no deployment pipeline. Tests must be run manually with `npm test`.

**Why:** The project is a local demo without a deployment target. CI/CD would add infrastructure complexity without changing the product.

**Fix:** Add a GitHub Actions workflow that runs `npm run lint` and `npm test` on every pull request. Add a deploy step targeting Vercel or a similar platform.

---

## Fetch-Level E2E Tests (Not Browser E2E)

**What:** The E2E test suites render full pages with React Testing Library and mock `fetch` responses. They do not use Playwright or Cypress to drive a real browser. This means they do not test actual network requests, browser rendering, or user interactions like clicking and scrolling.

**Why:** Fetch-level E2E tests run fast (~seconds), require no browser binary, and cover the full React component tree. They provide high value per test-second. True browser E2E was planned but not yet implemented.

**Fix:** Add Playwright with a small suite of critical-path tests: load dashboard, switch date range, navigate between pages, verify chart renders. Keep the existing fetch-level tests as a fast feedback layer.

---

## Date Range Limited to Mock Data Window

**What:** The mock dataset covers a fixed 30-day window. Selecting date ranges outside this window returns empty results. There is no indication to the user that data is unavailable for a given range.

**Why:** The mock data generator produces runs within a fixed window for determinism. Extending the window would increase dataset size without adding analytical value.

**Fix:** With a real database, date ranges would query actual data. Add an empty state message when the selected range has no data. Consider showing the available data range in the date picker UI.

---

## No Custom Date Picker

**What:** Date filtering uses preset options (7d, 14d, 30d) rather than a calendar-based custom date picker.

**Why:** Presets cover the common use cases and avoid the complexity of a date picker component. The mock data window is fixed, so custom dates have limited value.

**Fix:** Add a date picker component (e.g., `react-day-picker`) with a "Custom Range" option alongside the existing presets.

---

## No Agent Detail / Drill-Down Pages

**What:** The Agents page shows a leaderboard and failure taxonomy, but clicking on an agent does not navigate to a detail page with that agent's individual run history, latency distribution, or cost breakdown.

**Why:** The dashboard prioritizes aggregate views. Drill-down pages were in the roadmap but not yet implemented.

**Fix:** Add `/dashboard/agents/[id]` pages that show per-agent run timeline, error history, and performance metrics. The data is already available in mock data -- it just needs filtering and a new page.

---

## No Export Functionality

**What:** There is no way to export charts as images, tables as CSV, or data as JSON.

**Why:** Export was not prioritized over analytics quality and test coverage.

**Fix:** Add CSV export buttons to tables using a utility that converts array data to CSV. Add chart image export using Recharts' built-in SVG export or html2canvas.

---

## Fixed Dataset Size

**What:** The mock dataset contains exactly 10 agents, 8 users, and 500 runs. This is sufficient for demonstrating trends but does not represent the scale of a real organization.

**Why:** The dataset is sized for readability in tables and charts. Larger datasets would not improve the demo and would slow tests.

**Fix:** With a real database, dataset size is unbounded. Add server-side pagination to API endpoints. Add virtual scrolling to large tables. Test with 10K+ runs to validate performance.

---

## No Error Monitoring or Observability

**What:** There is no Sentry, no structured logging, no APM, no health check endpoint. If the app errors in production, there is no way to know.

**Why:** The project runs locally as a demo. There is no production environment to monitor.

**Fix:** Add Sentry for error tracking. Add structured JSON logging (e.g., pino). Add a `/api/health` endpoint. Integrate with an APM provider for latency and throughput monitoring.
