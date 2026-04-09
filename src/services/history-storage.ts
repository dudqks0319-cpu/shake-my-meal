import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ShakeHistoryItem } from '@/src/domain/menu-types';
import { HISTORY_STORAGE_KEY } from '@/src/services/settings-storage';

const HISTORY_LIMIT = 20;

export function appendHistory(existing: ShakeHistoryItem[], nextItem: ShakeHistoryItem) {
  return [nextItem, ...existing].slice(0, HISTORY_LIMIT);
}

export async function loadHistory() {
  const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);

  if (!raw) {
    return [] as ShakeHistoryItem[];
  }

  try {
    return JSON.parse(raw) as ShakeHistoryItem[];
  } catch {
    return [];
  }
}

export async function saveHistory(items: ShakeHistoryItem[]) {
  await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
}

export async function pushHistory(item: ShakeHistoryItem) {
  const current = await loadHistory();
  const next = appendHistory(current, item);
  await saveHistory(next);
  return next;
}
