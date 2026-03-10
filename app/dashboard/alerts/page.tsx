'use client';

import { useAlerts } from '@/lib/hooks/use-analytics';
import { useDateRange } from '@/lib/hooks/use-date-range';
import { useRole } from '@/lib/hooks/use-role';
import { canSeeSection } from '@/lib/role-visibility';
import { Section } from '@/components/dashboard/section';
import { Skeleton } from '@/components/dashboard/skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ErrorState } from '@/components/dashboard/error-state';
import { AlertCard } from '@/components/alerts/alert-card';
import type { Alert } from '@/lib/types';

function AlertsSkeleton() {
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

function AlertsContent({ alerts, breachedCount, showCostAlerts }: { alerts: Alert[]; breachedCount: number; showCostAlerts: boolean }) {
  const filtered = showCostAlerts
    ? alerts
    : alerts.filter((alert) => alert.metric !== 'cost');

  if (filtered.length === 0) {
    return <EmptyState message="No alerts available for your role." />;
  }

  const breached = filtered.filter((alert) => alert.status === 'breached');
  const ok = filtered.filter((alert) => alert.status === 'ok');
  const visibleBreachedCount = showCostAlerts ? breachedCount : breached.length;

  return (
    <>
      <p className="mt-4 text-sm text-gray-600">
        {visibleBreachedCount} of {filtered.length} alerts breached
      </p>

      {breached.length > 0 && (
        <Section title="Breached">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="space-y-3">
              {breached.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {ok.length > 0 && (
        <Section title="Passing">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="space-y-3">
              {ok.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}

export default function AlertsPage() {
  const { range } = useDateRange();
  const { role } = useRole();
  const { data, isLoading, isError, error } = useAlerts(range);

  const showCostAlerts = canSeeSection(role, 'cost-alerts');

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Alerts</h2>
      <p className="mt-1 text-sm text-gray-500">
        Threshold monitoring for success rate, cost, and latency.
      </p>

      {isLoading ? (
        <AlertsSkeleton />
      ) : isError ? (
        <ErrorState detail={error instanceof Error ? error.message : undefined} />
      ) : !data ? (
        <ErrorState />
      ) : (
        <AlertsContent alerts={data.alerts} breachedCount={data.breachedCount} showCostAlerts={showCostAlerts} />
      )}
    </div>
  );
}
