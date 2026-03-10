# Assignment Traceability Matrix

This document maps each major requirement to its implementation files, test files, and current status.

All paths are relative to the repository root.

---

## 1. Core Dashboard Requirements (CLAUDE.md Section 5)

### 1.1 Adoption Metrics

| Requirement | Implementation Files | Test Files | Doc Evidence | Status |
|---|---|---|---|---|
| Total runs KPI | `app/api/analytics/overview/overview.service.ts`, `components/dashboard/kpi-card.tsx` | `app/api/__tests__/unit/analytics/overview.test.ts`, `__tests__/unit/components/dashboard/kpi-card.test.tsx` | `docs/requirements-spec.md` (Overview section) | Full |
| Active users KPI | `app/api/analytics/overview/overview.service.ts`, `components/dashboard/kpi-card.tsx` | `app/api/__tests__/unit/analytics/overview.test.ts`, `__tests__/unit/components/dashboard/kpi-card.test.tsx` | `docs/requirements-spec.md` | Full |
| Active agents KPI | `app/api/analytics/overview/overview.service.ts`, `components/dashboard/kpi-card.tsx` | `app/api/__tests__/unit/analytics/overview.test.ts`, `__tests__/unit/components/dashboard/kpi-card.test.tsx` | `docs/requirements-spec.md` | Full |
| Runs over time trend | `app/api/analytics/trends/trends.service.ts`, `components/charts/runs-trend-chart.tsx` | `app/api/__tests__/unit/analytics/trends.test.ts`, `__tests__/unit/components/charts/runs-trend-chart.test.tsx` | `docs/requirements-spec.md` | Full |
| Usage by team | `app/api/analytics/teams/teams.service.ts`, `components/tables/team-usage-table.tsx` | `app/api/__tests__/unit/analytics/teams.test.ts`, `__tests__/unit/components/tables/team-usage-table.test.tsx` | `docs/requirements-spec.md` | Full |

### 1.2 Reliability Metrics

| Requirement | Implementation Files | Test Files | Doc Evidence | Status |
|---|---|---|---|---|
| Success rate KPI | `app/api/analytics/overview/overview.service.ts`, `components/dashboard/kpi-card.tsx` | `app/api/__tests__/unit/analytics/overview.test.ts`, `__tests__/unit/components/dashboard/kpi-card.test.tsx` | `docs/requirements-spec.md` | Full |
| Failure taxonomy breakdown | `app/api/analytics/agents/agents.service.ts`, `components/charts/failure-taxonomy-chart.tsx` | `app/api/__tests__/unit/analytics/agents.test.ts`, `__tests__/unit/components/charts/failure-taxonomy-chart.test.tsx` | `docs/requirements-spec.md` | Full |
| Success/error/retry trend | `app/api/analytics/trends/trends.service.ts`, `components/charts/runs-trend-chart.tsx` | `app/api/__tests__/unit/analytics/trends.test.ts`, `__tests__/unit/components/charts/runs-trend-chart.test.tsx` | `docs/requirements-spec.md` | Full |
| Error timeline | `app/api/analytics/troubleshooting/troubleshooting.service.ts`, `components/charts/error-timeline-chart.tsx` | `app/api/__tests__/unit/analytics/troubleshooting.test.ts`, `__tests__/unit/components/charts/error-timeline-chart.test.tsx` | `docs/user-stories.md` (US-034, US-035) | Full |
| Agent error breakdown | `app/api/analytics/troubleshooting/troubleshooting.service.ts`, `components/tables/agent-error-table.tsx` | `app/api/__tests__/unit/analytics/troubleshooting.test.ts`, `__tests__/unit/components/tables/agent-error-table.test.tsx` | `docs/user-stories.md` | Full |

### 1.3 Performance Metrics

| Requirement | Implementation Files | Test Files | Doc Evidence | Status |
|---|---|---|---|---|
| Average latency KPI | `app/api/analytics/overview/overview.service.ts`, `components/dashboard/kpi-card.tsx` | `app/api/__tests__/unit/analytics/overview.test.ts`, `__tests__/unit/components/dashboard/kpi-card.test.tsx` | `docs/requirements-spec.md` | Full |
| P95 latency KPI | `app/api/analytics/overview/overview.service.ts`, `components/dashboard/kpi-card.tsx` | `app/api/__tests__/unit/analytics/overview.test.ts`, `__tests__/unit/components/dashboard/kpi-card.test.tsx` | `docs/requirements-spec.md` | Full |
| Latency trend (p50/p95) | `app/api/analytics/trends/trends.service.ts`, `components/charts/latency-trend-chart.tsx` | `app/api/__tests__/unit/analytics/trends.test.ts`, `__tests__/unit/components/charts/latency-trend-chart.test.tsx` | `docs/requirements-spec.md` | Full |

