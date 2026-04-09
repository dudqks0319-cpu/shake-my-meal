import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/primary-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { completeOnboarding } from '@/src/services/settings-storage';
import { theme } from '@/src/styles/theme';

const slides = [
  { emoji: '📳', title: '흔들어봐', body: '폰을 흔들면 오늘 메뉴가 바로 정해져요.' },
  { emoji: '🔥', title: '세게 흔들수록 비싼 메뉴', body: '살살 흔들면 가볍게, 세게 흔들면 푸짐하게 고릅니다.' },
  { emoji: '⚔️', title: '친구랑 배틀!', body: '같은 화면에서 번갈아 흔들고 더 센 사람 메뉴로 결정해요.' },
];

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  const handleNext = async () => {
    if (!isLast) {
      setIndex((current) => current + 1);
      return;
    }

    await completeOnboarding();
    router.replace('/');
  };

  return (
    <ScreenShell scroll={false} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>
      <View style={styles.dots}>
        {slides.map((item, itemIndex) => (
          <View key={item.title} style={[styles.dot, itemIndex === index && styles.dotActive]} />
        ))}
      </View>
      <PrimaryButton label={isLast ? '배고파, 시작하자!' : '다음'} onPress={handleNext} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: theme.spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emoji: {
    fontSize: 88,
  },
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.hero,
    fontWeight: '900',
    textAlign: 'center',
  },
  body: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.bodyLarge,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: theme.spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.line,
  },
  dotActive: {
    width: 28,
    backgroundColor: theme.colors.bowl,
  },
});
