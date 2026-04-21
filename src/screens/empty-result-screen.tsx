import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/primary-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { theme } from '@/src/styles/theme';

export function EmptyResultScreen() {
  return (
    <ScreenShell scroll={false} contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>🥣</Text>
      <Text accessibilityRole="header" style={styles.title}>추천 결과 없음</Text>
      <Text style={styles.body}>조건에 맞는 메뉴가 없어요. 필터를 조금 풀거나 전체 메뉴에서 다시 추천받아보세요.</Text>
      <View style={styles.actions}>
        <PrimaryButton label="필터 변경하기" onPress={() => router.push('/filters' as never)} />
        <PrimaryButton label="전체 메뉴로 추천받기" variant="soft" onPress={() => router.replace('/')} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  emoji: {
    fontSize: 88,
  },
  title: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.title,
    fontWeight: '900',
  },
  body: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.bodyLarge,
    textAlign: 'center',
    lineHeight: 25,
  },
  actions: {
    width: '100%',
    gap: theme.spacing.sm,
  },
});
