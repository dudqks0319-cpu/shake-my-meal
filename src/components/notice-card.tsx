import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/styles/theme';

type NoticeTone = 'error' | 'info' | 'success';

export function NoticeCard({
  title,
  body,
  tone = 'info',
}: {
  title: string;
  body: string;
  tone?: NoticeTone;
}) {
  return (
    <View
      style={[
        styles.card,
        tone === 'error' && styles.errorCard,
        tone === 'success' && styles.successCard,
      ]}
      accessibilityRole="alert"
    >
      <Text style={[styles.title, tone === 'error' && styles.errorTitle]}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  errorCard: {
    backgroundColor: '#FFF1EE',
  },
  successCard: {
    backgroundColor: theme.colors.mintSoft,
  },
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
  errorTitle: {
    color: theme.colors.warning,
  },
  body: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
    lineHeight: 22,
  },
});
