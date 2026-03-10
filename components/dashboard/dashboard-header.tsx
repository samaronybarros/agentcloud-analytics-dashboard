'use client';

import { DateRangePicker } from '@/components/dashboard/date-range-picker';
import { RoleSelector } from '@/components/dashboard/role-selector';

export function DashboardHeader() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3 sm:gap-4">
      <RoleSelector />
      <DateRangePicker />
    </div>
  );
}
