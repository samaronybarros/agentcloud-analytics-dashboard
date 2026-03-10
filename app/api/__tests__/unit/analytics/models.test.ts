import { computeModelPerformance } from '@/app/api/analytics/models/models.service';
import { agents } from '@/app/api/_mock-data/agents';
import { runs } from '@/app/api/_mock-data/runs';
import type { Run } from '@/lib/types';

describe('computeModelPerformance', () => {
  const modelPerformance = computeModelPerformance(runs, agents);

  it('returns one entry per model used', () => {
    const agentMap = new Map(agents.map((agent) => [agent.id, agent]));
    const modelsWithRuns = new Set(
      runs
        .map((run) => agentMap.get(run.agentId))
        .filter(Boolean)
        .map((agent) => agent!.model),
    );
    expect(modelPerformance).toHaveLength(modelsWithRuns.size);
  });

  it('computes correct total runs per model', () => {
    const agentMap = new Map(agents.map((agent) => [agent.id, agent]));
    for (const entry of modelPerformance) {
      const manualCount = runs.filter((run) => {
        const agent = agentMap.get(run.agentId);
        return agent && agent.model === entry.model;
      }).length;
      expect(entry.totalRuns).toBe(manualCount);
    }
  });

  it('success rates are between 0 and 1', () => {
    for (const entry of modelPerformance) {
      expect(entry.successRate).toBeGreaterThanOrEqual(0);
      expect(entry.successRate).toBeLessThanOrEqual(1);
    }
  });

  it('computes correct total cost per model', () => {
    const agentMap = new Map(agents.map((agent) => [agent.id, agent]));
    for (const entry of modelPerformance) {
      const manualCost = runs
        .filter((run) => {
          const agent = agentMap.get(run.agentId);
          return agent && agent.model === entry.model;
        })
        .reduce((sum, run) => sum + run.estimatedCost, 0);
      expect(entry.totalCost).toBeCloseTo(manualCost, 2);
    }
  });

  it('costPerThousandTokens is finite and non-negative', () => {
    for (const entry of modelPerformance) {
      expect(Number.isFinite(entry.costPerThousandTokens)).toBe(true);
      expect(entry.costPerThousandTokens).toBeGreaterThanOrEqual(0);
    }
  });

  it('is sorted by totalRuns descending', () => {
    for (let i = 1; i < modelPerformance.length; i++) {
      expect(modelPerformance[i - 1].totalRuns).toBeGreaterThanOrEqual(
        modelPerformance[i].totalRuns,
      );
    }
  });

  it('returns empty array for empty runs', () => {
    expect(computeModelPerformance([], agents)).toEqual([]);
  });

  it('total tokens equals sum of input + output per model', () => {
    const agentMap = new Map(agents.map((agent) => [agent.id, agent]));
    for (const entry of modelPerformance) {
      const manualTokens = runs
        .filter((run) => {
          const agent = agentMap.get(run.agentId);
          return agent && agent.model === entry.model;
        })
        .reduce((sum, run) => sum + run.tokensInput + run.tokensOutput, 0);
      expect(entry.totalTokens).toBe(manualTokens);
    }
  });
});
