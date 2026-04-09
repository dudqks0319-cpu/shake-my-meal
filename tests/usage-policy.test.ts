import { describe, expect, it } from 'vitest';

import { canUseShake } from '@/src/domain/usage-policy';

describe('canUseShake', () => {
  it('allows unlimited free use in the current release configuration', () => {
    expect(canUseShake({ premiumUnlocked: false, dailyCount: 999 })).toEqual({
      allowed: true,
      reason: null,
    });
  });

  it('still supports a bounded limit when explicitly configured', () => {
    expect(canUseShake({ premiumUnlocked: false, dailyCount: 10, dailyLimit: 10 })).toEqual({
      allowed: false,
      reason: 'daily-limit',
    });
  });
});
