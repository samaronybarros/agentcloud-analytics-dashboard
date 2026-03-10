# AI-Assisted Workflow Log

This document records how AI was used in building the dashboard, what was human-led, and lessons learned.

---

## Workflow Summary

The project follows a disciplined, TDD-first methodology defined in CLAUDE.md. AI assists with implementation; humans lead on architecture, product decisions, and quality standards. Work was organized in 10 phases with clear checkpoints.

## Phase Log

### Phase 1: Project Setup & Structure

**Human-led decisions:**
- Repository structure and architecture
- Technology stack selection (Next.js, Tailwind v4, Recharts, React Query)
- Product requirements and dashboard page breakdown
- Documentation structure and CLAUDE.md rules

**AI-assisted work:**
- Scaffolding config files (tsconfig, jest, postcss, next.config)
- Creating directory structure
- Writing initial documentation from product spec
- Setting up app shell (layout, routing, providers)

### Phase 2: Types, Mock Data & TDD Tests

**Human-led decisions:**
- Entity design (Agent, Run, User)
- Mock data distribution (75% success, 15% error, 10% retry)
- Test-first approach enforcement

**AI-assisted work:**
- Domain type definitions with discriminated unions
- Seeded PRNG implementation (mulberry32, seed=42)
- Deterministic mock data generation (10 agents, 8 users, 500 runs)
- TDD test suites for all analytics logic

### Phase 3: Analytics Logic & API Routes

**Human-led decisions:**
- Which metrics to compute and how
- Insight generation rules (thresholds, severity classification)
- API response shapes

**AI-assisted work:**
- Analytics module implementations (overview, agents, teams, insights, trends)
- API route handlers
- React Query hooks
- Formatting utilities

### Phase 4: Dashboard Pages & Component Tests

**Human-led decisions:**
- Page composition and layout decisions
- Chart type selection per metric
- Active nav highlighting behavior
- Hydration bug diagnosis and fix approach

**AI-assisted work:**
- Reusable components (KPI cards, section headers, tables, charts, insight cards)
- Dashboard page composition
- Component and page test suites
- Sidebar nav extraction for hydration safety

### Phase 5: Integration Tests, README Polish & Summary

**Human-led decisions:**
- Test coverage expectations
- README structure and content priorities

**AI-assisted work:**
- API route integration tests (5 suites, 32 tests)
- README rewrite with architecture summary
- Documentation updates

### Phase 6: Test Coverage Hardening & E2E Tests

**Human-led decisions:**
- Coverage gap analysis and prioritization (service branches → hooks → chart formatters → e2e)
- ESLint config consistency requirements
- Isolated test scripts for unit/integration/e2e

**AI-assisted work:**
- Service branch coverage: edge cases for insights, teams, and trends services (unknown agents, orphaned runs, user fallbacks) — brought insights and teams to 100% branch coverage
- React Query hook tests: dedicated suite for `use-analytics` hooks (success, error, loading, date range forwarding) — initially 5 hooks, later expanded to 8 in Phase 7
- Chart formatter tests: coverage for inline `tickFormatter`/`formatter` functions via Recharts prop capture mocking — brought chart components to 100%
- E2E tests: initially 5 suites with fetch-level mocking testing full data flow (API → React Query → hooks → components → DOM) for the original 4 pages + navigation — later expanded to 8 suites in Phase 7
- ESLint config cleanup: extended test file rule overrides to backend test files
- Added isolated test scripts (`test:unit`, `test:integration`, `test:e2e`)
- Documentation updates across README, testing-spec, roadmap, and technical-spec

**Result:** 38 suites / 329 tests → 44 suites / 395 tests. Chart component coverage: 71% → 100%. Service branch coverage gaps closed.

---

## Key Observations

1. **CLAUDE.md as guardrails** — The detailed CLAUDE.md prevented scope creep and kept the AI focused on the product goals. Every implementation decision could be traced back to a documented requirement.

