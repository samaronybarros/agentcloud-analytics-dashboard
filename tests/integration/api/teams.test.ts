/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/teams/route';
import type { TeamUsageEntry, CostByModelEntry, TopUserEntry } from '@/lib/types';

describe('GET /api/analytics/teams', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns teamUsage, costByModel, and topUsers arrays', async () => {
    const data = await (await GET()).json();
    expect(Array.isArray(data.teamUsage)).toBe(true);
    expect(Array.isArray(data.costByModel)).toBe(true);
    expect(Array.isArray(data.topUsers)).toBe(true);
  });

  it('teamUsage entries have required fields', async () => {
    const data = await (await GET()).json();
    const entry: TeamUsageEntry = data.teamUsage[0];
    expect(entry).toHaveProperty('team');
    expect(entry).toHaveProperty('totalRuns');
    expect(entry).toHaveProperty('activeAgents');
    expect(entry).toHaveProperty('activeUsers');
    expect(entry).toHaveProperty('totalCost');
  });

  it('costByModel entries have required fields', async () => {
    const data = await (await GET()).json();
    const entry: CostByModelEntry = data.costByModel[0];
    expect(entry).toHaveProperty('model');
    expect(entry).toHaveProperty('totalCost');
    expect(entry).toHaveProperty('percentage');
  });

  it('costByModel percentages sum to approximately 1', async () => {
    const data = await (await GET()).json();
    const total = data.costByModel.reduce(
      (sum: number, e: CostByModelEntry) => sum + e.percentage,
      0,
    );
    expect(total).toBeCloseTo(1, 1);
  });

  it('topUsers entries have required fields', async () => {
    const data = await (await GET()).json();
    const entry: TopUserEntry = data.topUsers[0];
    expect(entry).toHaveProperty('userId');
    expect(entry).toHaveProperty('userName');
    expect(entry).toHaveProperty('team');
    expect(entry).toHaveProperty('totalRuns');
    expect(entry).toHaveProperty('totalCost');
  });

  it('returns deterministic values across calls', async () => {
    const first = await (await GET()).json();
    const second = await (await GET()).json();
    expect(first).toEqual(second);
  });
});
