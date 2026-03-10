/**
 * @jest-environment node
 */
import { GET } from '@/app/api/analytics/troubleshooting/route';
import type { AgentErrorBreakdown, ErrorTimelineEntry } from '@/lib/types';

const req = (params = '') =>
  new Request(`http://localhost/api/analytics/troubleshooting${params}`);

describe('GET /api/analytics/troubleshooting', () => {
  it('returns a valid JSON response', async () => {
    const response = await GET(req());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('returns errorTimeline, agentErrors, totalErrors, totalRetries', async () => {
    const data = await (await GET(req())).json();
    expect(Array.isArray(data.errorTimeline)).toBe(true);
    expect(Array.isArray(data.agentErrors)).toBe(true);
    expect(typeof data.totalErrors).toBe('number');
    expect(typeof data.totalRetries).toBe('number');
  });

  it('errorTimeline entries have required fields', async () => {
    const data = await (await GET(req())).json();
    const entry: ErrorTimelineEntry = data.errorTimeline[0];
    expect(entry).toHaveProperty('date');
    expect(entry).toHaveProperty('errors');
    expect(entry).toHaveProperty('retries');
  });

  it('agentErrors entries have required fields', async () => {
    const data = await (await GET(req())).json();
    const entry: AgentErrorBreakdown = data.agentErrors[0];
    expect(entry).toHaveProperty('agentId');
    expect(entry).toHaveProperty('agentName');
    expect(entry).toHaveProperty('team');
    expect(entry).toHaveProperty('totalErrors');
    expect(entry).toHaveProperty('errorsByType');
    expect(entry).toHaveProperty('topErrorType');
    expect(entry).toHaveProperty('remediation');
  });

  it('totalErrors and totalRetries are non-negative integers', async () => {
    const data = await (await GET(req())).json();
    expect(Number.isInteger(data.totalErrors)).toBe(true);
    expect(data.totalErrors).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(data.totalRetries)).toBe(true);
    expect(data.totalRetries).toBeGreaterThanOrEqual(0);
  });

  it('all numeric fields are finite', async () => {
    const data = await (await GET(req())).json();
    for (const entry of data.errorTimeline) {
      expect(Number.isFinite(entry.errors)).toBe(true);
      expect(Number.isFinite(entry.retries)).toBe(true);
    }
    for (const entry of data.agentErrors) {
      expect(Number.isFinite(entry.totalErrors)).toBe(true);
      for (const errorCount of Object.values(entry.errorsByType)) {
        expect(Number.isFinite(errorCount)).toBe(true);
      }
    }
    expect(Number.isFinite(data.totalErrors)).toBe(true);
    expect(Number.isFinite(data.totalRetries)).toBe(true);
  });

  it('returns deterministic values across calls', async () => {
    const firstResponse = await (await GET(req())).json();
    const secondResponse = await (await GET(req())).json();
    expect(firstResponse).toEqual(secondResponse);
  });
});
