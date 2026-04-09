import { StyleSheet, Text, View } from 'react-native';

import type { MenuItem } from '@/src/domain/menu-types';
import { categoryLabels, priceTierLabels } from '@/src/domain/menu-types';
import { theme } from '@/src/styles/theme';

type ResultCardProps = {
  menu: MenuItem;
  intensityPercent: number;
  winnerLabel?: string;
};

export function ResultCard({ menu, intensityPercent, winnerLabel }: ResultCardProps) {
  return (
    <View style={styles.card}>
      {winnerLabel ? <Text style={styles.badge}>{winnerLabel}</Text> : null}
      <Text style={styles.emoji}>{menu.emoji}</Text>
      <Text style={styles.name}>{menu.name}</Text>
      <View style={styles.metaGrid}>
        <MetaItem label="흔들기 강도" value={`${Math.round(intensityPercent)}%`} />
        <MetaItem label="카테고리" value={categoryLabels[menu.category]} />
        <MetaItem label="예상 가격" value={priceTierLabels[menu.priceTier]} />
        <MetaItem label="칼로리" value={`~${menu.calories}kcal`} />
      </View>
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.line,
    gap: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.mintSoft,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  name: {
    fontSize: theme.fontSize.hero,
    fontWeight: '900',
    color: theme.colors.ink,
    textAlign: 'center',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  metaItem: {
    width: '48%',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: 4,
  },
  metaLabel: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.caption,
    fontWeight: '700',
  },
  metaValue: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    fontWeight: '700',
  },
});
