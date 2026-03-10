/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/agents/route';
import type { AgentLeaderboardEntry, FailureTaxonomyEntry } from '@/lib/types';

const req = (params = '') => {
  const separator = params.includes('?') ? '&' : '?';
  const url = params
    ? `http://localhost/api/analytics/agents${params}${separator}role=admin`
    : `http://localhost/api/analytics/agents?role=admin`;
  return new Request(url);
};

describe('GET /api/analytics/agents', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET(req());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns leaderboard and failureTaxonomy arrays', async () => {
    const data = await (await GET(req())).json();
    expect(Array.isArray(data.leaderboard)).toBe(true);
    expect(Array.isArray(data.failureTaxonomy)).toBe(true);
  });

  it('leaderboard entries have required fields', async () => {
    const data = await (await GET(req())).json();
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
    const data = await (await GET(req())).json();
    const entry: FailureTaxonomyEntry = data.failureTaxonomy[0];
    expect(entry).toHaveProperty('errorType');
    expect(entry).toHaveProperty('count');
    expect(entry).toHaveProperty('percentage');
  });

  it('leaderboard is sorted by totalRuns descending', async () => {
    const data = await (await GET(req())).json();
    const runs = data.leaderboard.map((e: AgentLeaderboardEntry) => e.totalRuns);
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i - 1]).toBeGreaterThanOrEqual(runs[i]);
    }
  });

  it('all numeric fields are finite (not NaN or Infinity)', async () => {
    const data = await (await GET(req())).json();
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
    const first = await (await GET(req())).json();
    const second = await (await GET(req())).json();
    expect(first).toEqual(second);
  });

  describe('date range filtering', () => {
    it('returns fewer total runs when filtered to a narrow date range', async () => {
      const full = await (await GET(req())).json();
      const filtered = await (
        await GET(req('?from=2026-03-01&to=2026-03-05'))
      ).json();
      const fullTotal = full.leaderboard.reduce((s: number, e: AgentLeaderboardEntry) => s + e.totalRuns, 0);
      const filteredTotal = filtered.leaderboard.reduce((s: number, e: AgentLeaderboardEntry) => s + e.totalRuns, 0);
      expect(filteredTotal).toBeGreaterThan(0);
      expect(filteredTotal).toBeLessThan(fullTotal);
    });

    it('returns empty leaderboard for a date range with no data', async () => {
      const data = await (
        await GET(req('?from=2025-01-01&to=2025-01-02'))
      ).json();
      expect(data.leaderboard).toHaveLength(0);
    });
  });
});
