import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DateRangeProvider, useDateRange, isPresetKey } from '@/lib/hooks/use-date-range';

function TestConsumer() {
  const { range, preset, setPreset } = useDateRange();
  return (
    <div>
      <span data-testid="preset">{preset}</span>
      <span data-testid="from">{range.from ?? 'none'}</span>
      <span data-testid="to">{range.to ?? 'none'}</span>
      <button onClick={() => setPreset('7d')}>set-7d</button>
      <button onClick={() => setPreset('14d')}>set-14d</button>
      <button onClick={() => setPreset('30d')}>set-30d</button>
      <button onClick={() => setPreset('all')}>set-all</button>
    </div>
  );
}

describe('useDateRange', () => {
  it('throws when used outside DateRangeProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useDateRange must be used within a DateRangeProvider',
    );
    spy.mockRestore();
  });

  it('defaults to "all" preset with empty range', () => {
    render(
      <DateRangeProvider>
        <TestConsumer />
      </DateRangeProvider>,
    );
    expect(screen.getByTestId('preset').textContent).toBe('all');
    expect(screen.getByTestId('from').textContent).toBe('none');
    expect(screen.getByTestId('to').textContent).toBe('none');
  });

  it('computes a date range for 7d preset', () => {
    render(
      <DateRangeProvider>
        <TestConsumer />
      </DateRangeProvider>,
    );
    act(() => {
      screen.getByText('set-7d').click();
    });
    expect(screen.getByTestId('preset').textContent).toBe('7d');
    const from = screen.getByTestId('from').textContent!;
    const to = screen.getByTestId('to').textContent!;
    expect(from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const diffMs = new Date(to).getTime() - new Date(from).getTime();
    expect(diffMs / (1000 * 60 * 60 * 24)).toBe(6);
  });

  it('computes a date range for 14d preset', () => {
    render(
      <DateRangeProvider>
        <TestConsumer />
      </DateRangeProvider>,
    );
    act(() => {
      screen.getByText('set-14d').click();
    });
    const from = screen.getByTestId('from').textContent!;
    const to = screen.getByTestId('to').textContent!;
    const diffMs = new Date(to).getTime() - new Date(from).getTime();
    expect(diffMs / (1000 * 60 * 60 * 24)).toBe(13);
  });

  it('computes a date range for 30d preset', () => {
    render(
      <DateRangeProvider>
        <TestConsumer />
      </DateRangeProvider>,
    );
    act(() => {
      screen.getByText('set-30d').click();
    });
    const from = screen.getByTestId('from').textContent!;
    const to = screen.getByTestId('to').textContent!;
    const diffMs = new Date(to).getTime() - new Date(from).getTime();
    expect(diffMs / (1000 * 60 * 60 * 24)).toBe(29);
  });

  it('returns empty range when switching back to all', () => {
    render(
      <DateRangeProvider>
        <TestConsumer />
      </DateRangeProvider>,
    );
    act(() => {
      screen.getByText('set-7d').click();
    });
    expect(screen.getByTestId('from').textContent).not.toBe('none');
    act(() => {
      screen.getByText('set-all').click();
    });
    expect(screen.getByTestId('from').textContent).toBe('none');
    expect(screen.getByTestId('to').textContent).toBe('none');
  });
});

describe('isPresetKey', () => {
  it('returns true for valid preset keys', () => {
    expect(isPresetKey('7d')).toBe(true);
    expect(isPresetKey('14d')).toBe(true);
    expect(isPresetKey('30d')).toBe(true);
    expect(isPresetKey('all')).toBe(true);
  });

  it('returns false for invalid values', () => {
    expect(isPresetKey('60d')).toBe(false);
    expect(isPresetKey('')).toBe(false);
    expect(isPresetKey('custom')).toBe(false);
  });
});
