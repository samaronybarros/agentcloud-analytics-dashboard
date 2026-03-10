'use client';

import { useInsights } from '@/lib/hooks/use-analytics';
import { useDateRange } from '@/lib/hooks/use-date-range';
import { useRole } from '@/lib/hooks/use-role';
import { canSeeSection } from '@/lib/role-visibility';
import { Section } from '@/components/dashboard/section';
import { InsightCard } from '@/components/insights/insight-card';
import { Skeleton } from '@/components/dashboard/skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import type { Insight } from '@/lib/types';

const COST_INSIGHT_TYPES: ReadonlySet<string> = new Set([
  'high-cost-low-success',
  'top-cost-driver',
]);

function OptimizationSkeleton() {
  return (
    <div className="mt-8 space-y-6">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}

function OptimizationContent({ insights, showCostInsights }: { insights: Insight[]; showCostInsights: boolean }) {
  const filtered = showCostInsights
    ? insights
    : insights.filter((insight) => !COST_INSIGHT_TYPES.has(insight.type));

  const critical = filtered.filter((insight) => insight.severity === 'critical');
  const warnings = filtered.filter((insight) => insight.severity === 'warning');
  const info = filtered.filter((insight) => insight.severity === 'info');

  if (filtered.length === 0) {
    return (
      <EmptyState message="No optimization insights available for your role. All visible agents are performing well." />
    );
  }

  return (
    <>
      {critical.length > 0 && (
        <Section title="Critical">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="space-y-3">
              {critical.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {warnings.length > 0 && (
        <Section title="Warnings">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="space-y-3">
              {warnings.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {info.length > 0 && (
        <Section title="Information">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="space-y-3">
              {info.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}

export default function OptimizationPage() {
  const { range } = useDateRange();
  const { role } = useRole();
  const { data, isLoading, isError, error } = useInsights(range);

  const showCostInsights = canSeeSection(role, 'cost-insights');

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Optimization</h2>
      <p className="mt-1 text-sm text-gray-500">
        Actionable insights to improve cost, reliability, and performance.
      </p>

      {isLoading ? (
        <OptimizationSkeleton />
      ) : isError ? (
        <ErrorState detail={error instanceof Error ? error.message : undefined} />
      ) : !data ? (
        <ErrorState />
      ) : (
        <OptimizationContent insights={data.insights} showCostInsights={showCostInsights} />
      )}
    </div>
  );
}
