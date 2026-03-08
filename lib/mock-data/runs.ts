import type { ErrorType, Run, RunStatus } from '@/lib/types';
import { agents } from './agents';
import { users } from './users';
import { createSeededRng, pick, randFloat, randInt } from './seed';

// ---------------------------------------------------------------------------
// Generate 500 deterministic runs spanning the last 30 days.
// Uses seeded PRNG — output is identical on every call.
// ---------------------------------------------------------------------------

const SEED = 42;
const RUN_COUNT = 500;
const BASE_DATE = new Date('2026-03-01T00:00:00Z');
const DAYS_SPAN = 30;

const ERROR_TYPES: ErrorType[] = [
  'timeout',
  'rate-limit',
  'auth-failure',
  'invalid-input',
  'internal-error',
];

function generateRuns(): Run[] {
  const rng = createSeededRng(SEED);
  const result: Run[] = [];

  for (let i = 0; i < RUN_COUNT; i++) {
    const agent = pick(rng, agents);

    // Pick a user from the same team when possible (70%), else random
    const sameTeamUsers = users.filter((u) => u.team === agent.team);
    const user =
      rng() < 0.7 && sameTeamUsers.length > 0
        ? pick(rng, sameTeamUsers)
        : pick(rng, users);

    // Status distribution: ~75% success, ~15% error, ~10% retry
    const statusRoll = rng();
    let status: RunStatus;
    if (statusRoll < 0.75) {
      status = 'success';
    } else if (statusRoll < 0.9) {
      status = 'error';
    } else {
      status = 'retry';
    }

    // Timestamp: random point within the 30-day window
    const dayOffset = randInt(rng, 0, DAYS_SPAN - 1);
    const hourOffset = randInt(rng, 0, 23);
    const minuteOffset = randInt(rng, 0, 59);
    const startedAt = new Date(BASE_DATE);
    startedAt.setUTCDate(startedAt.getUTCDate() - dayOffset);
    startedAt.setUTCHours(hourOffset, minuteOffset, 0, 0);

    // Duration: 200ms–12000ms, errors tend to be longer (timeouts)
    const baseDuration = randInt(rng, 200, 8000);
    const durationMs =
      status === 'error' ? baseDuration + randInt(rng, 1000, 4000) : baseDuration;

    // Tokens: proportional to duration, with some noise
    const tokensInput = randInt(rng, 100, 4000);
    const tokensOutput = randInt(rng, 50, 3000);

    // Cost: based on model pricing approximation
    const costMultiplier =
      agent.model === 'claude-sonnet-4-20250514'
        ? 0.003
        : agent.model === 'gpt-4o'
          ? 0.0025
          : agent.model === 'claude-haiku-4-5-20251001'
            ? 0.0008
            : 0.0004; // gpt-4o-mini
    const estimatedCost = randFloat(
      rng,
      (tokensInput + tokensOutput) * costMultiplier * 0.8,
      (tokensInput + tokensOutput) * costMultiplier * 1.2,
      4,
    );

    // Error type: only set on error/retry runs
    const errorType: ErrorType =
      status === 'success' ? null : pick(rng, ERROR_TYPES);

    result.push({
      id: `run-${String(i + 1).padStart(4, '0')}`,
      agentId: agent.id,
      userId: user.id,
      status,
      startedAt: startedAt.toISOString(),
      durationMs,
      tokensInput,
      tokensOutput,
      estimatedCost,
      errorType,
    });
  }

  return result;
}

export const runs: readonly Run[] = generateRuns();
