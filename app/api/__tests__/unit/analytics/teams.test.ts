import {
  computeTeamUsage,
  computeCostByModel,
  computeTopUsers,
} from '@/app/api/analytics/teams/teams.service';
import { agents } from '@/app/api/_mock-data/agents';
import { runs } from '@/app/api/_mock-data/runs';
import { users } from '@/app/api/_mock-data/users';
import type { Run } from '@/lib/types';

describe('computeTeamUsage', () => {
  const teamUsage = computeTeamUsage(runs, agents, users);

  it('returns one entry per team that has runs', () => {
    // Derive teams from agents that have runs
    const agentIds = new Set(runs.map((r) => r.agentId));
    const teams = new Set(
      agents.filter((a) => agentIds.has(a.id)).map((a) => a.team),
    );
    expect(teamUsage).toHaveLength(teams.size);
  });

  it('computes correct total runs per team', () => {
    for (const entry of teamUsage) {
      const teamAgentIds = agents
        .filter((a) => a.team === entry.team)
        .map((a) => a.id);
      const teamRuns = runs.filter((r) => teamAgentIds.includes(r.agentId));
      expect(entry.totalRuns).toBe(teamRuns.length);
    }
  });

  it('computes correct active agents per team', () => {
    for (const entry of teamUsage) {
      const teamAgentIds = agents
        .filter((a) => a.team === entry.team)
        .map((a) => a.id);
      const activeAgents = new Set(
        runs.filter((r) => teamAgentIds.includes(r.agentId)).map((r) => r.agentId),
      );
      expect(entry.activeAgents).toBe(activeAgents.size);
    }
  });

  it('computes correct total cost per team', () => {
    for (const entry of teamUsage) {
      const teamAgentIds = agents
        .filter((a) => a.team === entry.team)
        .map((a) => a.id);
      const totalCost = runs
        .filter((r) => teamAgentIds.includes(r.agentId))
        .reduce((sum, r) => sum + r.estimatedCost, 0);
      expect(entry.totalCost).toBeCloseTo(totalCost, 2);
    }
  });

  it('computes correct success rate per team', () => {
    for (const entry of teamUsage) {
      const teamAgentIds = agents
        .filter((a) => a.team === entry.team)
        .map((a) => a.id);
      const teamRuns = runs.filter((r) => teamAgentIds.includes(r.agentId));
      const successCount = teamRuns.filter((r) => r.status === 'success').length;
      const expectedRate = teamRuns.length === 0 ? 0 : successCount / teamRuns.length;
      expect(entry.successRate).toBeCloseTo(expectedRate, 4);
    }
  });

  it('computes correct average latency per team', () => {
    for (const entry of teamUsage) {
      const teamAgentIds = agents
        .filter((a) => a.team === entry.team)
        .map((a) => a.id);
      const teamRuns = runs.filter((r) => teamAgentIds.includes(r.agentId));
      const totalDuration = teamRuns.reduce((sum, r) => sum + r.durationMs, 0);
      const expectedLatency = teamRuns.length === 0 ? 0 : totalDuration / teamRuns.length;
      expect(entry.avgLatencyMs).toBeCloseTo(expectedLatency, 2);
    }
  });

  it('returns empty array for empty runs', () => {
    expect(computeTeamUsage([], agents, users)).toEqual([]);
  });
});

describe('computeCostByModel', () => {
  const costByModel = computeCostByModel(runs, agents);

  it('returns one entry per model used', () => {
    const agentMap = new Map(agents.map((a) => [a.id, a]));
    const models = new Set(
      runs.map((r) => agentMap.get(r.agentId)!.model),
    );
    expect(costByModel).toHaveLength(models.size);
  });

  it('cost percentages sum to approximately 1', () => {
    const sum = costByModel.reduce((acc, e) => acc + e.percentage, 0);
    expect(sum).toBeCloseTo(1, 4);
  });

  it('total costs match actual per-model sums', () => {
    const agentMap = new Map(agents.map((a) => [a.id, a]));
    for (const entry of costByModel) {
      const modelCost = runs
        .filter((r) => agentMap.get(r.agentId)!.model === entry.model)
        .reduce((sum, r) => sum + r.estimatedCost, 0);
      expect(entry.totalCost).toBeCloseTo(modelCost, 2);
    }
  });

  it('returns empty array for empty runs', () => {
    expect(computeCostByModel([], agents)).toEqual([]);
  });

  it('returns zero percentages when all runs have zero cost', () => {
    const zeroCostRuns: Run[] = [
      {
        id: 'zc1', agentId: 'agent-01', userId: 'user-01', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 100,
        tokensInput: 10, tokensOutput: 10, estimatedCost: 0, errorType: null,
      },
      {
        id: 'zc2', agentId: 'agent-02', userId: 'user-02', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 200,
        tokensInput: 20, tokensOutput: 20, estimatedCost: 0, errorType: null,
      },
    ];
    const result = computeCostByModel(zeroCostRuns, agents);
    for (const entry of result) {
      expect(Number.isFinite(entry.percentage)).toBe(true);
      expect(entry.percentage).toBe(0);
    }
  });
});

