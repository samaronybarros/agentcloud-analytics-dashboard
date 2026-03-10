# Prototype & Design Iteration Notes

## Design Iteration Log

### Iteration 1: Four-Page Foundation (Phase 4)

**Pages:** Overview, Agents, Teams, Optimization

**Layout decisions (human-led):**
- Left sidebar navigation for clear page structure (PD-001)
- KPI cards in a 4-column grid for scanability
- Severity-grouped insight cards instead of more charts (PD-002)
- Color-coded success rates for instant visual scanning (PD-008)

**What worked:**
- Four pages mapped cleanly to the four core questions (adoption, reliability, performance, cost)
- Insight cards on the Optimization page provided clear actionable takeaways
- KPI card grid was data-dense without being cluttered

**What needed improvement:**
- Agents page lacked visual comparison tools (just a table)
- Overview had no day-of-week distribution view
- Teams page had no visual comparison between teams

---

### Iteration 2: Chart Additions (Phase 6 — Review Graphics)

**Added (human-led selection):**
- Cost vs Reliability scatter plot on Agents page
- Runs by Day of Week bar chart on Overview page
- Team Comparison bar chart on Teams page
- Success rate and avg latency columns added to Team Usage table

**Rationale:**
- Scatter plot enables quick identification of "bad quadrant" agents (high cost, low success)
- Day-of-week shows usage patterns (weekday vs weekend) for capacity planning
- Team comparison chart provides visual ranking that tables don't convey as quickly
- Augmented team table gives more context without requiring a separate view

**What changed:**
- Agents page went from table-only to table + 2 charts (more visual, same page)
- Overview added a fifth visualization (day-of-week) alongside the 4 trend charts
- Teams page gained a bar chart for quick team ranking

---

### Iteration 3: Three New Pages (Phase 7)

**Added (human-led decision to expand):**
- **Models page** — model performance comparison table
- **Alerts page** — severity-classified alert cards
- **Troubleshooting page** — error timeline chart + agent error breakdown table

**Rationale:**
- Models: platform engineers need to compare model choices for cost/performance tradeoffs
- Alerts: proactive monitoring is a core platform team need — "what needs attention now?"
- Troubleshooting: failure diagnosis requires a dedicated view beyond the Optimization page's high-level insights

**Sidebar navigation expanded:** 4 items → 7 items. Order was chosen to flow from general (Overview) to specific (Troubleshooting).

---

### Iteration 4: Role-Based Views (Phase 8)

**Added (human-led design):**
- "Viewing as" dropdown in page header
- Conditional rendering of pages, sections, table columns, and KPIs per role
- "Restricted access" state when a role cannot view a page

**What changed:**
- Overview: engineer sees 6 KPIs (no cost), 3 trends (no cost trend)
- Agents: engineer sees no cost column, no scatter plot
- Teams: restricted entirely for engineers
- Models: engineer sees no cost-per-token column
- Optimization: engineer sees no cost-related insights
- Alerts: engineer sees no cost-related alerts

**Design principle:** The same page adapts rather than showing different page sets. This keeps navigation consistent and helps reviewers see the difference by switching roles.

---

## Design Principles Applied

| Principle | How Applied |
|-----------|-------------|
| **Data density** | KPI cards pack 8 metrics in 2 rows; tables show 5-6 columns |
| **Scanability** | Color-coded success rates, severity grouping, consistent card layout |
| **Progressive disclosure** | Overview → detailed pages; insight summaries → specific metrics |
| **Consistency** | All pages share the same card wrapper, section header, and grid patterns |
| **Minimal chrome** | No decorative elements; every pixel serves data or navigation |

---

## Component Patterns

| Pattern | Usage | Component |
|---------|-------|-----------|
| KPI Card | Overview page, 8 instances | `components/dashboard/kpi-card.tsx` |
| Section Header | All pages, groups related content | `components/dashboard/section-header.tsx` |
| Card Wrapper | Charts, tables, insights | Tailwind `bg-white rounded-lg shadow p-6` |
| Data Table | Agents, Teams, Models, Troubleshooting | `components/tables/*.tsx` |
| Insight Card | Optimization page | `components/insights/insight-card.tsx` |
| Alert Card | Alerts page | `components/alerts/alert-card.tsx` (planned path) |
| Loading Skeleton | All pages during fetch | `components/dashboard/skeleton.tsx` |
| Error State | All pages on fetch failure | `components/dashboard/error-state.tsx` |
| Empty State | All pages when no data matches filters | `components/dashboard/empty-state.tsx` |

---

## What Would Change in v2

1. **Responsive layout** — current grid is desktop-only; would add tablet/mobile breakpoints
2. **Dark mode** — current palette is light-only; would add system-preference-aware theming
3. **Drill-down pages** — agent detail page with run history, latency distribution, error timeline
4. **Custom date picker** — calendar-based from/to selection beyond the 4 presets
5. **Chart interactivity** — click-to-filter, tooltip with links, cross-chart brushing
6. **Accessibility** — keyboard navigation audit, ARIA labels, screen reader testing
7. **Animation** — subtle transitions on page/filter changes for polish

---

## Decision Authority

| Aspect | Led By |
|--------|--------|
| Page layout and composition | Human |
| Chart type selection | Human |
| Which visualizations to add per iteration | Human |
| Component implementation | AI (within design constraints) |
| Iteration sequencing | Human |
