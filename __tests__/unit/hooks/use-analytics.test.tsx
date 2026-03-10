import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useOverviewKPIs,
  useTrends,
  useAgentAnalytics,
  useTeamAnalytics,
  useInsights,
  useModelAnalytics,
  useAlerts,
  useTroubleshooting,
} from '@/lib/hooks/use-analytics';
import type {
  OverviewResponse,
  TrendsResponse,
  AgentsResponse,
  TeamsResponse,
  InsightsResponse,
  ModelsResponse,
  AlertsResponse,
  TroubleshootingResponse,
} from '@/lib/types';

// ---------- Mock data fixtures ----------

const mockOverview: OverviewResponse = {
  totalRuns: 100,
  activeUsers: 5,
  activeAgents: 3,
  successRate: 0.8,
  avgLatencyMs: 1200,
  p95LatencyMs: 3500,
  totalTokens: 50000,
  estimatedCost: 125.5,
};

const mockTrends: TrendsResponse = {
  runsTrend: [{ date: '2026-03-01', total: 20, success: 15, error: 3, retry: 2 }],
  latencyTrend: [{ date: '2026-03-01', p50: 1000, p95: 3000 }],
  costTrend: [{ date: '2026-03-01', cost: 50 }],
  runsByDayOfWeek: [
    { day: 'Mon', runs: 20 }, { day: 'Tue', runs: 0 }, { day: 'Wed', runs: 0 },
    { day: 'Thu', runs: 0 }, { day: 'Fri', runs: 0 }, { day: 'Sat', runs: 0 }, { day: 'Sun', runs: 0 },
  ],
};

const mockAgents: AgentsResponse = {
  leaderboard: [
    {
      agentId: 'agent-01',
      agentName: 'Code Generator',
      team: 'Platform',
      totalRuns: 50,
      successRate: 0.9,
      avgLatencyMs: 800,
      totalCost: 60.0,
    },
  ],
  failureTaxonomy: [{ errorType: 'timeout', count: 5, percentage: 0.5 }],
};

const mockTeams: TeamsResponse = {
  teamUsage: [
    { team: 'Platform', totalRuns: 80, activeAgents: 3, activeUsers: 4, totalCost: 100, successRate: 0.85, avgLatencyMs: 2400 },
  ],
  costByModel: [
    { model: 'claude-sonnet-4-20250514', totalCost: 80, percentage: 0.8 },
  ],
  topUsers: [
    { userId: 'user-01', userName: 'Alice Chen', team: 'Platform', totalRuns: 30, totalCost: 40 },
  ],
};

const mockModels: ModelsResponse = {
  models: [
    {
      model: 'claude-sonnet-4-20250514',
      totalRuns: 200,
      successRate: 0.92,
      avgLatencyMs: 1800,
      totalCost: 180.0,
      costPerThousandTokens: 0.003,
      totalTokens: 60000,
    },
  ],
};

const mockAlerts: AlertsResponse = {
  alerts: [
    {
      id: 'alert-1',
      metric: 'success-rate',
      status: 'breached',
      title: 'Low success rate',
      description: 'Success rate below threshold',
      currentValue: 0.65,
      threshold: 0.8,
    },
  ],
  breachedCount: 1,
};

const mockTroubleshooting: TroubleshootingResponse = {
  errorTimeline: [{ date: '2026-03-01', errors: 5, retries: 3 }],
  agentErrors: [
    {
      agentId: 'agent-01',
      agentName: 'Code Generator',
      team: 'Platform',
      totalErrors: 5,
      errorsByType: { timeout: 3, 'rate-limit': 2 },
      topErrorType: 'timeout',
      remediation: 'Increase timeout threshold',
    },
  ],
  totalErrors: 5,
  totalRetries: 3,
};

const mockInsights: InsightsResponse = {
  insights: [
    {
      id: 'insight-1',
      type: 'top-cost-driver',
      severity: 'info',
      title: 'Code Generator is the top cost driver',
      description: 'This agent has accumulated $60.00 in estimated costs.',
      agentId: 'agent-01',
      value: 60,
    },
  ],
};

// ---------- Helpers ----------

// Mock useRole to avoid requiring RoleProvider in test wrapper
jest.mock('@/lib/hooks/use-role', () => ({
  useRole: () => ({ role: 'admin', setRole: jest.fn() }),
  RoleProvider: ({ children }: { children: React.ReactNode }) => children,
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

let fetchMock: jest.Mock;

beforeEach(() => {
  fetchMock = jest.fn();
  global.fetch = fetchMock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

function mockFetchSuccess(data: unknown) {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  } as Response);
}

function mockFetchFailure(status = 500) {
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ error: 'Internal Server Error' }),
  } as Response);
}

// ---------- Tests ----------

