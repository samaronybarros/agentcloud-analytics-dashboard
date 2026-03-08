'use client';

import { useOverviewKPIs, useTrends } from '@/lib/hooks/use-analytics';
import { useDateRange } from '@/lib/hooks/use-date-range';
import { KPICard } from '@/components/dashboard/kpi-card';
import { Section } from '@/components/dashboard/section';
import { RunsTrendChart } from '@/components/charts/runs-trend-chart';
import { LatencyTrendChart } from '@/components/charts/latency-trend-chart';
import { CostTrendChart } from '@/components/charts/cost-trend-chart';
import { KPICardSkeleton, ChartSkeleton } from '@/components/dashboard/skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { formatNumber, formatCost, formatPercent, formatLatency } from '@/lib/utils/format';
import type { OverviewKPIs, DailyRunsTrend, DailyLatencyTrend, DailyCostTrend } from '@/lib/types';

function OverviewSkeleton() {
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
      <Section title="Runs Over Time"><ChartSkeleton /></Section>
      <Section title="Latency Trend (p50 / p95)"><ChartSkeleton /></Section>
      <Section title="Cost Trend"><ChartSkeleton /></Section>
    </>
  );
}

function OverviewContent({
  kpis,
  trends,
}: {
  kpis: OverviewKPIs;
  trends: { runsTrend: DailyRunsTrend[]; latencyTrend: DailyLatencyTrend[]; costTrend: DailyCostTrend[] };
}) {
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Total Runs" value={formatNumber(kpis.totalRuns)} />
        <KPICard label="Active Users" value={formatNumber(kpis.activeUsers)} />
        <KPICard label="Active Agents" value={formatNumber(kpis.activeAgents)} />
        <KPICard label="Success Rate" value={formatPercent(kpis.successRate)} />
        <KPICard label="Avg Latency" value={formatLatency(kpis.avgLatencyMs)} />
        <KPICard label="p95 Latency" value={formatLatency(kpis.p95LatencyMs)} />
        <KPICard
          label="Token Volume"
          value={formatNumber(kpis.totalTokens)}
          detail="input + output"
        />
        <KPICard label="Estimated Cost" value={formatCost(kpis.estimatedCost)} />
      </div>

      <Section title="Runs Over Time">
        <RunsTrendChart data={trends.runsTrend} />
      </Section>

      <Section title="Latency Trend (p50 / p95)">
        <LatencyTrendChart data={trends.latencyTrend} />
      </Section>

      <Section title="Cost Trend">
        <CostTrendChart data={trends.costTrend} />
      </Section>
    </>
  );
}

export default function OverviewPage() {
  const { range } = useDateRange();
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
        <OverviewSkeleton />
      ) : isError ? (
        <ErrorState detail={error instanceof Error ? error.message : undefined} />
      ) : !kpis || !trends ? (
        <ErrorState />
      ) : kpis.totalRuns === 0 ? (
        <EmptyState />
      ) : (
        <OverviewContent kpis={kpis} trends={trends} />
      )}
    </div>
  );
}
