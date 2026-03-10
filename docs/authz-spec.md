# Authorization Specification

## Current State

**Implementation:** Client-side only (demo-grade).

The API returns full, unfiltered data to all callers. The UI conditionally renders pages and data based on the active role selected in a client-side dropdown. There is no authentication, no server-side authorization, and no request-level access control.

This design is intentional for a demo/interview context (see PD-024) but would be insufficient for production. This document defines the server-side enforcement plan.

---

## Roles

| Role | Identifier | Description | Data Access |
|------|-----------|-------------|-------------|
| Org Admin | `org_admin` | Executive / VP of Engineering | Full access to all data |
| Engineering Manager | `eng_manager` | Team lead / EM | Most data; no org-wide model cost allocation |
| Platform Engineer | `platform_engineer` | Platform engineer / SRE | Reliability and performance only; no cost data |

---

## Endpoint-Level Access Policy

| Endpoint | org_admin | eng_manager | platform_engineer | Current Status |
|----------|-----------|-------------|-------------------|----------------|
| `GET /api/analytics/overview` | Full response | Cost fields redacted | Cost fields redacted | Unprotected (client-side only) |
| `GET /api/analytics/agents` | Full response | Cost fields redacted | Cost fields redacted | Unprotected (client-side only) |
| `GET /api/analytics/teams` | Full response | Full response (no cost-by-model) | **403 Forbidden** | Unprotected (client-side only) |
| `GET /api/analytics/trends` | Full response | Cost trend redacted | Cost trend redacted | Unprotected (client-side only) |
| `GET /api/analytics/insights` | Full response | Cost insights filtered | Cost insights filtered | Unprotected (client-side only) |
| `GET /api/analytics/models` | Full response | Cost-per-token redacted | Cost-per-token redacted | Unprotected (client-side only) |
| `GET /api/analytics/alerts` | Full response | Cost alerts filtered | Cost alerts filtered | Unprotected (client-side only) |
| `GET /api/analytics/troubleshooting` | Full response | Full response | Full response | Unprotected (client-side only) |

---

## Field-Level Redaction Rules

### Overview Response

| Field | org_admin | eng_manager | platform_engineer |
|-------|-----------|-------------|-------------------|
| `totalRuns` | Visible | Visible | Visible |
| `activeUsers` | Visible | Visible | Visible |
| `activeAgents` | Visible | Visible | Visible |
| `successRate` | Visible | Visible | Visible |
| `avgLatencyMs` | Visible | Visible | Visible |
| `p95LatencyMs` | Visible | Visible | Visible |
| `totalTokens` | Visible | Visible | Visible |
| `estimatedCost` | Visible | Visible | **Redacted** |

### Agent Entries

| Field | org_admin | eng_manager | platform_engineer |
|-------|-----------|-------------|-------------------|
| `totalRuns`, `successRate`, `avgLatencyMs` | Visible | Visible | Visible |
| `totalCost` | Visible | Visible | **Redacted** |

### Team Entries

| Field | org_admin | eng_manager | platform_engineer |
|-------|-----------|-------------|-------------------|
| All team fields | Visible | Visible | **Endpoint blocked (403)** |
| `costByModel` | Visible | **Redacted** | **Endpoint blocked (403)** |

### Trend Entries

| Field | org_admin | eng_manager | platform_engineer |
|-------|-----------|-------------|-------------------|
| `dailyRuns`, `latencyTrend` | Visible | Visible | Visible |
| `costTrend` | Visible | **Redacted** | **Redacted** |

### Model Performance Entries

| Field | org_admin | eng_manager | platform_engineer |
|-------|-----------|-------------|-------------------|
| `successRate`, `avgLatencyMs`, `throughput` | Visible | Visible | Visible |
| `costPerToken` | Visible | **Redacted** | **Redacted** |

---

## Threat Model

| ID | Threat | Severity | Current Risk | Mitigation |
|----|--------|----------|-------------|------------|
| T1 | Any user can call API endpoints directly and access all data including cost | High | **Active** — no server-side protection | Planned: add auth middleware + role-based response filtering |
| T2 | No authentication — anyone with the URL can access the dashboard and API | High | **Active** — no auth exists | Planned: add session-based or JWT authentication |
| T3 | No rate limiting — API can be abused | Medium | **Active** — no rate limiting | Planned: add rate limiting middleware |
| T4 | No audit logging — access patterns are not tracked | Low | **Active** — no logging | Planned: add structured access logging |
| T5 | Client-side role can be manipulated via browser devtools | Medium | **Active** — role is in React context | Planned: server-side role enforcement from auth token |
| T6 | No CORS configuration — API accessible from any origin | Medium | **Active** — default Next.js behavior | Planned: configure CORS for production domain |
| T7 | No CSP headers — potential XSS vector | Low | **Low risk** — no user-generated content | Planned: add Content-Security-Policy headers |

---

## Production Migration Plan

### Phase 1: Authentication (not started)
1. Add authentication provider (NextAuth.js or similar)
2. Add login page and session management
3. Store user role in JWT/session token
4. Add `withAuth()` middleware to all API routes

### Phase 2: Authorization Middleware (not started)
1. Create `withAuthz(allowedRoles)` higher-order function
2. Wrap each API route: `withErrorHandler(withAuthz(['org_admin', 'eng_manager'], handler))`
3. Return 403 for unauthorized role access (e.g., engineer accessing teams)

### Phase 3: Field-Level Filtering (not started)
1. Add response shaping in controllers based on authenticated role
2. Redact cost fields from overview, agents, trends, models responses
3. Filter cost-related insights and alerts from response arrays

### Phase 4: Audit & Hardening (not started)
1. Add structured access logging (who accessed what, when)
2. Configure rate limiting per API key/session
3. Add CORS and CSP headers
4. Security audit of all endpoints

---

## Test Plan for AuthZ Enforcement

### Unit Tests (planned)
- `withAuthz` middleware correctly blocks unauthorized roles
- `withAuthz` middleware passes through for authorized roles
- Response filtering correctly redacts cost fields per role

### Integration Tests (planned)
- Each endpoint returns 401 without authentication
- Each endpoint returns 403 for unauthorized roles
- Each endpoint returns filtered response for authorized roles
- Teams endpoint returns 403 for platform_engineer

### Regression Tests (planned)
- Verify no cost data leaks in redacted responses (field-level assertions)
- Verify all 8 endpoints are protected (no unprotected route regression)

---

## Status Summary

| Component | Status |
|-----------|--------|
| Role definitions | Done (client-side) |
| Visibility configuration | Done (client-side) |
| UI conditional rendering | Done |
| Authentication | Not started |
| Server-side authorization | Not started |
| Field-level response filtering | Not started |
| Audit logging | Not started |
| Rate limiting | Not started |
