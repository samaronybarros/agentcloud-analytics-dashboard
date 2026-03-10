# Research Scope

## Problem Framing

Organizations adopting AI agents at scale face a visibility gap: they can deploy agents but lack tools to understand adoption patterns, reliability trends, cost drivers, and optimization opportunities. Without analytics, teams cannot answer basic questions like "which agents are failing?" or "where is budget going?"

This dashboard addresses that gap for three distinct personas within engineering organizations.

---

## Research Questions

| # | Question | Dashboard Answer |
|---|----------|-----------------|
| 1 | Are teams actually adopting AI agents? | Overview page: runs, active users, active agents, trends |
| 2 | Which agents are reliable and which are failing? | Agents page: success rate, failure taxonomy; Troubleshooting page |
| 3 | Where is cost concentrated? | Teams page: cost by team, model; Overview: cost KPI + trend |
| 4 | Which agents should be optimized or retired? | Optimization page: high-cost/low-success, degraded latency |
| 5 | How do different models compare? | Models page: success rate, latency, cost per token, throughput |
| 6 | What needs immediate attention? | Alerts page: threshold breaches, anomalies, critical events |

---

## Target Personas

| Persona | Pain Points | Dashboard Value |
|---------|------------|-----------------|
| **Org Admin** | No visibility into org-wide AI spend; can't justify platform investment; doesn't know adoption levels | Overview KPIs, cost trends, team comparisons, cost-by-model |
| **Engineering Manager** | Can't assess team agent reliability; no performance benchmarks; blind to cost outliers in their teams | Agent leaderboard, team usage, latency trends, optimization insights |
| **Platform Engineer** | Can't diagnose agent failures quickly; no systematic view of error patterns; unclear which agents need work | Failure taxonomy, troubleshooting view, alerts, degraded latency insights |

---

## Scope Boundaries

### In Scope
- Dashboard analytics for a single organization (no multi-tenancy)
- Four dimensions: adoption, reliability, performance, cost
- Seven dashboard pages with role-based views
- Deterministic mock data for demo/interview purposes
- Client-side role switching for persona demonstration
- TDD-first development with comprehensive test coverage

### Out of Scope
- Authentication and authorization server-side enforcement
- Real database or data pipeline integration
- Real-time streaming or WebSocket updates
- Multi-organization / tenant isolation
- Export, reporting, or scheduled digests
- AI-powered chat assistant
- Mobile-responsive layout

---

## Key Assumptions

1. **Mock data is sufficient for evaluation** — reviewers can assess product quality from deterministic data without needing a real backend
2. **Three roles cover the audience** — admin, manager, engineer map to real org structures
3. **Cost is the primary sensitivity boundary** — engineers care about reliability, not budget allocation
4. **500 runs over 30 days** — enough volume for meaningful aggregation without overwhelming the UI
5. **Four models** — Sonnet, GPT-4o, Haiku, GPT-4o-mini represent realistic model diversity

---

## Decision Authority

| Aspect | Led By |
|--------|--------|
| Problem framing and personas | Human |
| Research question prioritization | Human |
| Scope boundaries | Human |
| Metric selection for each persona | Human |
| Implementation of metrics and views | AI (within human-set constraints) |
| Mock data distribution design | Human (ratios); AI (generation) |
