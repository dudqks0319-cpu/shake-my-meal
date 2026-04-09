import { describe, expect, it } from 'vitest';

import { shouldShowOnboarding } from '@/src/services/settings-storage';

describe('shouldShowOnboarding', () => {
  it('returns true when onboarding flag is absent', () => {
    expect(shouldShowOnboarding(null)).toBe(true);
  });
});