2. **TDD accelerated development** — Writing tests first gave the AI clear targets. Implementation was faster and more focused because the expected behavior was already defined.

3. **Phased approach worked** — Breaking work into foundation → types → logic → UI → polish prevented the AI from jumping ahead and creating tightly coupled code.

4. **Bugs came from environment, not logic** — The main issues (Recharts circular require, jsdom missing Web APIs, hydration mismatches from browser extensions) were environment/tooling problems, not business logic errors.

5. **Human oversight caught real issues** — The human caught the `suppressHydrationWarning` anti-pattern and directed the proper fix (extracting a client component boundary instead of hiding the warning).

---

### Phase 6: Review Graphics & Dashboard

**Human-led decisions:**
- Selected which new views to add: cost vs reliability scatter, runs by day of week, team comparison chart
- Decided where each view belongs (Agents, Overview, Teams pages respectively)
- Chose to augment `TeamUsageEntry` with `successRate` and `avgLatencyMs` rather than creating a separate type

**AI-assisted work:**
- TDD implementation: 34 new tests written before components (10 scatter, 7 team comparison, 6 runs-by-day, 11 backend/integration)
- 3 new chart components: `CostReliabilityScatter`, `TeamComparisonChart`, `RunsByDayChart`
- Backend augmentation: `computeRunsByDayOfWeek` in trends service, `successRate`/`avgLatencyMs` in teams service
- Updated `TeamUsageTable` with 2 new columns (success rate, avg latency)
- Updated all affected test mocks across 12 existing test files
- Documentation updates: README, roadmap, testing-spec, technical-spec

**Result:** 47 suites, 429 tests passing. Three new decision-making views added to the dashboard.

---

### Phase 7: New Dashboard Pages — Models, Alerts, Troubleshooting

**Human-led decisions:**
- Selected three new pages to add: Models (model performance comparison), Alerts (threshold breaches and anomalies), Troubleshooting (error diagnosis and failure patterns)
- Each page requires a full backend vertical slice (repository, service, controller, route)
- Sidebar navigation expanded from 4 to 7 items (Overview, Agents, Teams, Models, Optimization, Alerts, Troubleshooting)
- New domain types: ModelPerformanceEntry, Alert, AlertStatus, AlertMetric, ErrorTimelineEntry, AgentErrorBreakdown, and corresponding API response types

**AI-assisted work:**
- Three new full vertical slices: models, alerts, troubleshooting — each with repository, service, controller, and route
- Three new dashboard pages: `app/dashboard/models/page.tsx`, `app/dashboard/alerts/page.tsx`, `app/dashboard/troubleshooting/page.tsx`
- New components: model-performance-table, alert-card, error-timeline-chart, agent-error-table
- New chart components: cost-reliability-scatter, team-comparison-chart, runs-by-day-chart
- New hooks: useModelAnalytics, useAlerts, useTroubleshooting
- Dynamic team color assignment replacing hardcoded TEAM_COLORS
- Consistent card wrappers across all pages
- Hook tests for new hooks, navigation tests updated for 7 items
- E2E tests for all three new pages
- Backend unit and integration tests for all three new contexts
- Documentation updates across README, roadmap, testing-spec, technical-spec

**Result:** 47 suites / 429 tests → 63 suites / 552 tests. Three new full-stack dashboard pages with complete test coverage. Sidebar navigation expanded to 7 items.

---

### Phase 8: Role-Based Dashboard Views

**Human-led decisions:**
- Decided to implement role-based views split by user persona (Org Admin, Eng Manager, Platform Engineer)
- Defined cost data as the primary sensitivity boundary between roles
- Chose client-side role switching over server-side enforcement for demo suitability
- Reviewed and requested refactor of visibility config to nest sections under pages

