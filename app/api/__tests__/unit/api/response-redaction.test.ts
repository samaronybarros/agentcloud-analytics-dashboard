/**
 * @jest-environment node
 */
import {
  redactOverviewResponse,
  redactAgentsResponse,
  redactTeamsResponse,
  redactTrendsResponse,
  redactInsightsResponse,
  redactModelsResponse,
  redactAlertsResponse,
} from '@/lib/utils/response-redaction';
import type {
  OverviewResponse,
  AgentsResponse,
  TeamsResponse,
  TrendsResponse,
  InsightsResponse,
  ModelsResponse,
  AlertsResponse,
} from '@/lib/types';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const mockOverview: OverviewResponse = {
  totalRuns: 500,
  activeUsers: 8,
  activeAgents: 10,
  successRate: 0.75,
  avgLatencyMs: 340,
  p95LatencyMs: 890,
  totalTokens: 120000,
  estimatedCost: 456.78,
};

const mockAgents: AgentsResponse = {
  leaderboard: [
    { agentId: 'a1', agentName: 'Agent 1', team: 'Platform', totalRuns: 50, successRate: 0.8, avgLatencyMs: 300, totalCost: 45.0 },
    { agentId: 'a2', agentName: 'Agent 2', team: 'Data', totalRuns: 40, successRate: 0.7, avgLatencyMs: 400, totalCost: 38.0 },
  ],
  failureTaxonomy: [
    { errorType: 'timeout', count: 10, percentage: 0.5 },
  ],
};

const mockTeams: TeamsResponse = {
  teamUsage: [
    { team: 'Platform', totalRuns: 180, activeAgents: 3, activeUsers: 3, totalCost: 120, successRate: 0.78, avgLatencyMs: 340 },
  ],
  costByModel: [
    { model: 'claude-sonnet-4-20250514', totalCost: 120, percentage: 0.4 },
  ],
  topUsers: [
    { userId: 'u1', userName: 'Alice', team: 'Platform', totalRuns: 90, totalCost: 60 },
  ],
};

const mockTrends: TrendsResponse = {
  runsTrend: [{ date: '2026-03-01', total: 20, success: 15, error: 3, retry: 2 }],
  latencyTrend: [{ date: '2026-03-01', p50: 300, p95: 800 }],
  costTrend: [{ date: '2026-03-01', cost: 15.5 }],
  runsByDayOfWeek: [{ day: 'Mon', runs: 80 }],
};

const mockInsights: InsightsResponse = {
  insights: [
    { id: 'i1', type: 'high-cost-low-success', severity: 'critical', title: 'Cost insight', description: 'High cost' },
    { id: 'i2', type: 'rising-failures', severity: 'warning', title: 'Failures rising', description: 'Non-cost' },
    { id: 'i3', type: 'top-cost-driver', severity: 'info', title: 'Top cost', description: 'Cost driver' },
    { id: 'i4', type: 'degraded-latency', severity: 'warning', title: 'Slow agent', description: 'Non-cost' },
  ],
};

const mockModels: ModelsResponse = {
  models: [
    { model: 'claude-sonnet-4-20250514', totalRuns: 150, successRate: 0.78, avgLatencyMs: 380, totalCost: 200, costPerThousandTokens: 3.0, totalTokens: 66000 },
    { model: 'claude-haiku-4-5-20251001', totalRuns: 120, successRate: 0.85, avgLatencyMs: 180, totalCost: 40, costPerThousandTokens: 0.8, totalTokens: 50000 },
  ],
};

const mockAlerts: AlertsResponse = {
  alerts: [
    { id: 'al1', metric: 'success-rate', status: 'breached', title: 'Low success', description: 'Below threshold', currentValue: 0.45, threshold: 0.7 },
    { id: 'al2', metric: 'cost', status: 'breached', title: 'High cost', description: 'Over budget', currentValue: 500, threshold: 300 },
    { id: 'al3', metric: 'latency', status: 'ok', title: 'Latency normal', description: 'Within range', currentValue: 300, threshold: 1000 },
  ],
  breachedCount: 2,
};

