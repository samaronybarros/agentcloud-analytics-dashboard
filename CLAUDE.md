# Agent Cloud Analytics Dashboard - CLAUDE.md

This file defines the mandatory working rules for AI-assisted development in this repository.

It is intended to be read by Claude Code (and any other AI coding agent) before making changes.

The goal is to ensure that all AI-generated work is:

- consistent with the product goals
- aligned with the repository architecture
- safe to review and maintain
- test-driven and production-minded
- useful for the take-home interview process

---

## 1. Project Context

This repository contains an **organizational analytics dashboard** for a fictional cloud-agent platform.

The product allows engineering organizations to run AI agents in the cloud.
This dashboard is customer-facing and intended for:

- org admins
- engineering managers
- platform / AI enablement teams

The dashboard helps them understand:

- adoption
- reliability
- performance
- cost
- optimization opportunities

This is not just a charting exercise.
This is a product-thinking, engineering-quality, and AI-first execution exercise.

---

## 2. Primary Product Goal

Build a polished, production-style analytics dashboard that helps organizations answer:

- Are teams adopting cloud agents?
- Which agents are most used?
- Which agents are reliable or unreliable?
- Which agents are expensive?
- Where can usage be optimized?

The dashboard must prioritize **actionable insights**, not just raw reporting.

---

## 3. Operating Mode

Act as a **senior / staff-level product engineer**.

Do not immediately start writing code.

Before making any change:

1. Read this file completely
2. Read the README and project docs
3. Inspect the relevant files in the repository
4. Search for similar implementations before introducing new ones
5. Understand where responsibility belongs
6. Prefer extending existing patterns over creating new abstractions

If the task is ambiguous, do not invent requirements.
Instead:

- make the safest assumption based on the repository
- keep the implementation minimal
- clearly state assumptions

---

## 4. Core Principles

### 4.1 Understand before changing

Never modify code before understanding:

- which user need the change serves
- where the logic belongs
- how data flows through the app
- which existing modules already solve similar problems
- what side effects the change may introduce

Inspect before implementing.

---

### 4.2 Product value over technical cleverness

This project is evaluated on the quality of product decisions.

Prefer:

- actionable metrics
- clear UX
- realistic mock data
- understandable architecture
- production-style decisions

Avoid:

- gratuitous complexity
- abstract frameworks
- speculative infrastructure
- technical novelty without user value

---

### 4.3 Consistency over novelty

Follow the existing stack and patterns in the repository.

Do not introduce without strong justification:

- new frameworks
- new state libraries
- new charting systems
- new folder structures
- new design systems

Prefer consistency over reinvention.

---

### 4.4 Keep logic in the correct layer

Respect architectural boundaries.

General rules:

- UI components -> presentation
- hooks -> UI behavior and data coordination
- repositories -> data access (mock data now, database later)
- services -> business logic, metric aggregation, data transformations
- controllers -> request parsing, service orchestration, response shaping
- API routes -> thin delegation to controllers via withErrorHandler
- mock data modules -> deterministic seed data
- utilities -> reusable shared helpers

Do not place business logic inside chart components, page files, or route files. Business logic belongs in service modules.

---

### 4.5 Minimize scope

Make the smallest safe change that solves the problem.

Avoid:

- unrelated refactors
- renaming for preference only
- moving files without necessity
- touching multiple concerns in one change

Keep changes focused and reviewable.

---

### 4.6 Optimize for maintainability

Prefer code that is:

- explicit
- composable
- typed
- testable
- easy to explain in an interview

Avoid overengineering.

---

## 5. Product Requirements to Protect

These requirements are the default product contract unless explicitly changed by the user.

### 5.1 Core dashboard outcomes

The dashboard should help users understand four dimensions:

1. **Adoption**
2. **Reliability**
3. **Performance**
4. **Cost / optimization**

### 5.2 Preferred metrics

The following metrics are strongly preferred:

#### Overview KPIs
- total runs
- active users
- active agents
- success rate
- average latency
- p95 latency
- token volume
- estimated cost

#### Trend charts
- runs over time
- success/error/retry trend
- latency trend
- cost trend

#### Breakdown views
- cost by model
- usage by team
- top agents
- top users
- failure taxonomy

#### Insight-oriented views
- high-cost / low-success agents
- rising failure trends
- top cost drivers
- agents with degraded latency
- optimization opportunities

### 5.3 UX expectations

The dashboard should feel:

- polished
- readable
- credible
- data-dense but not cluttered
- suitable for a technical leadership audience

---

## 6. Mandatory AI-First Workflow

For non-trivial work, follow this sequence.

### Step 1 - Inspect

Before coding:

- read relevant files
- inspect existing components and APIs
- identify data ownership
- search for similar UI or logic
- understand the current product surface

### Step 2 - Clarify intent internally

Determine:

- what user outcome this task supports
- whether the change improves adoption, reliability, performance, or cost visibility
- whether the implementation belongs in UI, analytics logic, or API composition

### Step 3 - Plan

