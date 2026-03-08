import { generateInsights } from '@/lib/analytics/insights';
import { agents } from '@/lib/mock-data/agents';
import { runs } from '@/lib/mock-data/runs';
import type { Run } from '@/lib/types';

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

  it('returns only top-cost-driver when all agents are healthy', () => {
    // All success, similar cost — should still have top-cost-driver but no warnings
    const healthyRuns: Run[] = agents.flatMap((agent, i) =>
      Array.from({ length: 10 }, (_, j) => ({
        id: `healthy-${i}-${j}`,
        agentId: agent.id,
        userId: 'user-01',
        status: 'success' as const,
        startedAt: '2026-03-01T10:00:00Z',
        durationMs: 500,
        tokensInput: 100,
        tokensOutput: 100,
        estimatedCost: 1.0,
        errorType: null,
      })),
    );
    const result = generateInsights(healthyRuns, agents);
    // No high-cost-low-success or rising-failures
    expect(result.filter((i) => i.type === 'high-cost-low-success')).toHaveLength(0);
    expect(result.filter((i) => i.type === 'rising-failures')).toHaveLength(0);
    // Should still identify top cost driver
    expect(result.filter((i) => i.type === 'top-cost-driver')).toHaveLength(1);
  });

  it('handles agents with exactly 10 runs at rising-failures boundary', () => {
    const boundaryRuns: Run[] = [
      // agent-01: exactly 10 runs, all failures → should trigger rising-failures
      ...Array.from({ length: 10 }, (_, j) => ({
        id: `boundary-01-${j}`,
        agentId: 'agent-01',
        userId: 'user-01',
        status: 'error' as const,
        startedAt: '2026-03-01T10:00:00Z',
        durationMs: 1000,
        tokensInput: 100,
        tokensOutput: 100,
        estimatedCost: 0.5,
        errorType: 'timeout' as const,
      })),
      // agent-02: cheap + all success (keeps median cost low)
      ...Array.from({ length: 10 }, (_, j) => ({
        id: `boundary-02-${j}`,
        agentId: 'agent-02',
        userId: 'user-02',
        status: 'success' as const,
        startedAt: '2026-03-01T10:00:00Z',
        durationMs: 200,
        tokensInput: 50,
        tokensOutput: 50,
        estimatedCost: 0.5,
        errorType: null,
      })),
      // agent-03: cheap + all success
      ...Array.from({ length: 10 }, (_, j) => ({
        id: `boundary-03-${j}`,
        agentId: 'agent-03',
        userId: 'user-03',
        status: 'success' as const,
        startedAt: '2026-03-01T10:00:00Z',
        durationMs: 200,
        tokensInput: 50,
        tokensOutput: 50,
        estimatedCost: 0.1,
        errorType: null,
      })),
    ];
    const result = generateInsights(boundaryRuns, agents);
    const risingFailures = result.filter(
      (i) => i.agentId === 'agent-01' && (i.type === 'rising-failures' || i.type === 'high-cost-low-success'),
    );
    expect(risingFailures.length).toBeGreaterThanOrEqual(1);
  });

  it('handles agents with 9 runs (below rising-failures threshold)', () => {
    const belowThreshold: Run[] = [
      // agent-01: 9 runs, all failures → should NOT trigger rising-failures
      ...Array.from({ length: 9 }, (_, j) => ({
        id: `below-01-${j}`,
        agentId: 'agent-01',
        userId: 'user-01',
        status: 'error' as const,
        startedAt: '2026-03-01T10:00:00Z',
        durationMs: 1000,
        tokensInput: 100,
        tokensOutput: 100,
        estimatedCost: 0.1,
        errorType: 'timeout' as const,
      })),
      // agent-02: enough runs to create stats
      ...Array.from({ length: 20 }, (_, j) => ({
        id: `below-02-${j}`,
        agentId: 'agent-02',
        userId: 'user-02',
        status: 'success' as const,
        startedAt: '2026-03-01T10:00:00Z',
        durationMs: 200,
        tokensInput: 50,
        tokensOutput: 50,
        estimatedCost: 1.0,
        errorType: null,
      })),
    ];
    const result = generateInsights(belowThreshold, agents);
    const risingFailures = result.filter(
      (i) => i.agentId === 'agent-01' && i.type === 'rising-failures',
    );
    expect(risingFailures).toHaveLength(0);
  });

  it('does not produce NaN values in insight descriptions with single agent', () => {
    const singleAgentRuns: Run[] = Array.from({ length: 5 }, (_, j) => ({
      id: `single-${j}`,
      agentId: 'agent-01',
      userId: 'user-01',
      status: 'success' as const,
      startedAt: '2026-03-01T10:00:00Z',
      durationMs: 1000,
      tokensInput: 100,
      tokensOutput: 100,
      estimatedCost: 5.0,
      errorType: null,
    }));
    const result = generateInsights(singleAgentRuns, agents);
    for (const insight of result) {
      expect(insight.description).not.toContain('NaN');
      expect(insight.title).not.toContain('NaN');
    }
  });

  it('flags an agent that is both expensive and unreliable', () => {
    const mixedRuns: Run[] = [
      // agent-01: expensive + all failures
      ...Array.from({ length: 20 }, (_, j) => ({
        id: `mixed-01-${j}`,
        agentId: 'agent-01',
        userId: 'user-01',
        status: 'error' as const,
        startedAt: '2026-03-01T10:00:00Z',
        durationMs: 5000,
        tokensInput: 1000,
        tokensOutput: 1000,
        estimatedCost: 10.0,
        errorType: 'timeout' as const,
      })),
      // agent-02: cheap + all success
      ...Array.from({ length: 20 }, (_, j) => ({
        id: `mixed-02-${j}`,
        agentId: 'agent-02',
        userId: 'user-02',
        status: 'success' as const,
        startedAt: '2026-03-01T10:00:00Z',
        durationMs: 200,
        tokensInput: 50,
        tokensOutput: 50,
        estimatedCost: 0.1,
        errorType: null,
      })),
      // agent-03: cheap + all success (ensures median is below agent-01)
      ...Array.from({ length: 20 }, (_, j) => ({
        id: `mixed-03-${j}`,
        agentId: 'agent-03',
        userId: 'user-03',
        status: 'success' as const,
        startedAt: '2026-03-01T10:00:00Z',
        durationMs: 250,
        tokensInput: 60,
        tokensOutput: 60,
        estimatedCost: 0.2,
        errorType: null,
      })),
    ];
    const result = generateInsights(mixedRuns, agents);
    const flagged = result.filter(
      (i) => i.type === 'high-cost-low-success' && i.agentId === 'agent-01',
    );
    expect(flagged.length).toBeGreaterThanOrEqual(1);
  });
});
