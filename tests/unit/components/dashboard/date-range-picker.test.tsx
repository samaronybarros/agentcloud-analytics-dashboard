import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from '@/components/dashboard/date-range-picker';
import { DateRangeProvider, useDateRange } from '@/lib/hooks/use-date-range';

function TestConsumer() {
  const { range } = useDateRange();
  return (
    <div data-testid="range-output">
      {range.from ?? 'none'}|{range.to ?? 'none'}
    </div>
  );
}

function renderWithProvider() {
  return render(
    <DateRangeProvider>
      <DateRangePicker />
      <TestConsumer />
    </DateRangeProvider>,
  );
}

describe('DateRangePicker', () => {
  it('renders a select element', () => {
    renderWithProvider();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('defaults to all time', () => {
    renderWithProvider();
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('all');
  });

  it('offers preset options', () => {
    renderWithProvider();
    const options = screen.getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual([
      'Last 7 days',
      'Last 14 days',
      'Last 30 days',
      'All time',
    ]);
  });

  it('updates context when selection changes to 7d', () => {
    renderWithProvider();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '7d' } });
    const output = screen.getByTestId('range-output').textContent;
    expect(output).toContain('|');
    expect(output).not.toBe('none|none');
  });

  it('sets range to undefined for all time', () => {
    renderWithProvider();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'all' } });
    const output = screen.getByTestId('range-output').textContent;
    expect(output).toBe('none|none');
  });

  it('has accessible label', () => {
    renderWithProvider();
    expect(screen.getByLabelText('Date range')).toBeInTheDocument();
  });
});