### 1.4 Cost / Optimization Metrics

| Requirement | Implementation Files | Test Files | Doc Evidence | Status |
|---|---|---|---|---|
| Token volume KPI | `app/api/analytics/overview/overview.service.ts`, `components/dashboard/kpi-card.tsx` | `app/api/__tests__/unit/analytics/overview.test.ts`, `__tests__/unit/components/dashboard/kpi-card.test.tsx` | `docs/requirements-spec.md` | Full |
| Estimated cost KPI | `app/api/analytics/overview/overview.service.ts`, `components/dashboard/kpi-card.tsx` | `app/api/__tests__/unit/analytics/overview.test.ts`, `__tests__/unit/components/dashboard/kpi-card.test.tsx` | `docs/requirements-spec.md` | Full |
| Cost trend | `app/api/analytics/trends/trends.service.ts`, `components/charts/cost-trend-chart.tsx` | `app/api/__tests__/unit/analytics/trends.test.ts`, `__tests__/unit/components/charts/cost-trend-chart.test.tsx` | `docs/requirements-spec.md` | Full |
| Cost by model | `app/api/analytics/teams/teams.service.ts`, `components/charts/cost-by-model-chart.tsx` | `app/api/__tests__/unit/analytics/teams.test.ts`, `__tests__/unit/components/charts/cost-by-model-chart.test.tsx` | `docs/requirements-spec.md` | Full |
| Top cost drivers insight | `app/api/analytics/insights/insights.service.ts`, `components/insights/insight-card.tsx` | `app/api/__tests__/unit/analytics/insights.test.ts`, `__tests__/unit/components/insights/insight-card.test.tsx` | `docs/requirements-spec.md` | Full |
| High-cost/low-success agents | `app/api/analytics/insights/insights.service.ts`, `components/insights/insight-card.tsx` | `app/api/__tests__/unit/analytics/insights.test.ts`, `__tests__/unit/components/insights/insight-card.test.tsx` | `docs/requirements-spec.md` | Full |
| Degraded latency agents | `app/api/analytics/insights/insights.service.ts`, `components/insights/insight-card.tsx` | `app/api/__tests__/unit/analytics/insights.test.ts`, `__tests__/unit/components/insights/insight-card.test.tsx` | `docs/requirements-spec.md` | Full |
| Rising failure trends | `app/api/analytics/insights/insights.service.ts`, `components/insights/insight-card.tsx` | `app/api/__tests__/unit/analytics/insights.test.ts`, `__tests__/unit/components/insights/insight-card.test.tsx` | `docs/requirements-spec.md` | Full |
| Cost-reliability scatter | `components/charts/cost-reliability-scatter.tsx` | `__tests__/unit/components/charts/cost-reliability-scatter.test.tsx` | N/A | Full |
| Model performance comparison | `app/api/analytics/models/models.service.ts`, `components/tables/model-performance-table.tsx` | `app/api/__tests__/unit/analytics/models.test.ts`, `__tests__/unit/components/tables/model-performance-table.test.tsx` | `docs/user-stories.md` (US-029, US-030) | Full |

---

## 2. Dashboard Pages

