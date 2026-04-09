import { useCallback, useState } from 'react';

import type { ShakeHistoryItem, UserSettings } from '@/src/domain/menu-types';
import { pushHistory, loadHistory } from '@/src/services/history-storage';
import { DEFAULT_SETTINGS, loadSettings } from '@/src/services/settings-storage';

export function useHomeData() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<ShakeHistoryItem[]>([]);
  const [dailyCount, setDailyCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [nextSettings, nextHistory] = await Promise.all([loadSettings(), loadHistory()]);
      setSettings(nextSettings);
      setHistory(nextHistory);
      const todayKey = new Date().toDateString();
      const todayCount = nextHistory.filter((item) => new Date(item.createdAt).toDateString() === todayKey).length;
      setDailyCount(todayCount);
    } catch {
      setErrorMessage('설정이나 기록을 불러오지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordHistory = useCallback(async (item: ShakeHistoryItem) => {
    try {
      const nextHistory = await pushHistory(item);
      setHistory(nextHistory);
      setDailyCount((current) => current + 1);
      return true;
    } catch {
      setErrorMessage('기록 저장에 실패했어요. 앱은 계속 사용할 수 있어요.');
      return false;
    }
  }, []);

  return {
    settings,
    history,
    dailyCount,
    isLoading,
    errorMessage,
    setErrorMessage,
    refresh,
    recordHistory,
  };
}
