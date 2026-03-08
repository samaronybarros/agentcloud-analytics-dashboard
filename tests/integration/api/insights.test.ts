/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/insights/route';
import type { Insight } from '@/lib/types';

describe('GET /api/analytics/insights', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns an insights array', async () => {
    const data = await (await GET()).json();
    expect(Array.isArray(data.insights)).toBe(true);
    expect(data.insights.length).toBeGreaterThan(0);
  });

  it('each insight has required fields', async () => {
    const data = await (await GET()).json();
    data.insights.forEach((insight: Insight) => {
      expect(insight).toHaveProperty('id');
      expect(insight).toHaveProperty('type');
      expect(insight).toHaveProperty('severity');
      expect(insight).toHaveProperty('title');
      expect(insight).toHaveProperty('description');
    });
  });

  it('severity values are valid', async () => {
    const data = await (await GET()).json();
    const validSeverities = ['info', 'warning', 'critical'];
    data.insights.forEach((insight: Insight) => {
      expect(validSeverities).toContain(insight.severity);
    });
  });

  it('insight IDs are unique', async () => {
    const data = await (await GET()).json();
    const ids = data.insights.map((i: Insight) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('returns deterministic values across calls', async () => {
    const first = await (await GET()).json();
    const second = await (await GET()).json();
    expect(first).toEqual(second);
  });
});
