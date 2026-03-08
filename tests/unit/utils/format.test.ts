import { formatNumber, formatCost, formatPercent, formatLatency } from '@/lib/utils/format';

describe('formatNumber', () => {
  it('formats integers with comma separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1523847)).toBe('1,523,847');
  });

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats small numbers without separators', () => {
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(999)).toBe('999');
  });

  it('formats decimals', () => {
    expect(formatNumber(1234.5)).toBe('1,234.5');
  });
});

describe('formatNumber (edge cases)', () => {
  it('handles NaN gracefully', () => {
    const result = formatNumber(NaN);
    expect(result).not.toContain('NaN');
    expect(result).toBe('0');
  });

  it('handles Infinity gracefully', () => {
    const result = formatNumber(Infinity);
    expect(result).not.toContain('Infinity');
  });
});

describe('formatCost', () => {
  it('formats with dollar sign and two decimals', () => {
    expect(formatCost(10)).toBe('$10.00');
    expect(formatCost(1234.5)).toBe('$1234.50');
  });

  it('formats zero cost', () => {
    expect(formatCost(0)).toBe('$0.00');
  });

  it('rounds to two decimal places', () => {
    expect(formatCost(10.999)).toBe('$11.00');
    expect(formatCost(10.004)).toBe('$10.00');
  });

  it('formats small costs', () => {
    expect(formatCost(0.01)).toBe('$0.01');
    expect(formatCost(0.1)).toBe('$0.10');
  });
});

describe('formatCost (edge cases)', () => {
  it('handles NaN gracefully', () => {
    const result = formatCost(NaN);
    expect(result).not.toContain('NaN');
    expect(result).toBe('$0.00');
  });

  it('handles Infinity gracefully', () => {
    const result = formatCost(Infinity);
    expect(result).not.toContain('Infinity');
  });
});

describe('formatPercent', () => {
  it('converts 0–1 ratio to percentage string', () => {
    expect(formatPercent(0.744)).toBe('74.4%');
    expect(formatPercent(0.925)).toBe('92.5%');
  });

  it('formats zero', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('formats 100%', () => {
    expect(formatPercent(1)).toBe('100.0%');
  });

  it('rounds to one decimal place', () => {
    expect(formatPercent(0.3333)).toBe('33.3%');
    expect(formatPercent(0.6667)).toBe('66.7%');
  });
});

describe('formatPercent (edge cases)', () => {
  it('handles NaN gracefully', () => {
    const result = formatPercent(NaN);
    expect(result).not.toContain('NaN');
    expect(result).toBe('0.0%');
  });

  it('handles Infinity gracefully', () => {
    const result = formatPercent(Infinity);
    expect(result).not.toContain('Infinity');
  });
});

describe('formatLatency', () => {
  it('formats milliseconds with ms suffix', () => {
    expect(formatLatency(500)).toBe('500ms');
    expect(formatLatency(3200)).toBe('3,200ms');
  });

  it('formats zero', () => {
    expect(formatLatency(0)).toBe('0ms');
  });

  it('rounds fractional milliseconds', () => {
    expect(formatLatency(1234.7)).toBe('1,235ms');
    expect(formatLatency(999.4)).toBe('999ms');
  });

  it('formats large latencies', () => {
    expect(formatLatency(12000)).toBe('12,000ms');
  });
});

describe('formatLatency (edge cases)', () => {
  it('handles NaN gracefully', () => {
    const result = formatLatency(NaN);
    expect(result).not.toContain('NaN');
    expect(result).toBe('0ms');
  });

  it('handles Infinity gracefully', () => {
    const result = formatLatency(Infinity);
    expect(result).not.toContain('Infinity');
  });
});
