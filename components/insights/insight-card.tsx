'use client';

import type { Insight } from '@/lib/types';

const severityStyles = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  critical: 'border-red-200 bg-red-50 text-red-800',
} as const;

const severityLabels = {
  info: 'Info',
  warning: 'Warning',
  critical: 'Critical',
} as const;

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div
      className={`rounded-lg border px-4 py-4 ${severityStyles[insight.severity]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{insight.title}</p>
        <span className="rounded-full px-2 py-0.5 text-xs font-medium opacity-80">
          {severityLabels[insight.severity]}
        </span>
      </div>
      <p className="mt-1 text-sm opacity-90">{insight.description}</p>
    </div>
  );
}
