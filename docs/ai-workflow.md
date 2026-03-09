# AI-Assisted Workflow Log

This document records how AI was used in building the dashboard, what was human-led, and lessons learned.

---

## Workflow Summary

The project follows a disciplined, TDD-first methodology defined in CLAUDE.md. AI assists with implementation; humans lead on architecture, product decisions, and quality standards. Work was organized in 5 phases with clear checkpoints.

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
- React Query hook tests: dedicated suite for all 5 `use-analytics` hooks (success, error, loading, date range forwarding)
- Chart formatter tests: coverage for inline `tickFormatter`/`formatter` functions via Recharts prop capture mocking — brought chart components to 100%
- E2E tests: 5 suites with fetch-level mocking testing full data flow (API → React Query → hooks → components → DOM) for all 4 pages + navigation
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
