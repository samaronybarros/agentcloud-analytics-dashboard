# Roadmap

Current status: **Core dashboard feature-complete** (44 test suites, 395 tests passing, production build green).

---

## Completed

- [x] Project foundation (Next.js 15, TypeScript strict, Tailwind v4, Recharts, React Query)
- [x] Deterministic mock data (10 agents, 8 users, 500 runs, seeded PRNG)
- [x] Analytics logic layer (overview, agents, teams, trends, insights)
- [x] 5 API contexts with repository → service → controller → route layers
- [x] Overview page — 8 KPI cards + 3 trend charts
- [x] Agents page — leaderboard table + failure taxonomy chart
- [x] Teams page — team usage table, cost by model chart, top users table
- [x] Optimization page — severity-grouped insight cards
- [x] Date range filtering end-to-end (7d / 14d / 30d / all)
- [x] Sidebar navigation with active route highlighting
- [x] Loading skeletons, error states, empty states
- [x] Full TDD test coverage (analytics, components, pages, utils, API integration)
- [x] Documentation (requirements, technical spec, testing spec, product decisions, AI workflow, dev workflow)
- [x] Type safety audit — zero `any`, strict mode

---

- [x] Backend refactor — DDD-inspired architecture with per-context repository/service/controller layers, mock data co-located at `app/api/_mock-data/`, backend tests at `app/api/__tests__/`
- [x] Service branch coverage — edge cases for insights, teams, and trends services (unknown agents, orphaned runs, user fallbacks)
- [x] React Query hook tests — dedicated test suite for all 5 `use-analytics` hooks (success, error, loading, date range forwarding)
- [x] Chart formatter tests — coverage for inline `tickFormatter`/`formatter` functions via prop capture mocks
- [x] E2E tests — 5 suites covering all 4 pages + navigation with fetch-level mocking (full data flow)
- [x] ESLint config cleanup — extended test file rule overrides to cover backend test files

---

## Up Next — New Dashboards & Views

- [ ] Alerts dashboard — surface critical events, threshold breaches, and anomalies requiring attention
- [ ] Time saved dashboard — quantify automation ROI by measuring time saved through agent usage
- [ ] Agents with high failure rate view — dedicated view to identify and drill into unreliable agents
- [ ] Team performance vs cost view — compare team output and reliability against spend
- [ ] Model reliability and efficiency view — compare models by success rate, latency, cost per token, and throughput

---

## Up Next — Polish & Quality

- [ ] Review filters — add team-based filtering across pages (agents, trends, overview)
- [ ] Review graphics and dashboard — add additional views to improve decision-making (e.g., cost vs reliability scatter, usage heatmap, team comparison board)
- [ ] Add troubleshooting page/section — help users diagnose agent failures, surface error patterns and remediation steps
- [x] ~~E2E tests~~ (5 suites, 33 tests — fetch-level mocking for all pages + navigation)
- [x] ~~Increase chart component test coverage~~ (now 100% statements/functions/branches)
- [ ] Accessibility audit — keyboard navigation, ARIA labels, color contrast
- [ ] Responsive layout — mobile/tablet breakpoints for sidebar + grid
- [ ] Runs trend chart on Overview page (component exists but not wired to Overview)
- [ ] Dark mode support
- [ ] Update product decisions log — document new decisions as features are added

---

## Future — Feature Enhancements

- [ ] User roles — role-based views and permissions (admin, manager, viewer) with scoped data access
- [ ] Agent detail page (`/dashboard/agents/[id]`) — run history, latency distribution, error timeline
- [ ] Comparison view — compare two agents or two time periods side by side
- [ ] Export/download — CSV or PDF export for reports
- [ ] Custom date range picker — calendar-based from/to selection (beyond presets)
- [ ] Real-time refresh — polling or SSE for live dashboards
- [ ] Search and filter — filter agents by team, model, status in leaderboard
- [ ] Pagination — for agent leaderboard and top users when dataset grows

---

## Future — Infrastructure

- [ ] Docker — containerize the application for consistent dev/prod environments
- [ ] CI/CD pipeline — lint, test, build gates (GitHub Actions or similar)
- [ ] Linting enforcement (ESLint config exists but not in CI)
- [ ] Performance budgets — bundle size tracking, Lighthouse CI
- [ ] Real data source integration — replace mock data with database/API
- [ ] Authentication and multi-tenancy
- [ ] Error monitoring integration (Sentry or similar)

