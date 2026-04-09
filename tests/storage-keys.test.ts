import { describe, expect, it } from 'vitest';

import { HISTORY_STORAGE_KEY, ONBOARDING_STORAGE_KEY, SETTINGS_STORAGE_KEY } from '@/src/services/settings-storage';

describe('storage keys', () => {
  it('uses shake-my-meal prefixes', () => {
    expect(SETTINGS_STORAGE_KEY).toContain('shakeMyMeal');
    expect(HISTORY_STORAGE_KEY).toContain('shakeMyMeal');
    expect(ONBOARDING_STORAGE_KEY).toContain('shakeMyMeal');
  });
});
