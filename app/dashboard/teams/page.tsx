'use client';

import { useTeamAnalytics } from '@/lib/hooks/use-analytics';
import { useDateRange } from '@/lib/hooks/use-date-range';
import { useRole } from '@/lib/hooks/use-role';
import { canAccessPage, canSeeSection } from '@/lib/role-visibility';
import { Section } from '@/components/dashboard/section';
import { TeamUsageTable } from '@/components/tables/team-usage-table';
import { TopUsersTable } from '@/components/tables/top-users-table';
import { CostByModelChart } from '@/components/charts/cost-by-model-chart';
import { TeamComparisonChart } from '@/components/charts/team-comparison-chart';
import { TableSkeleton, ChartSkeleton } from '@/components/dashboard/skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import type { TeamUsageEntry, CostByModelEntry, TopUserEntry } from '@/lib/types';

function TeamsSkeleton({ showCostByModel, showTopUsers }: { showCostByModel: boolean; showTopUsers: boolean }) {
  return (
    <>
      <Section title="Usage by Team"><TableSkeleton rows={4} /></Section>
      <Section title="Team Comparison"><ChartSkeleton /></Section>
      {showCostByModel && <Section title="Cost by Model"><ChartSkeleton /></Section>}
      {showTopUsers && <Section title="Top Users"><TableSkeleton rows={4} /></Section>}
    </>
  );
}

function TeamsContent({
  teamUsage,
  costByModel,
  topUsers,
  showCostByModel,
  showTopUsers,
}: {
  teamUsage: TeamUsageEntry[];
  costByModel: CostByModelEntry[];
  topUsers: TopUserEntry[];
  showCostByModel: boolean;
  showTopUsers: boolean;
}) {
  return (
    <>
      <Section title="Usage by Team">
        <div className="rounded-lg border border-gray-200 bg-white">
          <TeamUsageTable data={teamUsage} />
        </div>
      </Section>

      <Section title="Team Comparison">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-2 text-xs text-gray-500">
            Side-by-side comparison of success rate, run volume, and cost across teams.
          </p>
          <TeamComparisonChart data={teamUsage} />
        </div>
      </Section>

      {showCostByModel && (
        <Section title="Cost by Model">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <CostByModelChart data={costByModel} />
          </div>
        </Section>
      )}

      {showTopUsers && (
        <Section title="Top Users">
          <div className="rounded-lg border border-gray-200 bg-white">
            <TopUsersTable data={topUsers} />
          </div>
        </Section>
      )}
    </>
  );
}

function RestrictedAccess() {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 text-center">
      <p className="text-sm text-gray-500">
        Team-level analytics are available to Org Admins and Engineering Managers.
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Switch your role using the selector above to access this page.
      </p>
    </div>
  );
}

export default function TeamsPage() {
  const { range } = useDateRange();
  const { role } = useRole();
  const { data, isLoading, isError, error } = useTeamAnalytics(range);

  const hasAccess = canAccessPage(role, 'teams');
  const showCostByModel = canSeeSection(role, 'cost-by-model');
  const showTopUsers = canSeeSection(role, 'top-users');

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Teams</h2>
      <p className="mt-1 text-sm text-gray-500">
        Team-level adoption, cost distribution, and top contributors.
      </p>

      {!hasAccess ? (
        <RestrictedAccess />
      ) : isLoading ? (
        <TeamsSkeleton showCostByModel={showCostByModel} showTopUsers={showTopUsers} />
      ) : isError ? (
        <ErrorState detail={error instanceof Error ? error.message : undefined} />
      ) : !data ? (
        <ErrorState />
      ) : data.teamUsage.length === 0 ? (
        <EmptyState />
      ) : (
        <TeamsContent
          teamUsage={data.teamUsage}
          costByModel={data.costByModel}
          topUsers={data.topUsers}
          showCostByModel={showCostByModel}
          showTopUsers={showTopUsers}
        />
      )}
    </div>
  );
}
