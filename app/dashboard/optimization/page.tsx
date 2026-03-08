'use client';

import { useInsights } from '@/lib/hooks/use-analytics';
import { Section } from '@/components/dashboard/section';
import { InsightCard } from '@/components/insights/insight-card';
import { Skeleton } from '@/components/dashboard/skeleton';
import type { Insight } from '@/lib/types';

function OptimizationSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

function OptimizationContent({ insights }: { insights: Insight[] }) {
  const critical = insights.filter((i) => i.severity === 'critical');
  const warnings = insights.filter((i) => i.severity === 'warning');
  const info = insights.filter((i) => i.severity === 'info');

  if (insights.length === 0) {
    return (
      <p className="mt-8 text-sm text-gray-400">
        No optimization insights at this time. All agents are performing well.
      </p>
    );
  }

  return (
    <>
      {critical.length > 0 && (
        <Section title="Critical">
          <div className="space-y-3">
            {critical.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </Section>
      )}

      {warnings.length > 0 && (
        <Section title="Warnings">
          <div className="space-y-3">
            {warnings.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </Section>
      )}

      {info.length > 0 && (
        <Section title="Information">
          <div className="space-y-3">
            {info.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

export default function OptimizationPage() {
  const { data, isLoading } = useInsights();

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Optimization</h2>
      <p className="mt-1 text-sm text-gray-500">
        Actionable insights to improve cost, reliability, and performance.
      </p>

      {isLoading ? (
        <OptimizationSkeleton />
      ) : !data ? (
        <p className="mt-6 text-sm text-red-500">Failed to load insights.</p>
      ) : (
        <OptimizationContent insights={data.insights} />
      )}
    </div>
  );
}
