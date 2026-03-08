import { NextResponse } from 'next/server';
import { computeOverviewKPIs } from '@/lib/analytics/overview';
import { agents, runs, users } from '@/lib/mock-data';

export function GET() {
  const kpis = computeOverviewKPIs(runs, agents, users);
  return NextResponse.json(kpis);
}
