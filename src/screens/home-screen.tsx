import { useFocusEffect, router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HistoryList } from '@/src/components/history-list';
import { IntensityMeter } from '@/src/components/intensity-meter';
import { PrimaryButton } from '@/src/components/primary-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { menuDataset } from '@/src/data/menu-dataset';
import { recommendMenu, getCurrentTimeTag } from '@/src/domain/menu-recommender';
import { getHomeHeroState } from '@/src/domain/ui-copy';
import { canUseShake } from '@/src/domain/usage-policy';
import { useShakeSession } from '@/src/hooks/use-shake-session';
import { triggerSelectionHaptic } from '@/src/services/feedback';
import { loadHistory, pushHistory } from '@/src/services/history-storage';
import { loadSettings, readOnboardingState, shouldShowOnboarding } from '@/src/services/settings-storage';
import { theme } from '@/src/styles/theme';

export function HomeScreen() {
  const shake = useShakeSession();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [history, setHistory] = useState(awaitableArray);
  const [settings, setSettings] = useState(awaitableSettings);
  const [dailyCount, setDailyCount] = useState(0);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

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

  useEffect(() => {
    readOnboardingState().then((value) => {
      if (shouldShowOnboarding(value)) {
        router.replace('/onboarding');
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      Promise.all([loadSettings(), loadHistory()]).then(([nextSettings, nextHistory]) => {
        if (!active) {
          return;
        }

        setSettings(nextSettings);
        setHistory(nextHistory);
        const todayKey = new Date().toDateString();
        const todayCount = nextHistory.filter((item) => new Date(item.createdAt).toDateString() === todayKey).length;
        setDailyCount(todayCount);
      });

      return () => {
        active = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!usageState.allowed) {
      setLimitMessage('무료 버전은 하루 10번까지 흔들 수 있어요.');
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
      const menu = recommendMenu({
        intensityPercent: shake.peakIntensity,
        menus: menuDataset,
        settings,
        currentTimeTag: timeContext,
      });

      const historyItem = {
        id: `${Date.now()}`,
        menuId: menu.id,
        menuName: menu.name,
        emoji: menu.emoji,
        intensityPercent: shake.peakIntensity,
        createdAt: new Date().toISOString(),
        mode: 'single' as const,
      };

      pushHistory(historyItem).then((nextHistory) => {
        setHistory(nextHistory);
        setDailyCount((current) => current + 1);
      });

      router.push({
        pathname: '/result',
        params: {
          menuId: menu.id,
          intensity: `${shake.peakIntensity}`,
          mode: 'single',
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
  }, [countdown, settings, shake.peakIntensity, shake, settings.hapticsEnabled, timeContext]);

  const handleRestart = useCallback(() => {
    setCountdown(null);
    setLimitMessage(null);
    shake.resetSession();
    void shake.startSession();
  }, [shake]);

  return (
    <ScreenShell>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.brand}>🍚 흔들밥</Text>
            <Text style={styles.subtitle}>오늘 뭐 먹을지 5초 안에 끝내기</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/settings')} style={styles.settingsPill}>
            <Text style={styles.settingsPillText}>⚙ 설정</Text>
          </Pressable>
        </View>
        <View style={styles.contextRow}>
          <ContextChip label={`오늘 사용 ${Math.min(dailyCount, 10)} / 10`} tone="warm" />
          <ContextChip label={`${partyLabel} · ${timeLabel}`} tone="soft" />
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{heroState.badge}</Text>
        </View>
        <Text style={styles.heroEmoji}>{heroState.emoji}</Text>
        <Text style={styles.heroTitle}>{heroState.title}</Text>
        <Text style={styles.heroBody}>{heroState.body}</Text>
        <IntensityMeter value={shake.liveIntensity} />
      </View>

      {!usageState.allowed ? (
        <PrimaryButton label="오늘 제한 확인됨" variant="ghost" disabled />
      ) : null}

      {shake.status === 'ended' && !shake.readyForCountdown ? (
        <PrimaryButton label="조금 더 세게, 다시!" onPress={handleRestart} variant="soft" />
      ) : null}

      <View style={styles.quickActions}>
        <QuickLink emoji="📜" label="다시 측정" onPress={handleRestart} />
        <QuickLink emoji="⚔️" label="배틀" onPress={() => router.push('/battle')} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 흔들기 3개</Text>
        <Text style={styles.sectionHint}>오늘의 취향 흐름을 바로 다시 볼 수 있어요.</Text>
        <HistoryList items={history.slice(0, 3)} />
      </View>
    </ScreenShell>
  );
}

const awaitableArray = [] as Awaited<ReturnType<typeof loadHistory>>;
const awaitableSettings = {
  excludedMenuIds: [],
  enabledCategories: ['korean', 'chinese', 'japanese', 'western', 'snack', 'asian', 'dessert'],
  partySize: 'solo',
  autoTimeDetection: true,
  soundEnabled: true,
  hapticsEnabled: true,
  premiumUnlocked: false,
} as Awaited<ReturnType<typeof loadSettings>>;

function QuickLink({
  emoji,
  label,
  onPress,
}: {
  emoji: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.quickLink}>
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
  heroEmoji: {
    fontSize: 86,
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
