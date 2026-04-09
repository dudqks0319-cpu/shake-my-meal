import { router, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/primary-button';
import { ResultCard } from '@/src/components/result-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { menuDataset } from '@/src/data/menu-dataset';
import { getCurrentTimeTag } from '@/src/domain/menu-recommender';
import { buildRecommendationReason } from '@/src/domain/ui-copy';
import { triggerResultHaptic } from '@/src/services/feedback';
import { buildShareText } from '@/src/services/share-result';
import { loadSettings } from '@/src/services/settings-storage';
import { theme } from '@/src/styles/theme';
import { useEffect, useMemo, useState } from 'react';

export function ResultScreen() {
  const params = useLocalSearchParams<{
    menuId?: string;
    intensity?: string;
    winner?: string;
  }>();
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [partySize, setPartySize] = useState<'solo' | 'duo' | 'group'>('solo');
  const [autoTimeDetection, setAutoTimeDetection] = useState(true);
  const menu = useMemo(
    () => menuDataset.find((item) => item.id === params.menuId) ?? menuDataset[0],
    [params.menuId]
  );
  const intensity = Number(params.intensity ?? 0);
  const timeTag = autoTimeDetection ? getCurrentTimeTag() : 'lunch';
  const reason = useMemo(
    () =>
      buildRecommendationReason({
        intensityPercent: intensity,
        partySize,
        timeTag,
      }),
    [intensity, partySize, timeTag]
  );

  useEffect(() => {
    loadSettings().then((settings) => {
      setHapticsEnabled(settings.hapticsEnabled);
      setPartySize(settings.partySize);
      setAutoTimeDetection(settings.autoTimeDetection);
    });
  }, []);

  useEffect(() => {
    void triggerResultHaptic(hapticsEnabled);
  }, [hapticsEnabled]);

  const handleShare = async () => {
    await Share.share({
      message: buildShareText({
        menuName: menu.name,
        intensityPercent: intensity,
        category: menu.category,
      }),
    });
  };

  return (
    <ScreenShell contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 메뉴는...</Text>
        <Text style={styles.subtitle}>이 정도면 고민 끝입니다.</Text>
        <View style={styles.reasonCard}>
          <Text style={styles.reasonLabel}>추천 이유</Text>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>
      </View>

      <ResultCard menu={menu} intensityPercent={intensity} winnerLabel={params.winner} />

      <View style={styles.actions}>
        <PrimaryButton label="🔄 다시 흔들기" onPress={() => router.replace('/')} />
        <PrimaryButton label="📤 공유하기" onPress={handleShare} variant="soft" />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.title,
    fontWeight: '900',
  },
  subtitle: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
  },
  actions: {
    gap: theme.spacing.sm,
  },
  reasonCard: {
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  reasonLabel: {
    color: theme.colors.bowlDeep,
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
  },
  reasonText: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    lineHeight: 22,
    fontWeight: '600',
  },
});
