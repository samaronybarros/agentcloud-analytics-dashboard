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
- Trend charts: runs over time, success/error/retry, latency (p50/p95), cost

### Agents
- Agent leaderboard table (runs, success rate, avg latency, cost)
- Top agents by usage
- Failure taxonomy breakdown

### Teams
- Usage by team breakdown
- Cost by model (donut chart)
- Top users table

### Optimization
- Insight cards: high-cost/low-success agents, rising failure trends, top cost drivers, degraded latency agents
- Optimization opportunity summaries

## Data Model

All data is deterministically mocked. See `CLAUDE.md` Section 8 for entity schemas (Agent, Run, User).

## Non-Functional Requirements

- No external services required — runs fully offline with mock data
- Deterministic outputs — same data on every load
- Production-quality code — typed, tested, maintainable
- Accessible and responsive UI
