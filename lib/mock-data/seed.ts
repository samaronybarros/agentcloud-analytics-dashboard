// ---------------------------------------------------------------------------
// Deterministic seeded PRNG (mulberry32)
// Ensures identical data on every run — no Math.random().
// ---------------------------------------------------------------------------

export function createSeededRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a random element from an array using the seeded rng */
export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Return a random integer in [min, max] inclusive */
export function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Return a random float in [min, max) rounded to `decimals` places */
export function randFloat(
  rng: () => number,
  min: number,
  max: number,
  decimals: number = 4,
): number {
  const val = rng() * (max - min) + min;
  const factor = 10 ** decimals;
  return Math.round(val * factor) / factor;
}
