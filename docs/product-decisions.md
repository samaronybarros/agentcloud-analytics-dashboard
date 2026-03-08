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
