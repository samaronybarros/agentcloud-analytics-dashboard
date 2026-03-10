import { useQuery } from '@tanstack/react-query';
import { buildUrl } from '@/lib/utils/build-url';
import { useRole } from '@/lib/hooks/use-role';
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
  const { role } = useRole();
  return useQuery({
    queryKey: ['analytics', 'overview', range, role],
    queryFn: () => fetchJson<OverviewResponse>(buildUrl('/api/analytics/overview', range, role)),
  });
}

export function useTrends(range?: DateRange) {
  const { role } = useRole();
  return useQuery({
    queryKey: ['analytics', 'trends', range, role],
    queryFn: () => fetchJson<TrendsResponse>(buildUrl('/api/analytics/trends', range, role)),
  });
}

export function useAgentAnalytics(range?: DateRange) {
  const { role } = useRole();
  return useQuery({
    queryKey: ['analytics', 'agents', range, role],
    queryFn: () => fetchJson<AgentsResponse>(buildUrl('/api/analytics/agents', range, role)),
  });
}

export function useTeamAnalytics(range?: DateRange) {
  const { role } = useRole();
  return useQuery({
    queryKey: ['analytics', 'teams', range, role],
    queryFn: () => fetchJson<TeamsResponse>(buildUrl('/api/analytics/teams', range, role)),
  });
}

export function useInsights(range?: DateRange) {
  const { role } = useRole();
  return useQuery({
    queryKey: ['analytics', 'insights', range, role],
    queryFn: () => fetchJson<InsightsResponse>(buildUrl('/api/analytics/insights', range, role)),
  });
}

export function useModelAnalytics(range?: DateRange) {
  const { role } = useRole();
  return useQuery({
    queryKey: ['analytics', 'models', range, role],
    queryFn: () => fetchJson<ModelsResponse>(buildUrl('/api/analytics/models', range, role)),
  });
}

export function useAlerts(range?: DateRange) {
  const { role } = useRole();
  return useQuery({
    queryKey: ['analytics', 'alerts', range, role],
    queryFn: () => fetchJson<AlertsResponse>(buildUrl('/api/analytics/alerts', range, role)),
  });
}

export function useTroubleshooting(range?: DateRange) {
  const { role } = useRole();
  return useQuery({
    queryKey: ['analytics', 'troubleshooting', range, role],
    queryFn: () => fetchJson<TroubleshootingResponse>(buildUrl('/api/analytics/troubleshooting', range, role)),
  });
}
