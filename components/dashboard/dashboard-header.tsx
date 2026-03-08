'use client';

import { DateRangePicker } from '@/components/dashboard/date-range-picker';

export function DashboardHeader() {
  return (
    <div className="mb-6 flex items-center justify-end">
      <DateRangePicker />
    </div>
  );
}