// ---------------------------------------------------------------------------
// Overview redaction
// ---------------------------------------------------------------------------

describe('redactOverviewResponse', () => {
  it('returns full response for admin', () => {
    const result = redactOverviewResponse(mockOverview, 'admin');
    expect(result).toEqual(mockOverview);
  });

  it('returns full response for manager', () => {
    const result = redactOverviewResponse(mockOverview, 'manager');
    expect(result).toEqual(mockOverview);
  });

  it('omits estimatedCost for engineer', () => {
    const result = redactOverviewResponse(mockOverview, 'engineer');
    expect(result).not.toHaveProperty('estimatedCost');
    expect(result).toHaveProperty('totalRuns', 500);
    expect(result).toHaveProperty('successRate', 0.75);
    expect(result).toHaveProperty('avgLatencyMs', 340);
    expect(result).toHaveProperty('p95LatencyMs', 890);
    expect(result).toHaveProperty('totalTokens', 120000);
  });
});

// ---------------------------------------------------------------------------
// Agents redaction
// ---------------------------------------------------------------------------

describe('redactAgentsResponse', () => {
  it('returns full response for admin', () => {
    const result = redactAgentsResponse(mockAgents, 'admin') as AgentsResponse;
    expect(result.leaderboard[0]).toHaveProperty('totalCost', 45.0);
  });

  it('returns full response for manager', () => {
    const result = redactAgentsResponse(mockAgents, 'manager') as AgentsResponse;
    expect(result.leaderboard[0]).toHaveProperty('totalCost', 45.0);
  });

  it('omits totalCost from leaderboard entries for engineer', () => {
    const result = redactAgentsResponse(mockAgents, 'engineer') as { leaderboard: Record<string, unknown>[]; failureTaxonomy: unknown[] };
    expect(result.leaderboard[0]).not.toHaveProperty('totalCost');
    expect(result.leaderboard[0]).toHaveProperty('agentName', 'Agent 1');
    expect(result.leaderboard[0]).toHaveProperty('successRate', 0.8);
    expect(result.leaderboard[1]).not.toHaveProperty('totalCost');
  });

  it('preserves failureTaxonomy for all roles', () => {
    const result = redactAgentsResponse(mockAgents, 'engineer') as { failureTaxonomy: unknown[] };
    expect(result.failureTaxonomy).toEqual(mockAgents.failureTaxonomy);
  });
});

// ---------------------------------------------------------------------------
// Teams redaction
// ---------------------------------------------------------------------------

describe('redactTeamsResponse', () => {
  it('returns full response for admin', () => {
    const result = redactTeamsResponse(mockTeams, 'admin') as TeamsResponse;
    expect(result.costByModel).toHaveLength(1);
    expect(result.topUsers).toHaveLength(1);
  });

  it('omits costByModel for manager', () => {
    const result = redactTeamsResponse(mockTeams, 'manager') as Record<string, unknown>;
    expect(result).not.toHaveProperty('costByModel');
    expect(result).toHaveProperty('teamUsage');
    expect(result).toHaveProperty('topUsers');
  });

  it('returns full response minus costByModel for manager', () => {
    const result = redactTeamsResponse(mockTeams, 'manager') as { teamUsage: unknown[] };
    expect(result.teamUsage).toEqual(mockTeams.teamUsage);
  });
});

// ---------------------------------------------------------------------------
// Trends redaction
// ---------------------------------------------------------------------------

describe('redactTrendsResponse', () => {
  it('returns full response for admin', () => {
    const result = redactTrendsResponse(mockTrends, 'admin') as TrendsResponse;
    expect(result.costTrend).toHaveLength(1);
  });

  it('returns full response for manager (cost trend visible)', () => {
    const result = redactTrendsResponse(mockTrends, 'manager') as TrendsResponse;
    expect(result.costTrend).toHaveLength(1);
  });

  it('omits costTrend for engineer', () => {
    const result = redactTrendsResponse(mockTrends, 'engineer') as Record<string, unknown>;
    expect(result).not.toHaveProperty('costTrend');
    expect(result).toHaveProperty('runsTrend');
    expect(result).toHaveProperty('latencyTrend');
    expect(result).toHaveProperty('runsByDayOfWeek');
  });
});

