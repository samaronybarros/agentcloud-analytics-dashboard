'use client';

import type { TeamUsageEntry } from '@/lib/types';

export function TeamUsageTable({ data }: { data: TeamUsageEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
            <th className="px-3 py-3">Team</th>
            <th className="px-3 py-3 text-right">Runs</th>
            <th className="px-3 py-3 text-right">Active Agents</th>
            <th className="px-3 py-3 text-right">Active Users</th>
            <th className="px-3 py-3 text-right">Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.team} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-3 font-medium">{entry.team}</td>
              <td className="px-3 py-3 text-right">{entry.totalRuns}</td>
              <td className="px-3 py-3 text-right">{entry.activeAgents}</td>
              <td className="px-3 py-3 text-right">{entry.activeUsers}</td>
              <td className="px-3 py-3 text-right">${entry.totalCost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
