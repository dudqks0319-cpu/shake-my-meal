import { describe, expect, it } from 'vitest';

import { canUseShake } from '@/src/domain/usage-policy';

describe('canUseShake', () => {
  it('blocks free users after 10 shakes in a day', () => {
    expect(canUseShake({ premiumUnlocked: false, dailyCount: 10 })).toEqual({
      allowed: false,
      reason: 'daily-limit',
    });
  });
});
