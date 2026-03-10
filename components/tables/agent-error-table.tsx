'use client';

import type { AgentErrorBreakdown } from '@/lib/types';

function errorCountColor(count: number): string {
  if (count >= 10) return 'text-red-600';
  if (count >= 5) return 'text-amber-600';
  return '';
}

export function AgentErrorTable({ data }: { data: AgentErrorBreakdown[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
            <th className="px-3 py-3">Agent</th>
            <th className="px-3 py-3">Team</th>
            <th className="px-3 py-3 text-right">Errors</th>
            <th className="px-3 py-3">Top Error</th>
            <th className="px-3 py-3">Remediation</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.agentId} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-3 font-medium">{entry.agentName}</td>
              <td className="px-3 py-3 text-gray-500">{entry.team}</td>
              <td className={`px-3 py-3 text-right ${errorCountColor(entry.totalErrors)}`}>
                {entry.totalErrors}
              </td>
              <td className="px-3 py-3">{entry.topErrorType}</td>
              <td className="max-w-xs truncate px-3 py-3 text-gray-500">{entry.remediation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
