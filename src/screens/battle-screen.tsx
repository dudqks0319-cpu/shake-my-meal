import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/primary-button';
import { IntensityMeter } from '@/src/components/intensity-meter';
import { ResultCard } from '@/src/components/result-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { menuDataset } from '@/src/data/menu-dataset';
import { resolveBattleWinner } from '@/src/domain/battle';
import { recommendMenu } from '@/src/domain/menu-recommender';
import { getBattleStageState } from '@/src/domain/ui-copy';
import { useShakeSession } from '@/src/hooks/use-shake-session';
import { DEFAULT_SETTINGS } from '@/src/services/settings-storage';
import { theme } from '@/src/styles/theme';

export function BattleScreen() {
  const shake = useShakeSession();
  const [stage, setStage] = useState<'intro' | 'player1' | 'player1-ready' | 'player2' | 'complete'>('intro');
  const [playerOne, setPlayerOne] = useState<number | null>(null);
  const [playerTwo, setPlayerTwo] = useState<number | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const result = useMemo(
    () => resolveBattleWinner(playerOne ?? 0, playerTwo ?? 0),
    [playerOne, playerTwo]
  );
  const menu = useMemo(
    () =>
      recommendMenu({
        intensityPercent: result.winningIntensity,
        menus: menuDataset,
        settings: DEFAULT_SETTINGS,
        currentTimeTag: 'lunch',
      }),
    [result.winningIntensity]
  );
  const stageState = getBattleStageState(stage);

  useEffect(() => {
    if (!hasStarted || shake.status !== 'idle') {
      return;
    }

    void shake.startSession();
  }, [hasStarted, shake]);

  useEffect(() => {
    if (!hasStarted || shake.status !== 'ended') {
      return;
    }

    if (!shake.readyForCountdown) {
      setRetryMessage(stage === 'player1' ? '1P가 조금 더 세게 흔들어야 해요.' : '2P가 조금 더 세게 흔들어야 해요.');
      setHasStarted(false);
      shake.resetSession();
      return;
    }

    if (stage === 'player1') {
      setPlayerOne(shake.peakIntensity);
      setStage('player1-ready');
      setRetryMessage(null);
    } else if (stage === 'player2') {
      setPlayerTwo(shake.peakIntensity);
      setStage('complete');
      setRetryMessage(null);
    }

    setHasStarted(false);
    shake.resetSession();
  }, [hasStarted, shake, stage]);

  const currentPlayerLabel = stage === 'player2' ? '2P 차례' : '1P 차례';

  const startPlayerTurn = (nextStage: 'player1' | 'player2') => {
    setRetryMessage(null);
    setStage(nextStage);
    setHasStarted(true);
  };

  const resetBattle = () => {
    setStage('intro');
    setPlayerOne(null);
    setPlayerTwo(null);
    setRetryMessage(null);
    setHasStarted(false);
    shake.resetSession();
  };

  return (
    <ScreenShell contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚔️ 흔들 배틀</Text>
      <Text style={styles.subtitle}>한 대의 폰으로 1P, 2P가 순서대로 흔들고 더 센 쪽의 메뉴로 결정합니다.</Text>
      <View style={styles.stageCard}>
        <Text style={styles.stageBadge}>{stageState.badge}</Text>
        <Text style={styles.stageTitle}>{stageState.title}</Text>
        <Text style={styles.stageBody}>{stageState.body}</Text>
      </View>

      <View style={styles.duel}>
        <BattleMeter label="1P" value={playerOne} />
        <BattleMeter label="2P" value={playerTwo} />
      </View>
      <BattleProgress stage={stage} />

      {(stage === 'player1' || stage === 'player2') && hasStarted ? (
        <View style={styles.liveCard}>
          <Text style={styles.liveTitle}>{currentPlayerLabel}</Text>
          <Text style={styles.liveBody}>지금 흔드는 강도를 실시간으로 측정 중입니다.</Text>
          <IntensityMeter value={shake.liveIntensity} label="현재 강도" />
        </View>
      ) : null}

      {retryMessage ? (
        <View style={styles.retryCard}>
          <Text style={styles.retryText}>{retryMessage}</Text>
          <PrimaryButton
            label={stage === 'player2' ? '2P 다시 측정' : '1P 다시 측정'}
            onPress={() => startPlayerTurn(stage === 'player2' ? 'player2' : 'player1')}
            variant="soft"
          />
        </View>
      ) : null}

      <View style={styles.controls}>
        {stage === 'intro' ? (
          <PrimaryButton label="1P 시작" onPress={() => startPlayerTurn('player1')} />
        ) : null}

        {stage === 'player1-ready' ? (
          <PrimaryButton label="2P 시작" onPress={() => startPlayerTurn('player2')} />
        ) : null}

        {stage === 'complete' ? (
          <PrimaryButton label="다시 배틀하기" onPress={resetBattle} variant="soft" />
        ) : null}

        {stage !== 'intro' && stage !== 'complete' ? (
          <PrimaryButton label="처음부터 다시" onPress={resetBattle} variant="ghost" />
        ) : null}
      </View>

      {stage === 'complete' ? (
        <>
          <ScoreComparison playerOne={playerOne ?? 0} playerTwo={playerTwo ?? 0} />
          <ResultCard
            menu={menu}
            intensityPercent={result.winningIntensity}
            winnerLabel={
              result.winner === 'draw'
                ? '무승부! 다시 흔들기'
                : result.winner === 'player1'
                  ? '1P 승리'
                  : '2P 승리'
            }
          />
        </>
      ) : null}
    </ScreenShell>
  );
}

