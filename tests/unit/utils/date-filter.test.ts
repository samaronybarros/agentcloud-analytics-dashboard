import type { Run } from '@/lib/types';
import { filterRunsByDateRange } from '@/lib/utils/date-filter';

const makeRun = (date: string): Run => ({
  id: `run-${date}`,
  agentId: 'agent-01',
  userId: 'user-01',
  status: 'success',
  startedAt: `${date}T12:00:00Z`,
  durationMs: 1000,
  tokensInput: 100,
  tokensOutput: 50,
  estimatedCost: 0.5,
  errorType: null,
});

const runs: Run[] = [
  makeRun('2026-03-01'),
  makeRun('2026-03-05'),
  makeRun('2026-03-10'),
  makeRun('2026-03-15'),
  makeRun('2026-03-20'),
];

describe('filterRunsByDateRange', () => {
  it('returns all runs when no range is provided', () => {
    expect(filterRunsByDateRange(runs)).toHaveLength(5);
  });

  it('returns all runs when both from and to are undefined', () => {
    expect(filterRunsByDateRange(runs, undefined, undefined)).toHaveLength(5);
  });

  it('filters runs with from only (inclusive)', () => {
    const result = filterRunsByDateRange(runs, '2026-03-10');
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.id)).toEqual([
      'run-2026-03-10',
      'run-2026-03-15',
      'run-2026-03-20',
    ]);
  });

  it('filters runs with to only (inclusive)', () => {
    const result = filterRunsByDateRange(runs, undefined, '2026-03-10');
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.id)).toEqual([
      'run-2026-03-01',
      'run-2026-03-05',
      'run-2026-03-10',
    ]);
  });

  it('filters runs with both from and to (inclusive)', () => {
    const result = filterRunsByDateRange(runs, '2026-03-05', '2026-03-15');
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.id)).toEqual([
      'run-2026-03-05',
      'run-2026-03-10',
      'run-2026-03-15',
    ]);
  });

  it('returns empty array when range matches no runs', () => {
    const result = filterRunsByDateRange(runs, '2026-04-01', '2026-04-30');
    expect(result).toHaveLength(0);
  });

  it('returns empty array for empty input', () => {
    expect(filterRunsByDateRange([], '2026-03-01', '2026-03-30')).toHaveLength(0);
  });

  it('handles runs with full ISO timestamps correctly', () => {
    const runsWithTime: Run[] = [
      { ...makeRun('2026-03-10'), startedAt: '2026-03-10T23:59:59Z' },
      { ...makeRun('2026-03-11'), startedAt: '2026-03-11T00:00:01Z' },
    ];
    const result = filterRunsByDateRange(runsWithTime, '2026-03-10', '2026-03-10');
    expect(result).toHaveLength(1);
    expect(result[0].startedAt).toBe('2026-03-10T23:59:59Z');
  });

  it('handles single-day range', () => {
    const result = filterRunsByDateRange(runs, '2026-03-05', '2026-03-05');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('run-2026-03-05');
  });
});
