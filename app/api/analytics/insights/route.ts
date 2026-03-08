import { NextResponse } from 'next/server';
import { generateInsights } from '@/lib/analytics/insights';
import { agents, runs } from '@/lib/mock-data';

export function GET() {
  return NextResponse.json({
    insights: generateInsights(runs, agents),
  });
}
