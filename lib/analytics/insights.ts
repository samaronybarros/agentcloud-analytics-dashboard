import type { Agent, Insight, Run } from '@/lib/types';

export function generateInsights(
  runs: readonly Run[],
  agents: readonly Agent[],
): Insight[] {
  if (runs.length === 0) return [];

  const agentMap = new Map(agents.map((a) => [a.id, a]));
  const insights: Insight[] = [];
  let idCounter = 0;

  // Group runs by agent
  const runsByAgent = new Map<string, Run[]>();
  for (const run of runs) {
    const existing = runsByAgent.get(run.agentId);
    if (existing) {
      existing.push(run);
    } else {
      runsByAgent.set(run.agentId, [run]);
    }
  }

  // Per-agent stats
  const agentStats = new Map<
    string,
    { totalCost: number; successRate: number; avgLatencyMs: number; totalRuns: number }
  >();
  for (const [agentId, agentRuns] of runsByAgent) {
    const successCount = agentRuns.filter((r) => r.status === 'success').length;
    const totalCost = agentRuns.reduce((sum, r) => sum + r.estimatedCost, 0);
    const avgLatencyMs =
      agentRuns.reduce((sum, r) => sum + r.durationMs, 0) / agentRuns.length;
    agentStats.set(agentId, {
      totalCost,
      successRate: successCount / agentRuns.length,
      avgLatencyMs,
      totalRuns: agentRuns.length,
    });
  }

  // --- Top cost driver ---
  let maxCostId = '';
  let maxCost = 0;
  for (const [agentId, stats] of agentStats) {
    if (stats.totalCost > maxCost) {
      maxCost = stats.totalCost;
      maxCostId = agentId;
    }
  }
  if (maxCostId) {
    const agent = agentMap.get(maxCostId);
    insights.push({
      id: `insight-${++idCounter}`,
      type: 'top-cost-driver',
      severity: 'info',
      title: `${agent?.name ?? maxCostId} is the top cost driver`,
      description: `This agent has accumulated $${maxCost.toFixed(2)} in estimated costs, the highest across all agents.`,
      agentId: maxCostId,
      value: maxCost,
    });
  }

  // --- High cost + low success (cost above median, success rate below 70%) ---
  const costs = [...agentStats.values()].map((s) => s.totalCost).sort((a, b) => a - b);
  const medianCost = costs[Math.floor(costs.length / 2)];

  for (const [agentId, stats] of agentStats) {
    if (stats.totalCost > medianCost && stats.successRate < 0.7) {
      const agent = agentMap.get(agentId);
      insights.push({
        id: `insight-${++idCounter}`,
        type: 'high-cost-low-success',
        severity: 'critical',
        title: `${agent?.name ?? agentId} has high cost with low success`,
        description: `Success rate is ${(stats.successRate * 100).toFixed(1)}% while cost is $${stats.totalCost.toFixed(2)}, above the median of $${medianCost.toFixed(2)}.`,
        agentId,
        value: stats.successRate,
      });
    }
  }

  // --- Degraded latency (agents with avg latency above overall p75) ---
  const allLatencies = [...agentStats.values()]
    .map((s) => s.avgLatencyMs)
    .sort((a, b) => a - b);
  const p75Latency = allLatencies[Math.ceil(allLatencies.length * 0.75) - 1];

  for (const [agentId, stats] of agentStats) {
    if (stats.avgLatencyMs > p75Latency) {
      const agent = agentMap.get(agentId);
      insights.push({
        id: `insight-${++idCounter}`,
        type: 'degraded-latency',
        severity: 'warning',
        title: `${agent?.name ?? agentId} has elevated latency`,
        description: `Average latency is ${Math.round(stats.avgLatencyMs)}ms, above the 75th percentile of ${Math.round(p75Latency)}ms.`,
        agentId,
        value: stats.avgLatencyMs,
      });
    }
  }

  // --- Rising failures (agents where error rate > 30%) ---
  for (const [agentId, stats] of agentStats) {
    if (stats.successRate < 0.7 && stats.totalRuns >= 10) {
      // Skip if already flagged as high-cost-low-success
      if (insights.some((i) => i.type === 'high-cost-low-success' && i.agentId === agentId)) {
        continue;
      }
      const agent = agentMap.get(agentId);
      insights.push({
        id: `insight-${++idCounter}`,
        type: 'rising-failures',
        severity: 'warning',
        title: `${agent?.name ?? agentId} has a high failure rate`,
        description: `Only ${(stats.successRate * 100).toFixed(1)}% of ${stats.totalRuns} runs succeeded.`,
        agentId,
        value: 1 - stats.successRate,
      });
    }
  }

  return insights;
}
