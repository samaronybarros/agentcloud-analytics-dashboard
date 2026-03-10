import {
  computeRunsTrend,
  computeLatencyTrend,
  computeCostTrend,
  computeRunsByDayOfWeek,
} from '@/app/api/analytics/trends/trends.service';
import { runs } from '@/app/api/_mock-data/runs';
import type { Run } from '@/lib/types';

const twoDateRuns: Run[] = [
  {
    id: 'r1', agentId: 'agent-01', userId: 'user-01', status: 'success',
    startedAt: '2026-03-01T10:00:00Z', durationMs: 500,
    tokensInput: 100, tokensOutput: 50, estimatedCost: 0.5, errorType: null,
  },
  {
    id: 'r2', agentId: 'agent-01', userId: 'user-01', status: 'error',
    startedAt: '2026-03-01T14:00:00Z', durationMs: 2000,
    tokensInput: 200, tokensOutput: 100, estimatedCost: 1.0, errorType: 'timeout',
  },
  {
    id: 'r3', agentId: 'agent-02', userId: 'user-02', status: 'success',
    startedAt: '2026-03-02T09:00:00Z', durationMs: 800,
    tokensInput: 150, tokensOutput: 75, estimatedCost: 0.3, errorType: null,
  },
  {
    id: 'r4', agentId: 'agent-02', userId: 'user-02', status: 'retry',
    startedAt: '2026-03-02T11:00:00Z', durationMs: 1200,
    tokensInput: 180, tokensOutput: 90, estimatedCost: 0.4, errorType: 'rate-limit',
  },
];

describe('computeRunsTrend', () => {
  it('groups runs by date', () => {
    const trend = computeRunsTrend(twoDateRuns);
    expect(trend).toHaveLength(2);
  });

  it('is sorted by date ascending', () => {
    const trend = computeRunsTrend(twoDateRuns);
    expect(trend[0].date).toBe('2026-03-01');
    expect(trend[1].date).toBe('2026-03-02');
  });

  it('counts total, success, error, retry correctly per day', () => {
    const trend = computeRunsTrend(twoDateRuns);
    // March 1: 1 success + 1 error
    expect(trend[0].total).toBe(2);
    expect(trend[0].success).toBe(1);
    expect(trend[0].error).toBe(1);
    expect(trend[0].retry).toBe(0);
    // March 2: 1 success + 1 retry
    expect(trend[1].total).toBe(2);
    expect(trend[1].success).toBe(1);
    expect(trend[1].error).toBe(0);
    expect(trend[1].retry).toBe(1);
  });

  it('returns empty array for empty runs', () => {
    expect(computeRunsTrend([])).toEqual([]);
  });

  it('handles single run', () => {
    const trend = computeRunsTrend([twoDateRuns[0]]);
    expect(trend).toHaveLength(1);
    expect(trend[0].total).toBe(1);
    expect(trend[0].success).toBe(1);
  });

  it('works with full mock dataset', () => {
    const trend = computeRunsTrend(runs);
    expect(trend.length).toBeGreaterThan(0);
    const totalFromTrend = trend.reduce((sum, d) => sum + d.total, 0);
    expect(totalFromTrend).toBe(runs.length);
  });
});

describe('computeLatencyTrend', () => {
  it('computes p50 and p95 per day', () => {
    const trend = computeLatencyTrend(twoDateRuns);
    expect(trend).toHaveLength(2);
    // March 1: durations [500, 2000] → p50=500, p95=2000
    expect(trend[0].p50).toBe(500);
    expect(trend[0].p95).toBe(2000);
    // March 2: durations [800, 1200] → p50=800, p95=1200
    expect(trend[1].p50).toBe(800);
    expect(trend[1].p95).toBe(1200);
  });

  it('is sorted by date ascending', () => {
    const trend = computeLatencyTrend(twoDateRuns);
    expect(trend[0].date).toBe('2026-03-01');
    expect(trend[1].date).toBe('2026-03-02');
  });

  it('returns empty array for empty runs', () => {
    expect(computeLatencyTrend([])).toEqual([]);
  });

  it('handles single run per day', () => {
    const trend = computeLatencyTrend([twoDateRuns[0]]);
    expect(trend[0].p50).toBe(500);
    expect(trend[0].p95).toBe(500);
  });
});

describe('computeCostTrend', () => {
  it('sums cost per day', () => {
    const trend = computeCostTrend(twoDateRuns);
    expect(trend).toHaveLength(2);
    expect(trend[0].cost).toBeCloseTo(1.5, 2); // 0.5 + 1.0
    expect(trend[1].cost).toBeCloseTo(0.7, 2); // 0.3 + 0.4
  });

  it('is sorted by date ascending', () => {
    const trend = computeCostTrend(twoDateRuns);
    expect(trend[0].date).toBe('2026-03-01');
    expect(trend[1].date).toBe('2026-03-02');
  });

  it('returns empty array for empty runs', () => {
    expect(computeCostTrend([])).toEqual([]);
  });

  it('total cost across trend matches sum of all runs', () => {
    const trend = computeCostTrend(runs);
    const trendTotal = trend.reduce((sum, d) => sum + d.cost, 0);
    const runsTotal = runs.reduce((sum, r) => sum + r.estimatedCost, 0);
    expect(trendTotal).toBeCloseTo(runsTotal, 2);
  });
});

describe('computeRunsByDayOfWeek', () => {
  it('returns 7 entries for Mon through Sun', () => {
    const result = computeRunsByDayOfWeek(twoDateRuns);
    expect(result).toHaveLength(7);
    expect(result.map((entry) => entry.day)).toEqual([
      'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
    ]);
  });

  it('counts runs per day of week correctly', () => {
    // 2026-03-01 is a Sunday, 2026-03-02 is a Monday
    const result = computeRunsByDayOfWeek(twoDateRuns);
    const sundayEntry = result.find((entry) => entry.day === 'Sun');
    const mondayEntry = result.find((entry) => entry.day === 'Mon');
    expect(sundayEntry!.runs).toBe(2); // r1, r2
    expect(mondayEntry!.runs).toBe(2); // r3, r4
  });

  it('returns all zeros for empty runs', () => {
    const result = computeRunsByDayOfWeek([]);
    expect(result).toHaveLength(7);
    for (const entry of result) {
      expect(entry.runs).toBe(0);
    }
  });

  it('total runs across all days matches input length', () => {
    const result = computeRunsByDayOfWeek(runs);
    const totalFromDays = result.reduce((sum, entry) => sum + entry.runs, 0);
    expect(totalFromDays).toBe(runs.length);
  });
});

describe('percentile edge case via computeLatencyTrend', () => {
  it('handles a day with a single run (percentile on single-element array)', () => {
    const singleRunDay: Run[] = [
      {
        id: 'single-1',
        agentId: 'agent-01',
        userId: 'user-01',
        status: 'success',
        startedAt: '2026-03-05T10:00:00Z',
        durationMs: 750,
        tokensInput: 100,
        tokensOutput: 50,
        estimatedCost: 0.5,
        errorType: null,
      },
    ];
    const trend = computeLatencyTrend(singleRunDay);
    expect(trend).toHaveLength(1);
    // With a single value, both p50 and p95 should return that value
    expect(trend[0].p50).toBe(750);
    expect(trend[0].p95).toBe(750);
  });

  it('returns 0 for percentile when no runs exist (empty array path)', () => {
    // computeLatencyTrend([]) returns [] so we can't hit the percentile([], rank) branch
    // directly. But we can verify the empty path still works.
    const trend = computeLatencyTrend([]);
    expect(trend).toEqual([]);
  });
});
