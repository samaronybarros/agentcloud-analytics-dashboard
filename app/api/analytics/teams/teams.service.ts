import { teamsRepository } from './teams.repository';
import type {
  Agent,
  CostByModelEntry,
  ModelId,
  Run,
  TeamsResponse,
  TeamUsageEntry,
  TopUserEntry,
  User,
} from '@/lib/types';

export function getTeamAnalytics(from?: string, to?: string): TeamsResponse {
  const runs = teamsRepository.getFilteredRuns(from, to);
  const agents = teamsRepository.getAgents();
  const users = teamsRepository.getUsers();
  return {
    teamUsage: computeTeamUsage(runs, agents, users),
    costByModel: computeCostByModel(runs, agents),
    topUsers: computeTopUsers(runs, users),
  };
}

export function computeTeamUsage(
  runs: readonly Run[],
  agents: readonly Agent[],
  _users: readonly User[],
): TeamUsageEntry[] {
  if (runs.length === 0) return [];

  const agentMap = new Map(agents.map((agent) => [agent.id, agent]));

  const teamData = new Map<
    string,
    {
      runs: number;
      successCount: number;
      totalDuration: number;
      agents: Set<string>;
      users: Set<string>;
      cost: number;
    }
  >();

  for (const run of runs) {
    const agent = agentMap.get(run.agentId);
    if (!agent) continue;

    const team = agent.team;
    let data = teamData.get(team);
    if (!data) {
      data = { runs: 0, successCount: 0, totalDuration: 0, agents: new Set(), users: new Set(), cost: 0 };
      teamData.set(team, data);
    }

    data.runs++;
    if (run.status === 'success') data.successCount++;
    data.totalDuration += run.durationMs;
    data.agents.add(run.agentId);
    data.users.add(run.userId);
    data.cost += run.estimatedCost;
  }

  const entries: TeamUsageEntry[] = [];
  for (const [team, data] of teamData) {
    entries.push({
      team,
      totalRuns: data.runs,
      activeAgents: data.agents.size,
      activeUsers: data.users.size,
      totalCost: data.cost,
      successRate: data.runs === 0 ? 0 : data.successCount / data.runs,
      avgLatencyMs: data.runs === 0 ? 0 : data.totalDuration / data.runs,
    });
  }

  return entries.sort((left, right) => right.totalRuns - left.totalRuns);
}

export function computeCostByModel(
  runs: readonly Run[],
  agents: readonly Agent[],
): CostByModelEntry[] {
  if (runs.length === 0) return [];

  const agentMap = new Map(agents.map((agent) => [agent.id, agent]));
  const modelCosts = new Map<ModelId, number>();

  for (const run of runs) {
    const agent = agentMap.get(run.agentId);
    if (!agent) continue;
    modelCosts.set(
      agent.model,
      (modelCosts.get(agent.model) ?? 0) + run.estimatedCost,
    );
  }

  const totalCost = [...modelCosts.values()].reduce((sum, cost) => sum + cost, 0);

  const entries: CostByModelEntry[] = [];
  for (const [model, cost] of modelCosts) {
    entries.push({
      model,
      totalCost: cost,
      percentage: totalCost === 0 ? 0 : cost / totalCost,
    });
  }

  return entries.sort((left, right) => right.totalCost - left.totalCost);
}

export function computeTopUsers(
  runs: readonly Run[],
  users: readonly User[],
): TopUserEntry[] {
  if (runs.length === 0) return [];

  const userMap = new Map(users.map((user) => [user.id, user]));
  const userData = new Map<string, { runs: number; cost: number }>();

  for (const run of runs) {
    let data = userData.get(run.userId);
    if (!data) {
      data = { runs: 0, cost: 0 };
      userData.set(run.userId, data);
    }
    data.runs++;
    data.cost += run.estimatedCost;
  }

  const entries: TopUserEntry[] = [];
  for (const [userId, data] of userData) {
    const user = userMap.get(userId);
    entries.push({
      userId,
      userName: user?.name ?? userId,
      team: user?.team ?? 'Unknown',
      totalRuns: data.runs,
      totalCost: data.cost,
    });
  }

  return entries.sort((left, right) => right.totalRuns - left.totalRuns);
}
