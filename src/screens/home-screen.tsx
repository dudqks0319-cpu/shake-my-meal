import { useFocusEffect, router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_CONFIG } from '@/src/config/app-config';
import { HistoryList } from '@/src/components/history-list';
import { IntensityMeter } from '@/src/components/intensity-meter';
import { LoadingCard } from '@/src/components/loading-card';
import { BowlMascot } from '@/src/components/mascot';
import { NoticeCard } from '@/src/components/notice-card';
import { PrimaryButton } from '@/src/components/primary-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { menuDataset } from '@/src/data/menu-dataset';
import { getCurrentTimeTag, recommendMenuByIntent } from '@/src/domain/menu-recommender';
import { mealIntentLabels, type MealIntent } from '@/src/domain/menu-types';
import { getHomeHeroState } from '@/src/domain/ui-copy';
import { canUseShake } from '@/src/domain/usage-policy';
import { useHomeData } from '@/src/hooks/use-home-data';
import { useShakeSession } from '@/src/hooks/use-shake-session';
import { triggerSelectionHaptic } from '@/src/services/feedback';
import { loadFilterSettings } from '@/src/services/filter-storage';
import { readOnboardingState, shouldShowOnboarding } from '@/src/services/settings-storage';
import { theme } from '@/src/styles/theme';

