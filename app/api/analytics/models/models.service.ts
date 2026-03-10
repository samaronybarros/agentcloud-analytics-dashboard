import { modelsRepository } from './models.repository';
import type { Agent, ModelId, ModelPerformanceEntry, ModelsResponse, Run } from '@/lib/types';

export function getModelAnalytics(from?: string, to?: string): ModelsResponse {
  const runs = modelsRepository.getFilteredRuns(from, to);
  const agents = modelsRepository.getAgents();
  return {
    models: computeModelPerformance(runs, agents),
  };
}

export function computeModelPerformance(
  runs: readonly Run[],
  agents: readonly Agent[],
): ModelPerformanceEntry[] {
  if (runs.length === 0) return [];

  const agentMap = new Map(agents.map((agent) => [agent.id, agent]));

  // Group runs by model
  const runsByModel = new Map<ModelId, Run[]>();
  for (const run of runs) {
    const agent = agentMap.get(run.agentId);
    if (!agent) continue;

    const existing = runsByModel.get(agent.model);
    if (existing) {
      existing.push(run);
    } else {
      runsByModel.set(agent.model, [run]);
    }
  }

  // Compute per-model stats
  const entries: ModelPerformanceEntry[] = [];
  for (const [model, modelRuns] of runsByModel) {
    const totalRuns = modelRuns.length;
    const successCount = modelRuns.filter((run) => run.status === 'success').length;
    const successRate = successCount / totalRuns;
    const avgLatencyMs =
      modelRuns.reduce((sum, run) => sum + run.durationMs, 0) / totalRuns;
    const totalCost = modelRuns.reduce((sum, run) => sum + run.estimatedCost, 0);
    const totalTokens = modelRuns.reduce(
      (sum, run) => sum + run.tokensInput + run.tokensOutput,
      0,
    );
    const costPerThousandTokens = totalTokens === 0 ? 0 : (totalCost / totalTokens) * 1000;

    entries.push({
      model,
      totalRuns,
      successRate,
      avgLatencyMs,
      totalCost,
      totalTokens,
      costPerThousandTokens,
    });
  }

  // Sort by totalRuns descending
  entries.sort((left, right) => right.totalRuns - left.totalRuns);

  return entries;
}
