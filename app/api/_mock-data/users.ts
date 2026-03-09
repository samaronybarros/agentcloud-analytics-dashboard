import type { User } from '@/lib/types';

// ---------------------------------------------------------------------------
// 8 users across 4 teams. Hardcoded for determinism.
// ---------------------------------------------------------------------------

export const users: readonly User[] = [
  { id: 'user-01', name: 'Alice Chen', team: 'Platform', role: 'engineer' },
  { id: 'user-02', name: 'Bob Martinez', team: 'Platform', role: 'manager' },
  { id: 'user-03', name: 'Carol Wu', team: 'Data', role: 'engineer' },
  { id: 'user-04', name: 'Dan Kim', team: 'Backend', role: 'engineer' },
  { id: 'user-05', name: 'Eve Johnson', team: 'Backend', role: 'engineer' },
  { id: 'user-06', name: 'Frank Lee', team: 'Frontend', role: 'engineer' },
  { id: 'user-07', name: 'Grace Patel', team: 'Frontend', role: 'manager' },
  { id: 'user-08', name: 'Hank Rivera', team: 'Data', role: 'admin' },
] as const;
