# Wireframes

Low-fidelity ASCII wireframes representing the layout intent for each dashboard page.

---

## Common Layout

All pages share a sidebar + header + content grid structure:

```
┌───────────────┬─────────────────────────────────────────┐
│               │  [Date: 7d ▾ 14d  30d  All]             │
│    SIDEBAR    │─────────────────────────────────────────│
│               │                                         │
│ Overview      │              PAGE CONTENT               │
│ Agents        │                                         │
│ Teams         │                                         │
│ Models        │                                         │
│ Optimization  │                                         │
│ Alerts        │                                         │
│ Troubleshoot  │                                         │
│               │                                         │
└───────────────┴─────────────────────────────────────────┘
```

- Sidebar: fixed left, 7 nav items with active route highlighting (role-filtered)
- Header: date range picker (presets)
- Role selection: via URL search param (`?role=admin`, `?role=manager`, `?role=engineer`)
- Content: responsive grid below header

---

## Overview Page

```
┌──────────────────────────────────────────────────────────┐
│  KPI CARDS (4 per row, 2 rows)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │Total Runs│ │Active    │ │Active    │ │Success   │    │
│  │  1,234   │ │Users: 8  │ │Agents:10 │ │Rate: 75% │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │Avg Lat.  │ │P95 Lat.  │ │Token Vol │ │Est. Cost │    │
│  │  340ms   │ │  890ms   │ │ 1.2M     │ │ $456.78  │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                          │
│  TREND CHARTS (2x2 grid)                                 │
│  ┌────────────────────┐ ┌────────────────────┐           │
│  │ Runs Over Time     │ │ Runs by Day of Wk  │           │
│  │ ▁▂▃▅▇▆▅▃▂▁        │ │ Mon Tue Wed ...     │           │
│  └────────────────────┘ └────────────────────┘           │
│  ┌────────────────────┐ ┌────────────────────┐           │
│  │ Latency Trend      │ │ Cost Trend          │           │
│  │ p50 ── p95 ──      │ │ $▁▂▃▅▇            │           │
│  └────────────────────┘ └────────────────────┘           │
└──────────────────────────────────────────────────────────┘
```

**Role behavior**: Engineer sees 6 KPI cards (no cost KPIs) and 3 trend charts (no cost trend).

---

## Agents Page

```
┌──────────────────────────────────────────────────────────┐
│  AGENT LEADERBOARD TABLE                                 │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Agent     │ Team │ Runs │ Success │ Lat. │ Cost  │    │
│  │ agent-01  │ Plat │  78  │  82%    │ 320  │ $45   │    │
│  │ agent-02  │ Data │  65  │  71%    │ 450  │ $38   │    │
│  │ ...       │      │      │         │      │       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────┐ ┌────────────────────┐           │
│  │ Cost vs Reliability│ │ Failure Taxonomy    │           │
│  │  Scatter Plot      │ │  Pie Chart          │           │
│  │  ● ●  ●           │ │  ▓ timeout  35%     │           │
│  │    ●     ●         │ │  ░ rate_limit 25%   │           │
│  └────────────────────┘ └────────────────────┘           │
└──────────────────────────────────────────────────────────┘
```

**Role behavior**: Engineer sees no cost column in table, no cost-vs-reliability scatter.

---

## Teams Page

```
┌──────────────────────────────────────────────────────────┐
│  TEAM USAGE TABLE                                        │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Team      │ Runs │ Users │ Success │ Lat. │ Cost │    │
│  │ Platform  │  180 │   3   │  78%    │ 340  │ $120 │    │
│  │ Data      │  150 │   2   │  80%    │ 290  │ $95  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────┐ ┌────────────────────┐           │
│  │ Team Comparison    │ │ Cost by Model       │           │
│  │  Bar Chart         │ │  Donut Chart        │           │
│  │ ▇▅▃▂ by team      │ │  ◉ Sonnet 40%      │           │
│  └────────────────────┘ └────────────────────┘           │
│                                                          │
│  TOP USERS TABLE                                         │
│  ┌──────────────────────────────────────────────────┐    │
│  │ User      │ Team │ Runs │ Cost                    │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

**Role behavior**: Entire page restricted from engineers. Cost-by-model restricted from managers.

---

## Models Page

```
┌──────────────────────────────────────────────────────────┐
│  MODEL PERFORMANCE TABLE                                 │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Model       │ Runs │ Success │ Lat. │ $/tok │ Tput│   │
│  │ Sonnet      │  150 │  78%    │ 380  │ 0.003 │ 120 │   │
│  │ GPT-4o      │  130 │  82%    │ 290  │ 0.002 │ 145 │   │
│  │ Haiku       │  120 │  85%    │ 180  │ 0.001 │ 200 │   │
│  │ GPT-4o-mini │  100 │  88%    │ 150  │ 0.000 │ 250 │   │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

**Role behavior**: Engineer sees no cost-per-token column.

---

## Optimization Page

```
┌──────────────────────────────────────────────────────────┐
│  CRITICAL INSIGHTS                                       │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 🔴 Agent X: high cost ($89) + low success (45%)  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  WARNING INSIGHTS                                        │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 🟡 Agent Y: latency degraded (p95 > 2s)          │    │
│  │ 🟡 Rising failures: Agent Z (+15% this week)     │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  INFORMATION INSIGHTS                                    │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 🔵 Top cost driver: Team Platform ($320 total)   │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

**Role behavior**: Engineer sees no cost-related insights.

---

## Alerts Page

```
┌──────────────────────────────────────────────────────────┐
│  ALERT CARDS (grouped by severity)                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ CRITICAL │ Agent X success rate below 50%         │    │
│  │          │ Triggered: 2h ago │ Status: active     │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │ WARNING  │ P95 latency spike on Agent Y (>2s)     │    │
│  │          │ Triggered: 6h ago │ Status: active     │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │ INFO     │ Token usage anomaly on Team Data       │    │
│  │          │ Triggered: 1d ago │ Status: resolved   │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

**Role behavior**: Engineer sees no cost-related alerts.

---

## Troubleshooting Page

```
┌──────────────────────────────────────────────────────────┐
│  ERROR TIMELINE CHART                                    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Errors over time (stacked area)                  │    │
│  │  ▁▂▃▅▇▆▅ timeout                                │    │
│  │  ▁▁▂▃▃▂▁ rate_limit                             │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  AGENT ERROR BREAKDOWN TABLE                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Agent     │ Total Errors │ Top Error │ % of Total│    │
│  │ agent-01  │     14       │ timeout   │   64%     │    │
│  │ agent-03  │     11       │ rate_lim  │   55%     │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## Design Notes

- All wireframes are low-fidelity representations of the implemented layout
- Actual implementation uses Tailwind CSS utility classes for spacing and grid
- Charts use Recharts components (ResponsiveContainer, LineChart, BarChart, PieChart, ScatterChart)
- Tables use standard HTML tables with Tailwind styling
- Cards use a shared card wrapper component with consistent padding and borders