describe('useOverviewKPIs', () => {
  it('fetches overview data successfully', async () => {
    mockFetchSuccess(mockOverview);
    const { result } = renderHook(() => useOverviewKPIs(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockOverview);
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/overview?role=admin');
  });

  it('includes date range parameters in the URL', async () => {
    mockFetchSuccess(mockOverview);
    const range = { from: '2026-03-01', to: '2026-03-07' };
    const { result } = renderHook(() => useOverviewKPIs(range), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/overview?from=2026-03-01&to=2026-03-07&role=admin',
    );
  });

  it('enters error state on fetch failure', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useOverviewKPIs(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toContain('Failed to fetch');
  });
});

describe('useTrends', () => {
  it('fetches trends data successfully', async () => {
    mockFetchSuccess(mockTrends);
    const { result } = renderHook(() => useTrends(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTrends);
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/trends?role=admin');
  });

  it('includes date range parameters in the URL', async () => {
    mockFetchSuccess(mockTrends);
    const range = { from: '2026-02-15', to: '2026-03-01' };
    const { result } = renderHook(() => useTrends(range), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/trends?from=2026-02-15&to=2026-03-01&role=admin',
    );
  });

  it('enters error state on fetch failure', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useTrends(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useAgentAnalytics', () => {
  it('fetches agent analytics data successfully', async () => {
    mockFetchSuccess(mockAgents);
    const { result } = renderHook(() => useAgentAnalytics(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockAgents);
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/agents?role=admin');
  });

  it('includes date range parameters in the URL', async () => {
    mockFetchSuccess(mockAgents);
    const range = { from: '2026-03-01', to: '2026-03-09' };
    const { result } = renderHook(() => useAgentAnalytics(range), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/agents?from=2026-03-01&to=2026-03-09&role=admin',
    );
  });

  it('enters error state on fetch failure', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useAgentAnalytics(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useTeamAnalytics', () => {
  it('fetches team analytics data successfully', async () => {
    mockFetchSuccess(mockTeams);
    const { result } = renderHook(() => useTeamAnalytics(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTeams);
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/teams?role=admin');
  });

  it('includes date range parameters in the URL', async () => {
    mockFetchSuccess(mockTeams);
    const range = { from: '2026-02-01', to: '2026-03-01' };
    const { result } = renderHook(() => useTeamAnalytics(range), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/teams?from=2026-02-01&to=2026-03-01&role=admin',
    );
  });

  it('enters error state on fetch failure', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useTeamAnalytics(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useInsights', () => {
  it('fetches insights data successfully', async () => {
    mockFetchSuccess(mockInsights);
    const { result } = renderHook(() => useInsights(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockInsights);
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/insights?role=admin');
  });

  it('includes date range parameters in the URL', async () => {
    mockFetchSuccess(mockInsights);
    const range = { from: '2026-03-01', to: '2026-03-09' };
    const { result } = renderHook(() => useInsights(range), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/insights?from=2026-03-01&to=2026-03-09&role=admin',
    );
  });

  it('enters error state on fetch failure', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useInsights(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useModelAnalytics', () => {
  it('fetches model analytics data successfully', async () => {
    mockFetchSuccess(mockModels);
    const { result } = renderHook(() => useModelAnalytics(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockModels);
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/models?role=admin');
  });

  it('includes date range parameters in the URL', async () => {
    mockFetchSuccess(mockModels);
    const range = { from: '2026-03-01', to: '2026-03-09' };
    const { result } = renderHook(() => useModelAnalytics(range), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/models?from=2026-03-01&to=2026-03-09&role=admin',
    );
  });

  it('enters error state on fetch failure', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useModelAnalytics(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useAlerts', () => {
  it('fetches alerts data successfully', async () => {
    mockFetchSuccess(mockAlerts);
    const { result } = renderHook(() => useAlerts(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockAlerts);
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/alerts?role=admin');
  });

  it('includes date range parameters in the URL', async () => {
    mockFetchSuccess(mockAlerts);
    const range = { from: '2026-03-01', to: '2026-03-09' };
    const { result } = renderHook(() => useAlerts(range), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/alerts?from=2026-03-01&to=2026-03-09&role=admin',
    );
  });

  it('enters error state on fetch failure', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useAlerts(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useTroubleshooting', () => {
  it('fetches troubleshooting data successfully', async () => {
    mockFetchSuccess(mockTroubleshooting);
    const { result } = renderHook(() => useTroubleshooting(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTroubleshooting);
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/troubleshooting?role=admin');
  });

  it('includes date range parameters in the URL', async () => {
    mockFetchSuccess(mockTroubleshooting);
    const range = { from: '2026-03-01', to: '2026-03-09' };
    const { result } = renderHook(() => useTroubleshooting(range), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/troubleshooting?from=2026-03-01&to=2026-03-09&role=admin',
    );
  });

  it('enters error state on fetch failure', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useTroubleshooting(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('fetchJson (via hooks)', () => {
  it('passes no query string when range is undefined', async () => {
    mockFetchSuccess(mockOverview);
    const { result } = renderHook(() => useOverviewKPIs(undefined), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/overview?role=admin');
  });

  it('passes no query string when range is empty object', async () => {
    mockFetchSuccess(mockOverview);
    const { result } = renderHook(() => useOverviewKPIs({}), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/overview?role=admin');
  });

  it('starts in loading state before fetch resolves', () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useOverviewKPIs(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
