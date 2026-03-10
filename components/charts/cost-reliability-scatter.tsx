'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import type { AgentLeaderboardEntry } from '@/lib/types';

const COLOR_PALETTE = [
  '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981',
  '#ef4444', '#ec4899', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16',
];

function buildTeamColorMap(teams: string[]): Map<string, string> {
  const unique = [...new Set(teams)];
  const colorMap = new Map<string, string>();
  for (let i = 0; i < unique.length; i++) {
    colorMap.set(unique[i], COLOR_PALETTE[i % COLOR_PALETTE.length]);
  }
  return colorMap;
}

interface TooltipPayloadEntry {
  payload: AgentLeaderboardEntry;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0].payload;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="font-medium">{entry.agentName}</p>
      <p className="text-gray-500">{entry.team}</p>
      <p>Cost: ${entry.totalCost.toFixed(2)}</p>
      <p>Success: {(entry.successRate * 100).toFixed(1)}%</p>
      <p>Runs: {entry.totalRuns.toLocaleString()}</p>
    </div>
  );
}

export function CostReliabilityScatter({
  data,
}: {
  data: AgentLeaderboardEntry[];
}) {
  const teamColors = buildTeamColorMap(data.map((entry) => entry.team));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="totalCost"
          name="Cost"
          tickFormatter={(value: number) => `$${value.toFixed(0)}`}
          label={{ value: 'Total Cost ($)', position: 'bottom', offset: 0 }}
        />
        <YAxis
          type="number"
          dataKey="successRate"
          name="Success Rate"
          domain={[0, 1]}
          tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
          label={{
            value: 'Success Rate',
            angle: -90,
            position: 'insideLeft',
            offset: 10,
          }}
        />
        <ZAxis type="number" dataKey="totalRuns" range={[60, 400]} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={0.7}
          stroke="#ef4444"
          strokeDasharray="4 4"
          label={{ value: '70%', position: 'right', fill: '#ef4444' }}
        />
        <Scatter data={data} name="Agents">
          {data.map((entry) => (
            <Cell key={entry.agentId} fill={teamColors.get(entry.team) ?? COLOR_PALETTE[0]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
