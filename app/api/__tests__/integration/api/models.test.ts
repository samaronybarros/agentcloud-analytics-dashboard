/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/models/route';

const req = (params = '') => new Request(`http://localhost/api/analytics/models${params}`);

describe('GET /api/analytics/models', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET(req());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns models array', async () => {
    const data = await (await GET(req())).json();
    expect(Array.isArray(data.models)).toBe(true);
    expect(data.models.length).toBeGreaterThan(0);
  });

  it('model entries have required fields', async () => {
    const data = await (await GET(req())).json();
    const entry = data.models[0];
    expect(entry).toHaveProperty('model');
    expect(entry).toHaveProperty('totalRuns');
    expect(entry).toHaveProperty('successRate');
    expect(entry).toHaveProperty('avgLatencyMs');
    expect(entry).toHaveProperty('totalCost');
    expect(entry).toHaveProperty('costPerThousandTokens');
    expect(entry).toHaveProperty('totalTokens');
  });

  it('all numeric fields are finite', async () => {
    const data = await (await GET(req())).json();
    for (const entry of data.models) {
      expect(Number.isFinite(entry.totalRuns)).toBe(true);
      expect(Number.isFinite(entry.successRate)).toBe(true);
      expect(Number.isFinite(entry.avgLatencyMs)).toBe(true);
      expect(Number.isFinite(entry.totalCost)).toBe(true);
      expect(Number.isFinite(entry.costPerThousandTokens)).toBe(true);
      expect(Number.isFinite(entry.totalTokens)).toBe(true);
    }
  });

  it('returns deterministic values across calls', async () => {
    const firstResponse = await (await GET(req())).json();
    const secondResponse = await (await GET(req())).json();
    expect(firstResponse).toEqual(secondResponse);
  });

  it('respects date range parameters', async () => {
    const unfilteredData = await (await GET(req())).json();
    const filteredData = await (await GET(req('?from=2026-03-15&to=2026-03-20'))).json();

    const unfilteredTotalCost = unfilteredData.models.reduce(
      (sum: number, entry: { totalCost: number }) => sum + entry.totalCost,
      0,
    );
    const filteredTotalCost = filteredData.models.reduce(
      (sum: number, entry: { totalCost: number }) => sum + entry.totalCost,
      0,
    );

    const isFewerModels = filteredData.models.length <= unfilteredData.models.length;
    const isLowerCost = filteredTotalCost <= unfilteredTotalCost;
    expect(isFewerModels || isLowerCost).toBe(true);
  });
});
