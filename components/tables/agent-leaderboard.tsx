'use client';

import type { AgentLeaderboardEntry } from '@/lib/types';

export function AgentLeaderboard({ data }: { data: AgentLeaderboardEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
            <th className="px-3 py-3">Agent</th>
            <th className="px-3 py-3">Team</th>
            <th className="px-3 py-3 text-right">Runs</th>
            <th className="px-3 py-3 text-right">Success</th>
            <th className="px-3 py-3 text-right">Avg Latency</th>
            <th className="px-3 py-3 text-right">Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.agentId} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-3 font-medium">{entry.agentName}</td>
              <td className="px-3 py-3 text-gray-500">{entry.team}</td>
              <td className="px-3 py-3 text-right">{entry.totalRuns}</td>
              <td className="px-3 py-3 text-right">
                <span
                  className={
                    entry.successRate >= 0.9
                      ? 'text-green-600'
                      : entry.successRate >= 0.7
                        ? 'text-amber-600'
                        : 'text-red-600'
                  }
                >
                  {(entry.successRate * 100).toFixed(1)}%
                </span>
              </td>
              <td className="px-3 py-3 text-right">
                {Math.round(entry.avgLatencyMs).toLocaleString('en-US')}ms
              </td>
              <td className="px-3 py-3 text-right">${entry.totalCost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
