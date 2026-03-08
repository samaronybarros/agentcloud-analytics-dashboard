'use client';

import { useOverviewKPIs, useTrends } from '@/lib/hooks/use-analytics';
import { KPICard } from '@/components/dashboard/kpi-card';
import { Section } from '@/components/dashboard/section';
import { RunsTrendChart } from '@/components/charts/runs-trend-chart';
import { LatencyTrendChart } from '@/components/charts/latency-trend-chart';
import { CostTrendChart } from '@/components/charts/cost-trend-chart';
import { formatNumber, formatCost, formatPercent, formatLatency } from '@/lib/utils/format';

export default function OverviewPage() {
  const { data: kpis, isLoading: kpisLoading } = useOverviewKPIs();
  const { data: trends, isLoading: trendsLoading } = useTrends();

  if (kpisLoading || trendsLoading) {
    return <p className="text-sm text-gray-400">Loading analytics...</p>;
  }

  if (!kpis || !trends) {
    return <p className="text-sm text-red-500">Failed to load analytics data.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
      <p className="mt-1 text-sm text-gray-500">
        Organization-wide agent analytics at a glance.
      </p>

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
    </div>
  );
}
