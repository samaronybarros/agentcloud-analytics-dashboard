import { agents, runs, users } from '@/app/api/_mock-data';
import { filterRunsByDateRange } from '@/lib/utils/date-filter';
import type { Agent, Run, User } from '@/lib/types';

export const overviewRepository = {
  getFilteredRuns(from?: string, to?: string): Run[] {
    return filterRunsByDateRange(runs, from, to);
  },

  getAgents(): readonly Agent[] {
    return agents;
  },

  getUsers(): readonly User[] {
    return users;
  },
};
