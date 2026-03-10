# Authorization Specification

## Current State

**Implementation:** Server-side role-based authorization (demo-grade authentication).

The API enforces role-based access control at two levels:
1. **Page-level gating** — `withRoleAccess(page, handler)` checks `canAccessPage(role, page)` and returns 403 if denied
2. **Field-level redaction** — controllers use per-context redaction functions to omit cost-sensitive fields based on role

Role is determined from the request via `?role=` query parameter or `X-User-Role` header, defaulting to `engineer` (least-privileged) when no valid role is provided. The frontend forwards the active role from the `useRole` context to all API calls.

**What's enforced:** Role-based page access + field-level response filtering. An engineer calling `/api/analytics/teams` directly gets 403. An engineer calling `/api/analytics/overview` gets a response without `estimatedCost`.

**What's NOT enforced:** Authentication (no login, no JWT — anyone can set `?role=admin`). This is a demo convenience, not a security boundary. See the Production Migration Plan for the full auth path.

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
| `GET /api/analytics/overview` | Full response | Cost fields redacted | Cost fields redacted | **Enforced** (server-side redaction + page gating) |
| `GET /api/analytics/agents` | Full response | Cost fields redacted | Cost fields redacted | **Enforced** (server-side redaction + page gating) |
| `GET /api/analytics/teams` | Full response | Full response (no cost-by-model) | **403 Forbidden** | **Enforced** (server-side redaction + page gating) |
| `GET /api/analytics/trends` | Full response | Cost trend redacted | Cost trend redacted | **Enforced** (server-side redaction + page gating) |
| `GET /api/analytics/insights` | Full response | Cost insights filtered | Cost insights filtered | **Enforced** (server-side redaction + page gating) |
| `GET /api/analytics/models` | Full response | Cost-per-token redacted | Cost-per-token redacted | **Enforced** (server-side redaction + page gating) |
| `GET /api/analytics/alerts` | Full response | Cost alerts filtered | Cost alerts filtered | **Enforced** (server-side redaction + page gating) |
| `GET /api/analytics/troubleshooting` | Full response | Full response | Full response | **Enforced** (server-side redaction + page gating) |

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
| T1 | User can set `?role=admin` to bypass role restrictions | Medium | **Mitigated partially** — server enforces redaction but role is not authenticated | Planned: authenticate role via JWT/session |
| T2 | No authentication — anyone with the URL can access the dashboard and API | High | **Active** — no auth exists | Planned: add session-based or JWT authentication |
| T3 | No rate limiting — API can be abused | Medium | **Mitigated** — in-memory token bucket (100 req/60s) with Retry-After header | Done: rate limiting middleware on all API routes |
| T4 | No audit logging — access patterns are not tracked | Low | **Mitigated** — structured JSON logging with requestId, method, path, status, durationMs, role | Done: structured access logging on all API responses |
| T5 | Client-side role can be manipulated via browser devtools | Low | **Mitigated** — server enforces redaction regardless of client state | Remaining: role parameter in URL is not authenticated |
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
| Role definitions | Done (shared between client and server) |
| Visibility configuration | Done (single source of truth in `role-visibility.ts`) |
| UI conditional rendering | Done |
| Server-side page-level access | Done (`withRoleAccess` in all 8 routes) |
| Server-side field-level redaction | Done (7 redaction functions in `response-redaction.ts`) |
| Frontend role forwarding | Done (hooks pass `?role=` to all API calls) |
| Authentication | Not started (role is set via query param, not authenticated) |
| Audit logging | Done (structured JSON logging with requestId on all API responses) |
| Rate limiting | Done (in-memory token bucket, 100 req/60s, Retry-After header) |
