'use client';

import { useModelAnalytics } from '@/lib/hooks/use-analytics';
import { useDateRange } from '@/lib/hooks/use-date-range';
import { useRole } from '@/lib/hooks/use-role';
import { canSeeSection } from '@/lib/role-visibility';
import { Section } from '@/components/dashboard/section';
import { TableSkeleton } from '@/components/dashboard/skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { ModelPerformanceTable } from '@/components/tables/model-performance-table';
import type { ModelPerformanceEntry } from '@/lib/types';

function ModelsSkeleton() {
  return (
    <Section title="Model Performance"><TableSkeleton rows={4} /></Section>
  );
}

function ModelsContent({
  models,
  showCostColumn,
  showCostPerTokenColumn,
}: {
  models: ModelPerformanceEntry[];
  showCostColumn: boolean;
  showCostPerTokenColumn: boolean;
}) {
  return (
    <Section title="Model Performance">
      <div className="rounded-lg border border-gray-200 bg-white">
        <ModelPerformanceTable
          data={models}
          showCostColumn={showCostColumn}
          showCostPerTokenColumn={showCostPerTokenColumn}
        />
      </div>
    </Section>
  );
}

export default function ModelsPage() {
  const { range } = useDateRange();
  const { role } = useRole();
  const { data, isLoading, isError, error } = useModelAnalytics(range);

  const showCostColumn = canSeeSection(role, 'model-cost-column');
  const showCostPerTokenColumn = canSeeSection(role, 'model-cost-per-token-column');

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Models</h2>
      <p className="mt-1 text-sm text-gray-500">
        Model-level reliability, efficiency, and cost comparison.
      </p>

      {isLoading ? (
        <ModelsSkeleton />
      ) : isError ? (
        <ErrorState detail={error instanceof Error ? error.message : undefined} />
      ) : !data ? (
        <ErrorState />
      ) : data.models.length === 0 ? (
        <EmptyState />
      ) : (
        <ModelsContent
          models={data.models}
          showCostColumn={showCostColumn}
          showCostPerTokenColumn={showCostPerTokenColumn}
        />
      )}
    </div>
  );
}
