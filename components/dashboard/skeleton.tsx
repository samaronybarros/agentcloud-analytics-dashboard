interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      data-testid="skeleton"
      className={`animate-pulse rounded bg-gray-200 ${className}`}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div
      data-testid="kpi-skeleton"
      className="rounded-lg border border-gray-200 bg-white px-4 py-5"
    >
      <div className="animate-pulse rounded bg-gray-200 h-4 w-20" />
      <div className="animate-pulse rounded bg-gray-200 mt-2 h-7 w-28" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div
      data-testid="chart-skeleton"
      className="animate-pulse rounded-lg bg-gray-200 h-64 w-full"
    />
  );
}

interface TableSkeletonProps {
  rows?: number;
}

export function TableSkeleton({ rows = 3 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          data-testid="table-row-skeleton"
          className="animate-pulse rounded bg-gray-200 h-10 w-full"
        />
      ))}
    </div>
  );
}