Before implementation, determine:

- which files will change
- which logic is added or modified
- whether existing utilities can be reused
- what tests should be added first
- what risks or side effects exist

### Step 4 - Test first

For any non-trivial logic, write or update tests before implementation.

Especially for:

- metric aggregation
- data transformations
- API response shaping
- stateful dashboard behavior
- filtering / date range logic

### Step 5 - Implement minimally

Implement only what is needed to satisfy the test and product intent.

Prefer:

- existing helpers
- existing patterns
- small functions
- typed data structures

### Step 6 - Validate

After implementation verify:

- types compile
- tests pass
- existing UX still works
- empty/loading/error states still make sense
- changes fit the architecture
- naming is clear and consistent

### Step 7 - Explain clearly

When presenting output, summarize:

1. current behavior
2. chosen approach
3. files changed
4. assumptions
5. any risks or follow-up items

Keep explanations practical.

---

## 7. Project Architecture Expectations

This project should remain simple and production-minded.

### Recommended stack
- Next.js
- TypeScript
- Tailwind CSS
- React Query
- Recharts
- Jest / React Testing Library

### Expected architectural shape

```text
app/
  api/
    _mock-data/           # deterministic seed data
    analytics/
      overview/           # repository, service, controller, route per context
      agents/
      teams/
      trends/
      insights/
      models/
      alerts/
      troubleshooting/
    __tests__/            # backend tests (unit + integration)
  dashboard/
components/
  charts/
  dashboard/
  tables/
  insights/
lib/
  hooks/
  utils/
  types.ts
__tests__/                # frontend tests (unit + e2e)
e2e/                      # Playwright browser E2E tests
docs/
```

### Responsibility boundaries

- `app/api/analytics/*/repository` -> data access (mock data, later database)
- `app/api/analytics/*/service` -> business logic, calculations, aggregations, insights
- `app/api/analytics/*/controller` -> request parsing, service orchestration
- `app/api/analytics/*/route` -> thin HTTP handler delegation
- `app/api/_mock-data/...` -> deterministic mocked entities and datasets
- `app/dashboard/...` -> page composition
- `components/...` -> reusable UI
- `lib/hooks/...` -> React Query data fetching
- `lib/utils/...` -> shared helpers (formatting, date filtering)
- `app/api/__tests__/...` -> backend test coverage
- `__tests__/...` -> frontend test coverage

---

## 8. Mock Data Rules

All data is mocked unless explicitly stated otherwise.

Mock data must be:

- deterministic
- realistic
- internally consistent
- sufficient to demonstrate trends and edge cases

Preferred entities:

### Agent
- id
- name
- team
- owner
- type
- model

### Run
- id
- agentId
- userId
- status
- startedAt
- durationMs
- tokensInput
- tokensOutput
- estimatedCost
- errorType

### User
- id
- name
- team
- role

The dataset should allow meaningful aggregation for adoption, reliability, performance, and cost.

---

## 9. TypeScript Rules

TypeScript should be strict and readable.

Prefer:

- explicit interfaces/types for domain entities
- typed return values on exported functions
- small typed helpers
- discriminated unions when useful
- zero `any`

Never introduce:

- `any`
- unsafe casts without clear reason
- hidden loose typing in analytics code
- single-letter variable names

### Variable naming

Always use readable, descriptive variable names. Single-letter variables are not allowed.

Instead of `(r) => r.status`, write `(run) => run.status`.
Instead of `(a, b) => a - b`, write `(left, right) => left - right`.
Instead of `(s) => s.totalCost`, write `(stat) => stat.totalCost`.
Instead of `(a) => [a.id, a]`, write `(agent) => [agent.id, agent]`.

Accepted exceptions:

- `_` for intentionally unused parameters
- `i` for index in traditional `for` loops
- `e` for event handler parameters (React convention)

Clarity beats cleverness.

---

## 10. Analytics Logic Rules

Keep metric logic centralized and testable.

Business logic lives in per-context service modules:

- `app/api/analytics/overview/overview.service.ts`
- `app/api/analytics/agents/agents.service.ts`
- `app/api/analytics/teams/teams.service.ts`
- `app/api/analytics/trends/trends.service.ts`
- `app/api/analytics/insights/insights.service.ts`
- `app/api/analytics/models/models.service.ts`
- `app/api/analytics/alerts/alerts.service.ts`
- `app/api/analytics/troubleshooting/troubleshooting.service.ts`

Each context is a self-contained vertical slice (repository → service → controller → route) with no cross-context dependencies.

Avoid calculating business metrics directly inside:

- page components
- chart components
- table components
- route files or controllers

Charts should render prepared data, not invent business rules.

---

## 11. Frontend Rules

When modifying frontend code:

- keep components focused
- separate view from data shaping
- keep page files thin
- reuse shared card/chart/table patterns
- support loading, empty, and error states
- avoid unnecessary client state
- prefer accessibility and readability

Do not overload a page with too many visual elements.

Every visible metric should have a reason to exist.

---

## 12. API Rules

