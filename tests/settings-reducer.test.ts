import { describe, expect, it } from 'vitest';

import { toggleCategory, toggleExcludedMenuId } from '@/src/services/settings-storage';

describe('toggleCategory', () => {
  it('removes an enabled category', () => {
    expect(toggleCategory(['korean', 'japanese'], 'japanese')).toEqual(['korean']);
  });
});

describe('toggleExcludedMenuId', () => {
  it('adds a menu id when it is not present', () => {
    expect(toggleExcludedMenuId(['kimbap'], 'ramen')).toEqual(['kimbap', 'ramen']);
  });

  it('removes a menu id when it is already present', () => {
    expect(toggleExcludedMenuId(['kimbap', 'ramen'], 'ramen')).toEqual(['kimbap']);
  });
});