describe('computeTopUsers', () => {
  const topUsers = computeTopUsers(runs, users);

  it('returns one entry per user that has runs', () => {
    const activeUsers = new Set(runs.map((r) => r.userId));
    expect(topUsers).toHaveLength(activeUsers.size);
  });

  it('is sorted by totalRuns descending', () => {
    for (let i = 1; i < topUsers.length; i++) {
      expect(topUsers[i - 1].totalRuns).toBeGreaterThanOrEqual(
        topUsers[i].totalRuns,
      );
    }
  });

  it('includes correct user names and teams', () => {
    const entry = topUsers.find((e) => e.userId === 'user-01');
    expect(entry).toBeDefined();
    expect(entry!.userName).toBe('Alice Chen');
    expect(entry!.team).toBe('Platform');
  });

  it('computes correct total cost per user', () => {
    for (const entry of topUsers) {
      const userCost = runs
        .filter((r) => r.userId === entry.userId)
        .reduce((sum, r) => sum + r.estimatedCost, 0);
      expect(entry.totalCost).toBeCloseTo(userCost, 2);
    }
  });

  it('returns empty array for empty runs', () => {
    expect(computeTopUsers([], users)).toEqual([]);
  });

  it('handles cross-team user activity', () => {
    // user-01 is Platform, but runs agent-02 which is Data team
    const crossTeamRuns: Run[] = [
      {
        id: 'r1', agentId: 'agent-02', userId: 'user-01', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 300,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 0.1, errorType: null,
      },
    ];
    const result = computeTopUsers(crossTeamRuns, users);
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe('user-01');
    expect(result[0].team).toBe('Platform'); // user's own team, not agent's
  });

  it('falls back to userId and Unknown team when user is not in the user list', () => {
    const unknownUserRuns: Run[] = [
      {
        id: 'uu-1', agentId: 'agent-01', userId: 'unknown-user-99', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 300,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 0.5, errorType: null,
      },
    ];
    const result = computeTopUsers(unknownUserRuns, users);
    expect(result).toHaveLength(1);
    expect(result[0].userName).toBe('unknown-user-99');
    expect(result[0].team).toBe('Unknown');
  });
});

describe('computeTeamUsage — orphaned runs', () => {
  it('skips runs whose agentId is not in the agents list', () => {
    const orphanedRuns: Run[] = [
      {
        id: 'orphan-1', agentId: 'nonexistent-agent', userId: 'user-01', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 500,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 1.0, errorType: null,
      },
      {
        id: 'valid-1', agentId: 'agent-01', userId: 'user-01', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 500,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 2.0, errorType: null,
      },
    ];
    const result = computeTeamUsage(orphanedRuns, agents, users);
    // Only the valid run's team should appear
    expect(result).toHaveLength(1);
    expect(result[0].totalRuns).toBe(1);
    expect(result[0].totalCost).toBeCloseTo(2.0, 2);
  });
});

describe('computeCostByModel — orphaned runs', () => {
  it('skips runs whose agentId is not in the agents list', () => {
    const orphanedRuns: Run[] = [
      {
        id: 'orphan-1', agentId: 'nonexistent-agent', userId: 'user-01', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 500,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 1.0, errorType: null,
      },
      {
        id: 'valid-1', agentId: 'agent-01', userId: 'user-01', status: 'success',
        startedAt: '2026-03-01T10:00:00Z', durationMs: 500,
        tokensInput: 100, tokensOutput: 50, estimatedCost: 2.0, errorType: null,
      },
    ];
    const result = computeCostByModel(orphanedRuns, agents);
    // Only the valid run's model should appear
    expect(result).toHaveLength(1);
    expect(result[0].totalCost).toBeCloseTo(2.0, 2);
    expect(result[0].percentage).toBeCloseTo(1.0, 4);
  });
});
