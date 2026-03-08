# AI-Assisted Workflow Log

This document records how AI was used in building the dashboard, what was human-led, and lessons learned.

---

## Workflow Summary

The project follows a disciplined, TDD-first methodology defined in the README. AI assists with implementation; humans lead on architecture, product decisions, and quality standards.

## Phase Log

### Phase 1: Project Setup & Structure

**Human-led decisions:**
- Repository structure and architecture
- Technology stack selection (Next.js, Tailwind v4, Recharts, React Query)
- Product requirements and dashboard page breakdown
- Documentation structure

**AI-assisted work:**
- Scaffolding config files (tsconfig, jest, postcss, next.config)
- Creating directory structure
- Writing initial documentation from product spec
- Setting up app shell (layout, routing)

**Key observations:**
- CLAUDE.md and README provided strong guardrails — AI stayed within spec
- Phased approach prevented scope creep
- Inspect-before-code rule ensured understanding of existing repo state

---

## Decision Authority

| Area | Led by |
|------|--------|
| Product requirements | Human |
| Architecture & stack | Human |
| Page structure & navigation | Human |
| Implementation approach | AI (within human-set constraints) |
| Code scaffolding | AI |
| Test design | AI (human reviews) |
| Documentation content | AI (human reviews) |
| Quality standards | Human (via CLAUDE.md) |
