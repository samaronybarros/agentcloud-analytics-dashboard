'use client';

import { useModelAnalytics } from '@/lib/hooks/use-analytics';
import { useDateRange } from '@/lib/hooks/use-date-range';
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

function ModelsContent({ models }: { models: ModelPerformanceEntry[] }) {
  return (
    <Section title="Model Performance">
      <div className="rounded-lg border border-gray-200 bg-white">
        <ModelPerformanceTable data={models} />
      </div>
    </Section>
  );
}

export default function ModelsPage() {
  const { range } = useDateRange();
  const { data, isLoading, isError, error } = useModelAnalytics(range);

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
        <ModelsContent models={data.models} />
      )}
    </div>
  );
}
