interface EmptyStateProps {
  message?: string;
  showHint?: boolean;
}

export function EmptyState({
  message = 'No data available for the selected time period.',
  showHint = true,
}: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center"
    >
      <p className="text-sm text-gray-500">{message}</p>
      {showHint && (
        <p className="mt-2 text-xs text-gray-400">
          Try selecting a different date range to see results.
        </p>
      )}
    </div>
  );
}