// ---------------------------------------------------------------------------
// Insights redaction
// ---------------------------------------------------------------------------

describe('redactInsightsResponse', () => {
  it('returns all insights for admin', () => {
    const result = redactInsightsResponse(mockInsights, 'admin') as InsightsResponse;
    expect(result.insights).toHaveLength(4);
  });

  it('returns all insights for manager (cost insights visible)', () => {
    const result = redactInsightsResponse(mockInsights, 'manager') as InsightsResponse;
    expect(result.insights).toHaveLength(4);
  });

  it('filters out cost-related insights for engineer', () => {
    const result = redactInsightsResponse(mockInsights, 'engineer') as InsightsResponse;
    expect(result.insights).toHaveLength(2);
    const types = result.insights.map((insight) => insight.type);
    expect(types).toContain('rising-failures');
    expect(types).toContain('degraded-latency');
    expect(types).not.toContain('high-cost-low-success');
    expect(types).not.toContain('top-cost-driver');
  });
});

// ---------------------------------------------------------------------------
// Models redaction
// ---------------------------------------------------------------------------

describe('redactModelsResponse', () => {
  it('returns full response for admin', () => {
    const result = redactModelsResponse(mockModels, 'admin') as ModelsResponse;
    expect(result.models[0]).toHaveProperty('totalCost', 200);
    expect(result.models[0]).toHaveProperty('costPerThousandTokens', 3.0);
  });

  it('omits cost fields from models for manager', () => {
    const result = redactModelsResponse(mockModels, 'manager') as { models: Record<string, unknown>[] };
    expect(result.models[0]).not.toHaveProperty('totalCost');
    expect(result.models[0]).not.toHaveProperty('costPerThousandTokens');
    expect(result.models[0]).toHaveProperty('successRate', 0.78);
    expect(result.models[0]).toHaveProperty('avgLatencyMs', 380);
    expect(result.models[0]).toHaveProperty('totalTokens', 66000);
  });

  it('omits cost fields from models for engineer', () => {
    const result = redactModelsResponse(mockModels, 'engineer') as { models: Record<string, unknown>[] };
    expect(result.models[0]).not.toHaveProperty('totalCost');
    expect(result.models[0]).not.toHaveProperty('costPerThousandTokens');
    expect(result.models[1]).not.toHaveProperty('totalCost');
    expect(result.models[1]).not.toHaveProperty('costPerThousandTokens');
  });
});

// ---------------------------------------------------------------------------
// Alerts redaction
// ---------------------------------------------------------------------------

describe('redactAlertsResponse', () => {
  it('returns all alerts for admin', () => {
    const result = redactAlertsResponse(mockAlerts, 'admin') as AlertsResponse;
    expect(result.alerts).toHaveLength(3);
    expect(result.breachedCount).toBe(2);
  });

  it('returns all alerts for manager (cost alerts visible)', () => {
    const result = redactAlertsResponse(mockAlerts, 'manager') as AlertsResponse;
    expect(result.alerts).toHaveLength(3);
  });

  it('filters out cost alerts for engineer', () => {
    const result = redactAlertsResponse(mockAlerts, 'engineer') as AlertsResponse;
    expect(result.alerts).toHaveLength(2);
    const metrics = result.alerts.map((alert) => alert.metric);
    expect(metrics).not.toContain('cost');
    expect(metrics).toContain('success-rate');
    expect(metrics).toContain('latency');
  });

  it('recalculates breachedCount after filtering for engineer', () => {
    const result = redactAlertsResponse(mockAlerts, 'engineer') as AlertsResponse;
    expect(result.breachedCount).toBe(1);
  });
});
