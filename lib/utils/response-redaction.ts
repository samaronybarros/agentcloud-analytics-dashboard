// ---------------------------------------------------------------------------
// Server-side response redaction by role
// ---------------------------------------------------------------------------
// Uses the same role-visibility config as the frontend to ensure consistency.
// Each function takes a full response and returns a redacted copy.
// Redacted fields are omitted from the response (not set to null).
// ---------------------------------------------------------------------------

import type { UserRole } from '@/lib/types';
import type {
  OverviewResponse,
  AgentsResponse,
  TeamsResponse,
  TrendsResponse,
  InsightsResponse,
  ModelsResponse,
  AlertsResponse,
} from '@/lib/types';
import { canSeeSection } from '@/lib/role-visibility';

// ---------------------------------------------------------------------------
// Overview: omit estimatedCost for engineers
// ---------------------------------------------------------------------------

export function redactOverviewResponse(
  data: OverviewResponse,
  role: UserRole,
): object {
  if (canSeeSection(role, 'kpi-estimated-cost')) {
    return data;
  }
  const { estimatedCost: _redacted, ...redacted } = data;
  return redacted;
}

// ---------------------------------------------------------------------------
// Agents: omit totalCost from leaderboard entries for engineers
// ---------------------------------------------------------------------------

export function redactAgentsResponse(
  data: AgentsResponse,
  role: UserRole,
): object {
  if (canSeeSection(role, 'agent-cost-column')) {
    return data;
  }
  return {
    leaderboard: data.leaderboard.map((entry) => {
      const { totalCost: _redacted, ...redacted } = entry;
      return redacted;
    }),
    failureTaxonomy: data.failureTaxonomy,
  };
}

// ---------------------------------------------------------------------------
// Teams: omit costByModel for managers; engineers get 403 at page level
// ---------------------------------------------------------------------------

export function redactTeamsResponse(
  data: TeamsResponse,
  role: UserRole,
): object {
  if (canSeeSection(role, 'cost-by-model')) {
    return data;
  }
  const { costByModel: _redacted, ...redacted } = data;
  return redacted;
}

// ---------------------------------------------------------------------------
// Trends: omit costTrend for engineers
// ---------------------------------------------------------------------------

export function redactTrendsResponse(
  data: TrendsResponse,
  role: UserRole,
): object {
  if (canSeeSection(role, 'chart-cost-trend')) {
    return data;
  }
  const { costTrend: _redacted, ...redacted } = data;
  return redacted;
}

// ---------------------------------------------------------------------------
// Insights: filter out cost-related insights for engineers
// ---------------------------------------------------------------------------

const COST_INSIGHT_TYPES = new Set(['high-cost-low-success', 'top-cost-driver']);

export function redactInsightsResponse(
  data: InsightsResponse,
  role: UserRole,
): object {
  if (canSeeSection(role, 'cost-insights')) {
    return data;
  }
  return {
    insights: data.insights.filter(
      (insight) => !COST_INSIGHT_TYPES.has(insight.type),
    ),
  };
}

// ---------------------------------------------------------------------------
// Models: omit cost fields for managers and engineers
// ---------------------------------------------------------------------------

export function redactModelsResponse(
  data: ModelsResponse,
  role: UserRole,
): object {
  if (canSeeSection(role, 'model-cost-column')) {
    return data;
  }
  return {
    models: data.models.map((entry) => {
      const { totalCost: _cost, costPerThousandTokens: _cpt, ...redacted } = entry;
      return redacted;
    }),
  };
}

// ---------------------------------------------------------------------------
// Alerts: filter out cost alerts for engineers
// ---------------------------------------------------------------------------

export function redactAlertsResponse(
  data: AlertsResponse,
  role: UserRole,
): object {
  if (canSeeSection(role, 'cost-alerts')) {
    return data;
  }
  const filteredAlerts = data.alerts.filter(
    (alert) => alert.metric !== 'cost',
  );
  return {
    alerts: filteredAlerts,
    breachedCount: filteredAlerts.filter((alert) => alert.status === 'breached').length,
  };
}
