import { describe, expect, it } from 'vitest';

import { shouldTriggerHaptics } from '@/src/services/feedback';

describe('shouldTriggerHaptics', () => {
  it('returns false when user disabled haptics', () => {
    expect(shouldTriggerHaptics(false)).toBe(false);
  });
});