| Page | Route File | Key Components | Hook | API Endpoint | Backend Service | Unit Tests | E2E Tests | Status |
|---|---|---|---|---|---|---|---|---|
| **Overview** | `app/dashboard/page.tsx` | `kpi-card.tsx`, `runs-trend-chart.tsx`, `latency-trend-chart.tsx`, `cost-trend-chart.tsx` | `useOverviewKPIs`, `useTrends` | `/api/analytics/overview`, `/api/analytics/trends` | `overview.service.ts`, `trends.service.ts` | `overview-page.test.tsx`, `kpi-card.test.tsx`, `overview.test.ts`, `trends.test.ts` | `overview.e2e.test.tsx` | Full |
| **Agents** | `app/dashboard/agents/page.tsx` | `agent-leaderboard.tsx`, `failure-taxonomy-chart.tsx`, `cost-reliability-scatter.tsx` | `useAgentAnalytics` | `/api/analytics/agents` | `agents.service.ts` | `agents-page.test.tsx`, `agent-leaderboard.test.tsx`, `agents.test.ts` | `agents.e2e.test.tsx` | Full |
| **Teams** | `app/dashboard/teams/page.tsx` | `team-usage-table.tsx`, `cost-by-model-chart.tsx`, `top-users-table.tsx`, `team-comparison-chart.tsx` | `useTeamAnalytics` | `/api/analytics/teams` | `teams.service.ts` | `teams-page.test.tsx`, `team-usage-table.test.tsx`, `top-users-table.test.tsx`, `teams.test.ts` | `teams.e2e.test.tsx` | Full |
| **Models** | `app/dashboard/models/page.tsx` | `model-performance-table.tsx` | `useModelAnalytics` | `/api/analytics/models` | `models.service.ts` | `models-page.test.tsx`, `model-performance-table.test.tsx`, `models.test.ts` | `models.e2e.test.tsx` | Full |
| **Optimization** | `app/dashboard/optimization/page.tsx` | `insight-card.tsx` | `useInsights` | `/api/analytics/insights` | `insights.service.ts` | `optimization-page.test.tsx`, `insight-card.test.tsx`, `insights.test.ts` | `optimization.e2e.test.tsx` | Full |
| **Alerts** | `app/dashboard/alerts/page.tsx` | `alert-card.tsx` | `useAlerts` | `/api/analytics/alerts` | `alerts.service.ts` | `alerts-page.test.tsx`, `alert-card.test.tsx`, `alerts.test.ts` | `alerts.e2e.test.tsx` | Full |
| **Troubleshooting** | `app/dashboard/troubleshooting/page.tsx` | `error-timeline-chart.tsx`, `agent-error-table.tsx` | `useTroubleshooting` | `/api/analytics/troubleshooting` | `troubleshooting.service.ts` | `troubleshooting-page.test.tsx`, `agent-error-table.test.tsx`, `troubleshooting.test.ts` | `troubleshooting.e2e.test.tsx` | Full |

---

## 3. Technical Requirements

### 3.1 DDD Architecture (Repository -> Service -> Controller -> Route)

| Context | Repository | Service | Controller | Route | Unit Test | Integration Test | Status |
|---|---|---|---|---|---|---|---|
| Overview | `overview.repository.ts` | `overview.service.ts` | `overview.controller.ts` | `overview/route.ts` | `overview.test.ts` | `api/overview.test.ts` | Full |
| Agents | `agents.repository.ts` | `agents.service.ts` | `agents.controller.ts` | `agents/route.ts` | `agents.test.ts` | `api/agents.test.ts` | Full |
| Teams | `teams.repository.ts` | `teams.service.ts` | `teams.controller.ts` | `teams/route.ts` | `teams.test.ts` | `api/teams.test.ts` | Full |
| Trends | `trends.repository.ts` | `trends.service.ts` | `trends.controller.ts` | `trends/route.ts` | `trends.test.ts` | `api/trends.test.ts` | Full |
| Insights | `insights.repository.ts` | `insights.service.ts` | `insights.controller.ts` | `insights/route.ts` | `insights.test.ts` | `api/insights.test.ts` | Full |
| Alerts | `alerts.repository.ts` | `alerts.service.ts` | `alerts.controller.ts` | `alerts/route.ts` | `alerts.test.ts` | `api/alerts.test.ts` | Full |
| Models | `models.repository.ts` | `models.service.ts` | `models.controller.ts` | `models/route.ts` | `models.test.ts` | `api/models.test.ts` | Full |
| Troubleshooting | `troubleshooting.repository.ts` | `troubleshooting.service.ts` | `troubleshooting.controller.ts` | `troubleshooting/route.ts` | `troubleshooting.test.ts` | `api/troubleshooting.test.ts` | Full |

All files located under `app/api/analytics/<context>/`. Tests under `app/api/__tests__/unit/analytics/` and `app/api/__tests__/integration/api/`.

### 3.2 Other Technical Requirements

