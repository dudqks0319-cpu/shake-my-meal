import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomTabs } from '@/src/components/bottom-tabs';
import { LoadingCard } from '@/src/components/loading-card';
import { MenuRow } from '@/src/components/menu-row';
import { PrimaryButton } from '@/src/components/primary-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { menuDataset } from '@/src/data/menu-dataset';
import type { ShakeHistoryItem } from '@/src/domain/menu-types';
import { loadFavoriteIds, toggleFavorite } from '@/src/services/favorites-storage';
import { loadHistory, saveHistory } from '@/src/services/history-storage';
import { theme } from '@/src/styles/theme';

export function HistoryScreen() {
  const [history, setHistory] = useState<ShakeHistoryItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [nextHistory, nextFavorites] = await Promise.all([loadHistory(), loadFavoriteIds()]);
    setHistory(nextHistory);
    setFavoriteIds(nextFavorites);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      return undefined;
    }, [refresh])
  );

  const clearHistory = async () => {
    await saveHistory([]);
    setHistory([]);
  };

  return (
    <ScreenShell>
      <Text accessibilityRole="header" style={styles.title}>추천 기록</Text>
      {loading ? <LoadingCard title="기록을 불러오는 중" body="최근 추천을 정리하고 있어요." /> : null}
      {history.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>아직 추천 기록이 없어요</Text>
          <Text style={styles.emptyBody}>홈에서 메뉴를 추천받으면 여기에 쌓입니다.</Text>
        </View>
      ) : null}
      <View style={styles.list}>
        {history.map((item) => {
          const menu = menuDataset.find((candidate) => candidate.id === item.menuId);

          if (!menu) {
            return null;
          }

          return (
            <MenuRow
              key={item.id}
              menu={menu}
              favorite={favoriteIds.includes(menu.id)}
              onToggleFavorite={async () => setFavoriteIds(await toggleFavorite(menu.id))}
            />
          );
        })}
      </View>
      {history.length > 0 ? (
        <PrimaryButton label="기록 전체 삭제" variant="ghost" onPress={clearHistory} />
      ) : null}
      <BottomTabs active="home" />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.title,
    fontWeight: '900',
    textAlign: 'center',
    paddingTop: theme.spacing.lg,
  },
  list: {
    gap: theme.spacing.sm,
  },
  empty: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
  emptyBody: {
    color: theme.colors.inkSoft,
    textAlign: 'center',
  },
});
