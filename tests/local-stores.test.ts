import { describe, expect, it } from 'vitest';

import { toggleFavoriteId } from '@/src/services/favorites-storage';
import { DEFAULT_FILTER_SETTINGS, toggleArrayValue } from '@/src/services/filter-storage';

describe('local stores', () => {
  it('toggles favorite ids', () => {
    expect(toggleFavoriteId([], 'bibimbap')).toEqual(['bibimbap']);
    expect(toggleFavoriteId(['bibimbap'], 'bibimbap')).toEqual([]);
  });

  it('has all price tiers enabled by default', () => {
    expect(DEFAULT_FILTER_SETTINGS.priceTiers).toEqual(['budget', 'standard', 'premium']);
  });

  it('toggles generic filter values', () => {
    expect(toggleArrayValue(['spicy'], 'fresh')).toEqual(['spicy', 'fresh']);
    expect(toggleArrayValue(['spicy'], 'spicy')).toEqual([]);
  });
});
