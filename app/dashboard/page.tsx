'use client';

import { useOverviewKPIs, useTrends } from '@/lib/hooks/use-analytics';
import { useDateRange } from '@/lib/hooks/use-date-range';
import { useRole } from '@/lib/hooks/use-role';
import { canSeeSection } from '@/lib/role-visibility';
import { KPICard } from '@/components/dashboard/kpi-card';
import { Section } from '@/components/dashboard/section';
import { RunsTrendChart } from '@/components/charts/runs-trend-chart';
import { LatencyTrendChart } from '@/components/charts/latency-trend-chart';
import { CostTrendChart } from '@/components/charts/cost-trend-chart';
import { RunsByDayChart } from '@/components/charts/runs-by-day-chart';
import { KPICardSkeleton, ChartSkeleton } from '@/components/dashboard/skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { formatNumber, formatCost, formatPercent, formatLatency } from '@/lib/utils/format';
import type { OverviewKPIs, DailyRunsTrend, DailyLatencyTrend, DailyCostTrend, DayOfWeekEntry } from '@/lib/types';
import type { UserRole } from '@/lib/types';

function OverviewSkeleton({ role }: { role: UserRole }) {
  const kpiCount = canSeeSection(role, 'kpi-estimated-cost') ? 8 : 6;
  const showCostTrend = canSeeSection(role, 'chart-cost-trend');
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: kpiCount }, (_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
      <Section title="Runs Over Time"><ChartSkeleton /></Section>
      <Section title="Runs by Day of Week"><ChartSkeleton /></Section>
      <Section title="Latency Trend (p50 / p95)"><ChartSkeleton /></Section>
      {showCostTrend && <Section title="Cost Trend"><ChartSkeleton /></Section>}
    </>
  );
}

function OverviewContent({
  kpis,
  trends,
  role,
}: {
  kpis: OverviewKPIs;
  trends: { runsTrend: DailyRunsTrend[]; latencyTrend: DailyLatencyTrend[]; costTrend: DailyCostTrend[]; runsByDayOfWeek: DayOfWeekEntry[] };
  role: UserRole;
}) {
  const showTokenVolume = canSeeSection(role, 'kpi-token-volume');
  const showEstimatedCost = canSeeSection(role, 'kpi-estimated-cost');
  const showCostTrend = canSeeSection(role, 'chart-cost-trend');

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total Runs" value={formatNumber(kpis.totalRuns)} />
        <KPICard label="Active Users" value={formatNumber(kpis.activeUsers)} />
        <KPICard label="Active Agents" value={formatNumber(kpis.activeAgents)} />
        <KPICard label="Success Rate" value={formatPercent(kpis.successRate)} />
        <KPICard label="Avg Latency" value={formatLatency(kpis.avgLatencyMs)} />
        <KPICard label="p95 Latency" value={formatLatency(kpis.p95LatencyMs)} />
        {showTokenVolume && (
          <KPICard
            label="Token Volume"
            value={formatNumber(kpis.totalTokens)}
            detail="input + output"
          />
        )}
        {showEstimatedCost && (
          <KPICard label="Estimated Cost" value={formatCost(kpis.estimatedCost)} />
        )}
      </div>

      <Section title="Runs Over Time">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <RunsTrendChart data={trends.runsTrend} />
        </div>
      </Section>

      <Section title="Runs by Day of Week">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <RunsByDayChart data={trends.runsByDayOfWeek} />
        </div>
      </Section>

      <Section title="Latency Trend (p50 / p95)">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <LatencyTrendChart data={trends.latencyTrend} />
        </div>
      </Section>

      {showCostTrend && (
        <Section title="Cost Trend">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <CostTrendChart data={trends.costTrend} />
          </div>
        </Section>
      )}
    </>
  );
}

export default function OverviewPage() {
  const { range } = useDateRange();
  const { role } = useRole();
  const { data: kpis, isLoading: kpisLoading, isError: kpisError, error: kpisErr } = useOverviewKPIs(range);
  const { data: trends, isLoading: trendsLoading, isError: trendsError, error: trendsErr } = useTrends(range);

  const isLoading = kpisLoading || trendsLoading;
  const isError = kpisError || trendsError;
  const error = kpisErr || trendsErr;

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
      <p className="mt-1 text-sm text-gray-500">
        Organization-wide agent analytics at a glance.
      </p>

      {isLoading ? (
        <OverviewSkeleton role={role} />
      ) : isError ? (
        <ErrorState detail={error instanceof Error ? error.message : undefined} />
      ) : !kpis || !trends ? (
        <ErrorState />
      ) : kpis.totalRuns === 0 ? (
        <EmptyState />
      ) : (
        <OverviewContent kpis={kpis} trends={trends} role={role} />
      )}
    </div>
  );
}
