import { useQuery } from '@tanstack/react-query';
import { buildUrl } from '@/lib/utils/build-url';
import type {
  DateRange,
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

export type { DateRange } from '@/lib/types';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export function useOverviewKPIs(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'overview', range],
    queryFn: () => fetchJson<OverviewKPIs>(buildUrl('/api/analytics/overview', range)),
  });
}

export function useTrends(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'trends', range],
    queryFn: () =>
      fetchJson<{
        runsTrend: DailyRunsTrend[];
        latencyTrend: DailyLatencyTrend[];
        costTrend: DailyCostTrend[];
      }>(buildUrl('/api/analytics/trends', range)),
  });
}

export function useAgentAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'agents', range],
    queryFn: () =>
      fetchJson<{
        leaderboard: AgentLeaderboardEntry[];
        failureTaxonomy: FailureTaxonomyEntry[];
      }>(buildUrl('/api/analytics/agents', range)),
  });
}

export function useTeamAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'teams', range],
    queryFn: () =>
      fetchJson<{
        teamUsage: TeamUsageEntry[];
        costByModel: CostByModelEntry[];
        topUsers: TopUserEntry[];
      }>(buildUrl('/api/analytics/teams', range)),
  });
}

export function useInsights(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'insights', range],
    queryFn: () =>
      fetchJson<{ insights: Insight[] }>(buildUrl('/api/analytics/insights', range)),
  });
}
