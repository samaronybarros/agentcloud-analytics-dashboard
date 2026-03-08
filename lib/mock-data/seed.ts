// ---------------------------------------------------------------------------
// Deterministic seeded PRNG (mulberry32)
// Ensures identical data on every run — no Math.random().
// ---------------------------------------------------------------------------

export function createSeededRng(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let hash = Math.imul(state ^ (state >>> 15), 1 | state);
    hash = (hash + Math.imul(hash ^ (hash >>> 7), 61 | hash)) ^ hash;
    return ((hash ^ (hash >>> 14)) >>> 0) / 4294967296;
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
