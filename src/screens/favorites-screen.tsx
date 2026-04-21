import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomTabs } from '@/src/components/bottom-tabs';
import { LoadingCard } from '@/src/components/loading-card';
import { MenuRow } from '@/src/components/menu-row';
import { ScreenShell } from '@/src/components/screen-shell';
import { menuDataset } from '@/src/data/menu-dataset';
import { loadFavoriteIds, toggleFavorite } from '@/src/services/favorites-storage';
import { theme } from '@/src/styles/theme';

export function FavoritesScreen() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFavoriteIds(await loadFavoriteIds());
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      return undefined;
    }, [refresh])
  );

  const favoriteMenus = menuDataset.filter((menu) => favoriteIds.includes(menu.id));

  return (
    <ScreenShell>
      <Text accessibilityRole="header" style={styles.title}>찜 목록</Text>
      {loading ? <LoadingCard title="찜 목록을 불러오는 중" body="좋아하는 메뉴를 모으고 있어요." /> : null}
      {favoriteMenus.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>♡</Text>
          <Text style={styles.emptyTitle}>아직 찜한 메뉴가 없어요</Text>
          <Text style={styles.emptyBody}>결과나 기록에서 마음에 드는 메뉴를 찜해보세요.</Text>
        </View>
      ) : null}
      <View style={styles.list}>
        {favoriteMenus.map((menu) => (
          <MenuRow
            key={menu.id}
            menu={menu}
            favorite
            onToggleFavorite={async () => setFavoriteIds(await toggleFavorite(menu.id))}
          />
        ))}
      </View>
      <BottomTabs active="favorites" />
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
  emptyEmoji: {
    color: theme.colors.bowl,
    fontSize: 42,
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
