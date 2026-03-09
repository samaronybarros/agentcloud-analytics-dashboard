import { computeAgentLeaderboard, computeFailureTaxonomy } from '@/app/api/analytics/agents/agents.service';
import { agents } from '@/app/api/_mock-data/agents';
import { runs } from '@/app/api/_mock-data/runs';
import type { Run } from '@/lib/types';

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

  it('handles single-agent runs', () => {
    const singleAgentRuns: Run[] = [
      {
        id: 'r1', agentId: 'agent-01', userId: 'user-01', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 300,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 0.1, errorType: null,
      },
      {
        id: 'r2', agentId: 'agent-01', userId: 'user-02', status: 'error',
        startedAt: '2026-03-01T11:00:00Z', durationMs: 700,
        tokensInput: 200, tokensOutput: 100, estimatedCost: 0.3, errorType: 'timeout',
      },
    ];
    const result = computeAgentLeaderboard(singleAgentRuns, agents);
    expect(result).toHaveLength(1);
    expect(result[0].agentId).toBe('agent-01');
    expect(result[0].totalRuns).toBe(2);
    expect(result[0].successRate).toBe(0.5);
  });

  it('skips runs referencing unknown agent IDs', () => {
    const runsWithUnknown: Run[] = [
      {
        id: 'r1', agentId: 'agent-unknown', userId: 'user-01', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 300,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 0.1, errorType: null,
      },
    ];
    const result = computeAgentLeaderboard(runsWithUnknown, agents);
    expect(result).toEqual([]);
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

  it('handles all runs having the same error type', () => {
    const sameErrorRuns: Run[] = [
      {
        id: 'r1', agentId: 'agent-01', userId: 'user-01', status: 'error',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 500,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 0.1, errorType: 'timeout',
      },
      {
        id: 'r2', agentId: 'agent-01', userId: 'user-01', status: 'error',
        startedAt: '2026-03-01T11:00:00Z', durationMs: 600,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 0.1, errorType: 'timeout',
      },
    ];
    const result = computeFailureTaxonomy(sameErrorRuns);
    expect(result).toHaveLength(1);
    expect(result[0].errorType).toBe('timeout');
    expect(result[0].count).toBe(2);
    expect(result[0].percentage).toBe(1);
  });
});