export function HomeScreen() {
  const shake = useShakeSession();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<MealIntent>('full');
  const { settings, history, dailyCount, isLoading, errorMessage, recordHistory, refresh } = useHomeData();

  const usageState = useMemo(
    () => canUseShake({ premiumUnlocked: settings.premiumUnlocked, dailyCount }),
    [dailyCount, settings.premiumUnlocked]
  );
  const timeContext = settings.autoTimeDetection ? getCurrentTimeTag() : 'lunch';
  const partyLabel = {
    solo: '혼밥',
    duo: '2인',
    group: '단체',
  }[settings.partySize];
  const timeLabel = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
    'late-night': '야식',
  }[timeContext];
  const usageLabel =
    APP_CONFIG.freeUsageLimitPerDay === null
      ? `오늘 사용 ${dailyCount}회`
      : `오늘 사용 ${Math.min(dailyCount, APP_CONFIG.freeUsageLimitPerDay)} / ${APP_CONFIG.freeUsageLimitPerDay}`;

  const heroState = useMemo(
    () =>
      getHomeHeroState({
        countdown,
        liveIntensity: shake.liveIntensity,
        shakeStatus: shake.status,
        readyForCountdown: shake.readyForCountdown,
        warning: shake.warning,
        limitMessage,
      }),
    [countdown, limitMessage, shake.liveIntensity, shake.readyForCountdown, shake.status, shake.warning]
  );
  const intentBody = {
    light: '오늘은 가볍게 한 끼만 챙기고 싶을 때',
    full: '배는 든든하게, 만족감 있게 먹고 싶을 때',
    treat: '오늘만큼은 가격 생각 덜 하고 기분 좋게 먹고 싶을 때',
  }[selectedIntent];

  useEffect(() => {
    readOnboardingState().then((value) => {
      if (shouldShowOnboarding(value)) {
        router.replace('/onboarding');
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      return undefined;
    }, [refresh])
  );

  useEffect(() => {
    if (!usageState.allowed) {
      setLimitMessage('오늘 무료 사용 한도에 도달했어요.');
      shake.resetSession();
      return;
    }

    if (shake.status === 'idle') {
      void shake.startSession();
    }
  }, [shake, usageState.allowed]);

  useEffect(() => {
    if (shake.status !== 'ended' || !shake.readyForCountdown || countdown !== null) {
      return;
    }

    setCountdown(3);
  }, [countdown, shake.readyForCountdown, shake.status]);

  useEffect(() => {
    if (countdown === null) {
      return;
    }

    if (countdown === 0) {
      let filters;

      try {
        filters = awaitableFilters;
      } catch {
        filters = undefined;
      }
      const menu = recommendMenuByIntent({
        intent: selectedIntent,
        menus: menuDataset,
        settings,
        currentTimeTag: timeContext,
        filters,
      });

      void recordHistory({
        id: `${Date.now()}`,
        menuId: menu.id,
        menuName: menu.name,
        emoji: menu.emoji,
        intensityPercent: shake.peakIntensity,
        createdAt: new Date().toISOString(),
        mode: 'single',
      });

      router.push({
        pathname: '/result',
        params: {
          menuId: menu.id,
          intensity: `${shake.peakIntensity}`,
          mode: 'single',
          intent: selectedIntent,
        },
      });
      setCountdown(null);
      shake.resetSession();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((current) => (current === null ? current : current - 1));
      void triggerSelectionHaptic(settings.hapticsEnabled);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, recordHistory, selectedIntent, settings, shake, timeContext]);

  const handleRestart = useCallback(() => {
    setCountdown(null);
    setLimitMessage(null);
    shake.resetSession();
    void shake.startSession();
  }, [shake]);

  return (
    <ScreenShell>
      {errorMessage ? <NoticeCard title="불러오기 안내" body={errorMessage} tone="error" /> : null}

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text accessibilityRole="header" style={styles.brand}>🍚 흔들밥</Text>
            <Text style={styles.subtitle}>오늘 뭐 먹을지 5초 안에 끝내기</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="설정 화면으로 이동"
            onPress={() => router.push('/settings')}
            style={styles.settingsPill}
          >
            <Text style={styles.settingsPillText}>⚙ 설정</Text>
          </Pressable>
        </View>
        <View style={styles.contextRow}>
          <ContextChip label={usageLabel} tone="warm" />
          <ContextChip label={`${partyLabel} · ${timeLabel}`} tone="soft" />
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{heroState.badge}</Text>
        </View>
        <BowlMascot size={110} />
        <Text accessibilityRole="header" style={styles.heroTitle}>{heroState.title}</Text>
        <Text style={styles.heroBody}>{heroState.body}</Text>

        <View style={styles.intentSection}>
          <Text style={styles.intentLabel}>지금 기분을 먼저 골라주세요</Text>
          <View style={styles.intentChips}>
            {(Object.keys(mealIntentLabels) as MealIntent[]).map((intent) => (
              <PrimaryButton
                key={intent}
                label={mealIntentLabels[intent]}
                variant={selectedIntent === intent ? 'solid' : 'ghost'}
                onPress={() => setSelectedIntent(intent)}
                accessibilityLabel={`${mealIntentLabels[intent]} 모드 선택`}
              />
            ))}
          </View>
          <Text style={styles.intentHint}>{intentBody}</Text>
        </View>

        <IntensityMeter value={shake.liveIntensity} label="흔들기 연출" />
      </View>

      {isLoading ? (
        <LoadingCard title="설정과 기록을 불러오는 중" body="최근 추천 흐름과 개인 설정을 준비하고 있어요." />
      ) : null}

      {!usageState.allowed ? (
        <PrimaryButton label="오늘 제한 확인됨" variant="ghost" disabled accessibilityLabel="오늘 사용 제한 도달" />
      ) : null}

      {shake.status === 'ended' && !shake.readyForCountdown ? (
        <PrimaryButton
          label="조금 더 세게, 다시!"
          onPress={handleRestart}
          variant="soft"
          accessibilityHint="흔들기 측정을 다시 시작합니다."
        />
      ) : null}

      <View style={styles.quickActions}>
        <QuickLink emoji="📜" label="다시 측정" onPress={handleRestart} accessibilityLabel="다시 측정하기" />
        <QuickLink emoji="⚔️" label="배틀" onPress={() => router.push('/battle')} accessibilityLabel="배틀 화면으로 이동" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 흔들기 3개</Text>
        <Text style={styles.sectionHint}>오늘의 취향 흐름을 바로 다시 볼 수 있어요.</Text>
        <HistoryList items={history.slice(0, 3)} />
      </View>
    </ScreenShell>
  );
}

let awaitableFilters: Awaited<ReturnType<typeof loadFilterSettings>> | undefined;
loadFilterSettings().then((filters) => {
  awaitableFilters = filters;
});

function QuickLink({
  emoji,
  label,
  onPress,
  accessibilityLabel,
}: {
  emoji: string;
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={styles.quickLink}>
      <Text style={styles.quickEmoji}>{emoji}</Text>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

function ContextChip({ label, tone }: { label: string; tone: 'warm' | 'soft' }) {
  return (
    <View style={[styles.contextChip, tone === 'warm' ? styles.contextChipWarm : styles.contextChipSoft]}>
      <Text style={[styles.contextChipText, tone === 'warm' && styles.contextChipTextWarm]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  headerText: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  brand: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.title,
    fontWeight: '900',
  },
  subtitle: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
  },
  contextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  contextChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  contextChipWarm: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  contextChipSoft: {
    backgroundColor: theme.colors.mintSoft,
  },
  contextChipText: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.caption,
    fontWeight: '700',
  },
  contextChipTextWarm: {
    color: theme.colors.bowlDeep,
  },
  settingsPill: {
    minHeight: 40,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsPillText: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    gap: theme.spacing.sm,
    minHeight: 260,
    justifyContent: 'center',
  },
  heroBadge: {
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceMuted,
  },
  heroBadgeText: {
    color: theme.colors.bowlDeep,
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
  },
  heroTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.hero,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroBody: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.bodyLarge,
    textAlign: 'center',
    lineHeight: 25,
  },
  intentSection: {
    width: '100%',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  intentLabel: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    fontWeight: '800',
    textAlign: 'center',
  },
  intentChips: {
    gap: theme.spacing.sm,
  },
  intentHint: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.caption,
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'flex-end',
  },
  quickLink: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.xs,
    minHeight: 72,
    justifyContent: 'center',
  },
  quickEmoji: {
    fontSize: 22,
  },
  quickLabel: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    fontWeight: '700',
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
  sectionHint: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.caption,
  },
});
