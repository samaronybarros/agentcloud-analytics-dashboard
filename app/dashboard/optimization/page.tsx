'use client';

import { useInsights } from '@/lib/hooks/use-analytics';
import { Section } from '@/components/dashboard/section';
import { InsightCard } from '@/components/insights/insight-card';

export default function OptimizationPage() {
  const { data, isLoading } = useInsights();

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading insights...</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-500">Failed to load insights.</p>;
  }

  const critical = data.insights.filter((i) => i.severity === 'critical');
  const warnings = data.insights.filter((i) => i.severity === 'warning');
  const info = data.insights.filter((i) => i.severity === 'info');

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Optimization</h2>
      <p className="mt-1 text-sm text-gray-500">
        Actionable insights to improve cost, reliability, and performance.
      </p>

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

      {data.insights.length === 0 && (
        <p className="mt-8 text-sm text-gray-400">
          No optimization insights at this time. All agents are performing well.
        </p>
      )}
    </div>
  );
}
