'use client';

import { useDateRange } from '@/lib/hooks/use-date-range';

const PRESETS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '14d', label: 'Last 14 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
] as const;

export function DateRangePicker() {
  const { preset, setPreset } = useDateRange();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="date-range" className="text-sm text-gray-500">
        Date range
      </label>
      <select
        id="date-range"
        value={preset}
        onChange={(e) => setPreset(e.target.value as typeof preset)}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {PRESETS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
