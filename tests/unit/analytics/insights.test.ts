import { generateInsights } from '@/lib/analytics/insights';
import { agents } from '@/lib/mock-data/agents';
import { runs } from '@/lib/mock-data/runs';
import type { Insight } from '@/lib/types';

describe('generateInsights', () => {
  const insights = generateInsights(runs, agents);

  it('returns an array of insights', () => {
    expect(Array.isArray(insights)).toBe(true);
    expect(insights.length).toBeGreaterThan(0);
  });

  it('every insight has required fields', () => {
    for (const insight of insights) {
      expect(insight.id).toBeDefined();
      expect(insight.type).toBeDefined();
      expect(insight.severity).toBeDefined();
      expect(insight.title).toBeDefined();
      expect(insight.description).toBeDefined();
      expect(['info', 'warning', 'critical']).toContain(insight.severity);
      expect([
        'high-cost-low-success',
        'rising-failures',
        'top-cost-driver',
        'degraded-latency',
      ]).toContain(insight.type);
    }
  });

  it('identifies the top cost driver agent', () => {
    const costDriver = insights.find((i) => i.type === 'top-cost-driver');
    expect(costDriver).toBeDefined();
    expect(costDriver!.agentId).toBeDefined();

    // Verify it actually is the highest-cost agent
    const costByAgent = new Map<string, number>();
    for (const run of runs) {
      costByAgent.set(
        run.agentId,
        (costByAgent.get(run.agentId) ?? 0) + run.estimatedCost,
      );
    }
    const maxCostAgentId = [...costByAgent.entries()].sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    expect(costDriver!.agentId).toBe(maxCostAgentId);
  });

  it('identifies agents with high cost and low success', () => {
    const highCostLowSuccess = insights.filter(
      (i) => i.type === 'high-cost-low-success',
    );
    // May or may not exist depending on data, but if present must reference a real agent
    for (const insight of highCostLowSuccess) {
      expect(insight.agentId).toBeDefined();
      expect(agents.some((a) => a.id === insight.agentId)).toBe(true);
    }
  });

  it('identifies agents with degraded latency', () => {
    const degraded = insights.filter((i) => i.type === 'degraded-latency');
    for (const insight of degraded) {
      expect(insight.agentId).toBeDefined();
      expect(agents.some((a) => a.id === insight.agentId)).toBe(true);
    }
  });

  it('returns unique insight IDs', () => {
    const ids = insights.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('returns empty array for empty runs', () => {
    expect(generateInsights([], agents)).toEqual([]);
  });
});
