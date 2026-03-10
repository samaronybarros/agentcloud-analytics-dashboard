'use client';

import { useTroubleshooting } from '@/lib/hooks/use-analytics';
import { useDateRange } from '@/lib/hooks/use-date-range';
import { Section } from '@/components/dashboard/section';
import { TableSkeleton, ChartSkeleton } from '@/components/dashboard/skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { ErrorTimelineChart } from '@/components/charts/error-timeline-chart';
import { AgentErrorTable } from '@/components/tables/agent-error-table';
import type { ErrorTimelineEntry, AgentErrorBreakdown } from '@/lib/types';

function TroubleshootingSkeleton() {
  return (
    <>
      <Section title="Error Timeline"><ChartSkeleton /></Section>
      <Section title="Agent Error Breakdown"><TableSkeleton rows={5} /></Section>
    </>
  );
}

function TroubleshootingContent({
  errorTimeline,
  agentErrors,
  totalErrors,
  totalRetries,
}: {
  errorTimeline: ErrorTimelineEntry[];
  agentErrors: AgentErrorBreakdown[];
  totalErrors: number;
  totalRetries: number;
}) {
  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-5">
          <p className="text-sm text-gray-500">Total Errors</p>
          <p className="mt-1 text-2xl font-semibold" data-testid="total-errors">{totalErrors}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-5">
          <p className="text-sm text-gray-500">Total Retries</p>
          <p className="mt-1 text-2xl font-semibold" data-testid="total-retries">{totalRetries}</p>
        </div>
      </div>

      <Section title="Error Timeline">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <ErrorTimelineChart data={errorTimeline} />
        </div>
      </Section>

      <Section title="Agent Error Breakdown">
        <div className="rounded-lg border border-gray-200 bg-white">
          <AgentErrorTable data={agentErrors} />
        </div>
      </Section>
    </>
  );
}

export default function TroubleshootingPage() {
  const { range } = useDateRange();
  const { data, isLoading, isError, error } = useTroubleshooting(range);

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Troubleshooting</h2>
      <p className="mt-1 text-sm text-gray-500">
        Diagnose agent failures and surface error patterns.
      </p>

      {isLoading ? (
        <TroubleshootingSkeleton />
      ) : isError ? (
        <ErrorState detail={error instanceof Error ? error.message : undefined} />
      ) : !data ? (
        <ErrorState />
      ) : data.totalErrors === 0 && data.totalRetries === 0 ? (
        <EmptyState />
      ) : (
        <TroubleshootingContent
          errorTimeline={data.errorTimeline}
          agentErrors={data.agentErrors}
          totalErrors={data.totalErrors}
          totalRetries={data.totalRetries}
        />
      )}
    </div>
  );
}
