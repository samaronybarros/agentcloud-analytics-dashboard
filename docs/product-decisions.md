# Product Decisions Log

This document records key product decisions, their rationale, and alternatives considered.

---

## PD-001: Four dashboard pages instead of one

**Decision:** Split the dashboard into Overview, Agents, Teams, and Optimization pages.

**Rationale:** A single page with all metrics would be overwhelming. The four-page structure maps to the four core questions the product answers: adoption (overview), reliability/performance (agents), team-level visibility (teams), and actionable optimization (optimization).

**Alternatives considered:** Single scrollable page, tab-based layout. Rejected because separate pages give clearer navigation and allow focused analysis.

---

## PD-002: Optimization page with insight cards, not just charts

**Decision:** The optimization page shows data-backed insight cards (e.g., "Agent X has the highest failure rate") rather than additional charts.

**Rationale:** The product goal is actionable insights, not raw reporting. Insight cards surface the "so what" that charts alone don't provide. This differentiates the dashboard from a generic metrics viewer.

---

## PD-003: Deterministic mock data over random generation

**Decision:** All mock data uses a seeded, deterministic generator. No `Math.random()`.

**Rationale:** Deterministic data makes tests reliable, screenshots reproducible, and demos consistent. It also makes it easier for reviewers to verify correctness.

---

## PD-004: No authentication or multi-tenancy

**Decision:** The dashboard assumes a single org context. No login, no tenant switching.

**Rationale:** Authentication is out of scope for this exercise. The focus is on analytics quality and product thinking, not infrastructure.

---

## PD-005: API routes serve mocked data directly

**Decision:** Next.js API routes call analytics functions with mock data and return shaped JSON. No database, no external service.

**Rationale:** This keeps the project self-contained and runnable with zero setup. The architecture still demonstrates proper separation (API → analytics → mock data) so it would be straightforward to swap in a real data source.

---

## PD-006: Active navigation highlighting via client component extraction

**Decision:** The sidebar nav is a separate `'use client'` component (`SidebarNav`), while the dashboard layout remains a server component.

**Rationale:** Active nav highlighting requires `usePathname()`, which needs a client component. Putting `'use client'` on the entire layout would make the layout's static HTML path-dependent, risking hydration mismatches. Extracting just the nav keeps the hydration-safe boundary minimal.

---

## PD-007: Severity-grouped insight cards

**Decision:** Insights on the Optimization page are grouped by severity (Critical → Warnings → Information) rather than by type.

**Rationale:** Severity-first grouping helps users prioritize action. A critical insight (high cost + low success) should appear above an informational one (top cost driver), regardless of category. Empty severity groups are hidden to avoid visual noise.

---

## PD-008: Color-coded success rates in agent leaderboard

**Decision:** Success rates in the agent leaderboard use color coding: green (≥90%), amber (≥70%), red (<70%).

**Rationale:** Color makes it immediately scannable which agents need attention. The thresholds (90/70) match common SRE conventions, making them intuitive for the target audience (engineering managers and platform teams).

---

## PD-009: Preset-based date range with Context API

**Decision:** Date range is managed via React Context (`useDateRange`) with four fixed presets: 7d, 14d, 30d, and "all".

**Rationale:** Presets make common time windows one-click accessible without calendar complexity. Context API keeps selection global across all dashboard pages, avoiding prop drilling. The "all" preset passes empty `from`/`to` values, allowing unrestricted filtering.

**Alternatives considered:** Calendar date picker, URL-based state. Calendar adds UX complexity without clear value for this scope. URL state was considered but Context is simpler and sufficient.

---

## PD-010: Daily bucketing for trends with p50/p95 latency percentiles

**Decision:** Trend data (runs, latency, cost) is bucketed by calendar day. Latency trends report p50 and p95 percentiles, not averages.

**Rationale:** Daily bucketing aligns with how users think about performance ("yesterday's numbers"). Percentiles — especially p95 — are more actionable than averages for identifying tail latency, which is standard SRE practice.

---

## PD-011: Inclusive date range filtering via string comparison

**Decision:** Date filtering uses string comparison (`date >= from && date <= to`), inclusive on both boundaries.

**Rationale:** YYYY-MM-DD format is lexicographically sortable, so string comparison is correct and avoids timezone issues from `Date` parsing. Inclusive boundaries match user expectations ("from the 1st to the 7th" means both days included).

---

## PD-012: React Query with 60-second stale time, no window refetch

**Decision:** React Query is configured globally with `staleTime: 60_000` and `refetchOnWindowFocus: false`.

**Rationale:** Analytics data doesn't need real-time updates. 60-second stale time balances cache efficiency with freshness. Disabling window refetch prevents unexpected re-fetches when switching tabs, keeping the UX predictable. Data refreshes on date range change via query key invalidation.

---

## PD-013: Locale-aware formatting with fixed decimal conventions

**Decision:** All numeric formatting uses `toLocaleString()`. Cost displays as `$X.XX`, percentages as `XX.X%`, latency as `NNNms` with comma separators.

**Rationale:** Locale-aware formatting respects regional conventions. Fixed decimal places (2 for cost, 1 for percentage) make metrics consistently scannable across the dashboard.

---

## PD-014: Mulberry32 PRNG with seed 42 for 500 runs over 30 days

**Decision:** Mock data uses the mulberry32 algorithm with seed 42. The dataset is 500 runs spanning 30 days (2026-03-01 to 2026-03-30), generated once at module load.

