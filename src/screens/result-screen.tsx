import { router, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';

import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

import { APP_CONFIG } from '@/src/config/app-config';
import { LoadingCard } from '@/src/components/loading-card';
import { NoticeCard } from '@/src/components/notice-card';
import { PrimaryButton } from '@/src/components/primary-button';
import { ResultCard } from '@/src/components/result-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { ShareResultPoster } from '@/src/components/share-result-poster';
import { menuDataset } from '@/src/data/menu-dataset';
import { getCurrentTimeTag } from '@/src/domain/menu-recommender';
import { buildRecommendationReason } from '@/src/domain/ui-copy';
import { triggerResultHaptic } from '@/src/services/feedback';
import { buildShareText } from '@/src/services/share-result';
import { loadSettings } from '@/src/services/settings-storage';
import { theme } from '@/src/styles/theme';

export function ResultScreen() {
  const params = useLocalSearchParams<{
    menuId?: string;
    intensity?: string;
    winner?: string;
  }>();
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [partySize, setPartySize] = useState<'solo' | 'duo' | 'group'>('solo');
  const [autoTimeDetection, setAutoTimeDetection] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const shareCardRef = useRef<ViewShot>(null);

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
    loadSettings()
      .then((settings) => {
        setHapticsEnabled(settings.hapticsEnabled);
        setPartySize(settings.partySize);
        setAutoTimeDetection(settings.autoTimeDetection);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    void triggerResultHaptic(hapticsEnabled);
  }, [hapticsEnabled]);

  const handleShare = async () => {
    setIsSharing(true);
    setShareError(null);

    try {
      const sharingAvailable = await Sharing.isAvailableAsync();
      const imageUri = await shareCardRef.current?.capture?.();

      if (sharingAvailable && imageUri) {
        await Sharing.shareAsync(imageUri, {
          dialogTitle: '흔들밥 결과 카드 공유',
        });
      } else {
        await Share.share({
          message: buildShareText({
            menuName: menu.name,
            intensityPercent: intensity,
            category: menu.category,
          }),
          url: APP_CONFIG.githubRepoUrl,
        });
      }
    } catch {
      setShareError('이미지 카드 생성에 실패해서 텍스트 공유로 전환했어요.');
      await Share.share({
        message: buildShareText({
          menuName: menu.name,
          intensityPercent: intensity,
          category: menu.category,
        }),
        url: APP_CONFIG.githubRepoUrl,
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.container}>
      {shareError ? <NoticeCard title="공유 안내" body={shareError} tone="error" /> : null}
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 메뉴는...</Text>
        <Text style={styles.subtitle}>이 정도면 고민 끝입니다.</Text>
        <View style={styles.reasonCard}>
          <Text style={styles.reasonLabel}>추천 이유</Text>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>
      </View>

      {isLoading ? (
        <LoadingCard title="공유 옵션 준비 중" body="결과 카드와 사용자 설정을 불러오고 있어요." />
      ) : null}

      <ViewShot ref={shareCardRef} options={{ format: 'png', quality: 1, result: 'tmpfile' }}>
        <ShareResultPoster menu={menu} intensityPercent={intensity} partySize={partySize} timeTag={timeTag} />
      </ViewShot>

      <ResultCard menu={menu} intensityPercent={intensity} winnerLabel={params.winner} />

      <View style={styles.actions}>
        <PrimaryButton
          label="🔄 다시 흔들기"
          onPress={() => router.replace('/')}
          accessibilityHint="메인 화면으로 돌아가 다시 추천을 받습니다."
        />
        <PrimaryButton
          label="🖼 이미지 카드 공유"
          onPress={handleShare}
          variant="soft"
          loading={isSharing}
          accessibilityHint="메뉴 결과를 이미지 카드 또는 텍스트로 공유합니다."
        />
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
