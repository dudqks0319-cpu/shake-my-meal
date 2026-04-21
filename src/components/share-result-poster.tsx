import { StyleSheet, Text, View } from 'react-native';

import { categoryLabels, mealIntentLabels, priceTierLabels, type MealIntent, type MenuItem, type PartySize, type TimeTag } from '@/src/domain/menu-types';
import { buildIntentRecommendationReason, buildRecommendationReason } from '@/src/domain/ui-copy';
import { APP_CONFIG } from '@/src/config/app-config';
import { BowlMascot } from '@/src/components/mascot';
import { theme } from '@/src/styles/theme';

export function ShareResultPoster({
  menu,
  intensityPercent,
  partySize,
  timeTag,
  intent,
}: {
  menu: MenuItem;
  intensityPercent: number;
  partySize: PartySize;
  timeTag: TimeTag;
  intent?: MealIntent;
}) {
  const reasonText = intent
    ? buildIntentRecommendationReason({
        intentLabel: mealIntentLabels[intent],
        partyLabel: {
          solo: '혼밥',
          duo: '2인',
          group: '단체',
        }[partySize],
        timeLabel: {
          breakfast: '아침',
          lunch: '점심',
          dinner: '저녁',
          'late-night': '야식',
        }[timeTag],
      })
    : buildRecommendationReason({ intensityPercent, partySize, timeTag });

  return (
    <View style={styles.poster}>
      <Text style={styles.brand}>🍚 흔들밥</Text>
      <Text style={styles.kicker}>오늘의 메뉴</Text>
      <BowlMascot size={86} />
      <Text style={styles.menuEmoji}>{menu.emoji}</Text>
      <Text style={styles.title}>{menu.name}</Text>
      <Text style={styles.reason}>{reasonText}</Text>
      <View style={styles.metaRow}>
        <MetaChip label={categoryLabels[menu.category]} />
        <MetaChip label={priceTierLabels[menu.priceTier]} />
        <MetaChip label={`~${menu.calories}kcal`} />
      </View>
      <Text style={styles.footer}>shake-my-meal • {APP_CONFIG.githubRepoUrl}</Text>
    </View>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <View style={styles.metaChip}>
      <Text style={styles.metaChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  poster: {
    backgroundColor: theme.colors.canvas,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.line,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    width: '100%',
  },
  brand: {
    color: theme.colors.bowlDeep,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '900',
    textAlign: 'center',
  },
  kicker: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  menuEmoji: {
    fontSize: 40,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.hero,
    fontWeight: '900',
    textAlign: 'center',
  },
  reason: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  metaChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  metaChipText: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.caption,
    fontWeight: '700',
  },
  footer: {
    color: theme.colors.inkSoft,
    fontSize: 11,
    textAlign: 'center',
  },
});
