import { computeAgentLeaderboard, computeFailureTaxonomy } from '@/lib/analytics/agents';
import { agents } from '@/lib/mock-data/agents';
import { runs } from '@/lib/mock-data/runs';

describe('computeAgentLeaderboard', () => {
  const leaderboard = computeAgentLeaderboard(runs, agents);

  it('returns one entry per agent that has runs', () => {
    const agentsWithRuns = new Set(runs.map((r) => r.agentId));
    expect(leaderboard).toHaveLength(agentsWithRuns.size);
  });

  it('is sorted by totalRuns descending', () => {
    for (let i = 1; i < leaderboard.length; i++) {
      expect(leaderboard[i - 1].totalRuns).toBeGreaterThanOrEqual(
        leaderboard[i].totalRuns,
      );
    }
  });

  it('includes correct agent name and team', () => {
    const entry = leaderboard.find((e) => e.agentId === 'agent-01');
    expect(entry).toBeDefined();
    expect(entry!.agentName).toBe('CodeReviewer');
    expect(entry!.team).toBe('Platform');
  });

  it('computes per-agent success rate correctly', () => {
    for (const entry of leaderboard) {
      const agentRuns = runs.filter((r) => r.agentId === entry.agentId);
      const successCount = agentRuns.filter((r) => r.status === 'success').length;
      expect(entry.successRate).toBeCloseTo(successCount / agentRuns.length, 4);
    }
  });

  it('computes per-agent average latency correctly', () => {
    for (const entry of leaderboard) {
      const agentRuns = runs.filter((r) => r.agentId === entry.agentId);
      const avgMs =
        agentRuns.reduce((sum, r) => sum + r.durationMs, 0) / agentRuns.length;
      expect(entry.avgLatencyMs).toBeCloseTo(avgMs, 0);
    }
  });

  it('computes per-agent total cost correctly', () => {
    for (const entry of leaderboard) {
      const agentRuns = runs.filter((r) => r.agentId === entry.agentId);
      const totalCost = agentRuns.reduce((sum, r) => sum + r.estimatedCost, 0);
      expect(entry.totalCost).toBeCloseTo(totalCost, 2);
    }
  });

  it('returns empty array for empty runs', () => {
    expect(computeAgentLeaderboard([], agents)).toEqual([]);
  });
});

describe('computeFailureTaxonomy', () => {
  const taxonomy = computeFailureTaxonomy(runs);

  it('returns entries only for error types that occurred', () => {
    const errorRuns = runs.filter((r) => r.errorType !== null);
    const errorTypes = new Set(errorRuns.map((r) => r.errorType));
    expect(taxonomy).toHaveLength(errorTypes.size);
  });

  it('counts match actual error occurrences', () => {
    for (const entry of taxonomy) {
      const count = runs.filter((r) => r.errorType === entry.errorType).length;
      expect(entry.count).toBe(count);
    }
  });

  it('percentages sum to approximately 1', () => {
    const sum = taxonomy.reduce((acc, e) => acc + e.percentage, 0);
    expect(sum).toBeCloseTo(1, 4);
  });

  it('is sorted by count descending', () => {
    for (let i = 1; i < taxonomy.length; i++) {
      expect(taxonomy[i - 1].count).toBeGreaterThanOrEqual(taxonomy[i].count);
    }
  });

  it('returns empty array when no errors exist', () => {
    const successRuns = runs.filter((r) => r.status === 'success');
    expect(computeFailureTaxonomy(successRuns)).toEqual([]);
  });
});
