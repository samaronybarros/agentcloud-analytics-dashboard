import {
  computeTeamUsage,
  computeCostByModel,
  computeTopUsers,
} from '@/lib/analytics/teams';
import { agents } from '@/lib/mock-data/agents';
import { runs } from '@/lib/mock-data/runs';
import { users } from '@/lib/mock-data/users';
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
});
