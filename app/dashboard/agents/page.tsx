'use client';

import { useAgentAnalytics } from '@/lib/hooks/use-analytics';
import { Section } from '@/components/dashboard/section';
import { AgentLeaderboard } from '@/components/tables/agent-leaderboard';
import { FailureTaxonomyChart } from '@/components/charts/failure-taxonomy-chart';

export default function AgentsPage() {
  const { data, isLoading } = useAgentAnalytics();

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading agent analytics...</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-500">Failed to load agent data.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Agents</h2>
      <p className="mt-1 text-sm text-gray-500">
        Per-agent performance, reliability, and cost.
      </p>

      <Section title="Agent Leaderboard">
        <div className="rounded-lg border border-gray-200 bg-white">
          <AgentLeaderboard data={data.leaderboard} />
        </div>
      </Section>

      <Section title="Failure Taxonomy">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <FailureTaxonomyChart data={data.failureTaxonomy} />
        </div>
      </Section>
    </div>
  );
}
