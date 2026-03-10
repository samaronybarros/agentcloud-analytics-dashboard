# Metric Rationale

This document explains why each metric exists in the dashboard, which persona needs it, what decision it supports, and why it was chosen over alternatives.

---

## Overview KPIs (8 metrics)

These appear on the Overview page as top-level KPI cards, providing at-a-glance organizational health.

| Metric | Persona | Decision it supports | Why this metric | Alternatives considered | Page/Section | Ref |
|--------|---------|---------------------|----------------|------------------------|--------------|-----|
| Total runs | All | "Is the platform being used?" | Volume is the most fundamental adoption signal. Without it, nothing else contextualizes. | Unique sessions (too complex for agent workloads) | Overview KPI | Human-led |
| Active users | Org Admin, Manager | "How many people rely on agents?" | Distinguishes adoption breadth from a single power user inflating run counts. | Registered users (vanity metric — doesn't measure usage) | Overview KPI | Human-led |
| Active agents | Org Admin, Platform Eng | "How much of the fleet is in use?" | Identifies dormant agents. A fleet with 10 agents but only 3 active signals underutilization. | Total agents (static, not actionable) | Overview KPI | Human-led |
| Success rate | All | "Is the platform reliable?" | Single number that answers "are things working?" Color-coded thresholds (green >= 90%, amber >= 70%, red < 70%) per PD-008. | Error count (doesn't scale with volume — 10 errors in 100 runs vs 10,000 runs is very different) | Overview KPI | Human-led |
| Avg latency | Manager, Platform Eng | "Are agents fast enough?" | Baseline performance indicator. Combined with p95, gives full latency picture. | Median (p50 is in trend charts; avg is more intuitive for KPI cards) | Overview KPI | Human-led |
| P95 latency | Platform Eng | "What's the worst-case user experience?" | Tail latency catches degradation that averages hide. Standard SRE practice per PD-010. | p99 (too noisy with 500 runs), max (single outlier distortion) | Overview KPI | Human-led |
| Token volume | Org Admin | "How much LLM capacity are we consuming?" | Proxy for platform load and scaling needs. Complements cost by showing raw consumption regardless of model pricing. | API call count (doesn't reflect workload size — a 10-token call vs 10,000-token call are very different) | Overview KPI, admin/manager only | Human-led |
| Estimated cost | Org Admin, Manager | "How much are we spending?" | Direct financial signal. Uses per-model cost multipliers (PD-017) for realistic attribution. | Actual billing (requires external integration, out of scope) | Overview KPI, admin/manager only | PD-017 |

**Role visibility:** Token volume and estimated cost are hidden from engineers (PD-025).

---

## Trend Charts

Displayed on the Overview page below KPI cards. Provide temporal context that point-in-time KPIs cannot.

| Chart | Persona | Decision it supports | Why this metric | Where | Ref |
|-------|---------|---------------------|----------------|-------|-----|
| Runs over time (daily) | All | "Is adoption growing, stable, or declining?" | Trend direction matters more than absolute numbers for planning. Daily bucketing matches leadership review cadence (PD-010). | Overview | PD-010 |
| Success/error/retry trend | Platform Eng, Manager | "Is reliability improving or degrading?" | Stacked area shows composition changes. A spike in retries may precede an error spike — early warning signal. | Overview | Human-led |
| Latency trend (p50/p95) | Platform Eng | "Is performance degrading over time?" | Two percentile lines reveal whether degradation is broad (p50 rising) or tail-only (p95 rising while p50 stable). | Overview | PD-010 |
| Cost trend (daily) | Org Admin, Manager | "Is spending on track or accelerating?" | Enables budget forecasting. A sudden spike prompts investigation. | Overview, admin/manager only | Human-led |
| Runs by day of week | Manager | "Are there usage patterns by day?" | Reveals workload distribution. Low weekend usage is expected; low Monday usage may signal adoption problems. | Overview | Human-led |

---

## Agent Metrics (Agents Page)

Agent-level analytics for identifying which agents need attention.

| Metric / View | Persona | Decision it supports | Why this metric | Where | Ref |
|---------------|---------|---------------------|----------------|-------|-----|
| Agent leaderboard (sorted by total runs) | All | "Which agents are most used?" | Adoption-first ordering answers the most common question. Cost and success rate visible in the same row for secondary comparison (PD-018). | Agents table | PD-018 |
| Success rate per agent | Platform Eng | "Which agents are unreliable?" | Color-coded (PD-008) for instant scanning. Minimum run threshold in insights prevents flagging low-volume agents. | Agents table column | PD-008 |
| Avg latency per agent | Platform Eng | "Which agents are slow?" | Enables comparison across agents. Combined with success rate, reveals agents that are both slow and unreliable. | Agents table column | Human-led |
| Total cost per agent | Org Admin, Manager | "Which agents are expensive?" | Cost visibility at agent level enables optimization decisions. Hidden from engineers (PD-025). | Agents table column, admin/manager only | PD-025 |
| Cost vs reliability scatter | Org Admin, Manager | "Which agents are wasteful (high cost, low success)?" | Two-dimensional view reveals agents in the "expensive and unreliable" quadrant — the highest-priority optimization targets. | Agents page, admin/manager only | Human-led |
| Failure taxonomy | Platform Eng | "What kinds of errors are happening?" | Categorized errors (timeout, rate-limit, auth-failure, invalid-input, internal-error) enable targeted remediation rather than generic "fix errors." | Agents page bar chart | PD-022 |

---

## Team Metrics (Teams Page)

Cross-team visibility for organizational leadership. Entire page restricted to admin and manager roles.

| Metric / View | Persona | Decision it supports | Why this metric | Where | Ref |
|---------------|---------|---------------------|----------------|-------|-----|
| Team usage table | Org Admin, Manager | "Which teams drive the most activity?" | Shows runs, active agents, active users, cost, success rate, and avg latency per team. Comprehensive team health snapshot. | Teams table | Human-led |
| Success rate per team | Manager | "Is my team's reliability acceptable?" | Enables cross-team benchmarking. A team with 60% success rate needs different intervention than one at 90%. | Teams table column | Human-led |
| Avg latency per team | Manager | "Are my team's agents performing well?" | Cross-team latency comparison highlights whether performance issues are team-specific or platform-wide. | Teams table column | Human-led |
| Team comparison chart | Org Admin | "How do teams compare at a glance?" | Bar chart comparing runs across teams. Visual comparison is faster than reading table rows. | Teams page | Human-led |
| Cost by model (donut) | Org Admin | "Is model selection cost-efficient?" | Reveals spend concentration by model. If 80% of cost is on the most expensive model, there may be optimization opportunities. Admin-only (PD-025). | Teams page, admin only | PD-025 |
| Top users table | Org Admin, Manager | "Who are the power users and outliers?" | Identifies individuals driving disproportionate usage or cost. Useful for training, recognition, or investigation. | Teams page | Human-led |

---

## Model Metrics (Models Page)

Model-level performance comparison for platform engineers and admins evaluating model selection policy.

| Metric / View | Persona | Decision it supports | Why this metric | Where | Ref |
|---------------|---------|---------------------|----------------|-------|-----|
| Model performance table | All | "Which model performs best for our workloads?" | Compares models by success rate, latency, runs, and tokens. | Models table | Human-led |
| Success rate per model | Platform Eng | "Which models are most reliable?" | Model-level reliability informs selection decisions. A cheaper model with 60% success rate may cost more in retries. | Models table column | Human-led |
| Avg latency per model | Platform Eng | "Which models are fastest?" | Latency varies significantly across models. Platform teams need this for SLA decisions. | Models table column | Human-led |
| Total cost per model | Org Admin | "Where is model spend concentrated?" | Admin-only column. Shows absolute spend per model for budget allocation. | Models table, admin/manager only | PD-025 |
| Cost per 1K tokens | Org Admin | "Which models are cost-efficient?" | Normalizes cost by volume. A model with high total cost but low per-token cost is heavily used, not necessarily wasteful. Admin-only. | Models table, admin only | Human-led |
| Total tokens per model | Platform Eng | "Which models handle the most throughput?" | Throughput context for interpreting cost and latency numbers. | Models table column | Human-led |

---

## Optimization Insights (Optimization Page)

Severity-grouped insight cards that surface actionable findings. This page differentiates the dashboard from raw reporting tools.

| Insight type | Severity | Persona | Decision it supports | Threshold logic | Where | Ref |
|-------------|----------|---------|---------------------|----------------|-------|-----|
| High cost, low success | Critical | Org Admin, Manager | "Which agents are wasting money?" | Cost > median AND success < 70%, minimum 10 runs | Optimization page | PD-019 |
| Rising failures | Warning | Platform Eng, Manager | "Which agents are getting worse?" | Success < 70% with minimum 10 runs (de-duplicated against critical) | Optimization page | PD-019, PD-020 |
| Degraded latency | Warning | Platform Eng | "Which agents are slowing down?" | Avg latency > p75 across all agents | Optimization page | PD-019 |
| Top cost drivers | Info | Org Admin | "Where does the budget go?" | Highest total cost agents | Optimization page, admin/manager only | PD-025 |

**Design decisions:**
- Insights grouped by severity, not by type (PD-007) — helps users prioritize action
- Critical preempts warning on the same agent (PD-020) — prevents duplicate noise
- Minimum 10 runs required (PD-019) — prevents false positives on low-volume agents
- Cost insights hidden from engineers (PD-025)

---

## Alerts (Alerts Page)

Threshold-based alerts that surface breaches requiring immediate attention. Distinct from insights: alerts are about current state violations, insights are about patterns.

| Alert metric | Persona | Decision it supports | What it monitors | Where | Ref |
|-------------|---------|---------------------|-----------------|-------|-----|
| Success rate breach | All | "Is an agent below reliability threshold right now?" | Agent success rate falling below defined threshold | Alerts page | Human-led |
| Cost breach | Org Admin, Manager | "Is an agent exceeding its cost budget?" | Agent cost exceeding threshold. Hidden from engineers (PD-025). | Alerts page, admin/manager only | PD-025 |
| Latency breach | Platform Eng | "Is an agent violating its latency SLA?" | Agent latency exceeding threshold | Alerts page | Human-led |
| Error spike | Platform Eng | "Is there an abnormal error surge?" | Sudden increase in error volume for an agent or team | Alerts page | Human-led |

**Status model:** Each alert is `breached` or `ok`. The alerts page shows a breached count summary alongside the alert list.

---

## Troubleshooting (Troubleshooting Page)

Error diagnosis tools for platform engineers investigating failures. Full access for all roles — reliability data is not cost-sensitive.

| Metric / View | Persona | Decision it supports | Why this metric | Where | Ref |
|---------------|---------|---------------------|----------------|-------|-----|
| Error timeline | Platform Eng | "When did errors happen?" | Daily errors + retries over time. Reveals whether failures are episodic or chronic. | Troubleshooting chart | Human-led |
| Per-agent error breakdown | Platform Eng | "Which agents fail and why?" | Shows total errors, errors by type, and top error type per agent. Enables targeted investigation. | Troubleshooting table | Human-led |
| Top error type per agent | Platform Eng | "What's the most common failure mode for each agent?" | Prioritizes remediation — fixing the top error type yields the biggest improvement. | Troubleshooting table column | Human-led |
| Remediation suggestions | Platform Eng | "What should I do about this error?" | Maps error types to actionable remediation steps. Reduces mean time to resolution. | Troubleshooting table column | Human-led |
| Total errors / total retries | All | "How bad is the overall error situation?" | Summary KPIs at the top of the page. Quick health check before diving into details. | Troubleshooting KPI summary | Human-led |

---

## Metric-to-Page Matrix

Summary of where each metric category appears and which roles can see it.

| Metric group | Overview | Agents | Teams | Models | Optimization | Alerts | Troubleshooting |
|-------------|----------|--------|-------|--------|-------------|--------|----------------|
| Adoption KPIs | Admin, Manager, Eng | — | — | — | — | — | — |
| Cost KPIs | Admin, Manager | — | — | — | — | — | — |
| Trend charts | All (cost: Admin, Manager) | — | — | — | — | — | — |
| Agent leaderboard | — | All (cost col: Admin, Manager) | — | — | — | — | — |
| Failure taxonomy | — | All | — | — | — | — | — |
| Team usage | — | — | Admin, Manager | — | — | — | — |
| Cost by model | — | — | Admin | — | — | — | — |
| Top users | — | — | Admin, Manager | — | — | — | — |
| Model comparison | — | — | — | All (cost cols: Admin) | — | — | — |
| Optimization insights | — | — | — | — | All (cost: Admin, Manager) | — | — |
| Threshold alerts | — | — | — | — | — | All (cost: Admin, Manager) | — |
| Error diagnosis | — | — | — | — | — | — | All |

---

## Attribution

| Aspect | Led by |
|--------|--------|
| Metric selection and prioritization | Human-led |
| Threshold values (success rate, latency percentiles, cost median) | Human-led, informed by SRE conventions |
| Role-based visibility boundaries | Human-led (PD-024, PD-025) |
| Insight severity classification | Human-led (PD-007, PD-019, PD-020) |
| Metric documentation and rationale writeup | AI-assisted |
| Alternatives-considered analysis per metric | AI-assisted |
