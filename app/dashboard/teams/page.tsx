'use client';

import { useTeamAnalytics } from '@/lib/hooks/use-analytics';
import { Section } from '@/components/dashboard/section';
import { TeamUsageTable } from '@/components/tables/team-usage-table';
import { TopUsersTable } from '@/components/tables/top-users-table';
import { CostByModelChart } from '@/components/charts/cost-by-model-chart';

export default function TeamsPage() {
  const { data, isLoading } = useTeamAnalytics();

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading team analytics...</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-500">Failed to load team data.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Teams</h2>
      <p className="mt-1 text-sm text-gray-500">
        Team-level adoption, cost distribution, and top contributors.
      </p>

      <Section title="Usage by Team">
        <div className="rounded-lg border border-gray-200 bg-white">
          <TeamUsageTable data={data.teamUsage} />
        </div>
      </Section>

      <Section title="Cost by Model">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <CostByModelChart data={data.costByModel} />
        </div>
      </Section>

      <Section title="Top Users">
        <div className="rounded-lg border border-gray-200 bg-white">
          <TopUsersTable data={data.topUsers} />
        </div>
      </Section>
    </div>
  );
}
