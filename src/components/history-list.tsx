import { StyleSheet, Text, View } from 'react-native';

import type { ShakeHistoryItem } from '@/src/domain/menu-types';
import { theme } from '@/src/styles/theme';

type HistoryListProps = {
  items: ShakeHistoryItem[];
};

export function HistoryList({ items }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>아직 기록이 없어요</Text>
        <Text style={styles.emptyBody}>첫 흔들기로 오늘 메뉴를 남겨보세요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.menu}>{item.emoji} {item.menuName}</Text>
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text style={styles.intensity}>{Math.round(item.intensityPercent)}%</Text>
        </View>
      ))}
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.getMonth() + 1}.${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
  row: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    gap: 4,
  },
  menu: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    fontWeight: '700',
  },
  date: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.caption,
  },
  intensity: {
    color: theme.colors.bowlDeep,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '900',
  },
  empty: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    gap: theme.spacing.xs,
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '700',
  },
  emptyBody: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
  },
});
