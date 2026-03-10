import { alertsRepository } from './alerts.repository';
import type { Agent, Alert, AlertsResponse, Run } from '@/lib/types';

export function getAlerts(from?: string, to?: string): AlertsResponse {
  const runs = alertsRepository.getFilteredRuns(from, to);
  const agents = alertsRepository.getAgents();
  return generateAlerts(runs, agents);
}

export function generateAlerts(
  runs: readonly Run[],
  agents: readonly Agent[],
): AlertsResponse {
  const agentMap = new Map(agents.map((agent) => [agent.id, agent]));
  const alerts: Alert[] = [];
  let idCounter = 0;

  // --- Overall success rate alert ---
  const successCount = runs.filter((run) => run.status === 'success').length;
  const globalSuccessRate = runs.length > 0 ? successCount / runs.length : 1;
  const successRateThreshold = 0.8;
  const successRateBreached = globalSuccessRate < successRateThreshold;

  alerts.push({
    id: `alert-${++idCounter}`,
    metric: 'success-rate',
    status: successRateBreached ? 'breached' : 'ok',
    title: successRateBreached
      ? 'Overall success rate is below 80%'
      : 'Overall success rate is healthy',
    description: successRateBreached
      ? `Current success rate is ${(globalSuccessRate * 100).toFixed(1)}%, below the 80% threshold.`
      : `Current success rate is ${(globalSuccessRate * 100).toFixed(1)}%, above the 80% threshold.`,
    currentValue: globalSuccessRate,
    threshold: successRateThreshold,
  });

  // --- Per-agent error spike alerts ---
  const runsByAgent = new Map<string, Run[]>();
  for (const run of runs) {
    const existing = runsByAgent.get(run.agentId);
    if (existing) {
      existing.push(run);
    } else {
      runsByAgent.set(run.agentId, [run]);
    }
  }

  for (const [agentId, agentRuns] of runsByAgent) {
    if (agentRuns.length < 10) continue;

    const agentSuccessCount = agentRuns.filter((run) => run.status === 'success').length;
    const agentSuccessRate = agentSuccessCount / agentRuns.length;
    const errorSpikeThreshold = 0.6;
    const errorSpikeBreached = agentSuccessRate < errorSpikeThreshold;
    const agent = agentMap.get(agentId);

    alerts.push({
      id: `alert-${++idCounter}`,
      metric: 'error-spike',
      status: errorSpikeBreached ? 'breached' : 'ok',
      title: errorSpikeBreached
        ? `${agent?.name ?? agentId} has an error spike`
        : `${agent?.name ?? agentId} error rate is within limits`,
      description: errorSpikeBreached
        ? `Success rate is ${(agentSuccessRate * 100).toFixed(1)}% across ${agentRuns.length} runs, below the 60% threshold.`
        : `Success rate is ${(agentSuccessRate * 100).toFixed(1)}% across ${agentRuns.length} runs, above the 60% threshold.`,
      currentValue: agentSuccessRate,
      threshold: errorSpikeThreshold,
      agentId,
      team: agent?.team,
    });
  }

  // --- Cost budget alert ---
  const totalCost = runs.reduce((sum, run) => sum + run.estimatedCost, 0);
  const costThreshold = 500;
  const costBreached = totalCost > costThreshold;

  alerts.push({
    id: `alert-${++idCounter}`,
    metric: 'cost',
    status: costBreached ? 'breached' : 'ok',
    title: costBreached
      ? 'Total cost exceeds $500 budget'
      : 'Total cost is within $500 budget',
    description: costBreached
      ? `Current total cost is $${totalCost.toFixed(2)}, exceeding the $500 threshold.`
      : `Current total cost is $${totalCost.toFixed(2)}, within the $500 threshold.`,
    currentValue: totalCost,
    threshold: costThreshold,
  });

  // --- Latency alert ---
  const averageLatency =
    runs.length > 0
      ? runs.reduce((sum, run) => sum + run.durationMs, 0) / runs.length
      : 0;
  const latencyThreshold = 5000;
  const latencyBreached = averageLatency > latencyThreshold;

  alerts.push({
    id: `alert-${++idCounter}`,
    metric: 'latency',
    status: latencyBreached ? 'breached' : 'ok',
    title: latencyBreached
      ? 'Average latency exceeds 5000ms'
      : 'Average latency is within limits',
    description: latencyBreached
      ? `Current average latency is ${Math.round(averageLatency)}ms, above the 5000ms threshold.`
      : `Current average latency is ${Math.round(averageLatency)}ms, within the 5000ms threshold.`,
    currentValue: averageLatency,
    threshold: latencyThreshold,
  });

  const breachedCount = alerts.filter((alert) => alert.status === 'breached').length;

  return { alerts, breachedCount };
}
