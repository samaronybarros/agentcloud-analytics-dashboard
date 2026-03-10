# Authorization Specification

## Current State

**Implementation:** Server-side role-based authorization (demo-grade authentication).

The API enforces role-based access control at two levels:
1. **Page-level gating** — `withRoleAccess(page, handler)` checks `canAccessPage(role, page)` and returns 403 if denied
2. **Field-level redaction** — controllers use per-context redaction functions to omit cost-sensitive fields based on role

Role is determined from the request via `?role=` query parameter or `X-User-Role` header, defaulting to `engineer` (least-privileged) when no valid role is provided. The frontend reads the role from the URL via `useRole()` hook (`useSearchParams`) and forwards it to all API calls.

**What's enforced:** Role-based page access + field-level response filtering. An engineer calling `/api/analytics/teams` directly gets 403. An engineer calling `/api/analytics/overview` gets a response without `estimatedCost`.

**What's NOT enforced:** Authentication (no login, no JWT — anyone can set `?role=admin`). This is a demo convenience, not a security boundary. See the Production Migration Plan for the full auth path.

---

## Roles

| Role | Identifier | Description | Data Access |
|------|-----------|-------------|-------------|
| Org Admin | `admin` | Executive / VP of Engineering | Full access to all data |
| Engineering Manager | `manager` | Team lead / EM | Most data; no org-wide model cost allocation |
| Platform Engineer | `engineer` | Platform engineer / SRE | Reliability and performance only; no cost data |

---

## Endpoint-Level Access Policy

| Endpoint | `admin` | `manager` | `engineer` | Current Status |
|----------|---------|-----------|------------|----------------|
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

| Field | `admin` | `manager` | `engineer` |
|-------|---------|-----------|------------|
| `totalRuns` | Visible | Visible | Visible |
| `activeUsers` | Visible | Visible | Visible |
| `activeAgents` | Visible | Visible | Visible |
| `successRate` | Visible | Visible | Visible |
| `avgLatencyMs` | Visible | Visible | Visible |
| `p95LatencyMs` | Visible | Visible | Visible |
| `totalTokens` | Visible | Visible | Visible |
| `estimatedCost` | Visible | Visible | **Redacted** |

### Agent Entries

| Field | `admin` | `manager` | `engineer` |
|-------|---------|-----------|------------|
| `totalRuns`, `successRate`, `avgLatencyMs` | Visible | Visible | Visible |
| `totalCost` | Visible | Visible | **Redacted** |

### Team Entries

| Field | `admin` | `manager` | `engineer` |
|-------|---------|-----------|------------|
| All team fields | Visible | Visible | **Endpoint blocked (403)** |
| `costByModel` | Visible | **Redacted** | **Endpoint blocked (403)** |

### Trend Entries

| Field | `admin` | `manager` | `engineer` |
|-------|---------|-----------|------------|
| `dailyRuns`, `latencyTrend` | Visible | Visible | Visible |
| `costTrend` | Visible | **Redacted** | **Redacted** |

### Model Performance Entries

| Field | `admin` | `manager` | `engineer` |
|-------|---------|-----------|------------|
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
4. Replace `?role=` query param with JWT/session claim in `parseRole()`
5. Add `withAuth()` middleware to all API routes

### Phase 2: Per-Session Rate Limiting (not started)
1. Replace in-memory token bucket with per-session/API-key rate limiting
2. Configure rate limits per role (admin may have higher limits)

### Phase 3: Infrastructure Hardening (not started)
1. Add CORS headers restricted to production domain
2. Add Content-Security-Policy headers
3. Security audit of all endpoints

**Note:** Authorization middleware (`withRoleAccess`), field-level redaction (`response-redaction.ts`), structured logging (`api-logger.ts`), and basic rate limiting (`rate-limiter.ts`) are already implemented. The remaining production work is adding real authentication so that role identity is trustworthy.

---

## Test Coverage for AuthZ

### Unit Tests (done)
- `role-auth.test.ts` — `parseRole()` extracts role from query param and header, defaults to `engineer`; `withRoleAccess` blocks unauthorized roles with 403
- `response-redaction.test.ts` — per-context redaction functions correctly omit cost fields based on role

### Integration Tests (done)
- `authz.test.ts` — end-to-end role gating + field-level redaction across all 8 API endpoints; verifies 403 for engineer on Teams, cost field absence for restricted roles

### Remaining Test Gaps
- No tests for authenticated role extraction (depends on Phase 1 authentication)
- No tests for per-session rate limiting (depends on Phase 2)

---

## Status Summary

| Component | Status |
|-----------|--------|
| Role definitions | Done (shared `UserRole` type: `'admin' \| 'manager' \| 'engineer'`) |
| Visibility configuration | Done (single source of truth in `role-visibility.ts`) |
| UI conditional rendering | Done (all 7 pages respect role visibility) |
| Server-side page-level access | Done (`withRoleAccess` in all 8 routes) |
| Server-side field-level redaction | Done (7 redaction functions in `response-redaction.ts`) |
| Frontend role forwarding | Done (`useRole()` reads from URL, hooks pass `?role=` to API calls) |
| Sidebar role preservation | Done (links append `?role=` param during navigation) |
| Authentication | Not started (role is set via query param, not authenticated) |
| Audit logging | Done (structured JSON logging with requestId on all API responses) |
| Rate limiting | Done (in-memory token bucket, 100 req/60s, Retry-After header) |
