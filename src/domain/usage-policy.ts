import { APP_CONFIG } from '@/src/config/app-config';

export function canUseShake({
  premiumUnlocked,
  dailyCount,
  dailyLimit = APP_CONFIG.freeUsageLimitPerDay,
}: {
  premiumUnlocked: boolean;
  dailyCount: number;
  dailyLimit?: number | null;
}) {
  if (premiumUnlocked) {
    return {
      allowed: true,
      reason: null,
    } as const;
  }

  if (dailyLimit !== null && dailyCount >= dailyLimit) {
    return {
      allowed: false,
      reason: 'daily-limit',
    } as const;
  }

  return {
    allowed: true,
    reason: null,
  } as const;
}
