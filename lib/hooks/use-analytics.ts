import { useQuery } from '@tanstack/react-query';
import { buildUrl } from '@/lib/utils/build-url';
import type {
  DateRange,
  OverviewResponse,
  AgentsResponse,
  TeamsResponse,
  TrendsResponse,
  InsightsResponse,
  ModelsResponse,
  AlertsResponse,
  TroubleshootingResponse,
} from '@/lib/types';

export type { DateRange } from '@/lib/types';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export function useOverviewKPIs(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'overview', range],
    queryFn: () => fetchJson<OverviewResponse>(buildUrl('/api/analytics/overview', range)),
  });
}

export function useTrends(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'trends', range],
    queryFn: () => fetchJson<TrendsResponse>(buildUrl('/api/analytics/trends', range)),
  });
}

export function useAgentAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'agents', range],
    queryFn: () => fetchJson<AgentsResponse>(buildUrl('/api/analytics/agents', range)),
  });
}

export function useTeamAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'teams', range],
    queryFn: () => fetchJson<TeamsResponse>(buildUrl('/api/analytics/teams', range)),
  });
}

export function useInsights(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'insights', range],
    queryFn: () => fetchJson<InsightsResponse>(buildUrl('/api/analytics/insights', range)),
  });
}

export function useModelAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'models', range],
    queryFn: () => fetchJson<ModelsResponse>(buildUrl('/api/analytics/models', range)),
  });
}

export function useAlerts(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'alerts', range],
    queryFn: () => fetchJson<AlertsResponse>(buildUrl('/api/analytics/alerts', range)),
  });
}

export function useTroubleshooting(range?: DateRange) {
  return useQuery({
    queryKey: ['analytics', 'troubleshooting', range],
    queryFn: () => fetchJson<TroubleshootingResponse>(buildUrl('/api/analytics/troubleshooting', range)),
  });
}