function BattleMeter({ label, value }: { label: string; value: number | null }) {
  return (
    <View style={styles.meterCard}>
      <Text style={styles.meterLabel}>{label}</Text>
      <Text style={styles.meterValue}>{value === null ? '--' : `${Math.round(value)}%`}</Text>
    </View>
  );
}

function BattleProgress({
  stage,
}: {
  stage: 'intro' | 'player1' | 'player1-ready' | 'player2' | 'complete';
}) {
  const activeIndex =
    stage === 'intro' ? 0 : stage === 'player1' ? 1 : stage === 'player1-ready' || stage === 'player2' ? 2 : 3;
  const labels = ['준비', '1P', '2P', '결과'];

  return (
    <View style={styles.progressRow}>
      {labels.map((label, index) => (
        <View key={label} style={styles.progressItem}>
          <View
            style={[
              styles.progressDot,
              index <= activeIndex ? styles.progressDotActive : styles.progressDotInactive,
            ]}
          />
          <Text style={[styles.progressLabel, index <= activeIndex && styles.progressLabelActive]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

function ScoreComparison({ playerOne, playerTwo }: { playerOne: number; playerTwo: number }) {
  const total = Math.max(playerOne + playerTwo, 1);
  const playerOneWidth = `${Math.round((playerOne / total) * 100)}%` as `${number}%`;
  const playerTwoWidth = `${Math.round((playerTwo / total) * 100)}%` as `${number}%`;

  return (
    <View style={styles.comparisonCard}>
      <View style={styles.comparisonHeader}>
        <Text style={styles.comparisonTitle}>강도 비교</Text>
        <Text style={styles.comparisonSubtitle}>{playerOne}% vs {playerTwo}%</Text>
      </View>
      <View style={styles.comparisonTrack}>
        <View style={[styles.comparisonPlayerOne, { width: playerOneWidth }]} />
        <View style={[styles.comparisonPlayerTwo, { width: playerTwoWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.lg,
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
  duel: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  progressDotActive: {
    backgroundColor: theme.colors.bowlDeep,
  },
  progressDotInactive: {
    backgroundColor: theme.colors.line,
  },
  progressLabel: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.caption,
    fontWeight: '700',
  },
  progressLabelActive: {
    color: theme.colors.ink,
  },
  stageCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  stageBadge: {
    color: theme.colors.bowlDeep,
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
  },
  stageTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '900',
  },
  stageBody: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
    lineHeight: 22,
  },
  liveCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  liveTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
  liveBody: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
  },
  retryCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  retryText: {
    color: theme.colors.warning,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '700',
  },
  comparisonCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
  comparisonSubtitle: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
    fontWeight: '700',
  },
  comparisonTrack: {
    flexDirection: 'row',
    height: 16,
    overflow: 'hidden',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceMuted,
  },
  comparisonPlayerOne: {
    backgroundColor: theme.colors.bowl,
    height: '100%',
  },
  comparisonPlayerTwo: {
    backgroundColor: theme.colors.mint,
    height: '100%',
  },
  meterCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  meterLabel: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
  },
  meterValue: {
    color: theme.colors.bowlDeep,
    fontSize: theme.fontSize.hero,
    fontWeight: '900',
  },
  controls: {
    gap: theme.spacing.sm,
  },
});
