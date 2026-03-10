import { agents, runs } from '@/app/api/_mock-data';
import { filterRunsByDateRange } from '@/lib/utils/date-filter';
import type { Agent, Run } from '@/lib/types';

export const alertsRepository = {
  getFilteredRuns(from?: string, to?: string): Run[] {
    return filterRunsByDateRange(runs, from, to);
  },

  getAgents(): readonly Agent[] {
    return agents;
  },
};
