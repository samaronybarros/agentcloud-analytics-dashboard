import { NextResponse } from 'next/server';
import { computeRunsTrend, computeLatencyTrend, computeCostTrend } from '@/lib/analytics/trends';
import { runs } from '@/lib/mock-data';

export function GET() {
  return NextResponse.json({
    runsTrend: computeRunsTrend(runs),
    latencyTrend: computeLatencyTrend(runs),
    costTrend: computeCostTrend(runs),
  });
}
