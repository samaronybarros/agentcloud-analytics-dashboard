/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/trends/route';
import type { DailyRunsTrend, DailyLatencyTrend, DailyCostTrend } from '@/lib/analytics/trends';

describe('GET /api/analytics/trends', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns runsTrend, latencyTrend, and costTrend arrays', async () => {
    const data = await (await GET()).json();
    expect(Array.isArray(data.runsTrend)).toBe(true);
    expect(Array.isArray(data.latencyTrend)).toBe(true);
    expect(Array.isArray(data.costTrend)).toBe(true);
  });

  it('runsTrend entries have required fields', async () => {
    const data = await (await GET()).json();
    const entry: DailyRunsTrend = data.runsTrend[0];
    expect(entry).toHaveProperty('date');
    expect(entry).toHaveProperty('total');
    expect(entry).toHaveProperty('success');
    expect(entry).toHaveProperty('error');
    expect(entry).toHaveProperty('retry');
  });

  it('latencyTrend entries have required fields', async () => {
    const data = await (await GET()).json();
    const entry: DailyLatencyTrend = data.latencyTrend[0];
    expect(entry).toHaveProperty('date');
    expect(entry).toHaveProperty('p50');
    expect(entry).toHaveProperty('p95');
  });

  it('costTrend entries have required fields', async () => {
    const data = await (await GET()).json();
    const entry: DailyCostTrend = data.costTrend[0];
    expect(entry).toHaveProperty('date');
    expect(entry).toHaveProperty('cost');
  });

  it('trend dates are sorted chronologically', async () => {
    const data = await (await GET()).json();
    const dates = data.runsTrend.map((e: DailyRunsTrend) => e.date);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });

  it('all three trends cover the same date range', async () => {
    const data = await (await GET()).json();
    const runsDates = data.runsTrend.map((e: DailyRunsTrend) => e.date);
    const latencyDates = data.latencyTrend.map((e: DailyLatencyTrend) => e.date);
    const costDates = data.costTrend.map((e: DailyCostTrend) => e.date);
    expect(runsDates[0]).toBe(latencyDates[0]);
    expect(runsDates[0]).toBe(costDates[0]);
    expect(runsDates[runsDates.length - 1]).toBe(latencyDates[latencyDates.length - 1]);
    expect(runsDates[runsDates.length - 1]).toBe(costDates[costDates.length - 1]);
  });

  it('returns deterministic values across calls', async () => {
    const first = await (await GET()).json();
    const second = await (await GET()).json();
    expect(first).toEqual(second);
  });
});