| Requirement | Evidence Files | Test Files | Status |
|---|---|---|---|
| TypeScript strict mode / zero `any` | `tsconfig.json` (`"strict": true`) | N/A (compiler enforced) | Full |
| Deterministic mock data (seeded PRNG) | `app/api/_mock-data/seed.ts` (mulberry32 PRNG), `app/api/_mock-data/agents.ts`, `app/api/_mock-data/runs.ts`, `app/api/_mock-data/users.ts`, `app/api/_mock-data/index.ts` | Backend unit/integration tests rely on deterministic outputs | Full |
| Date range filtering | `lib/utils/date-filter.ts`, `lib/utils/build-url.ts`, `lib/utils/parse-date-params.ts` (inferred from test), `lib/hooks/use-date-range.tsx`, `components/dashboard/date-range-picker.tsx` | `__tests__/unit/utils/date-filter.test.ts`, `__tests__/unit/utils/build-url.test.ts`, `__tests__/unit/utils/parse-date-params.test.ts`, `__tests__/unit/hooks/use-date-range.test.tsx`, `__tests__/unit/components/dashboard/date-range-picker.test.tsx` | Full |
| Loading states | `components/dashboard/skeleton.tsx` | `__tests__/unit/components/dashboard/skeleton.test.tsx` | Full |
| Error states | `components/dashboard/error-state.tsx` | `__tests__/unit/components/dashboard/error-state.test.tsx` | Full |
| Empty states | `components/dashboard/empty-state.tsx` | `__tests__/unit/components/dashboard/empty-state.test.tsx` | Full |
| Role-based views | `lib/role-visibility.ts`, `lib/hooks/use-role.tsx`, `components/dashboard/role-selector.tsx` | `__tests__/unit/lib/role-visibility.test.ts`, `__tests__/unit/hooks/use-role.test.tsx`, `__tests__/unit/components/role-selector.test.tsx` | Full |
| API error handler | `lib/utils/api-handler.ts` | `app/api/__tests__/unit/api/api-handler.test.ts` | Full |
| Domain types | `lib/types.ts` (Agent, Run, User, all aggregation types, all response types) | Type-checked at compile time | Full |
| Dashboard layout (sidebar, header) | `app/dashboard/layout.tsx`, `components/dashboard/dashboard-header.tsx`, `components/dashboard/sidebar-nav.tsx` | `__tests__/unit/components/layout/dashboard-layout.test.tsx`, `__tests__/unit/components/dashboard/dashboard-header.test.tsx`, `__tests__/unit/components/dashboard/sidebar-nav.test.tsx` | Full |
| Navigation E2E | N/A | `__tests__/e2e/navigation.e2e.test.tsx` | Full |

---

## 4. Documentation Requirements (CLAUDE.md Section 15)

| Required Document | Path | Status |
|---|---|---|
| `README.md` | `README.md` | Exists (not verified in this audit) |
| `docs/requirements-spec.md` | `docs/requirements-spec.md` | Exists |
| `docs/technical-spec.md` | `docs/technical-spec.md` | Exists |
| `docs/testing-spec.md` | `docs/testing-spec.md` | Exists |
| `docs/product-decisions.md` | `docs/product-decisions.md` | Exists |
| `docs/ai-workflow.md` | `docs/ai-workflow.md` | Exists |
| `docs/roadmap.md` | `docs/roadmap.md` | Exists |
| `docs/user-stories.md` | `docs/user-stories.md` | Exists |
| `docs/development-workflow.md` | `docs/development-workflow.md` | Exists |

All required documents from CLAUDE.md section 15 are present. An additional `development-workflow.md` and `user-stories.md` also exist.

---

## 5. User Stories Coverage

### 5.1 Implemented Stories (per `docs/user-stories.md`)

