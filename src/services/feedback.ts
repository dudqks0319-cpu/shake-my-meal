export function shouldTriggerHaptics(enabled: boolean) {
  return enabled;
}

export async function triggerSelectionHaptic(enabled: boolean) {
  if (!shouldTriggerHaptics(enabled)) {
    return;
  }

  const Haptics = await import('expo-haptics');
  await Haptics.selectionAsync();
}

export async function triggerResultHaptic(enabled: boolean) {
  if (!shouldTriggerHaptics(enabled)) {
    return;
  }

  const Haptics = await import('expo-haptics');
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
