'use client';

import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { DateRange } from '@/lib/types';

export type PresetKey = '7d' | '14d' | '30d' | 'all';

const VALID_PRESETS: ReadonlySet<string> = new Set<PresetKey>(['7d', '14d', '30d', 'all']);

export function isPresetKey(value: string): value is PresetKey {
  return VALID_PRESETS.has(value);
}

interface DateRangeContextValue {
  range: DateRange;
  preset: PresetKey;
  setPreset: (preset: PresetKey) => void;
}

const DateRangeContext = createContext<DateRangeContextValue | null>(null);

function computeRange(preset: PresetKey): DateRange {
  if (preset === 'all') return {};

  const days = preset === '7d' ? 7 : preset === '14d' ? 14 : 30;
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days + 1);

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

const DEFAULT_PRESET: PresetKey = 'all';

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<PresetKey>(DEFAULT_PRESET);

  const range = useMemo(() => computeRange(preset), [preset]);

  const setPreset = useCallback((newPreset: PresetKey) => {
    setPresetState(newPreset);
  }, []);

  const value = useMemo(() => ({ range, preset, setPreset }), [range, preset, setPreset]);

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange(): DateRangeContextValue {
  const ctx = useContext(DateRangeContext);
  if (!ctx) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return ctx;
}
