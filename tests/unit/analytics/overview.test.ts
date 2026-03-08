import { computeOverviewKPIs } from '@/lib/analytics/overview';
import { agents } from '@/lib/mock-data/agents';
import { runs } from '@/lib/mock-data/runs';
import { users } from '@/lib/mock-data/users';
import type { Run } from '@/lib/types';

describe('computeOverviewKPIs', () => {
  const kpis = computeOverviewKPIs(runs, agents, users);

  it('returns the correct total runs count', () => {
    expect(kpis.totalRuns).toBe(500);
  });

  it('returns the number of distinct active users', () => {
    const uniqueUsers = new Set(runs.map((r) => r.userId));
    expect(kpis.activeUsers).toBe(uniqueUsers.size);
  });

  it('returns the number of distinct active agents', () => {
    const uniqueAgents = new Set(runs.map((r) => r.agentId));
    expect(kpis.activeAgents).toBe(uniqueAgents.size);
  });

  it('computes success rate as ratio of successful runs', () => {
    const successCount = runs.filter((r) => r.status === 'success').length;
    expect(kpis.successRate).toBeCloseTo(successCount / runs.length, 4);
  });

  it('computes average latency across all runs', () => {
    const sum = runs.reduce((acc, r) => acc + r.durationMs, 0);
    expect(kpis.avgLatencyMs).toBeCloseTo(sum / runs.length, 0);
  });

  it('computes p95 latency correctly', () => {
    const sorted = [...runs].map((r) => r.durationMs).sort((a, b) => a - b);
    const idx = Math.ceil(sorted.length * 0.95) - 1;
    expect(kpis.p95LatencyMs).toBe(sorted[idx]);
  });

  it('computes total token volume (input + output)', () => {
    const total = runs.reduce((acc, r) => acc + r.tokensInput + r.tokensOutput, 0);
    expect(kpis.totalTokens).toBe(total);
  });

  it('computes total estimated cost', () => {
    const total = runs.reduce((acc, r) => acc + r.estimatedCost, 0);
    expect(kpis.estimatedCost).toBeCloseTo(total, 2);
  });

  it('handles empty runs array gracefully', () => {
    const emptyKPIs = computeOverviewKPIs([], agents, users);
    expect(emptyKPIs.totalRuns).toBe(0);
    expect(emptyKPIs.activeUsers).toBe(0);
    expect(emptyKPIs.activeAgents).toBe(0);
    expect(emptyKPIs.successRate).toBe(0);
    expect(emptyKPIs.avgLatencyMs).toBe(0);
    expect(emptyKPIs.p95LatencyMs).toBe(0);
    expect(emptyKPIs.totalTokens).toBe(0);
    expect(emptyKPIs.estimatedCost).toBe(0);
  });

  it('returns values that are numbers, not NaN', () => {
    for (const value of Object.values(kpis)) {
      expect(typeof value).toBe('number');
      expect(Number.isNaN(value)).toBe(false);
    }
  });
});
