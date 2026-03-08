/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/overview/route';
import type { OverviewKPIs } from '@/lib/types';

describe('GET /api/analytics/overview', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns all required KPI fields', async () => {
    const response = await GET();
    const data: OverviewKPIs = await response.json();
    expect(data).toHaveProperty('totalRuns');
    expect(data).toHaveProperty('activeUsers');
    expect(data).toHaveProperty('activeAgents');
    expect(data).toHaveProperty('successRate');
    expect(data).toHaveProperty('avgLatencyMs');
    expect(data).toHaveProperty('p95LatencyMs');
    expect(data).toHaveProperty('totalTokens');
    expect(data).toHaveProperty('estimatedCost');
  });

  it('returns numeric values for all KPIs', async () => {
    const response = await GET();
    const data: OverviewKPIs = await response.json();
    expect(typeof data.totalRuns).toBe('number');
    expect(typeof data.activeUsers).toBe('number');
    expect(typeof data.activeAgents).toBe('number');
    expect(typeof data.successRate).toBe('number');
    expect(typeof data.avgLatencyMs).toBe('number');
    expect(typeof data.p95LatencyMs).toBe('number');
    expect(typeof data.totalTokens).toBe('number');
    expect(typeof data.estimatedCost).toBe('number');
  });

  it('returns deterministic values across calls', async () => {
    const first = await (await GET()).json();
    const second = await (await GET()).json();
    expect(first).toEqual(second);
  });

  it('returns reasonable value ranges', async () => {
    const data: OverviewKPIs = await (await GET()).json();
    expect(data.totalRuns).toBe(500);
    expect(data.activeUsers).toBeGreaterThan(0);
    expect(data.activeAgents).toBeGreaterThan(0);
    expect(data.successRate).toBeGreaterThan(0);
    expect(data.successRate).toBeLessThanOrEqual(1);
    expect(data.avgLatencyMs).toBeGreaterThan(0);
    expect(data.p95LatencyMs).toBeGreaterThanOrEqual(data.avgLatencyMs);
    expect(data.estimatedCost).toBeGreaterThan(0);
  });
});
