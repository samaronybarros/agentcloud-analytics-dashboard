'use client';

import type { ModelPerformanceEntry } from '@/lib/types';

interface ModelPerformanceTableProps {
  data: ModelPerformanceEntry[];
  showCostColumn?: boolean;
  showCostPerTokenColumn?: boolean;
}

export function ModelPerformanceTable({
  data,
  showCostColumn = true,
  showCostPerTokenColumn = true,
}: ModelPerformanceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
            <th className="px-3 py-3">Model</th>
            <th className="px-3 py-3 text-right">Runs</th>
            <th className="px-3 py-3 text-right">Success</th>
            <th className="px-3 py-3 text-right">Avg Latency</th>
            {showCostColumn && <th className="px-3 py-3 text-right">Cost</th>}
            {showCostPerTokenColumn && <th className="px-3 py-3 text-right">Cost/1K Tokens</th>}
            <th className="px-3 py-3 text-right">Tokens</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.model} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-3 font-medium">{entry.model}</td>
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
              {showCostColumn && (
                <td className="px-3 py-3 text-right">${entry.totalCost.toFixed(2)}</td>
              )}
              {showCostPerTokenColumn && (
                <td className="px-3 py-3 text-right">${entry.costPerThousandTokens.toFixed(4)}</td>
              )}
              <td className="px-3 py-3 text-right">{entry.totalTokens.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
