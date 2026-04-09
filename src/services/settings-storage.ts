import AsyncStorage from '@react-native-async-storage/async-storage';

import type { MenuCategory, UserSettings } from '@/src/domain/menu-types';

export const SETTINGS_STORAGE_KEY = 'shakeMyMeal:settings';
export const HISTORY_STORAGE_KEY = 'shakeMyMeal:history';
export const ONBOARDING_STORAGE_KEY = 'shakeMyMeal:onboarding';

export const DEFAULT_SETTINGS: UserSettings = {
  excludedMenuIds: [],
  enabledCategories: ['korean', 'chinese', 'japanese', 'western', 'snack', 'asian', 'dessert'],
  partySize: 'solo',
  autoTimeDetection: true,
  soundEnabled: true,
  hapticsEnabled: true,
  premiumUnlocked: false,
};

export function toggleCategory(categories: MenuCategory[], category: MenuCategory) {
  return categories.includes(category)
    ? categories.filter((item) => item !== category)
    : [...categories, category];
}

export function toggleExcludedMenuId(menuIds: string[], menuId: string) {
  return menuIds.includes(menuId)
    ? menuIds.filter((item) => item !== menuId)
    : [...menuIds, menuId];
}

export function shouldShowOnboarding(value: string | null) {
  return value !== 'done';
}

export async function loadSettings() {
  const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!raw) {
    return DEFAULT_SETTINGS;
  }

  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(raw),
    } as UserSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: UserSettings) {
  await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export async function readOnboardingState() {
  return AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
}

export async function completeOnboarding() {
  await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'done');
}
