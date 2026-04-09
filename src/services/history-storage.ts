import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ShakeHistoryItem } from '@/src/domain/menu-types';
import { HISTORY_STORAGE_KEY } from '@/src/services/settings-storage';

const HISTORY_LIMIT = 20;

export function appendHistory(existing: ShakeHistoryItem[], nextItem: ShakeHistoryItem) {
  return [nextItem, ...existing].slice(0, HISTORY_LIMIT);
}

export async function loadHistory() {
  let raw: string | null = null;

  try {
    raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
  } catch {
    return [] as ShakeHistoryItem[];
  }

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
  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export async function pushHistory(item: ShakeHistoryItem) {
  const current = await loadHistory();
  const next = appendHistory(current, item);
  const saved = await saveHistory(next);

  if (!saved) {
    throw new Error('history-save-failed');
  }

  return next;
}