**AI-assisted work:**
- TDD implementation: 47 new tests written before implementation (35 visibility config, 5 role hook, 3 sidebar role-filtering)
- New modules: `useRole()` hook (reads role from URL search params), `role-visibility.ts` declarative config
- Page-centric visibility config: sections nested under parent pages with `'all'` shorthand, resolved to flat sets at module load
- Updated all 7 dashboard pages with conditional rendering (cost KPIs, cost trends, cost columns, cost insights, cost alerts)
- Added `showCostColumn` props to `AgentLeaderboard` and `ModelPerformanceTable`
- "Restricted access" state for Teams page when viewed as engineer
- Updated 14 existing test files to mock `useRole`
- Documentation updates: README, roadmap, testing-spec, technical-spec, product-decisions, user-stories, ai-workflow

**Result:** 63 suites / 552 tests → 66 suites / 599 tests. Two new product decisions documented (PD-024, PD-025). User story US-036 implemented.

---

### Phase 9: Documentation Hardening & Assignment Evidence

**Human-led decisions:**
- Identified evidence gaps for assignment requirements (AI-first process, spec-driven planning, production readiness)
- Defined the 10-step documentation execution plan
- Required honest status labels (done/partial/planned) with no overstated claims

**AI-assisted work:**
- Baseline audit of all existing docs — identified 8 inconsistencies (stale counts, status mismatches, missing pages in specs)
- Created research artifacts: `research-scope.md`, `competitive-analysis.md`, `metric-rationale.md`
- Created wireframe/prototype evidence: `wireframes.md`, `prototype-notes.md`
- Created server-side authorization specification: `authz-spec.md`
- Created assignment traceability matrix: `assignment-traceability.md`
- Fixed documentation consistency: user stories status corrections (6 stories moved from planned to implemented), README product decision count fix, requirements-spec page list update, ai-workflow stale count fixes
- Clarified test taxonomy in testing-spec: distinguished fetch-level E2E from true browser E2E, added risk coverage and uncovered risk tables
- Created production readiness package: `production-readiness.md`, `limitations.md`
- Updated README with links to all new docs and evidence section

**Result:** 8 existing docs → 17 total docs. All assignment requirements mapped with explicit coverage status. No contradictory status labels remaining.

---

### Phase 10: Production Hardening

**Human-led decisions:**
- Identified production readiness gaps: no server-side authz enforcement, no logging, no rate limiting, no responsive layout, no CI
- Prioritized hardening scope: security (authz + rate limiting), observability (structured logging), UX (responsive), CI pipeline, browser E2E
- Required in-memory token bucket approach for rate limiting (no external dependencies)

**AI-assisted work:**
- Server-side role-based authorization: `withRoleAccess` middleware for page-level gating, per-context response redaction functions for field-level filtering
- Structured JSON logging: `api-logger.ts` emitting JSON logs with requestId, method, path, status, durationMs, role on all API responses
- Rate limiting: `rate-limiter.ts` implementing in-memory token bucket (100 req/60s) with Retry-After header
- Responsive sidebar: mobile hamburger menu with collapsible sidebar navigation
- Playwright E2E: configuration and smoke tests for browser-level testing
- GitHub Actions CI pipeline: lint, test, build gates on push and PR
- TDD test suites: api-handler tests (logging, rate limiting, request IDs), api-logger tests, rate-limiter tests, role-auth unit tests, response-redaction unit tests, authz integration tests
- Documentation updates across 7 files

**Result:** 66 suites / 599 tests -> 71 suites / 697 tests. Rate limiting, structured logging, server-side authz, responsive layout, Playwright E2E, and CI pipeline shipped.

---

## Decision Authority

| Area | Led by |
|------|--------|
| Product requirements | Human |
| Architecture & stack | Human |
| Page structure & navigation | Human |
| Quality standards | Human (via CLAUDE.md) |
| Bug diagnosis approach | Human |
| Implementation approach | AI (within human-set constraints) |
| Code scaffolding | AI |
| Test design | AI (human reviews) |
| Documentation content | AI (human reviews) |
