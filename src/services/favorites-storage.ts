import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = 'shakeMyMeal:favorites';

export function toggleFavoriteId(ids: string[], menuId: string) {
  return ids.includes(menuId) ? ids.filter((id) => id !== menuId) : [menuId, ...ids];
}

export async function loadFavoriteIds() {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteIds(ids: string[]) {
  try {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}

export async function toggleFavorite(menuId: string) {
  const current = await loadFavoriteIds();
  const next = toggleFavoriteId(current, menuId);
  await saveFavoriteIds(next);
  return next;
}
