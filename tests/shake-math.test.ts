import { describe, expect, it } from 'vitest';

import { getCountdownStartState, normalizeAccelerationToPercent } from '@/src/domain/shake-math';

describe('shake math', () => {
  it('clamps negative values to zero', () => {
    expect(normalizeAccelerationToPercent(-1, 20)).toBe(0);
  });

  it('clamps values above max to 100', () => {
    expect(normalizeAccelerationToPercent(30, 20)).toBe(100);
  });

  it('keeps a mild shake from jumping into the mid range', () => {
    expect(normalizeAccelerationToPercent(2)).toBeLessThan(35);
  });

  it('starts countdown after a valid peak', () => {
    expect(getCountdownStartState(42)).toBe(true);
  });
});
