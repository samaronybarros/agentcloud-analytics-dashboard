'use client';

import { useAgentAnalytics } from '@/lib/hooks/use-analytics';
import { useDateRange } from '@/lib/hooks/use-date-range';
import { Section } from '@/components/dashboard/section';
import { AgentLeaderboard } from '@/components/tables/agent-leaderboard';
import { FailureTaxonomyChart } from '@/components/charts/failure-taxonomy-chart';
import { CostReliabilityScatter } from '@/components/charts/cost-reliability-scatter';
import { TableSkeleton, ChartSkeleton } from '@/components/dashboard/skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import type { AgentLeaderboardEntry, FailureTaxonomyEntry } from '@/lib/types';

function AgentsSkeleton() {
  return (
    <>
      <Section title="Agent Leaderboard"><TableSkeleton rows={5} /></Section>
      <Section title="Cost vs Reliability"><ChartSkeleton /></Section>
      <Section title="Failure Taxonomy"><ChartSkeleton /></Section>
    </>
  );
}

function AgentsContent({
  leaderboard,
  failureTaxonomy,
}: {
  leaderboard: AgentLeaderboardEntry[];
  failureTaxonomy: FailureTaxonomyEntry[];
}) {
  return (
    <>
      <Section title="Agent Leaderboard">
        <div className="rounded-lg border border-gray-200 bg-white">
          <AgentLeaderboard data={leaderboard} />
        </div>
      </Section>

      <Section title="Cost vs Reliability">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-2 text-xs text-gray-500">
            Bubble size = run volume. Red dashed line = 70% success threshold.
          </p>
          <CostReliabilityScatter data={leaderboard} />
        </div>
      </Section>

      <Section title="Failure Taxonomy">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <FailureTaxonomyChart data={failureTaxonomy} />
        </div>
      </Section>
    </>
  );
}

export default function AgentsPage() {
  const { range } = useDateRange();
  const { data, isLoading, isError, error } = useAgentAnalytics(range);

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Agents</h2>
      <p className="mt-1 text-sm text-gray-500">
        Per-agent performance, reliability, and cost.
      </p>

      {isLoading ? (
        <AgentsSkeleton />
      ) : isError ? (
        <ErrorState detail={error instanceof Error ? error.message : undefined} />
      ) : !data ? (
        <ErrorState />
      ) : data.leaderboard.length === 0 ? (
        <EmptyState />
      ) : (
        <AgentsContent
          leaderboard={data.leaderboard}
          failureTaxonomy={data.failureTaxonomy}
        />
      )}
    </div>
  );
}