| Story | Description | Implementation Evidence | Test Evidence | Status |
|---|---|---|---|---|
| **US-001** | Total runs, active users, active agents at a glance | `overview.service.ts`, `kpi-card.tsx`, `app/dashboard/page.tsx` | `overview.test.ts`, `kpi-card.test.tsx`, `overview-page.test.tsx` | Full |
| **US-002** | Runs over time trend | `trends.service.ts`, `runs-trend-chart.tsx` | `trends.test.ts`, `runs-trend-chart.test.tsx` | Full |
| **US-003** | Token volume and estimated cost | `overview.service.ts`, `kpi-card.tsx` | `overview.test.ts`, `kpi-card.test.tsx` | Full |
| **US-004** | Agent leaderboard by usage | `agents.service.ts`, `agent-leaderboard.tsx` | `agents.test.ts`, `agent-leaderboard.test.tsx` | Full |
| **US-005** | Success rate per agent | `agents.service.ts`, `agent-leaderboard.tsx` | `agents.test.ts`, `agent-leaderboard.test.tsx` | Full |
| **US-006** | Failure taxonomy breakdown | `agents.service.ts`, `failure-taxonomy-chart.tsx` | `agents.test.ts`, `failure-taxonomy-chart.test.tsx` | Full |
| **US-007** | Average and p95 latency | `overview.service.ts`, `kpi-card.tsx` | `overview.test.ts`, `kpi-card.test.tsx` | Full |
| **US-008** | Latency trends (p50/p95) over time | `trends.service.ts`, `latency-trend-chart.tsx` | `trends.test.ts`, `latency-trend-chart.test.tsx` | Full |
| **US-009** | Cost trends over time | `trends.service.ts`, `cost-trend-chart.tsx` | `trends.test.ts`, `cost-trend-chart.test.tsx` | Full |
| **US-010** | Usage by team | `teams.service.ts`, `team-usage-table.tsx` | `teams.test.ts`, `team-usage-table.test.tsx` | Full |
| **US-011** | Cost by model | `teams.service.ts`, `cost-by-model-chart.tsx` | `teams.test.ts`, `cost-by-model-chart.test.tsx` | Full |
| **US-012** | Top users by runs and cost | `teams.service.ts`, `top-users-table.tsx` | `teams.test.ts`, `top-users-table.test.tsx` | Full |
| **US-013** | High cost / low success agents | `insights.service.ts`, `insight-card.tsx` | `insights.test.ts`, `insight-card.test.tsx` | Full |
| **US-014** | Rising failure trends alert | `insights.service.ts`, `insight-card.tsx` | `insights.test.ts`, `insight-card.test.tsx` | Full |
| **US-015** | Degraded latency agents | `insights.service.ts`, `insight-card.tsx` | `insights.test.ts`, `insight-card.test.tsx` | Full |
| **US-016** | Top cost drivers | `insights.service.ts`, `insight-card.tsx` | `insights.test.ts`, `insight-card.test.tsx` | Full |
| **US-017** | Date range filtering (7d, 14d, 30d, all) | `date-filter.ts`, `use-date-range.tsx`, `date-range-picker.tsx` | `date-filter.test.ts`, `use-date-range.test.tsx`, `date-range-picker.test.tsx` | Full |
| **US-018** | Loading states | `skeleton.tsx` | `skeleton.test.tsx` | Full |
| **US-019** | Error states | `error-state.tsx` | `error-state.test.tsx` | Full |
| **US-020** | Empty states | `empty-state.tsx` | `empty-state.test.tsx` | Full |
| **US-036** | Role-based views (admin, manager, engineer) | `role-visibility.ts`, `use-role.tsx`, `role-selector.tsx` | `role-visibility.test.ts`, `use-role.test.tsx`, `role-selector.test.tsx` | Full |

### 5.2 Planned Stories -- Actual Implementation Status

These stories are listed as "Planned" in `docs/user-stories.md` but some have been implemented.

