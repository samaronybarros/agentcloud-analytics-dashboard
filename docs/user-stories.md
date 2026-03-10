# User Stories

## Personas

| Persona | Role | Primary Needs |
|---------|------|---------------|
| **Org Admin** | Executive / VP of Engineering | High-level adoption and cost visibility across the organization |
| **Engineering Manager** | Team lead / EM | Team-level reliability, performance, and resource allocation |
| **Platform / AI Enablement** | Platform engineer / SRE | Agent-level optimization, failure diagnosis, and operational health |

---

## Implemented

### Adoption — Overview Page

- [x] **US-001:** As an Org Admin, I want to see total runs, active users, and active agents at a glance so that I can assess overall platform adoption.
- [x] **US-002:** As an Engineering Manager, I want to see runs over time so that I can identify adoption trends and growth patterns.
- [x] **US-003:** As an Org Admin, I want to see token volume and estimated cost so that I can understand platform-wide resource consumption.

### Reliability — Agents Page

- [x] **US-004:** As a Platform Engineer, I want to see a leaderboard of agents ranked by usage so that I can identify which agents are most critical to the organization.
- [x] **US-005:** As a Platform Engineer, I want to see success rate per agent so that I can quickly identify unreliable agents that need attention.
- [x] **US-006:** As a Platform Engineer, I want to see a failure taxonomy breakdown so that I can understand the types of errors occurring and prioritize fixes.

### Performance — Overview & Agents Pages

- [x] **US-007:** As an Engineering Manager, I want to see average and p95 latency so that I can assess whether agents meet performance expectations.
- [x] **US-008:** As a Platform Engineer, I want to see latency trends (p50/p95) over time so that I can detect performance degradation early.
- [x] **US-009:** As an Engineering Manager, I want to see cost trends over time so that I can track spending and forecast budgets.

### Cost — Teams Page

- [x] **US-010:** As an Org Admin, I want to see usage broken down by team so that I can understand which teams drive the most activity and cost.
- [x] **US-011:** As an Org Admin, I want to see cost broken down by model so that I can evaluate whether model selection is cost-efficient.
- [x] **US-012:** As an Engineering Manager, I want to see top users by run count and cost so that I can identify power users and potential outliers.

### Optimization — Optimization Page

- [x] **US-013:** As a Platform Engineer, I want to see which agents have high cost but low success rate so that I can prioritize remediation of wasteful agents.
- [x] **US-014:** As a Platform Engineer, I want to be alerted to rising failure trends so that I can intervene before reliability degrades further.
- [x] **US-015:** As an Engineering Manager, I want to see agents with degraded latency so that I can investigate root causes and reassign workloads.
- [x] **US-016:** As an Org Admin, I want to see top cost drivers so that I understand where budget is being spent.

### Date Filtering

- [x] **US-017:** As any user, I want to filter all dashboards by time range (7d, 14d, 30d, all) so that I can focus on the period relevant to my analysis.

### UX Foundations

- [x] **US-018:** As any user, I want clear loading states so that I know data is being fetched and the page is not broken.
- [x] **US-019:** As any user, I want meaningful error messages so that I can understand what went wrong and how to recover.
- [x] **US-020:** As any user, I want empty state guidance when no data matches my filters so that I know to adjust my date range.

---

## Implemented — New Dashboards & Views

### Alerts Dashboard

- [x] **US-021:** As a Platform Engineer, I want an alerts dashboard that surfaces threshold breaches and anomalies so that I can respond to critical issues quickly.
- [x] **US-022:** As an Engineering Manager, I want to see alerts grouped by severity so that I can prioritize which problems to address first.

### Model Reliability & Efficiency

- [x] **US-029:** As a Platform Engineer, I want to compare models by success rate, latency, and cost per token so that I can recommend the best model for each use case.
- [x] **US-030:** As an Org Admin, I want to see which models deliver the best reliability per dollar so that I can guide model selection policy.

---

## Implemented — Troubleshooting

- [x] **US-034:** As a Platform Engineer, I want a troubleshooting view that surfaces error patterns and suggests remediation steps so that I can resolve agent failures faster.
- [x] **US-035:** As an Engineering Manager, I want to see which error types are most common for my team's agents so that I can allocate engineering effort effectively.

---

## Implemented — User Roles & Permissions

- [x] **US-036:** As an Org Admin, I want role-based views (admin, manager, engineer) so that users only see data relevant to their scope.

---

## Implemented — Infrastructure (Partial)

- [x] **US-042:** As a developer, I want the backend structured with DDD so that swapping mock data for a real database requires minimal changes.

---

## Planned — New Dashboards & Views

### Time Saved

- [ ] **US-023:** As an Org Admin, I want to see how much time agents have saved the organization so that I can justify platform investment and measure ROI.
- [ ] **US-024:** As an Engineering Manager, I want to see time saved per team so that I can identify which teams benefit most from automation.

### High Failure Rate Agents

- [ ] **US-025:** As a Platform Engineer, I want a dedicated view of agents with high failure rates so that I can drill into error patterns and prioritize fixes.
- [ ] **US-026:** As a Platform Engineer, I want to see failure rate trends per agent so that I can determine if an agent is improving or degrading over time.

### Team Performance vs Cost

- [ ] **US-027:** As an Org Admin, I want to compare team output and reliability against their cost so that I can evaluate efficiency across teams.
- [ ] **US-028:** As an Engineering Manager, I want to benchmark my team's agent performance against other teams so that I can identify improvement opportunities.

---

## Planned — Filtering & Navigation

- [ ] **US-031:** As an Engineering Manager, I want to filter dashboards by team so that I can focus on my team's agents and metrics.
- [ ] **US-032:** As a Platform Engineer, I want to filter the agent leaderboard by model or status so that I can narrow down to specific agent types.
- [ ] **US-033:** As any user, I want to select a custom date range with a calendar picker so that I can analyze specific time windows beyond the presets.
- [ ] **US-037:** As an Engineering Manager, I want my dashboard to default to my team's data so that I see relevant information without manual filtering.

---

## Planned — AI Analytics Assistant

- [ ] **US-043:** As an Org Admin, I want an AI-powered chat panel that can cross-reference dashboard data (adoption, cost, reliability, performance) and suggest new dashboard views, KPIs, or optimizations so that I can uncover insights I might not think to look for.
- [ ] **US-044:** As an Engineering Manager, I want to ask the AI assistant questions about my team's metrics (e.g., "Which agents are getting worse?", "Where should I cut cost?") so that I can get actionable recommendations without manually analyzing charts.

---

## Planned — Export & Reporting

- [ ] **US-038:** As an Org Admin, I want to export dashboard data as CSV or PDF so that I can share reports with stakeholders who don't use the dashboard.
- [ ] **US-039:** As an Engineering Manager, I want to download a snapshot of current metrics so that I can include them in status updates and reviews.

---

## Planned — Infrastructure

- [ ] **US-040:** As a developer, I want the application containerized with Docker so that I can run it consistently across environments.
- [ ] **US-041:** As a developer, I want CI/CD pipelines that run lint, test, and build gates so that code quality is enforced automatically on every change.

---

## Acceptance Criteria Conventions

Each story, when implemented, should satisfy:

1. **Functional** — the feature works as described
2. **Tested** — analytics logic and component rendering are covered by tests (TDD)
3. **Typed** — no `any`, explicit return types, domain types used
4. **Accessible** — keyboard navigable, proper ARIA attributes
5. **State-complete** — loading, error, and empty states handled
