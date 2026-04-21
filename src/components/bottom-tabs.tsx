import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/styles/theme';

type TabKey = 'home' | 'categories' | 'favorites';

const tabs: { key: TabKey; label: string; emoji: string; path: '/' | '/categories' | '/favorites' }[] = [
  { key: 'home', label: '홈', emoji: '🏠', path: '/' },
  { key: 'categories', label: '카테고리', emoji: '🍴', path: '/categories' },
  { key: 'favorites', label: '찜 목록', emoji: '♡', path: '/favorites' },
];

export function BottomTabs({ active }: { active: TabKey }) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const selected = tab.key === active;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${tab.label} 탭`}
            onPress={() => router.replace(tab.path as never)}
            style={styles.item}
          >
            <Text style={[styles.emoji, selected && styles.selected]}>{tab.emoji}</Text>
            <Text style={[styles.label, selected && styles.selected]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  item: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  emoji: {
    fontSize: 18,
    color: theme.colors.inkSoft,
  },
  label: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.caption,
    fontWeight: '700',
  },
  selected: {
    color: theme.colors.bowlDeep,
  },
});
