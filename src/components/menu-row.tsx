import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { MenuItem } from '@/src/domain/menu-types';
import { categoryLabels } from '@/src/domain/menu-types';
import { theme } from '@/src/styles/theme';

export function MenuRow({
  menu,
  favorite,
  onToggleFavorite,
}: {
  menu: MenuItem;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.emoji}>{menu.emoji}</Text>
      <View style={styles.copy}>
        <Text style={styles.name}>{menu.name}</Text>
        <Text style={styles.meta}>{categoryLabels[menu.category]} · ~{menu.calories}kcal</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${menu.name} 찜 ${favorite ? '해제' : '추가'}`}
        onPress={onToggleFavorite}
        style={styles.favoriteButton}
      >
        <Text style={[styles.favorite, favorite && styles.favoriteActive]}>{favorite ? '♥' : '♡'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  emoji: {
    fontSize: 34,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
  meta: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.caption,
    fontWeight: '600',
  },
  favoriteButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favorite: {
    color: theme.colors.inkSoft,
    fontSize: 24,
  },
  favoriteActive: {
    color: theme.colors.bowl,
  },
});
