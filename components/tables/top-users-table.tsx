'use client';

import type { TopUserEntry } from '@/lib/types';

export function TopUsersTable({ data }: { data: TopUserEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
            <th className="px-3 py-3">User</th>
            <th className="px-3 py-3">Team</th>
            <th className="px-3 py-3 text-right">Runs</th>
            <th className="px-3 py-3 text-right">Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.userId} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-3 font-medium">{entry.userName}</td>
              <td className="px-3 py-3 text-gray-500">{entry.team}</td>
              <td className="px-3 py-3 text-right">{entry.totalRuns}</td>
              <td className="px-3 py-3 text-right">${entry.totalCost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
