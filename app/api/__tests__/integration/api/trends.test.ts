/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/trends/route';
import type { DailyRunsTrend, DailyLatencyTrend, DailyCostTrend, DayOfWeekEntry } from '@/lib/types';

const req = (params = '') => {
  const separator = params.includes('?') ? '&' : '?';
  const url = params
    ? `http://localhost/api/analytics/trends${params}${separator}role=admin`
    : `http://localhost/api/analytics/trends?role=admin`;
  return new Request(url);
};

describe('GET /api/analytics/trends', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET(req());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns runsTrend, latencyTrend, costTrend, and runsByDayOfWeek arrays', async () => {
    const data = await (await GET(req())).json();
    expect(Array.isArray(data.runsTrend)).toBe(true);
    expect(Array.isArray(data.latencyTrend)).toBe(true);
    expect(Array.isArray(data.costTrend)).toBe(true);
    expect(Array.isArray(data.runsByDayOfWeek)).toBe(true);
    expect(data.runsByDayOfWeek).toHaveLength(7);
  });

  it('runsTrend entries have required fields', async () => {
    const data = await (await GET(req())).json();
    const entry: DailyRunsTrend = data.runsTrend[0];
    expect(entry).toHaveProperty('date');
    expect(entry).toHaveProperty('total');
    expect(entry).toHaveProperty('success');
    expect(entry).toHaveProperty('error');
    expect(entry).toHaveProperty('retry');
  });

  it('latencyTrend entries have required fields', async () => {
    const data = await (await GET(req())).json();
    const entry: DailyLatencyTrend = data.latencyTrend[0];
    expect(entry).toHaveProperty('date');
    expect(entry).toHaveProperty('p50');
    expect(entry).toHaveProperty('p95');
  });

  it('costTrend entries have required fields', async () => {
    const data = await (await GET(req())).json();
    const entry: DailyCostTrend = data.costTrend[0];
    expect(entry).toHaveProperty('date');
    expect(entry).toHaveProperty('cost');
  });

  it('trend dates are sorted chronologically', async () => {
    const data = await (await GET(req())).json();
    const dates = data.runsTrend.map((e: DailyRunsTrend) => e.date);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });

  it('all three trends cover the same date range', async () => {
    const data = await (await GET(req())).json();
    const runsDates = data.runsTrend.map((e: DailyRunsTrend) => e.date);
    const latencyDates = data.latencyTrend.map((e: DailyLatencyTrend) => e.date);
    const costDates = data.costTrend.map((e: DailyCostTrend) => e.date);
    expect(runsDates[0]).toBe(latencyDates[0]);
    expect(runsDates[0]).toBe(costDates[0]);
    expect(runsDates[runsDates.length - 1]).toBe(latencyDates[latencyDates.length - 1]);
    expect(runsDates[runsDates.length - 1]).toBe(costDates[costDates.length - 1]);
  });

  it('all numeric fields are finite (not NaN or Infinity)', async () => {
    const data = await (await GET(req())).json();
    for (const entry of data.runsTrend) {
      expect(Number.isFinite(entry.total)).toBe(true);
      expect(Number.isFinite(entry.success)).toBe(true);
      expect(Number.isFinite(entry.error)).toBe(true);
      expect(Number.isFinite(entry.retry)).toBe(true);
    }
    for (const entry of data.latencyTrend) {
      expect(Number.isFinite(entry.p50)).toBe(true);
      expect(Number.isFinite(entry.p95)).toBe(true);
    }
    for (const entry of data.costTrend) {
      expect(Number.isFinite(entry.cost)).toBe(true);
    }
    for (const entry of data.runsByDayOfWeek) {
      expect(Number.isFinite(entry.runs)).toBe(true);
      expect(typeof entry.day).toBe('string');
    }
  });

  it('returns deterministic values across calls', async () => {
    const first = await (await GET(req())).json();
    const second = await (await GET(req())).json();
    expect(first).toEqual(second);
  });
});
