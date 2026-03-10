import { generateAlerts } from '@/app/api/analytics/alerts/alerts.service';
import { agents } from '@/app/api/_mock-data/agents';
import { runs } from '@/app/api/_mock-data/runs';
import type { Run, Agent } from '@/lib/types';

describe('generateAlerts', () => {
  const { alerts } = generateAlerts(runs, agents);

  it('generates alerts from mock data', () => {
    expect(Array.isArray(alerts)).toBe(true);
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('each alert has required fields', () => {
    for (const alert of alerts) {
      expect(alert.id).toBeDefined();
      expect(alert.metric).toBeDefined();
      expect(alert.status).toBeDefined();
      expect(alert.title).toBeDefined();
      expect(alert.description).toBeDefined();
      expect(typeof alert.currentValue).toBe('number');
      expect(typeof alert.threshold).toBe('number');
    }
  });

  it('includes a success-rate alert', () => {
    const successRateAlerts = alerts.filter(
      (alert) => alert.metric === 'success-rate',
    );
    expect(successRateAlerts.length).toBeGreaterThanOrEqual(1);
  });

  it('includes a cost alert', () => {
    const costAlerts = alerts.filter((alert) => alert.metric === 'cost');
    expect(costAlerts.length).toBeGreaterThanOrEqual(1);
  });

  it('includes a latency alert', () => {
    const latencyAlerts = alerts.filter((alert) => alert.metric === 'latency');
    expect(latencyAlerts.length).toBeGreaterThanOrEqual(1);
  });

  it('alert status is either breached or ok', () => {
    for (const alert of alerts) {
      expect(['breached', 'ok']).toContain(alert.status);
    }
  });

  it('returns only ok alerts for empty runs', () => {
    const result = generateAlerts([], agents);
    expect(result.alerts.length).toBeGreaterThan(0);
    for (const alert of result.alerts) {
      expect(alert.status).toBe('ok');
    }
    expect(result.breachedCount).toBe(0);
  });

  it('all IDs are unique', () => {
    const ids = alerts.map((alert) => alert.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('breached alerts have currentValue exceeding threshold in the expected direction', () => {
    const breachedAlerts = alerts.filter((alert) => alert.status === 'breached');
    for (const alert of breachedAlerts) {
      if (alert.metric === 'success-rate' || alert.metric === 'error-spike') {
        expect(alert.currentValue).toBeLessThan(alert.threshold);
      } else if (alert.metric === 'cost' || alert.metric === 'latency') {
        expect(alert.currentValue).toBeGreaterThan(alert.threshold);
      }
    }
  });
});
