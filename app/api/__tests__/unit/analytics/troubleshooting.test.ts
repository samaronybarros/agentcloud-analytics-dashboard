import {
  computeErrorTimeline,
  computeAgentErrors,
} from '@/app/api/analytics/troubleshooting/troubleshooting.service';
import { agents } from '@/app/api/_mock-data/agents';
import { runs } from '@/app/api/_mock-data/runs';
import type { Run } from '@/lib/types';

const allSuccessRuns: Run[] = [
  {
    id: 'success-1', agentId: 'agent-01', userId: 'user-01', status: 'success',
    startedAt: '2026-03-01T10:00:00Z', durationMs: 500,
    tokensInput: 100, tokensOutput: 50, estimatedCost: 0.5, errorType: null,
  },
  {
    id: 'success-2', agentId: 'agent-02', userId: 'user-02', status: 'success',
    startedAt: '2026-03-02T14:00:00Z', durationMs: 800,
    tokensInput: 200, tokensOutput: 100, estimatedCost: 1.0, errorType: null,
  },
];

describe('computeErrorTimeline', () => {
  it('groups errors and retries by date', () => {
    const timeline = computeErrorTimeline(runs);
    expect(timeline.length).toBeGreaterThan(0);
  });

  it('dates are sorted ascending', () => {
    const timeline = computeErrorTimeline(runs);
    const dates = timeline.map((entry) => entry.date);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });

  it('counts match actual error/retry runs per date', () => {
    const timeline = computeErrorTimeline(runs);
    expect(timeline.length).toBeGreaterThan(0);

    const firstDate = timeline[0].date;
    const runsOnFirstDate = runs.filter(
      (run) => run.startedAt.slice(0, 10) === firstDate,
    );
    const expectedErrors = runsOnFirstDate.filter((run) => run.status === 'error').length;
    const expectedRetries = runsOnFirstDate.filter((run) => run.status === 'retry').length;
    expect(timeline[0].errors).toBe(expectedErrors);
    expect(timeline[0].retries).toBe(expectedRetries);
  });

  it('returns empty array for empty runs', () => {
    expect(computeErrorTimeline([])).toEqual([]);
  });

  it('returns zero errors for all-success runs', () => {
    const timeline = computeErrorTimeline(allSuccessRuns);
    for (const entry of timeline) {
      expect(entry.errors).toBe(0);
    }
  });
});

describe('computeAgentErrors', () => {
  it('returns one entry per agent that has errors', () => {
    const agentErrors = computeAgentErrors(runs, agents);
    const errorRuns = runs.filter((run) => run.errorType !== null);
    const uniqueAgentIds = new Set(errorRuns.map((run) => run.agentId));
    expect(agentErrors).toHaveLength(uniqueAgentIds.size);
  });

  it('is sorted by totalErrors descending', () => {
    const agentErrors = computeAgentErrors(runs, agents);
    for (let i = 1; i < agentErrors.length; i++) {
      expect(agentErrors[i - 1].totalErrors).toBeGreaterThanOrEqual(
        agentErrors[i].totalErrors,
      );
    }
  });

  it('each entry has a remediation string', () => {
    const agentErrors = computeAgentErrors(runs, agents);
    for (const entry of agentErrors) {
      expect(typeof entry.remediation).toBe('string');
      expect(entry.remediation.length).toBeGreaterThan(0);
    }
  });

  it('topErrorType is the most frequent error for each agent', () => {
    const agentErrors = computeAgentErrors(runs, agents);
    expect(agentErrors.length).toBeGreaterThan(0);

    const firstEntry = agentErrors[0];
    const errorCounts = Object.entries(firstEntry.errorsByType);
    const maxCount = Math.max(...errorCounts.map(([_, count]) => count));
    const topType = errorCounts.find(([_, count]) => count === maxCount)![0];
    expect(firstEntry.topErrorType).toBe(topType);
  });

  it('returns empty array when no errors exist', () => {
    const agentErrors = computeAgentErrors(allSuccessRuns, agents);
    expect(agentErrors).toEqual([]);
  });

  it('returns empty array for empty runs', () => {
    const agentErrors = computeAgentErrors([], agents);
    expect(agentErrors).toEqual([]);
  });
});
