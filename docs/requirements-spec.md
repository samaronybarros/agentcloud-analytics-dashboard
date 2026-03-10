# Requirements Specification

## Product Overview

AgentCloud Analytics Dashboard is a customer-facing analytics tool for organizations that run AI agents in the cloud. It serves org admins, engineering managers, and platform/AI enablement teams.

## Core Questions the Dashboard Answers

1. **Are teams adopting cloud agents?** — Adoption metrics: active users, active agents, runs over time, usage by team.
2. **Which agents are reliable?** — Reliability metrics: success rate, failure taxonomy, error trends, retry volume.
3. **Which agents perform well?** — Performance metrics: average latency, p95 latency, latency trends per agent.
4. **Where is cost concentrated?** — Cost metrics: estimated cost, cost by model, cost by team, top cost drivers.
5. **Where can we optimize?** — Insight views: high-cost/low-success agents, degraded latency, rising failures, optimization opportunities.

## Target Users

| Persona | Needs |
|---------|-------|
| Org Admin | High-level adoption and cost visibility |
| Engineering Manager | Team-level reliability and performance |
| Platform / AI Enablement | Agent-level optimization and failure diagnosis |

## Dashboard Pages

### Overview
- 8 KPI cards: total runs, active users, active agents, success rate, avg latency, p95 latency, token volume, estimated cost
- Trend charts: runs over time, day-of-week distribution, latency (p50/p95), cost

### Agents
- Agent leaderboard table (runs, success rate, avg latency, cost)
- Cost vs reliability scatter plot
- Failure taxonomy breakdown

### Teams
- Team usage table (with success rate, avg latency)
- Team comparison bar chart
- Cost by model (donut chart)
- Top users table

### Models
- Model performance table: success rate, latency, cost per token, throughput
- Model comparison across key dimensions

### Optimization
- Insight cards: high-cost/low-success agents, rising failure trends, top cost drivers, degraded latency agents
- Severity-grouped (critical/warning/information)

### Alerts
- Alert cards with severity classification
- Threshold breaches and anomaly detection
- Critical events requiring immediate attention

### Troubleshooting
- Error timeline chart
- Agent error breakdown table
- Failure pattern analysis and remediation guidance

## Data Model

All data is deterministically mocked. See `CLAUDE.md` Section 8 for entity schemas (Agent, Run, User).

## Role-Based Views

The dashboard supports three user personas with differentiated access:

| Role | Pages Visible | Cost Data | Primary Focus |
|------|--------------|-----------|---------------|
| Org Admin | All 7 pages | Full access | Adoption, cost, org-wide visibility |
| Engineering Manager | 6 pages (no Teams cost-by-model) | Partial | Team reliability, performance |
| Platform Engineer | 5 pages (no Teams) | None | Agent optimization, failure diagnosis |

Cost-sensitive data (estimated cost, cost trends, cost-by-model) is the primary sensitivity boundary between roles. See PD-024 and PD-025 for rationale.

**Current implementation:** Client-side only (demo-grade). The API returns full data; the UI conditionally renders based on the active role. See `docs/authz-spec.md` for the server-side enforcement plan.

## Non-Functional Requirements

- No external services required — runs fully offline with mock data
- Deterministic outputs — same data on every load
- Production-quality code — typed, tested, maintainable
- Accessible and responsive UI
