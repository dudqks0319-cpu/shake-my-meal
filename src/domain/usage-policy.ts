export function canUseShake({
  premiumUnlocked,
  dailyCount,
}: {
  premiumUnlocked: boolean;
  dailyCount: number;
}) {
  if (premiumUnlocked) {
    return {
      allowed: true,
      reason: null,
    } as const;
  }

  if (dailyCount >= 10) {
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
