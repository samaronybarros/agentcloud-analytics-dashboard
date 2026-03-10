/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/alerts/route';
import type { Alert } from '@/lib/types';

const req = (params = '') =>
  new Request(`http://localhost/api/analytics/alerts${params}`);

describe('GET /api/analytics/alerts', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET(req());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns alerts array and breachedCount', async () => {
    const data = await (await GET(req())).json();
    expect(Array.isArray(data.alerts)).toBe(true);
    expect(typeof data.breachedCount).toBe('number');
  });

  it('breachedCount matches number of breached alerts', async () => {
    const data = await (await GET(req())).json();
    const actualBreachedCount = data.alerts.filter(
      (alert: Alert) => alert.status === 'breached',
    ).length;
    expect(data.breachedCount).toBe(actualBreachedCount);
  });

  it('alert entries have required fields', async () => {
    const data = await (await GET(req())).json();
    for (const alert of data.alerts as Alert[]) {
      expect(alert).toHaveProperty('metric');
      expect(alert).toHaveProperty('status');
      expect(alert).toHaveProperty('title');
      expect(alert).toHaveProperty('description');
      expect(typeof alert.currentValue).toBe('number');
      expect(typeof alert.threshold).toBe('number');
    }
  });

  it('all numeric fields are finite', async () => {
    const data = await (await GET(req())).json();
    for (const alert of data.alerts as Alert[]) {
      expect(Number.isFinite(alert.currentValue)).toBe(true);
      expect(Number.isFinite(alert.threshold)).toBe(true);
    }
  });

  it('returns deterministic values across calls', async () => {
    const firstResponse = await (await GET(req())).json();
    const secondResponse = await (await GET(req())).json();
    expect(firstResponse).toEqual(secondResponse);
  });
});