**Rationale:** 500 runs provide enough volume for meaningful trends and aggregation without being overwhelming. 30 days matches common analytics reporting periods. Module-level generation ensures data is created once and shared across all consumers.

---

## PD-015: Run status distribution — 75% success, 15% error, 10% retry

**Decision:** Mock runs follow a 75/15/10 split (success/error/retry). Error runs have longer duration (base + 1–4s extra).

**Rationale:** 75% success is realistic for production AI systems. Error runs being slower reflects real failure modes (timeouts, retries). This distribution gives the Optimization page enough anomalies to flag without being unrealistic.

---

## PD-016: User-agent team affinity at 70%

**Decision:** When generating a run, the assigned user is from the same team as the agent 70% of the time; otherwise a random user is picked.

**Rationale:** Creates realistic team cohesion (teams tend to use their own agents) while allowing cross-team usage. This makes team usage and cost breakdown metrics more interesting and believable.

---

## PD-017: Model-aware cost multipliers with ±20% variance

**Decision:** Estimated cost uses per-model multipliers (Sonnet ≈ 0.003, GPT-4o ≈ 0.0025, Haiku ≈ 0.0008, GPT-4o-mini ≈ 0.0004) with ±20% random variance per run.

**Rationale:** Reflects real LLM pricing differences. The variance prevents identical costs for same-model runs, mimicking real-world variability in token usage and pricing.

---

## PD-018: Agent leaderboard sorted by total runs, not cost or success rate

**Decision:** The agent leaderboard ranks agents by `totalRuns` descending.

**Rationale:** Sorting by volume answers the adoption question first — which agents are most actively used. Cost and reliability are visible in the same row for secondary comparison, but adoption drives the primary ordering.

---

## PD-019: Insight thresholds — median cost, p75 latency, 70% success, minimum 10 runs

**Decision:** Insight generation uses: cost > median AND success < 70% for high-cost-low-success; avg latency > p75 for degraded latency; success < 70% with minimum 10 runs for rising failures.

**Rationale:** Median is more robust than mean for cost comparison. P75 flags only the slowest quartile. 70% success aligns with SRE conventions (PD-008). Minimum 10 runs prevents false positives on low-volume agents.

---

## PD-020: Insight de-duplication — critical preempts warning

**Decision:** If an agent is flagged as "high-cost-low-success" (critical), it is excluded from "rising-failures" (warning) even if it qualifies.

**Rationale:** Avoids redundant insights on the same agent. The highest-severity insight takes precedence, keeping the Optimization page focused and actionable.

---

## PD-021: Centralized API error handler via higher-order function

**Decision:** All API routes use `withErrorHandler()`, which catches exceptions and returns `{ error: 'Internal server error' }` with status 500.

**Rationale:** Ensures consistent error responses across endpoints without repeated try-catch blocks. Prevents information leakage (no stack traces sent to client). Generic typing preserves type safety.

---

## PD-022: Discriminated union for RunStatus with nullable errorType

**Decision:** `RunStatus` is `'success' | 'error' | 'retry'`. `errorType` is `ErrorType | null`, set only on non-success runs.

**Rationale:** Type safety prevents accidentally assigning an error type to a successful run. The triple state allows the insights engine to distinguish retries (transient) from errors (potentially persistent).

---

## PD-023: Fixed entity counts — 10 agents, 8 users, 4 teams

**Decision:** 10 hardcoded agents and 8 hardcoded users across 4 teams (Platform, Data, Backend, Frontend), declared as `readonly` arrays.

**Rationale:** Hardcoding ensures complete determinism and makes data review trivial. The distribution (e.g., 3 agents in Platform, 2 in others) provides interesting aggregation scenarios without being unbalanced. Matches a plausible small org structure.

---

## PD-024: Client-side role-based views instead of server-side enforcement

**Decision:** Role switching is implemented as a client-side context (`RoleProvider`) with a "Viewing as" dropdown. The API returns full data; the UI conditionally renders pages and sections based on the active role.

**Rationale:** For a demo/interview dashboard with mock data, server-side enforcement adds complexity without value. The client-side approach lets reviewers instantly switch personas and see how the dashboard adapts. A production system would enforce access server-side, but the architectural pattern (declarative visibility config) would carry over.

**Alternatives considered:** Server-side role filtering in API routes. Rejected because it would require duplicating API endpoints or adding middleware, with no user-facing benefit for a demo.

---

## PD-025: Cost data as the primary role sensitivity boundary

**Decision:** The main distinction between roles is access to cost-sensitive data. Engineers see reliability and performance metrics but no cost KPIs, cost trends, cost table columns, cost insights, or cost alerts. Managers see most cost data but not org-wide model cost allocation (admin-only). Admins see everything.

**Rationale:** In real organizations, financial data (cloud spend, cost-per-model) is restricted to leadership. Platform engineers care about reliability, latency, and failure diagnosis — not budget allocation. This boundary is realistic, easy to explain, and creates a meaningful difference between roles without fragmenting the UX.

**Visibility summary:**

| Boundary | Admin | Manager | Engineer |
|----------|-------|---------|----------|
| Cost KPIs & trends | Yes | Yes | No |
| Cost table columns | Yes | Some | No |
| Teams page | Yes | Yes | No |
| Cost-by-model chart | Yes | No | No |
| Cost insights/alerts | Yes | Yes | No |
