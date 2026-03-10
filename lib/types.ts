// ---------------------------------------------------------------------------
// Domain types for AgentCloud Analytics Dashboard
// ---------------------------------------------------------------------------

/** Possible outcomes of a single agent run */
export type RunStatus = 'success' | 'error' | 'retry';

/** Functional category of an agent */
export type AgentType =
  | 'code-gen'
  | 'data-pipeline'
  | 'qa-testing'
  | 'deployment'
  | 'monitoring'
  | 'chat';

/** Error classification when a run fails */
export type ErrorType =
  | 'timeout'
  | 'rate-limit'
  | 'auth-failure'
  | 'invalid-input'
  | 'internal-error'
  | null;

/** User role within the organization */
export type UserRole = 'admin' | 'engineer' | 'manager';

/** LLM model identifier */
export type ModelId =
  | 'claude-sonnet-4-20250514'
  | 'claude-haiku-4-5-20251001'
  | 'gpt-4o'
  | 'gpt-4o-mini';

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Agent {
  id: string;
  name: string;
  team: string;
  owner: string;
  type: AgentType;
  model: ModelId;
}

export interface Run {
  id: string;
  agentId: string;
  userId: string;
  status: RunStatus;
  startedAt: string; // ISO 8601
  durationMs: number;
  tokensInput: number;
  tokensOutput: number;
  estimatedCost: number;
  errorType: ErrorType;
}

export interface User {
  id: string;
  name: string;
  team: string;
  role: UserRole;
}

// ---------------------------------------------------------------------------
// Computed / aggregated types used by analytics modules
// ---------------------------------------------------------------------------

export interface OverviewKPIs {
  totalRuns: number;
  activeUsers: number;
  activeAgents: number;
  successRate: number; // 0–1
  avgLatencyMs: number;
  p95LatencyMs: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface AgentLeaderboardEntry {
  agentId: string;
  agentName: string;
  team: string;
  totalRuns: number;
  successRate: number; // 0–1
  avgLatencyMs: number;
  totalCost: number;
}

export interface FailureTaxonomyEntry {
  errorType: string;
  count: number;
  percentage: number; // 0–1, share of total errors
}

export interface TeamUsageEntry {
  team: string;
  totalRuns: number;
  activeAgents: number;
  activeUsers: number;
  totalCost: number;
  successRate: number; // 0–1
  avgLatencyMs: number;
}

export interface CostByModelEntry {
  model: ModelId;
  totalCost: number;
  percentage: number; // 0–1
}

export interface TopUserEntry {
  userId: string;
  userName: string;
  team: string;
  totalRuns: number;
  totalCost: number;
}

export interface Insight {
  id: string;
  type: 'high-cost-low-success' | 'rising-failures' | 'top-cost-driver' | 'degraded-latency';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  agentId?: string;
  team?: string;
  value?: number;
}

// ---------------------------------------------------------------------------
// Trend types — daily aggregation shapes used by charts and API responses
// ---------------------------------------------------------------------------

export interface DailyRunsTrend {
  date: string; // YYYY-MM-DD
  total: number;
  success: number;
  error: number;
  retry: number;
}

export interface DailyLatencyTrend {
  date: string;
  p50: number;
  p95: number;
}

export interface DailyCostTrend {
  date: string;
  cost: number;
}

export interface DayOfWeekEntry {
  day: string; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  runs: number;
}

// ---------------------------------------------------------------------------
// API response types — shared contract between routes and hooks
// ---------------------------------------------------------------------------

export type OverviewResponse = OverviewKPIs;

export interface AgentsResponse {
  leaderboard: AgentLeaderboardEntry[];
  failureTaxonomy: FailureTaxonomyEntry[];
}

export interface TeamsResponse {
  teamUsage: TeamUsageEntry[];
  costByModel: CostByModelEntry[];
  topUsers: TopUserEntry[];
}

export interface TrendsResponse {
  runsTrend: DailyRunsTrend[];
  latencyTrend: DailyLatencyTrend[];
  costTrend: DailyCostTrend[];
  runsByDayOfWeek: DayOfWeekEntry[];
}

export interface InsightsResponse {
  insights: Insight[];
}

// ---------------------------------------------------------------------------
// Filter types
// ---------------------------------------------------------------------------

export interface DateRange {
  from?: string;
  to?: string;
}
