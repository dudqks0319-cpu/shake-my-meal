import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/src/styles/theme';

type ScreenShellProps = {
  children: ReactNode;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
  scrollProps?: ScrollViewProps;
};

export function ScreenShell({
  children,
  scroll = true,
  contentContainerStyle,
  scrollProps,
}: ScreenShellProps) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentContainerStyle]}>{children}</View>
  );

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#FFF0D9', '#FFF7E8', '#FFFDF8']} style={StyleSheet.absoluteFillObject} />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {content}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  safe: {
    flex: 1,
  },
  content: {
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  glowTop: {
    position: 'absolute',
    top: -40,
    right: -10,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(244, 138, 61, 0.16)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 20,
    left: -20,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(116, 198, 157, 0.16)',
  },
});
