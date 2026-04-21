import AsyncStorage from '@react-native-async-storage/async-storage';

import type { IngredientTag, PriceTier, TasteTag } from '@/src/domain/menu-types';

const FILTER_STORAGE_KEY = 'shakeMyMeal:filters';

export type FilterSettings = {
  excludedIngredients: IngredientTag[];
  preferredTastes: TasteTag[];
  priceTiers: PriceTier[];
};

export const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  excludedIngredients: [],
  preferredTastes: [],
  priceTiers: ['budget', 'standard', 'premium'],
};

export function toggleArrayValue<T extends string>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export async function loadFilterSettings() {
  try {
    const raw = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
    return raw ? { ...DEFAULT_FILTER_SETTINGS, ...(JSON.parse(raw) as Partial<FilterSettings>) } : DEFAULT_FILTER_SETTINGS;
  } catch {
    return DEFAULT_FILTER_SETTINGS;
  }
}

export async function saveFilterSettings(settings: FilterSettings) {
  try {
    await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}
