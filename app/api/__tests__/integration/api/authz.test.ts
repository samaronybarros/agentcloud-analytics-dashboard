/**
 * @jest-environment node
 */
/**
 * Integration tests for server-side role-based authorization.
 * Tests each endpoint with admin, manager, and engineer roles.
 * Verifies page-level access control and field-level response redaction.
 */

import { GET as overviewGET } from '@/app/api/analytics/overview/route';
import { GET as agentsGET } from '@/app/api/analytics/agents/route';
import { GET as teamsGET } from '@/app/api/analytics/teams/route';
import { GET as trendsGET } from '@/app/api/analytics/trends/route';
import { GET as insightsGET } from '@/app/api/analytics/insights/route';
import { GET as modelsGET } from '@/app/api/analytics/models/route';
import { GET as alertsGET } from '@/app/api/analytics/alerts/route';
import { GET as troubleshootingGET } from '@/app/api/analytics/troubleshooting/route';

function req(path: string, role?: string): Request {
  const roleParam = role ? `?role=${role}` : '';
  return new Request(`http://localhost${path}${roleParam}`);
}

// ---------------------------------------------------------------------------
// Overview endpoint
// ---------------------------------------------------------------------------

describe('GET /api/analytics/overview — authz', () => {
  it('returns estimatedCost for admin', async () => {
    const data = await (await overviewGET(req('/api/analytics/overview', 'admin'))).json();
    expect(data).toHaveProperty('estimatedCost');
    expect(typeof data.estimatedCost).toBe('number');
  });

  it('returns estimatedCost for manager', async () => {
    const data = await (await overviewGET(req('/api/analytics/overview', 'manager'))).json();
    expect(data).toHaveProperty('estimatedCost');
  });

  it('omits estimatedCost for engineer', async () => {
    const data = await (await overviewGET(req('/api/analytics/overview', 'engineer'))).json();
    expect(data).not.toHaveProperty('estimatedCost');
    expect(data).toHaveProperty('totalRuns');
    expect(data).toHaveProperty('successRate');
  });

  it('returns 200 for all roles', async () => {
    for (const role of ['admin', 'manager', 'engineer']) {
      const response = await overviewGET(req('/api/analytics/overview', role));
      expect(response.status).toBe(200);
    }
  });
});

// ---------------------------------------------------------------------------
// Agents endpoint
// ---------------------------------------------------------------------------

