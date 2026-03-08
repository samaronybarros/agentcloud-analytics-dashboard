'use client';

import { useTeamAnalytics } from '@/lib/hooks/use-analytics';
import { Section } from '@/components/dashboard/section';
import { TeamUsageTable } from '@/components/tables/team-usage-table';
import { TopUsersTable } from '@/components/tables/top-users-table';
import { CostByModelChart } from '@/components/charts/cost-by-model-chart';
import { TableSkeleton, ChartSkeleton } from '@/components/dashboard/skeleton';
import type { TeamUsageEntry, CostByModelEntry, TopUserEntry } from '@/lib/types';

function TeamsSkeleton() {
  return (
    <>
      <Section title="Usage by Team"><TableSkeleton rows={4} /></Section>
      <Section title="Cost by Model"><ChartSkeleton /></Section>
      <Section title="Top Users"><TableSkeleton rows={4} /></Section>
    </>
  );
}

function TeamsContent({
  teamUsage,
  costByModel,
  topUsers,
}: {
  teamUsage: TeamUsageEntry[];
  costByModel: CostByModelEntry[];
  topUsers: TopUserEntry[];
}) {
  return (
    <>
      <Section title="Usage by Team">
        <div className="rounded-lg border border-gray-200 bg-white">
          <TeamUsageTable data={teamUsage} />
        </div>
      </Section>

      <Section title="Cost by Model">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <CostByModelChart data={costByModel} />
        </div>
      </Section>

      <Section title="Top Users">
        <div className="rounded-lg border border-gray-200 bg-white">
          <TopUsersTable data={topUsers} />
        </div>
      </Section>
    </>
  );
}

export default function TeamsPage() {
  const { data, isLoading } = useTeamAnalytics();

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Teams</h2>
      <p className="mt-1 text-sm text-gray-500">
        Team-level adoption, cost distribution, and top contributors.
      </p>

      {isLoading ? (
        <TeamsSkeleton />
      ) : !data ? (
        <p className="mt-6 text-sm text-red-500">Failed to load team data.</p>
      ) : (
        <TeamsContent
          teamUsage={data.teamUsage}
          costByModel={data.costByModel}
          topUsers={data.topUsers}
        />
      )}
    </div>
  );
}
