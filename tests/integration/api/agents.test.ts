/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/agents/route';
import type { AgentLeaderboardEntry, FailureTaxonomyEntry } from '@/lib/types';

describe('GET /api/analytics/agents', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns leaderboard and failureTaxonomy arrays', async () => {
    const data = await (await GET()).json();
    expect(Array.isArray(data.leaderboard)).toBe(true);
    expect(Array.isArray(data.failureTaxonomy)).toBe(true);
  });

  it('leaderboard entries have required fields', async () => {
    const data = await (await GET()).json();
    const entry: AgentLeaderboardEntry = data.leaderboard[0];
    expect(entry).toHaveProperty('agentId');
    expect(entry).toHaveProperty('agentName');
    expect(entry).toHaveProperty('team');
    expect(entry).toHaveProperty('totalRuns');
    expect(entry).toHaveProperty('successRate');
    expect(entry).toHaveProperty('avgLatencyMs');
    expect(entry).toHaveProperty('totalCost');
  });

  it('taxonomy entries have required fields', async () => {
    const data = await (await GET()).json();
    const entry: FailureTaxonomyEntry = data.failureTaxonomy[0];
    expect(entry).toHaveProperty('errorType');
    expect(entry).toHaveProperty('count');
    expect(entry).toHaveProperty('percentage');
  });

  it('leaderboard is sorted by totalRuns descending', async () => {
    const data = await (await GET()).json();
    const runs = data.leaderboard.map((e: AgentLeaderboardEntry) => e.totalRuns);
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i - 1]).toBeGreaterThanOrEqual(runs[i]);
    }
  });

  it('all numeric fields are finite (not NaN or Infinity)', async () => {
    const data = await (await GET()).json();
    for (const entry of data.leaderboard) {
      expect(Number.isFinite(entry.totalRuns)).toBe(true);
      expect(Number.isFinite(entry.successRate)).toBe(true);
      expect(Number.isFinite(entry.avgLatencyMs)).toBe(true);
      expect(Number.isFinite(entry.totalCost)).toBe(true);
    }
    for (const entry of data.failureTaxonomy) {
      expect(Number.isFinite(entry.count)).toBe(true);
      expect(Number.isFinite(entry.percentage)).toBe(true);
    }
  });

  it('returns deterministic values across calls', async () => {
    const first = await (await GET()).json();
    const second = await (await GET()).json();
    expect(first).toEqual(second);
  });
});
