import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/primary-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { router } from 'expo-router';
import { theme } from '@/src/styles/theme';

const steps = [
  '기분을 먼저 고르세요.',
  '휴대폰을 가볍게 1~2초 흔들어 주세요.',
  '센서가 불안정하면 다시 측정 버튼을 눌러도 됩니다.',
];

export function ShakeGuideScreen() {
  return (
    <ScreenShell>
      <Text accessibilityRole="header" style={styles.title}>흔들기 안내</Text>
      <View style={styles.hero}>
        <Text style={styles.phone}>📱</Text>
        <Text style={styles.heroTitle}>살짝 흔들어도 충분해요</Text>
        <Text style={styles.heroBody}>흔들기는 메뉴를 섞는 재미있는 연출이고, 추천은 기분과 필터를 기준으로 랜덤 선택됩니다.</Text>
      </View>
      <View style={styles.steps}>
        {steps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <Text style={styles.stepIndex}>{index + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
      <PrimaryButton label="확인했어요!" onPress={() => router.back()} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.title,
    fontWeight: '900',
    textAlign: 'center',
    paddingTop: theme.spacing.lg,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  phone: {
    fontSize: 88,
  },
  heroTitle: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.title,
    fontWeight: '900',
  },
  heroBody: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
    textAlign: 'center',
    lineHeight: 23,
  },
  steps: {
    gap: theme.spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  stepIndex: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceMuted,
    color: theme.colors.bowlDeep,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '900',
  },
  stepText: {
    flex: 1,
    color: theme.colors.ink,
    fontSize: theme.fontSize.body,
    fontWeight: '700',
  },
});
