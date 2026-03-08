import { NextResponse } from 'next/server';
import { computeAgentLeaderboard, computeFailureTaxonomy } from '@/lib/analytics/agents';
import { agents, runs } from '@/lib/mock-data';

export function GET() {
  return NextResponse.json({
    leaderboard: computeAgentLeaderboard(runs, agents),
    failureTaxonomy: computeFailureTaxonomy(runs),
  });
}