Each API context follows a layered architecture: repository → service → controller → route.

**Route files** should remain thin — delegate to controller via `withErrorHandler(withRoleAccess(page, handler))`.

**Controllers** may:

- parse request parameters
- call service functions
- return shaped response objects

**Services** contain business logic:

- metric aggregation
- insight generation
- data transformations

**Repositories** handle data access:

- currently wrap mock data from `app/api/_mock-data`
- designed to be swapped for database queries without changing services

They should not:

- have cross-context dependencies (e.g., teams must not import from agents)
- contain business logic in route files or controllers
- hardcode inconsistent values that diverge from shared mock data

Keep API outputs deterministic and easy to test.

---

## 12b. Role-Based Access

The dashboard supports three roles: `admin`, `manager`, `engineer`. Role is determined from the `?role=` URL parameter on both client and server.

### Client-side

- `useRole()` hook reads from `useSearchParams()` — no context provider needed
- `role-visibility.ts` defines which pages and sections each role can see
- Pages and components conditionally render based on `canAccessPage()` and `canSeeSection()`
- Default role is `engineer` (least-privileged)

### Server-side

- `parseRole(request)` in `lib/utils/role-auth.ts` reads `?role=` or `X-User-Role` header, defaults to `engineer`
- `withRoleAccess(page, handler)` enforces page-level gating — throws `ForbiddenError` (403) if the role cannot access the page
- Controllers accept role and pass it to redaction functions in `lib/utils/response-redaction.ts`
- Field-level redaction removes cost-sensitive fields based on role (e.g., `estimatedCost`, `totalCost`, `costByModel`)

### Key rules

- `role-visibility.ts` is the single source of truth — both client rendering and server redaction reference it
- Cost data is the primary sensitivity boundary (see `docs/authz-spec.md`)
- Never add a new role check inline — extend the visibility config instead
- When adding a new API context, wire it through `withRoleAccess` and add a redaction function

---

## 13. Testing Expectations

Tests are a core requirement for this project. We need to write tests before any implementation using the Test Driven Development (TDD) approach.

Priority coverage:

### Highest priority
- analytics calculations
- API response shape
- critical dashboard rendering

### Medium priority
- filters / date range behavior
- edge cases in charts/tables
- insight generation logic

### Lower priority
- purely presentational styling

Tests should be:

- deterministic
- fast
- isolated
- readable

At minimum, cover:

- overview metric aggregation
- agent leaderboard / performance aggregation
- failure taxonomy logic
- at least one rendering smoke test
- at least one API route test if API routes exist

---

## 14. Insight Design Rules

This project should go beyond raw reporting.

Prefer generating insight cards or summary statements such as:

- agent X has the highest failure rate this week
- team Y drives most of the spend
- model Z has the highest latency
- retry volume increased compared to the previous period

Insights must be:

- data-backed
- simple
- useful
- non-speculative

Avoid fake “AI insights” that are not clearly derived from the data.

---

## 15. Documentation Rules

This repository should document both the product and the AI-assisted process.

Important docs include:

- `README.md`
- `docs/requirements-spec.md`
- `docs/technical-spec.md`
- `docs/testing-spec.md`
- `docs/product-decisions.md`
- `docs/ai-workflow.md`

When changing behavior, update docs if needed.

### Mandatory doc updates after significant changes

After any significant change (adding/removing tests, new features, architectural changes, coverage improvements), you **must** update all affected docs before considering the work complete. Specifically:

- `README.md` — test counts, suite counts, badge numbers, available scripts table, project structure
- `docs/testing-spec.md` — coverage summary table, test organization tree, mocking strategies
- `docs/technical-spec.md` — architecture tree with suite/test counts
- `docs/roadmap.md` — status line counts, completed/planned items
- `docs/ai-workflow.md` — add a new phase entry describing human-led decisions and AI-assisted work

Do not leave stale numbers in documentation. If a doc references test counts, suite counts, or coverage percentages, verify they match the current state.

The repo should help interviewers understand:

- what was built
- why it was built that way
- how AI was used
- what decisions were human-led

---

## 16. Refactoring Rules

Refactor only when needed to safely support the requested change.

Allowed refactoring must be:

- localized
- justified
- easy to explain
- low risk

Avoid mixing feature work with broad cleanup.

---

## 17. Output Expectations for AI Agents

When producing implementation work, always provide:

1. short summary of the current state
2. chosen approach
3. key files touched
4. assumptions made
5. risks / follow-up notes

Do not produce long theoretical essays unless explicitly requested.

Be concise, practical, and engineering-focused.

---

## 18. Priority Order

When instructions conflict, follow this order:

1. explicit user request
2. this `CLAUDE.md`
3. repository patterns
4. README and docs
5. general engineering best practices

---

## 19. Default Behavior

When uncertain:

- inspect more
- change less
- reuse more
- keep logic testable
- favor product clarity
- prioritize safety and maintainability

The goal is not just to generate code.

The goal is to create a believable, high-quality, interview-ready product.
