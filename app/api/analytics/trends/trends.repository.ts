import { runs } from '@/app/api/_mock-data';
import { filterRunsByDateRange } from '@/lib/utils/date-filter';
import type { Run } from '@/lib/types';

export const trendsRepository = {
  getFilteredRuns(from?: string, to?: string): Run[] {
    return filterRunsByDateRange(runs, from, to);
  },
};
