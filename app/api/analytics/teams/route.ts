import { NextResponse } from 'next/server';
import { computeTeamUsage, computeCostByModel, computeTopUsers } from '@/lib/analytics/teams';
import { agents, runs, users } from '@/lib/mock-data';

export function GET() {
  return NextResponse.json({
    teamUsage: computeTeamUsage(runs, agents, users),
    costByModel: computeCostByModel(runs, agents),
    topUsers: computeTopUsers(runs, users),
  });
}
