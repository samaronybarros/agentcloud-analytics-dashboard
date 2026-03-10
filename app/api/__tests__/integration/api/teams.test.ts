/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/teams/route';
import type { TeamUsageEntry, CostByModelEntry, TopUserEntry } from '@/lib/types';

const req = (params = '') => {
  const separator = params.includes('?') ? '&' : '?';
  const url = params
    ? `http://localhost/api/analytics/teams${params}${separator}role=admin`
    : `http://localhost/api/analytics/teams?role=admin`;
  return new Request(url);
};

describe('GET /api/analytics/teams', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET(req());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns teamUsage, costByModel, and topUsers arrays', async () => {
    const data = await (await GET(req())).json();
    expect(Array.isArray(data.teamUsage)).toBe(true);
    expect(Array.isArray(data.costByModel)).toBe(true);
    expect(Array.isArray(data.topUsers)).toBe(true);
  });

  it('teamUsage entries have required fields', async () => {
    const data = await (await GET(req())).json();
    const entry: TeamUsageEntry = data.teamUsage[0];
    expect(entry).toHaveProperty('team');
    expect(entry).toHaveProperty('totalRuns');
    expect(entry).toHaveProperty('activeAgents');
    expect(entry).toHaveProperty('activeUsers');
    expect(entry).toHaveProperty('totalCost');
    expect(entry).toHaveProperty('successRate');
    expect(entry).toHaveProperty('avgLatencyMs');
  });

  it('teamUsage successRate values are between 0 and 1', async () => {
    const data = await (await GET(req())).json();
    for (const entry of data.teamUsage) {
      expect(entry.successRate).toBeGreaterThanOrEqual(0);
      expect(entry.successRate).toBeLessThanOrEqual(1);
    }
  });

  it('costByModel entries have required fields', async () => {
    const data = await (await GET(req())).json();
    const entry: CostByModelEntry = data.costByModel[0];
    expect(entry).toHaveProperty('model');
    expect(entry).toHaveProperty('totalCost');
    expect(entry).toHaveProperty('percentage');
  });

  it('costByModel percentages sum to approximately 1', async () => {
    const data = await (await GET(req())).json();
    const total = data.costByModel.reduce(
      (sum: number, e: CostByModelEntry) => sum + e.percentage,
      0,
    );
    expect(total).toBeCloseTo(1, 1);
  });

  it('topUsers entries have required fields', async () => {
    const data = await (await GET(req())).json();
    const entry: TopUserEntry = data.topUsers[0];
    expect(entry).toHaveProperty('userId');
    expect(entry).toHaveProperty('userName');
    expect(entry).toHaveProperty('team');
    expect(entry).toHaveProperty('totalRuns');
    expect(entry).toHaveProperty('totalCost');
  });

  it('all numeric fields are finite (not NaN or Infinity)', async () => {
    const data = await (await GET(req())).json();
    for (const entry of data.teamUsage) {
      expect(Number.isFinite(entry.totalRuns)).toBe(true);
      expect(Number.isFinite(entry.activeAgents)).toBe(true);
      expect(Number.isFinite(entry.activeUsers)).toBe(true);
      expect(Number.isFinite(entry.totalCost)).toBe(true);
      expect(Number.isFinite(entry.successRate)).toBe(true);
      expect(Number.isFinite(entry.avgLatencyMs)).toBe(true);
    }
    for (const entry of data.costByModel) {
      expect(Number.isFinite(entry.totalCost)).toBe(true);
      expect(Number.isFinite(entry.percentage)).toBe(true);
    }
    for (const entry of data.topUsers) {
      expect(Number.isFinite(entry.totalRuns)).toBe(true);
      expect(Number.isFinite(entry.totalCost)).toBe(true);
    }
  });

  it('returns deterministic values across calls', async () => {
    const first = await (await GET(req())).json();
    const second = await (await GET(req())).json();
    expect(first).toEqual(second);
  });
});
