'use client';

interface KPICardProps {
  label: string;
  value: string;
  detail?: string;
}

export function KPICard({ label, value, detail }: KPICardProps) {
  return (
    <div role="region" aria-label={label} className="rounded-lg border border-gray-200 bg-white px-4 py-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {detail && <p className="mt-1 text-xs text-gray-400">{detail}</p>}
    </div>
  );
}
