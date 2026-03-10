import { troubleshootingRepository } from './troubleshooting.repository';
import type {
  Agent,
  AgentErrorBreakdown,
  ErrorTimelineEntry,
  Run,
  TroubleshootingResponse,
} from '@/lib/types';

const REMEDIATION_BY_ERROR_TYPE: Record<string, string> = {
  timeout: 'Consider increasing timeout limits or optimizing agent workload size.',
  'rate-limit': 'Implement request throttling or increase rate limit quotas.',
  'auth-failure': 'Verify API credentials and token expiration policies.',
  'invalid-input': 'Add input validation and sanitization before agent invocation.',
  'internal-error': 'Review agent logs for stack traces and recent deployment changes.',
};

export function computeErrorTimeline(runs: readonly Run[]): ErrorTimelineEntry[] {
  const dailyCounts = new Map<string, { errors: number; retries: number }>();

  for (const run of runs) {
    const date = run.startedAt.slice(0, 10);
    const existing = dailyCounts.get(date);
    if (existing) {
      if (run.status === 'error') existing.errors += 1;
      if (run.status === 'retry') existing.retries += 1;
    } else {
      dailyCounts.set(date, {
        errors: run.status === 'error' ? 1 : 0,
        retries: run.status === 'retry' ? 1 : 0,
      });
    }
  }

  const timeline: ErrorTimelineEntry[] = [...dailyCounts.entries()]
    .map(([date, counts]) => ({
      date,
      errors: counts.errors,
      retries: counts.retries,
    }))
    .sort((left, right) => left.date.localeCompare(right.date));

  return timeline;
}

export function computeAgentErrors(
  runs: readonly Run[],
  agents: readonly Agent[],
): AgentErrorBreakdown[] {
  const agentMap = new Map(agents.map((agent) => [agent.id, agent]));
  const errorRunsByAgent = new Map<string, Run[]>();

  for (const run of runs) {
    if (run.errorType === null) continue;
    const existing = errorRunsByAgent.get(run.agentId);
    if (existing) {
      existing.push(run);
    } else {
      errorRunsByAgent.set(run.agentId, [run]);
    }
  }

  const breakdowns: AgentErrorBreakdown[] = [];

  for (const [agentId, errorRuns] of errorRunsByAgent) {
    const agent = agentMap.get(agentId);
    const errorsByType: Record<string, number> = {};

    for (const run of errorRuns) {
      const errorType = run.errorType as string;
      errorsByType[errorType] = (errorsByType[errorType] ?? 0) + 1;
    }

    let topErrorType = '';
    let topErrorCount = 0;
    for (const [errorType, count] of Object.entries(errorsByType)) {
      if (count > topErrorCount) {
        topErrorCount = count;
        topErrorType = errorType;
      }
    }

    const remediation =
      REMEDIATION_BY_ERROR_TYPE[topErrorType] ?? 'Investigate agent logs for further details.';

    breakdowns.push({
      agentId,
      agentName: agent?.name ?? agentId,
      team: agent?.team ?? 'unknown',
      totalErrors: errorRuns.length,
      errorsByType,
      topErrorType,
      remediation,
    });
  }

  breakdowns.sort((left, right) => right.totalErrors - left.totalErrors);

  return breakdowns;
}

export function getTroubleshooting(from?: string, to?: string): TroubleshootingResponse {
  const runs = troubleshootingRepository.getFilteredRuns(from, to);
  const agents = troubleshootingRepository.getAgents();
  const errorTimeline = computeErrorTimeline(runs);
  const agentErrors = computeAgentErrors(runs, agents);
  const totalErrors = runs.filter((run) => run.status === 'error').length;
  const totalRetries = runs.filter((run) => run.status === 'retry').length;
  return { errorTimeline, agentErrors, totalErrors, totalRetries };
}
