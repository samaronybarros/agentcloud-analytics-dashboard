'use client';

import type { Alert } from '@/lib/types';

const statusStyles = {
  breached: 'border-red-200 bg-red-50 text-red-800',
  ok: 'border-green-200 bg-green-50 text-green-800',
} as const;

const statusLabels = {
  breached: 'Breached',
  ok: 'OK',
} as const;

function formatMetricValue(metric: Alert['metric'], value: number): string {
  switch (metric) {
    case 'success-rate':
    case 'error-spike':
      return `${(value * 100).toFixed(1)}%`;
    case 'cost':
      return `$${value.toFixed(2)}`;
    case 'latency':
      return `${value}ms`;
  }
}

export function AlertCard({ alert }: { alert: Alert }) {
  return (
    <div
      className={`rounded-lg border px-4 py-4 ${statusStyles[alert.status]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{alert.title}</p>
        <span className="rounded-full px-2 py-0.5 text-xs font-medium opacity-80">
          {statusLabels[alert.status]}
        </span>
      </div>
      <p className="mt-1 text-sm opacity-90">{alert.description}</p>
      <p className="mt-2 text-xs opacity-75">
        Current: {formatMetricValue(alert.metric, alert.currentValue)} | Threshold: {formatMetricValue(alert.metric, alert.threshold)}
      </p>
    </div>
  );
}