describe('GET /api/analytics/agents — authz', () => {
  it('includes totalCost in leaderboard for admin', async () => {
    const data = await (await agentsGET(req('/api/analytics/agents', 'admin'))).json();
    expect(data.leaderboard[0]).toHaveProperty('totalCost');
  });

  it('includes totalCost in leaderboard for manager', async () => {
    const data = await (await agentsGET(req('/api/analytics/agents', 'manager'))).json();
    expect(data.leaderboard[0]).toHaveProperty('totalCost');
  });

  it('omits totalCost from leaderboard for engineer', async () => {
    const data = await (await agentsGET(req('/api/analytics/agents', 'engineer'))).json();
    expect(data.leaderboard[0]).not.toHaveProperty('totalCost');
    expect(data.leaderboard[0]).toHaveProperty('agentName');
    expect(data.leaderboard[0]).toHaveProperty('successRate');
  });

  it('preserves failureTaxonomy for all roles', async () => {
    for (const role of ['admin', 'manager', 'engineer']) {
      const data = await (await agentsGET(req('/api/analytics/agents', role))).json();
      expect(Array.isArray(data.failureTaxonomy)).toBe(true);
      expect(data.failureTaxonomy.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Teams endpoint
// ---------------------------------------------------------------------------

describe('GET /api/analytics/teams — authz', () => {
  it('returns full response for admin', async () => {
    const response = await teamsGET(req('/api/analytics/teams', 'admin'));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('teamUsage');
    expect(data).toHaveProperty('costByModel');
    expect(data).toHaveProperty('topUsers');
  });

  it('omits costByModel for manager', async () => {
    const response = await teamsGET(req('/api/analytics/teams', 'manager'));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('teamUsage');
    expect(data).toHaveProperty('topUsers');
    expect(data).not.toHaveProperty('costByModel');
  });

  it('returns 403 for engineer', async () => {
    const response = await teamsGET(req('/api/analytics/teams', 'engineer'));
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('Forbidden');
  });
});

// ---------------------------------------------------------------------------
// Trends endpoint
// ---------------------------------------------------------------------------

describe('GET /api/analytics/trends — authz', () => {
  it('returns costTrend for admin', async () => {
    const data = await (await trendsGET(req('/api/analytics/trends', 'admin'))).json();
    expect(data).toHaveProperty('costTrend');
    expect(Array.isArray(data.costTrend)).toBe(true);
  });

  it('returns costTrend for manager', async () => {
    const data = await (await trendsGET(req('/api/analytics/trends', 'manager'))).json();
    expect(data).toHaveProperty('costTrend');
  });

  it('omits costTrend for engineer', async () => {
    const data = await (await trendsGET(req('/api/analytics/trends', 'engineer'))).json();
    expect(data).not.toHaveProperty('costTrend');
    expect(data).toHaveProperty('runsTrend');
    expect(data).toHaveProperty('latencyTrend');
    expect(data).toHaveProperty('runsByDayOfWeek');
  });
});

// ---------------------------------------------------------------------------
// Insights endpoint
// ---------------------------------------------------------------------------

describe('GET /api/analytics/insights — authz', () => {
  it('returns all insight types for admin', async () => {
    const data = await (await insightsGET(req('/api/analytics/insights', 'admin'))).json();
    const types = data.insights.map((insight: { type: string }) => insight.type);
    expect(types).toContain('top-cost-driver');
  });

  it('returns all insight types for manager', async () => {
    const data = await (await insightsGET(req('/api/analytics/insights', 'manager'))).json();
    const types = data.insights.map((insight: { type: string }) => insight.type);
    expect(types).toContain('top-cost-driver');
  });

  it('filters cost insights for engineer', async () => {
    const data = await (await insightsGET(req('/api/analytics/insights', 'engineer'))).json();
    const types = data.insights.map((insight: { type: string }) => insight.type);
    expect(types).not.toContain('high-cost-low-success');
    expect(types).not.toContain('top-cost-driver');
  });

  it('preserves non-cost insights for engineer', async () => {
    const data = await (await insightsGET(req('/api/analytics/insights', 'engineer'))).json();
    expect(data.insights.length).toBeGreaterThan(0);
    const types = data.insights.map((insight: { type: string }) => insight.type);
    expect(types.some((type: string) => ['rising-failures', 'degraded-latency'].includes(type))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Models endpoint
// ---------------------------------------------------------------------------

describe('GET /api/analytics/models — authz', () => {
  it('returns cost fields for admin', async () => {
    const data = await (await modelsGET(req('/api/analytics/models', 'admin'))).json();
    expect(data.models[0]).toHaveProperty('totalCost');
    expect(data.models[0]).toHaveProperty('costPerThousandTokens');
  });

  it('omits cost fields for manager', async () => {
    const data = await (await modelsGET(req('/api/analytics/models', 'manager'))).json();
    expect(data.models[0]).not.toHaveProperty('totalCost');
    expect(data.models[0]).not.toHaveProperty('costPerThousandTokens');
    expect(data.models[0]).toHaveProperty('successRate');
    expect(data.models[0]).toHaveProperty('avgLatencyMs');
    expect(data.models[0]).toHaveProperty('totalTokens');
  });

  it('omits cost fields for engineer', async () => {
    const data = await (await modelsGET(req('/api/analytics/models', 'engineer'))).json();
    expect(data.models[0]).not.toHaveProperty('totalCost');
    expect(data.models[0]).not.toHaveProperty('costPerThousandTokens');
  });
});

// ---------------------------------------------------------------------------
// Alerts endpoint
// ---------------------------------------------------------------------------

describe('GET /api/analytics/alerts — authz', () => {
  it('returns all alerts for admin', async () => {
    const data = await (await alertsGET(req('/api/analytics/alerts', 'admin'))).json();
    const metrics = data.alerts.map((alert: { metric: string }) => alert.metric);
    expect(metrics).toContain('cost');
  });

  it('returns all alerts for manager', async () => {
    const data = await (await alertsGET(req('/api/analytics/alerts', 'manager'))).json();
    const metrics = data.alerts.map((alert: { metric: string }) => alert.metric);
    expect(metrics).toContain('cost');
  });

  it('filters cost alerts for engineer', async () => {
    const data = await (await alertsGET(req('/api/analytics/alerts', 'engineer'))).json();
    const metrics = data.alerts.map((alert: { metric: string }) => alert.metric);
    expect(metrics).not.toContain('cost');
  });

  it('recalculates breachedCount after filtering for engineer', async () => {
    const adminData = await (await alertsGET(req('/api/analytics/alerts', 'admin'))).json();
    const engineerData = await (await alertsGET(req('/api/analytics/alerts', 'engineer'))).json();
    expect(engineerData.breachedCount).toBeLessThanOrEqual(adminData.breachedCount);
    // Verify breachedCount matches actual breached alerts
    const actualBreached = engineerData.alerts.filter((alert: { status: string }) => alert.status === 'breached').length;
    expect(engineerData.breachedCount).toBe(actualBreached);
  });
});

// ---------------------------------------------------------------------------
// Troubleshooting endpoint
// ---------------------------------------------------------------------------

describe('GET /api/analytics/troubleshooting — authz', () => {
  it('returns full response for all roles', async () => {
    for (const role of ['admin', 'manager', 'engineer']) {
      const response = await troubleshootingGET(req('/api/analytics/troubleshooting', role));
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('errorTimeline');
      expect(data).toHaveProperty('agentErrors');
      expect(data).toHaveProperty('totalErrors');
      expect(data).toHaveProperty('totalRetries');
    }
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('Authorization edge cases', () => {
  it('defaults to engineer (least-privileged) when no role is provided', async () => {
    const response = await overviewGET(new Request('http://localhost/api/analytics/overview'));
    expect(response.status).toBe(200);
    const data = await response.json();
    // Engineer cannot see cost data
    expect(data).not.toHaveProperty('estimatedCost');
    expect(data).toHaveProperty('totalRuns');
  });

  it('defaults to engineer for invalid role values', async () => {
    const response = await overviewGET(new Request('http://localhost/api/analytics/overview?role=superadmin'));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).not.toHaveProperty('estimatedCost');
    expect(data).toHaveProperty('totalRuns');
  });

  it('role does not interfere with date filtering', async () => {
    const response = await overviewGET(
      new Request('http://localhost/api/analytics/overview?from=2026-03-01&to=2026-03-05&role=engineer'),
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.totalRuns).toBeGreaterThan(0);
    expect(data.totalRuns).toBeLessThan(500);
    expect(data).not.toHaveProperty('estimatedCost');
  });
});
