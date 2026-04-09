import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/styles/theme';

export function LoadingCard({
  title = '불러오는 중',
  body = '잠시만 기다려 주세요.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <View style={styles.card} accessibilityRole="progressbar" accessibilityLabel={title}>
      <ActivityIndicator color={theme.colors.bowlDeep} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
  body: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
    textAlign: 'center',
  },
});
