interface ErrorStateProps {
  message?: string;
  detail?: string;
  showHint?: boolean;
}

export function ErrorState({
  message = 'Something went wrong while loading data.',
  detail,
  showHint = true,
}: ErrorStateProps) {
  return (
    <div
      data-testid="error-state"
      className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-200 py-12"
    >
      <p className="text-sm text-red-600">{message}</p>
      {detail && (
        <p data-testid="error-detail" className="mt-1 text-xs text-red-400">
          {detail}
        </p>
      )}
      {showHint && (
        <p className="mt-2 text-xs text-gray-400">
          Try refreshing the page or selecting a different date range.
        </p>
      )}
    </div>
  );
}
