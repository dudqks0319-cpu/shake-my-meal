import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BottomTabs } from '@/src/components/bottom-tabs';
import { PrimaryButton } from '@/src/components/primary-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { categoryLabels, type MenuCategory } from '@/src/domain/menu-types';
import { theme } from '@/src/styles/theme';

const categoryEmoji: Record<MenuCategory, string> = {
  korean: '🍲',
  chinese: '🥡',
  japanese: '🍣',
  western: '🍝',
  snack: '🍢',
  asian: '🍜',
  dessert: '🍰',
};

export function CategoryScreen() {
  return (
    <ScreenShell>
      <Text accessibilityRole="header" style={styles.title}>카테고리</Text>
      <Text style={styles.subtitle}>먹고 싶은 음식 계열을 먼저 골라보세요.</Text>
      <View style={styles.grid}>
        {(Object.keys(categoryLabels) as MenuCategory[]).map((category) => (
          <View key={category} style={styles.card}>
            <Text style={styles.emoji}>{categoryEmoji[category]}</Text>
            <Text style={styles.cardTitle}>{categoryLabels[category]}</Text>
            <PrimaryButton
              label="추천받기"
              variant="soft"
              onPress={() =>
                router.push({
                  pathname: '/',
                  params: {
                    category,
                  },
                })
              }
            />
          </View>
        ))}
      </View>
      <BottomTabs active="categories" />
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
  subtitle: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  card: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 42,
  },
  cardTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
});
