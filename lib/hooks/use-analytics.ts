import { useQuery } from '@tanstack/react-query';
import type {
  OverviewKPIs,
  AgentLeaderboardEntry,
  FailureTaxonomyEntry,
  TeamUsageEntry,
  CostByModelEntry,
  TopUserEntry,
  Insight,
} from '@/lib/types';
import type {
  DailyRunsTrend,
  DailyLatencyTrend,
  DailyCostTrend,
} from '@/lib/analytics/trends';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export function useOverviewKPIs() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: () => fetchJson<OverviewKPIs>('/api/analytics/overview'),
  });
}

export function useTrends() {
  return useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: () =>
      fetchJson<{
        runsTrend: DailyRunsTrend[];
        latencyTrend: DailyLatencyTrend[];
        costTrend: DailyCostTrend[];
      }>('/api/analytics/trends'),
  });
}

export function useAgentAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'agents'],
    queryFn: () =>
      fetchJson<{
        leaderboard: AgentLeaderboardEntry[];
        failureTaxonomy: FailureTaxonomyEntry[];
      }>('/api/analytics/agents'),
  });
}

export function useTeamAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'teams'],
    queryFn: () =>
      fetchJson<{
        teamUsage: TeamUsageEntry[];
        costByModel: CostByModelEntry[];
        topUsers: TopUserEntry[];
      }>('/api/analytics/teams'),
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ['analytics', 'insights'],
    queryFn: () =>
      fetchJson<{ insights: Insight[] }>('/api/analytics/insights'),
  });
}