| Story | Description | Actually Implemented? | Evidence |
|---|---|---|---|
| **US-021** | Alerts dashboard (threshold breaches) | **Yes** | `app/api/analytics/alerts/` (full DDD stack), `app/dashboard/alerts/page.tsx`, `components/alerts/alert-card.tsx`, `alerts.service.ts`, `alerts.test.ts`, `alerts.e2e.test.tsx` |
| **US-022** | Alerts grouped by severity | **Yes** | `alerts.service.ts`, `alert-card.tsx` (alert severity rendered via `AlertStatus` type) |
| **US-023** | Time saved by agents | **No** | Not evidenced in any implementation or test files |
| **US-024** | Time saved per team | **No** | Not evidenced |
| **US-025** | High failure rate agents view | **Partial** | Covered via insights (`high-cost-low-success` type in `insights.service.ts`) and troubleshooting (`agent-error-table.tsx`), but no dedicated standalone page |
| **US-026** | Failure rate trends per agent | **Partial** | Error timeline exists in troubleshooting (`error-timeline-chart.tsx`), but not per-agent granularity |
| **US-027** | Team performance vs cost comparison | **Partial** | `team-comparison-chart.tsx` and `team-usage-table.tsx` exist, but no explicit cross-team efficiency ratio view |
| **US-028** | Benchmark team agent performance | **Partial** | `team-comparison-chart.tsx` provides some comparison capability |
| **US-029** | Model comparison (success, latency, cost/token) | **Yes** | `app/api/analytics/models/` (full DDD stack), `models.service.ts`, `model-performance-table.tsx`, `app/dashboard/models/page.tsx`, `models.test.ts`, `models.e2e.test.tsx` |
| **US-030** | Model reliability per dollar | **Yes** | `ModelPerformanceEntry` type includes `costPerThousandTokens` and `successRate`; rendered in `model-performance-table.tsx` |
| **US-031** | Filter by team | **No** | Not evidenced |
| **US-032** | Filter agent leaderboard by model/status | **No** | Not evidenced |
| **US-033** | Custom date range calendar picker | **No** | Only preset ranges (7d, 14d, 30d, all) in `date-range-picker.tsx` |
| **US-034** | Troubleshooting view (error patterns + remediation) | **Yes** | `app/api/analytics/troubleshooting/` (full DDD stack), `app/dashboard/troubleshooting/page.tsx`, `error-timeline-chart.tsx`, `agent-error-table.tsx`, `AgentErrorBreakdown` type includes `remediation` field |
| **US-035** | Common error types per team | **Partial** | `agent-error-table.tsx` shows errors per agent (with team info), but not aggregated at the team level |
| **US-037** | Manager dashboard defaults to own team | **No** | Not evidenced; role visibility restricts sections but does not auto-filter by team |
| **US-038** | Export as CSV/PDF | **No** | Not evidenced |
| **US-039** | Download metrics snapshot | **No** | Not evidenced |
| **US-040** | Docker containerization | **No** | Not evidenced (no Dockerfile found) |
| **US-041** | CI/CD pipelines | **No** | Not evidenced |
| **US-042** | DDD backend structure | **Yes** | All 8 contexts follow repository -> service -> controller -> route pattern under `app/api/analytics/` |
| **US-043** | AI analytics assistant (chat panel) | **No** | Not evidenced |
| **US-044** | AI assistant natural language queries | **No** | Not evidenced |

---

## 6. Test Coverage Summary

### Backend Tests

| Suite | Location | Contexts Covered |
|---|---|---|
| Unit (analytics) | `app/api/__tests__/unit/analytics/` | overview, agents, teams, trends, insights, alerts, models, troubleshooting (8 files) |
| Unit (api handler) | `app/api/__tests__/unit/api/` | api-handler (1 file) |
| Integration (API routes) | `app/api/__tests__/integration/api/` | overview, agents, teams, trends, insights, alerts, models, troubleshooting (8 files) |

### Frontend Tests

| Suite | Location | Files |
|---|---|---|
| Component unit tests | `__tests__/unit/components/` | charts (8), dashboard (8), insights (1), tables (5), alerts (1), layout (1), pages (7), role-selector (1) -- 32 files |
| Hook unit tests | `__tests__/unit/hooks/` | use-date-range, use-analytics, use-role (3 files) |
| Utility unit tests | `__tests__/unit/utils/` | build-url, date-filter, format, parse-date-params (4 files) |
| Lib unit tests | `__tests__/unit/lib/` | role-visibility (1 file) |
| E2E tests | `__tests__/e2e/` | overview, agents, teams, optimization, alerts, models, troubleshooting, navigation (8 files + helpers) |

**Total test files: 65**

---

## 7. Requirement Gap Summary

| Gap | Category | Notes |
|---|---|---|
| `docs/user-stories.md` lists US-021/022 (Alerts), US-029/030 (Models), US-034 (Troubleshooting), US-042 (DDD) as "Planned" but they are fully implemented | Doc staleness | User stories doc should be updated to move these to "Implemented" |
| US-023/024 (Time saved) | Not implemented | No time-saved metric in mock data or services |
| US-031/032 (Team/model/status filters) | Not implemented | Only date range filtering exists |
| US-033 (Custom calendar picker) | Not implemented | Only preset ranges supported |
| US-037 (Manager auto-filter by team) | Not implemented | Role visibility restricts sections, does not auto-scope data |
| US-038/039 (Export) | Not implemented | No export capability |
| US-040/041 (Docker, CI/CD) | Not implemented | No infrastructure files |
| US-043/044 (AI assistant) | Not implemented | No chat or NLP features |
